import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetUsersInput = Pick<Prisma.UserFindManyArgs, "where" | "orderBy" | "select">

export default async function getBannedUsers({ orderBy, where }: GetUsersInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role

  const bann = await db.user.findMany({
    where: { role: "BANNED" },
    select: { name: true, id: true, ip: true, email: true, createdAt: true },
    orderBy,
  })

  return bann
}
