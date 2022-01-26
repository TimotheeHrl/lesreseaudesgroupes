import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetSignalAdmin = Pick<Prisma.SignalAdminFindFirstArgs, "where" | "orderBy">

export default async function getSignals({ where, orderBy }: GetSignalAdmin, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role

  const userSignals = await db.signalAdmin.findMany({
    where: { isTreated: false },
    select: {
      id: true,
      content: true,
      chatId: true,
      createdAt: true,
      subject: true,
      userSending: {
        select: {
          id: true,
          email: true,
          role: true,
          name: true,
          avatar: true,
          lien: true,
          userDescription: true,
          createdAt: true,
        },
      },
    },
    orderBy,
  })

  return userSignals
}
