import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"
import { sendEmail } from "app/mail"
import crypto from "crypto"
import { templatemail } from "app/utils/templatemail"
const url = process.env.BASE_URL as string
const baseurl = process.env.BASE_URL as string

type CreateTreplyInput = Pick<Prisma.TreplyCreateArgs, "data">
export default async function createTreplyFromTpost({ data }: CreateTreplyInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  const treplyId = crypto.randomBytes(20).toString("hex")

  let UserId = ctx.session.userId as string

  let treply = await db.treply.create({
    data: {
      id: treplyId,
      content: data.content as string,
      teamId: data.teamId as string,
      tpostId: data.tpostId as string,
      userId: UserId,
    },
  })
  sentMail({ data }, ctx)

  return treply
}
async function sentMail({ data }, ctx: Ctx) {
  const teamId = data.teamId as string

  const teamMembers = await db.team.findFirst({
    where: { id: teamId as string },
    select: { users: { select: { email: true, getNotifications: true } } },
  })
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { name: true },
  })
  const link = `${baseurl}/collectifs/${teamId}`
  let htmlMessage = `${me!
    .name!} à répondue à votre annonce </br> Rendez-vous sur la page de votre groupe`
  let htmlToSend = templatemail(link, url, htmlMessage) as string

  let teamUserLenght = teamMembers?.users.length as number
  for (let i = 0; i < teamUserLenght; i++) {
    let teamEmail = teamMembers?.users[i]?.email as string
    let getteamNotifs = teamMembers?.users[i]?.getNotifications as boolean
    if (getteamNotifs === true) {
      await sendEmail({
        from: "info@yourwebsite.com",
        to: teamEmail,
        subject: `${me!.name!} à répondue à votre annonce`,
        text: `${me!
          .name!} à répondue à votre annonce </br> Rendez-vous sur la page de votre groupe`,
        html: htmlToSend,
      })
    }
  }
}
