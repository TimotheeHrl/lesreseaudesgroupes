import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetUsersInput = Pick<Prisma.UserFindManyArgs, "where" | "orderBy" | "select">

export default async function getUsers({ orderBy }: GetUsersInput, ctx: Ctx) {
  ctx.session.$authorize()

  const users = await db.user.findMany({
    where: { emailIsVerified: true },
    select: { name: true, id: true },
    orderBy,
  })

  return users
}
