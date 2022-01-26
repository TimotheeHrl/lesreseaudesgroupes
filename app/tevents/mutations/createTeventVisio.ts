import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma, User } from "db"
import { sendEmail } from "app/mail"
import { templatemail } from "app/utils/templatemail"
import createDOMPurify, { DOMPurifyI } from "dompurify"
import { JSDOM } from "jsdom"
const url = process.env.BASE_URL as string
export default async function createtevent({ data }, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  const teamId = data.teamId as string
  const team = await db.team.findFirst({
    where: { id: teamId },
    select: {
      TeamMastersID: true,
      public: true,
      TeamMemberId: true,
      findIndex: true,
    },
  })
  let newIndex = (team!.findIndex + 1) as number

  if (!team) throw new NotFoundError()
  const UserId = ctx.session.userId
  let TMasters = team.TeamMastersID as string[]
  let TMembers = team.TeamMemberId
  let AllTeam = TMembers
  AllTeam.concat(TMasters)
  const HtmlContent = data.content as string

  const windowEmulator: any = new JSDOM("").window
  const DOMPurify: DOMPurifyI = createDOMPurify(windowEmulator)
  let sanitizedhtml = DOMPurify.sanitize(HtmlContent, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  })
  const even = (element) => element === UserId
  const Matched: boolean = AllTeam.some(even)

  if (Matched === true && team.public === true) {
    await db.tevent.create({
      data: {
        id: data.id,
        content: sanitizedhtml.toString() as string,
        teamId: teamId,
        userId: UserId,
        subject: data.subject,
        maxParticipants: data.maxParticipants,
        eventLat: data.eventLat,
        eventLon: data.eventLon,
        visible: data.visible,
        startAt: data.startAt,
        endsAt: data.endsAt,
        visioPres: data.visioPres,
        linkVisio: data.linkVisio,
        visioCode: data.visioCode,
      },
    })
    await db.tevent.update({
      where: { id: data.id },
      data: {
        invitedUsers: {
          connect: data.invitedUsers.map((userId) => ({ id: userId as string })),
        } as Prisma.UserCreateNestedManyWithoutInvitedInEventInput,
      } as any,
    })
    await db.team.update({
      where: { id: teamId },
      data: {
        findIndex: newIndex as number,
      },
    })
    sentMail({ data }, ctx)
  }
  if (Matched === false) {
    throw new AuthorizationError()
  }
  return team
}

async function sentMail({ data }, ctx: Ctx) {
  let SentTo = data.invitedUsers as string[]
  let sentToLengh = SentTo.length //as ISendPartLenght

  const sentToNumber = sentToLengh as number
  const partner = await db.user.findMany({
    where: {
      OR: SentTo.map((userId) => ({ id: userId as string })),
    },
    select: { email: true, getNotifications: true },
  })
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { name: true, avatar: true },
  })
  let link = `${url}/teams/${data.teamId as string}/tevents/sldtevent/${data.id as string}`
  if (data.visible === false) {
    link = `${url}/collectifs/${data.teamId as string}/publicevent/${data.id as string}`
  }
  const htmlMessage = `Vous êtes inviter à un événement sur le thème de : ${
    data.subject as string
  } </br> C'est organiser part : ${me!.name!}  `
  let htmlToSend = templatemail(link, url, htmlMessage) as string

  for (let i = 0; i < sentToNumber; i++) {
    let getNotifs = partner[i]?.getNotifications as boolean
    let partEmail = partner[i]?.email as string
    if (getNotifs === true) {
      await sendEmail({
        from: "info@yourwebsite.com",
        to: partEmail,
        subject: `${data.subject as string} : Le groupe de ${me!.name!} vous invite à un événement`,
        text: `Vous êtes inviter à un événement sur le thème de : ${
          data.subject as string
        } C'est organiser part : ${me!.name!}  `,
        html: htmlToSend,
      })
    }
  }
}
