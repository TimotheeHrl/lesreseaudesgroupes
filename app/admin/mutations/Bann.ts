import { Ctx, AuthorizationError } from "blitz"
import db, { Prisma, Session } from "db"

type UpdateUserInput = Pick<Prisma.UserUpdateArgs, "where">
async function updateSession(userId, userIps) {
  const dateNow = new Date()
  const UserIps = userIps as string[]
  const UserId = userId as string
  await db.session.updateMany({
    where: { userId: UserId },
    data: {
      publicData: `{"userId":"${UserId}","role":"BANNED","emailIsVerified":true}`,
    },
  })
  await db.tpost.updateMany({
    where: { userId: UserId },
    data: {
      content: " ",
    },
  })
  await db.message.updateMany({
    where: { sentFromId: UserId },
    data: {
      content: " ",
    },
  })
  await db.treply.updateMany({
    where: { userId: UserId },
    data: {
      content: " ",
    },
  })
  await db.ereply.updateMany({
    where: { userId: UserId },
    data: {
      content: " ",
    },
  })
  await db.areply.updateMany({
    where: { userId: UserId },
    data: {
      content: " ",
    },
  })

  await db.tevent.updateMany({
    where: { userId: UserId },
    data: {
      subject: " ",
      content: " ",
      endsAt: dateNow,
    },
  })
  await db.message.updateMany({
    where: { sentFromId: UserId },
    data: {
      content: " ",
    },
  })
  for (let i = 0; i < UserIps?.length; i++) {
    const ip = UserIps[i] as string
    await db.bannedIp.create({
      data: {
        ip: ip,
      },
    })
  }
}

export default async function Bann({ where }: UpdateUserInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role
  const User = await db.user.findUnique({
    where,
    select: { id: true, ip: true },
  })
  const userId = User?.id as string
  const userIps = User?.ip as string[]
  updateSession(userId, userIps)

  const user = await db.user.update({
    where,
    data: {
      role: "BANNED",
      isPublic: false,
    },
  })
  return user
}
