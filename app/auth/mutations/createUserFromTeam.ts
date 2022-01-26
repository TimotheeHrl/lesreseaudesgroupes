import db, { Prisma } from "db"
import { Ctx } from "blitz"
import { hashPassword } from "app/auth/auth-utils"
import ip from "ip"
import crypto from "crypto"
import * as passwordResetInvite from "../resetpasswordInvite"
type CreateUserInvite = Pick<Prisma.UserCreateArgs, "data">

async function getCurrentUserLatLon(currentUserId) {
  const currentUser = await db.user.findFirst({
    where: { id: currentUserId },
    select: { name: true, userLat: true, userLon: true },
  })
  return currentUser
}

export default async function createUserFromTeam({ data }: CreateUserInvite, ctx: Ctx) {
  const email = data.email as string
  let password = crypto.randomBytes(12).toString("hex")
  let nameEnd = crypto.randomBytes(2).toString("hex")
  let nameMatch = email.match(/^([^@]*)@/)
  let NewUserName = nameMatch ? nameMatch[1] : null
  let PreUserName = NewUserName as string
  PreUserName = PreUserName.slice(0, 5)
  let userName = `${PreUserName}${nameEnd}`
  const currentUserId = ctx.session.userId
  const getUserInfo = await getCurrentUserLatLon(currentUserId)
  const UserInfos = await getUserInfo
  const InviterName = UserInfos?.name as string
  let userIpArr = [] as string[]
  const Ip = ip.address() // my ip address
  const userIp = Ip as string // my ip address
  userIpArr.push(userIp)
  const existingUser = await db.user.findUnique({ where: { email } })
  if (existingUser?.isActive) {
    return "email_exists"
  }
  const existingUserName = await db.user.findUnique({ where: { name: userName } })
  if (existingUserName?.isActive) {
    return "username_exists"
  }

  const hashedPassword = await hashPassword(password)
  const user = await db.user.create({
    data: {
      name: userName as string,
      email,
      hashedPassword,
      userLat: UserInfos?.userLat as number,
      userLon: UserInfos?.userLon as number,
      ip: userIpArr as string[],
      getNotifications: true,
    },
    select: {
      id: true,
    },
  })
  const sendEmail = await passwordResetInvite.invoke(email, InviterName)
  await sendEmail
  return user.id
}
