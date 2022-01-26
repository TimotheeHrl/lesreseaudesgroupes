import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"
import { sendEmail } from "app/mail"
import { templatemail } from "app/utils/templatemail"
import createDOMPurify, { DOMPurifyI } from "dompurify"
import { JSDOM } from "jsdom"
const url = process.env.BASE_URL as string

type CreateTpostInput = Pick<Prisma.TpostCreateArgs, "data">
export default async function createTpost({ data }: CreateTpostInput, ctx: Ctx) {
  ctx.session.$authorize()
  const teamId = data.teamId as string
  const team = await db.team.findFirst({
    where: { id: teamId },
    select: {
      TeamMemberId: true,
      findIndex: true,
    },
  })
  if (!team) throw new NotFoundError()
  const teamMastersIds = team.TeamMemberId
  let UserId = ctx.session.userId
  const even = (element) => element === UserId
  const Matched: boolean = teamMastersIds.some(even)
  const HtmlContent = data.content as string

  const windowEmulator: any = new JSDOM("").window
  const DOMPurify: DOMPurifyI = createDOMPurify(windowEmulator)
  let sanitizedhtml = DOMPurify.sanitize(HtmlContent, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  })
  if (Matched === true) {
    const content = data.content as string

    let userIdd = ctx.session.userId as string
    const userId = userIdd as string
    const teamId = data.teamId as string
    const id = data.id as string
    let newIndex = (team.findIndex + 1) as number
    await db.tpost.create({
      data: {
        id,
        content: sanitizedhtml.toString(),
        teamId,
        userId,
      },
    })

    await db.team.update({
      where: { id: teamId },
      data: {
        findIndex: newIndex as number,
      },
    })
  }

  if (Matched === false) {
    throw new AuthorizationError()
  }
  sentMail({ data }, ctx)

  return teamId
}

async function sentMail({ data }, ctx: Ctx) {
  const teamId = data.teamId as string

  const followers = await db.teamFollower.findMany({
    where: { teamId: teamId as string },
    select: { user: { select: { email: true, getNotifications: true } } },
  })
  const teamMembers = await db.team.findFirst({
    where: { id: teamId as string },
    select: { users: { select: { email: true, getNotifications: true } } },
  })
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { name: true },
  })
  const link = `${url}/collectifs/${teamId}`
  let htmlMessage = "Il y a du nouveau contenu sur un groupe que vous suivez !</br> C'est par ici !"
  let htmlToSend = templatemail(link, url, htmlMessage) as string

  for (let i = 0; i < followers.length; i++) {
    let partEmail = followers[i]?.user[0]?.email as string
    let getNotifs = followers[i]?.user[0]?.getNotifications as boolean
    if (getNotifs === true) {
      await sendEmail({
        from: "info@yourwebsite.com",
        to: partEmail,
        subject: `${me!.name!} du Réseau des groupes`,
        text: htmlMessage,
        html: htmlToSend,
      })
    }
  }
  let teamUserLenght = teamMembers?.users.length as number
  let htmlMessage2 = "Il y a du nouveau contenu dans votre groupe  !</br> C'est par ici !"
  let htmlToSend2 = templatemail(link, url, htmlMessage2) as string
  for (let i = 0; i < teamUserLenght; i++) {
    let teamEmail = teamMembers?.users[i]?.email as string
    let getteamNotifs = teamMembers?.users[i]?.getNotifications as boolean
    if (getteamNotifs === true) {
      await sendEmail({
        from: "info@yourwebsite.com",
        to: teamEmail,
        subject: `${me!.name!} du Réseau des groupes`,
        text: htmlMessage2,
        html: htmlToSend2,
      })
    }
  }
}
