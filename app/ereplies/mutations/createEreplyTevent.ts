import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma, Ereply } from "db"
import { sendEmail } from "app/mail"
import { templatemail } from "app/utils/templatemail"

const url = process.env.BASE_URL as string

type CreateTreplyInput = Pick<Prisma.EreplyCreateArgs, "data">
export default async function createTreplyFromTpost({ data }: CreateTreplyInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])

  let UserId = ctx.session.userId as string

  let ereply = await db.ereply.create({
    data: {
      id: data.id as string,
      content: data.content as string,
      teamId: data.teamId as string,
      teventId: data.teventId as string,
      userId: UserId,
    },
  })
  const Content = data.content as string
  const TeventId = data.teventId as string

  sentMail(Content, TeventId, ctx)

  return ereply
}
async function sentMail(Content: string, TeventId: string, ctx: Ctx) {
  const tevent = await db.tevent.findFirst({
    where: { id: TeventId as string },
    select: {
      visible: true,
      teamId: true,
      userId: true,
      subject: true,
      usersParticipeEvent: { select: { user: { select: { email: true } } } },
    },
  })

  const organiseur = await db.user.findFirst({
    where: { id: tevent?.userId as string },
    select: { email: true, name: true },
  })
  let organisorEmail = organiseur?.email as string
  let organisorName = organiseur?.name as string
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { name: true },
  })
  let link = `${url}/teams/${tevent?.teamId as string}/tevents/sldtevent/${TeventId as string}`
  if (tevent?.visible === false) {
    link = `${url}/collectifs/${tevent?.teamId as string}/publicevent/${TeventId as string}`
  }

  const TeventSubject = tevent?.subject as string
  const participantLenght = tevent?.usersParticipeEvent.length as number
  const htmlMessage = `Question de ${me!.name!} sur ${TeventSubject} organiser par ${
    organisorName as string
  } </br> 
  ${Content as string}`
  let htmlToSend = templatemail(link, url, htmlMessage) as string
  await sendEmail({
    from: "info@yourwebsite.com",
    to: organisorEmail,
    subject: `Question sur ${TeventSubject} de la part de ${me!.name!} `,
    text: `Question de ${me!.name!} sur ${TeventSubject} organiser par ${organisorName as string} `,
    html: htmlToSend,
  })
  for (let i = 0; i < participantLenght; i++) {
    let partEmail = tevent?.usersParticipeEvent[i]?.user[0]?.email as string

    await sendEmail({
      from: "info@yourwebsite.com",
      to: partEmail,
      subject: `Question sur ${TeventSubject} de la part de ${me!.name!} `,
      text: `Question de ${me!.name!} sur ${TeventSubject} organiser par ${
        organisorName as string
      } `,
      html: htmlToSend,
    })
  }
}
