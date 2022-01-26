import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma, Team, Tevent, UserParticipeEvent } from "db"
import { sendEmail } from "app/mail"
import { templatemail } from "app/utils/templatemail"
const url = process.env.BASE_URL as string

const baseurl = process.env.BASE_URL as string
type UpdateteventInput = Pick<Prisma.TeventUpdateArgs, "data" | "where">
export default async function updateTeventPostscript({ data, where }: UpdateteventInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  let UserId = ctx.session.userId
  const team = (await db.team.findFirst({
    where: { id: data.teamId as string },
  })) as Team
  const TeamMemberId = team.TeamMemberId as string[]
  const even = (element) => element === UserId
  const Matched: boolean = TeamMemberId.some(even)
  const InfoPostscritum = data.infoPostscritum as string
  const IsCancel = data.isCancel as boolean
  if (Matched === true) {
    const tevent = (await db.tevent.findFirst({
      where,
    })) as Tevent
    const Participants = (await db.userParticipeEvent.findMany({
      where: { teventId: tevent.id as string },
    })) as UserParticipeEvent[]
    await db.tevent.update({
      where,
      data: {
        infoPostscritum: data.infoPostscritum,
        postScriptWriterId: UserId,
        isCancel: data.isCancel,
      },
    })
    sentMail(InfoPostscritum, IsCancel, ctx, tevent, Participants)
  }

  if (Matched === false) {
    throw new AuthorizationError()
  }

  return team
}

async function sentMail(
  InfoPostscritum,
  IsCancel,
  ctx: Ctx,
  tevent: Tevent,
  Participants: UserParticipeEvent[]
) {
  let participantsIdArray = [] as string[]
  for (let i = 0; i < Participants.length; i++) {
    participantsIdArray.push(Participants[i]?.participantId as string)
  }
  let link = `${baseurl}/teams/${tevent.teamId as string}/tevents/sldtevent/${tevent.id as string}`
  if (tevent.visible === true) {
    link = `${baseurl}/collectifs/${tevent.teamId as string}/publicevent/${tevent.id as string}`
  }
  let date = tevent.startAt.toLocaleDateString("fr", { timeZone: "CET" })
  let SentTo = participantsIdArray as string[]
  let sentToLengh = participantsIdArray.length //as ISendPartLenght

  const sentToNumber = sentToLengh as number
  const partner = await db.user.findMany({
    where: {
      OR: SentTo.map((userId) => ({ id: userId as string })),
    },
    select: { email: true, getNotifications: true },
  })
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { name: true },
  })
  let title = `${me!.name}: info sur ${tevent.subject}, le ${date}`

  if (IsCancel === true) {
    const htmlMessage = `Annulation de ${tevent.subject}, le ${date}</br>
    ${InfoPostscritum as string}</br>
    Répondre : ${link as string}`
    let htmlToSend = templatemail(link, url, htmlMessage) as string

    for (let i = 0; i < sentToNumber; i++) {
      const getNotifs = partner[i]?.getNotifications as boolean
      const partEmail = partner[i]?.email as string
      if (getNotifs === true) {
        await sendEmail({
          from: "info@yourwebsite.com",
          to: partEmail,
          subject: `${title}`,
          text: `Annulation de ${tevent.subject}, le ${date} ${InfoPostscritum}`,
          html: htmlToSend,
        })
      }
    }
  } else {
    let htmlMessage2 = `<p>${tevent.subject}, le ${date}</p>
    <p>${InfoPostscritum as string}</p>
    <p>répondre ${link as string}</p>`
    let htmlToSend2 = templatemail(link, url, htmlMessage2) as string
    for (let i = 0; i < sentToNumber; i++) {
      const getNotifs = partner[i]?.getNotifications as boolean
      const partEmail = partner[i]?.email as string
      if (getNotifs === true) {
        await sendEmail({
          from: "info@yourwebsite.com",
          to: partEmail,
          subject: `${title}`,
          text: `${InfoPostscritum}`,
          html: htmlToSend2,
        })
      }
    }
  }
}
