import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"
import { sendEmail } from "app/mail"
import crypto from "crypto"

const baseurl = process.env.BASE_URL as string

type CreateAreplyInput = Pick<Prisma.AreplyCreateArgs, "data">
export default async function createTreplyFromTpost({ data }: CreateAreplyInput, ctx: Ctx) {
  ctx.session.$authorize(["VERIF", "ADMIN"])
  let areplyId = crypto.randomBytes(20).toString("hex")

  let UserId = ctx.session.userId as string

  const content = data.content as string

  const apostId = data.apostId as string
  if (content.length < 500) {
    let areply = await db.areply.create({
      data: {
        id: areplyId,
        content,
        apostId,
        userId: UserId,
      },
    })
    sentMail({ data }, ctx)
    return areply
  }
}

async function sentMail({ data }, ctx: Ctx) {
  const partner = await db.user.findMany({
    where: { role: "ADMIN" },
    select: { email: true },
  })
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { name: true },
  })
  const link = `${baseurl}`

  for (let i = 0; i < partner.length; i++) {
    let partEmail = partner[i]?.email as string

    await sendEmail({
      from: "info@yourwebsite.com",
      to: partEmail,
      subject: `${me!.name!} a répondue à votre annonce!`,
      text: `${data.content as string} `,
      html: `<p>${data.content as string}</p>
    <p>répondre ${link as string}</p>`,
    })
  }
}
