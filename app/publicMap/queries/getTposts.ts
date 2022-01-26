import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetTpostsInput = Pick<
  Prisma.TpostFindManyArgs,
  "where" | "orderBy" | "skip" | "take" | "include"
>

export default async function getTposts(
  { where, orderBy, skip = 0, take }: GetTpostsInput,
  ctx: Ctx
) {
  ctx.session.$authorize(["ADMIN", "VERIF"])

  const tposts = await db.tpost.findMany({
    where,
    orderBy,
    take,
    skip,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          lien: true,
          role: true,
          createdAt: true,
          userDescription: true,
        },
      },
      treplys: { select: { content: true, createdAt: true, userId: true } },
    },
  })

  const count = await db.tpost.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    tposts,
    nextPage,
    hasMore,
    count,
  }
}
