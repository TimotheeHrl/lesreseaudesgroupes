import db from "db"
import { hashPassword } from "./auth-utils"
import { generateCode, verifyCode } from "./verify-email"
import { sendEmail } from "app/mail"
import { templatemail } from "app/utils/templatemail"

export async function invoke(email: string, InviterName: string) {
  const url = process.env.BASE_URL as string

  const user = await db.user.findUnique({
    where: { email },
    select: { hashedPassword: true },
  })
  if (!user) {
    return
  }

  const { hashedPassword } = user!
  const resetCode = await generateCode(hashedPassword)
  let resetPass = `${url}/resetPassword/${encodeURIComponent(email)}/${resetCode}` as string
  const link = resetPass
  const htmlMessage = `Vous pouvez vous connecter dès maintenant en renouvelant votre mot de passe : avec ce lien`
  let htmlToSend = templatemail(link, url, htmlMessage) as string

  await sendEmail({
    from: "info@yourwebsite.com",
    to: email,
    subject: `${InviterName} vous à invité à rejoindre sa groupe`,
    text: `Vous pouvez vous connecter dès maintenant en renouvelant votre mot de passe : avec ce lien ${resetPass}`,
    html: htmlToSend,
  })
}

export async function isValidCode(email: string, code: string) {
  const user = await db.user.findUnique({ where: { email }, select: { hashedPassword: true } })

  if (!user) {
    return false
  }

  const { hashedPassword } = user

  const isValid = await verifyCode(code, hashedPassword)
  return isValid
}

export async function setPassword(email: string, code: string, password: string) {
  const isValid = await isValidCode(email, code)
  if (!isValid) {
    return false
  }
  const hashedPassword = await hashPassword(password)
  const result = await db.user.update({
    where: { email },
    data: { hashedPassword },
    select: { id: true },
  })
  return result.id
}
