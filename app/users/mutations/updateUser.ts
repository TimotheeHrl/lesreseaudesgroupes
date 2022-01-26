import db, { Prisma } from "db"
import { resolver, Ctx } from "blitz"
import { hashPassword } from "app/auth/auth-utils"
import { userUpdateInput } from "app/auth/validations"
import { sendEmail } from "app/mail"
import ip from "ip"
import * as verifyEmail from "app/auth/verify-email"
import { Role } from "types"
import { templatemail } from "app/utils/templatemail"

const url = process.env.BASE_URL as string
export default resolver.pipe(
  resolver.zod(userUpdateInput),
  async ({ name, userLat, userLon, userDescription, lien }, ctx: Ctx) => {
    ctx.session.$authorize(["ADMIN", "VERIF", "NONVERIF"])
    let UserId = ctx.session.userId as string
    const userRole = ctx.session.role
    const emailVerif = ctx.session.emailIsVerified
    const url = process.env.BASE_URL as string
    const userData = await db.user.findUnique({
      where: { id: UserId },
      select: { email: true, hashedPassword: true, createdAt: true, name: true },
    })
    const hasNotChangeName = (userData?.name as string) === (name as string)

    let NameonlyLetters = name.replace(/[^a-zA-Zéèê]/gm, "").toLocaleLowerCase() as string
    let NameStartWithUpperCase = (NameonlyLetters.charAt(0).toUpperCase() +
      NameonlyLetters.slice(1)) as string

    const existingUserName = await db.user.findUnique({ where: { name } })
    if (existingUserName?.isActive && hasNotChangeName === false) {
      return "username_exists"
    }

    const hashedPassword = userData?.hashedPassword as string

    if (!lien.includes("https://") && !lien.includes("http://") && lien.length > 0) {
      lien = `https://${lien}` as string
    }
    if (lien.includes("http://")) {
      return "lien_no_ssl"
    }

    await db.user.update({
      where: { id: UserId },
      data: {
        name: NameStartWithUpperCase,
        userLat,
        userLon,
        userDescription,
        lien: lien,
        isActive: false,
        isPublic: false,
      },
    })

    return "success"
  }
)
