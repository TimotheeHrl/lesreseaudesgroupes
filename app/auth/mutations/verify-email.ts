import { resolver } from "blitz"
import db from "db"
import { verifyCode } from "../verify-email"
import * as z from "zod"
import { Role } from "types"

export default resolver.pipe(
  resolver.zod(z.object({ code: z.string() })),
  resolver.authorize(),
  async ({ code }, ctx) => {
    const user = await db.user.findUnique({
      where: { id: ctx.session.userId },
      select: {
        hashedPassword: true,
        email: true,
        lien: true,
        userDescription: true,
        createdAt: true,
      },
    })
    const IsNotBanned = await db.user.findUnique({
      where: { id: ctx.session.userId },
      select: { isPublic: true },
    })
    const { hashedPassword } = user!
    const isValid = await verifyCode(code, hashedPassword)
    if (isValid && IsNotBanned?.isPublic === (true as Boolean)) {
      await ctx.session.$revoke()
      await ctx.session.$create({
        userId: ctx.session.userId,
        role: "VERIF" as Role,
        emailIsVerified: true,
        lien: user?.lien as string,
        userDescription: user?.userDescription as string,
        userCreatedAt: user?.createdAt as Date,
      })
      await db.user.update({
        where: { id: ctx.session.userId },
        data: { emailIsVerified: true, role: "VERIF" as Role },
      })
      return true
    } else {
      return false
    }
  }
)
