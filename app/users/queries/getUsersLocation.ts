import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetUsersInput = Pick<Prisma.UserFindManyArgs, "where" | "orderBy" | "select">

export default async function getUsersLocation({ orderBy }: GetUsersInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  const userId = ctx.session.userId as string
  const users = await db.user.findMany({
    where: {
      OR: [
        { role: "VERIF", getNotifications: true },
        { role: "ADMIN", getNotifications: true },
      ],
      NOT: [{ id: userId }],
    },
    select: {
      name: true,
      avatar: true,
      id: true,
      userLat: true,
      userLon: true,
      userDescription: true,
      lien: true,
      role: true,
    },
    orderBy,
  })

  const count = await db.user.count()

  return {
    users,
    count,
  }
}
