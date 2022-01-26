import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetUserInput = Pick<Prisma.UserFindUniqueArgs, "where">

export default async function getUserPerso(GetUserInput, ctx: Ctx) {
  ctx.session.$authorize(["VERIF", "NONVERIF", "ADMIN"])
  const userId = ctx.session.userId
  const UserQuery = await db.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      name: true,
      avatar: true,
      userLat: true,
      userLon: true,
      following: true,
      userDescription: true,
      lien: true,
      getNotifications: true,
      teams: {
        select: {
          id: true,
          image: true,
          name: true,
        },
      },
    },
  })
  return UserQuery
}
