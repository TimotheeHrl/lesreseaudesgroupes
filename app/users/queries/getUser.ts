import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetUserInput = Pick<Prisma.UserFindUniqueArgs, "where" | "select">

export default async function getUser({ where }: GetUserInput, ctx: Ctx) {
  ctx.session.$authorize()

  const user = await db.user.findFirst({
    where,
    select: {
      id: true,
      name: true,
      avatar: true,
      bio: true,
      userDescription: true,
      lien: true,
      role: true,
      createdAt: true,
    },
  })

  return user
}
