import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"
import { sendEmail } from "app/mail"
import { templatemail } from "app/utils/templatemail"

type CreateApostInput = Pick<Prisma.ApostCreateArgs, "data">
const baseurl = process.env.BASE_URL as string

export default async function createApost({ data }: CreateApostInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role
  const userId = ctx.session?.userId as string
  await db.apost.create({
    data: {
      content: data.content,
      userId: userId,
    },
  })
  sentMail({ data }, ctx)
}

async function sentMail({ data }, ctx: Ctx) {
  const partner = await db.user.findMany({
    where: { getNotifications: true },
    select: { email: true },
  })
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { name: true },
  })
  const url = process.env.BASE_URL as string

  const link = `${baseurl}`
  const htmlMessage = "Il y a une nouvelle sur le Réseau des groupes" as string
  let htmlToSend = templatemail(link, url, htmlMessage) as string

  for (let i = 0; i < partner.length; i++) {
    let partEmail = partner[i]?.email as string

    await sendEmail({
      from: "info@yourwebsite.com",
      to: partEmail,
      subject: `${me!.name!} du Réseau des groupes`,
      text: `Il y a une nouvelle actu sur le Réseau des groupes`,
      html: htmlToSend,
    })
  }
}
