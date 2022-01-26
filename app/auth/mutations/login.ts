import { resolver } from "blitz"
import { authenticateUser } from "app/auth/auth-utils"
import { LoginInput } from "../validations"
import { Role } from "types"
import ip from "ip"
import db from "db"

export default resolver.pipe(resolver.zod(LoginInput), async ({ email, password }, ctx) => {
  const Ip = await ip.address() // my ip address
  const userIp = Ip as string
  const userVerif = await db.user.findUnique({
    where: { email: email },
    select: { emailIsVerified: true, ip: true },
  })
  let userIpArr = userVerif?.ip as string[]
  const includesIp = userIpArr.includes(userIp)
  if (includesIp === false) {
    userIpArr.push(userIp)
  }
  await db.user.update({
    where: { email: email },
    data: { ip: userIpArr },
  })
  const isVerif = userVerif?.emailIsVerified as boolean
  const user = await authenticateUser(email, password)

  await ctx.session.$create({
    userId: user.id,
    role: user.role as Role,
    emailIsVerified: isVerif,
    lien: user.lien,
    userDescription: user.userDescription,
    userCreatedAt: user.createdAt,
  })

  return user
})
