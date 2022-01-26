import db, { Prisma } from "db"
import { resolver } from "blitz"
import { hashPassword } from "app/auth/auth-utils"
import { SignupInput } from "app/auth/validations"
import { sendEmail } from "app/mail"
import ip from "ip"
import * as verifyEmail from "../verify-email"
import { Role } from "types"
import { templatemail } from "app/utils/templatemail"

export default resolver.pipe(
  resolver.zod(SignupInput),
  async ({ email, password, name, userLat, userLon, userDescription, lien }, ctx) => {
    let userIpArr = [] as string[]
    const Ip = ip.address() // my ip address
    const userIp = Ip as string // my ip address
    //const checkBann = CheckIfBanned(userIp)
    userIpArr.push(userIp)
    const url = process.env.BASE_URL as string
    const CheckIfBanned = await db.bannedIp.findFirst({ where: { ip: userIp } })
    if (typeof CheckIfBanned?.id === "string") {
      return "isBanned"
    }
    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser?.isActive) {
      return "email_exists"
    }
    const existingUserName = await db.user.findUnique({ where: { name } })
    if (existingUserName?.isActive) {
      return "username_exists"
    }

    if (!lien.includes("https://") && !lien.includes("http://") && lien.length > 0) {
      lien = `https://${lien}` as string
    }
    if (lien.includes("http://")) {
      return "lien_no_ssl"
    }

    let NameonlyLetters = name.replace(/[^a-zA-Zéèê]/gm, "").toLocaleLowerCase() as string
    let NameStartWithUpperCase = (NameonlyLetters.charAt(0).toUpperCase() +
      NameonlyLetters.slice(1)) as string
    const hashedPassword = await hashPassword(password)
    const user = await db.user.create({
      data: {
        name: NameStartWithUpperCase,
        email,
        hashedPassword,
        userLat,
        userLon,
        ip: userIpArr,
        getNotifications: true,
        userDescription,
        lien: lien,
      },
      select: {
        id: true,
        createdAt: true,
      },
    })

    const emailCode = await verifyEmail.generateCode(hashedPassword)
    let verify_email_url = `${url}/verifyEmail/${emailCode}` as string
    const link = verify_email_url
    const htmlMessage = `Bienvenue sur Le Réseau des groupes </br> Merci d'activer votre compte avec ce lien. </br> Vous devez utliser le même navigateur que lors de votre inscritption`
    let htmlToSend = templatemail(link, url, htmlMessage) as string

    await Promise.all([
      await sendEmail({
        from: "info@yourwebsite.com",
        to: email,
        subject: "Bienvenue sur Le Réseau des groupes",
        text: `Merci d'activer votre compte avec ce lien ${verify_email_url}. Vous devez utliser le même navigateur que lors de votre inscritption `,
        html: htmlToSend,
      }),
      ctx.session.$create({
        userId: user.id,
        role: "NONVERIF" as Role,
        emailIsVerified: false,
        userDescription,
        lien,
        userCreatedAt: user.createdAt as Date,
      }),
    ])

    return "success"
  }
)
