import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GeterepliesInput = Pick<
  Prisma.EreplyFindManyArgs,
  "where" | "orderBy" | "skip" | "take" | "include"
>

export default async function getereplies(
  { where, orderBy, skip = 0, take }: GeterepliesInput,
  ctx: Ctx
) {
  ctx.session.$authorize()

  const ereplies = await db.ereply.findMany({
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
          userDescription: true,
          lien: true,
          role: true,
          createdAt: true,
        },
      },
    },
  })

  const count = await db.ereply.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    ereplies,
    nextPage,
    hasMore,
    count,
  }
}
