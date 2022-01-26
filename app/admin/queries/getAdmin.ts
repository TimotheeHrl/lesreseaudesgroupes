import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetUsersInput = Pick<Prisma.UserFindManyArgs, "where" | "orderBy" | "select">

export default async function getAdmin({ orderBy, where }: GetUsersInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role

  const users = await db.user.findMany({
    where,
    select: {
      name: true,
      id: true,
      avatar: true,
      lien: true,
      userDescription: true,
      createdAt: true,
      role: true,
    },
    orderBy,
  })

  return users
}
