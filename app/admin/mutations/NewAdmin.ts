import { Ctx, AuthorizationError } from "blitz"
import db, { Prisma, Session } from "db"
import { sendEmail } from "app/mail"

type UpdateUserInput = Pick<Prisma.UserUpdateArgs, "where">
const baseurl = process.env.BASE_URL as string
async function updateSession(userId) {
  await db.session.updateMany({
    where: { userId: userId },
    data: {
      publicData: `{"userId":"${userId}","role":"ADMIN","emailIsVerified":true}`,
    },
  })
}
export default async function NewAdmin({ where }: UpdateUserInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role
  const User = await db.user.findUnique({
    where,
    select: { id: true },
  })
  const userId = User?.id as string
  updateSession(userId)

  const user = await db.user.update({
    where,
    data: {
      role: "ADMIN",
    },
  })
  sentMail(userId)
  return user
}

async function sentMail(userId) {
  const partner = await db.user.findFirst({
    where: { id: userId },
    select: { email: true },
  })

  const link = `${baseurl}/adminpage`

  let partEmail = partner?.email as string

  await sendEmail({
    from: "info@yourwebsite.com",
    to: partEmail,
    subject: `Vous êtes maintenant administeur`,
    text: `Vous êtes administrateur `,
    html: `<p>Vous êtes administrateur</p>
    <p>rendez-vous sur : ${link as string}</p>`,
  })
}
