import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetTrepliesInput = Pick<
  Prisma.TreplyFindManyArgs,
  "where" | "orderBy" | "skip" | "take" | "include"
>

export default async function getTreplies(
  { where, orderBy, skip = 0, take }: GetTrepliesInput,
  ctx: Ctx
) {
  ctx.session.$authorize()

  const treplies = await db.treply.findMany({
    where,
    orderBy,
    take,
    skip,
    include: {
      user: { select: { id: true, name: true, avatar: true } },
    },
  })

  const count = await db.treply.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    treplies,
    nextPage,
    hasMore,
    count,
  }
}
