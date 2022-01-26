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
  ctx.session.$authorize()

  const tposts = await db.tpost.findMany({
    where,
    orderBy,
    take,
    skip,
    include: {
      treplys: true,
      user: { select: { id: true, name: true, avatar: true } },
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
