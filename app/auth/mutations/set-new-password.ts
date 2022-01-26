import { resolver } from "blitz"
import * as passwordReset from "../resetpassword"
import * as z from "zod"
import { Role } from "types"
import ip from "ip"
import db from "db"
import { authenticateUser } from "app/auth/auth-utils"
export default resolver.pipe(
  resolver.zod(z.object({ email: z.string(), code: z.string(), newPassword: z.string() })),
  async ({ email, code, newPassword }, ctx) => {
    const Ip = ip.address() // my ip address
    const userIp = Ip as string
    const userId = await db.user.findUnique({
      where: { email: email as string },
      select: { id: true, role: true, ip: true,lien:true,userDescription:true,createdAt:true  },
    })
    let userIpArr = userId?.ip as string[]
    const includesIp = userIpArr.includes(userIp)
    if (includesIp === false) {
      userIpArr.push(userIp)
    }
    let userIDD = userId?.id as string
    const userRole = userId?.role as string
    const resetPass = await passwordReset.setPassword(email, code, newPassword)
    if ((resetPass as string) && userRole === "NONVERIF") {
      await authenticateUser(email, newPassword)
      await ctx.session.$create({
        userId: userIDD,
        role: "VERIF" as Role,
        emailIsVerified: true,
        lien:userId?.lien as string, userDescription:userId?.userDescription as string,userCreatedAt:userId?.createdAt as Date

        
      })
      await db.user.update({
        where: { id: userIDD },
        data: { emailIsVerified: true, ip: userIpArr, role: "VERIF" as Role },
      })

      return true
    }
    if ((resetPass as string) && userRole === "ADMIN") {
      await authenticateUser(email, newPassword)
      await ctx.session.$create({
        userId: userIDD,
        role: "ADMIN" as Role,
        emailIsVerified: true,
        lien:userId?.lien as string, userDescription:userId?.userDescription as string,userCreatedAt:userId?.createdAt as Date
      })
      await db.user.update({
        where: { id: userIDD },
        data: { emailIsVerified: true, ip: userIpArr, role: "ADMIN" as Role },
      })

      return true
    }
    if ((resetPass as string) && userRole === "VERIF") {
      await authenticateUser(email, newPassword)
      await ctx.session.$create({
        userId: userIDD,
        role: "VERIF" as Role,
        emailIsVerified: true,

       lien:userId?.lien as string, userDescription:userId?.userDescription as string,userCreatedAt:userId?.createdAt as Date

      })
      await db.user.update({
        where: { id: userIDD },
        data: { emailIsVerified: true, ip: userIpArr, role: "VERIF" as Role },
      })

      return true
    } else {
      return false
    }
  }
)
