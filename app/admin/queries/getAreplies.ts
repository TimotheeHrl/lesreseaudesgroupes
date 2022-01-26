import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetArepliesInput = Pick<
  Prisma.AreplyFindManyArgs,
  "where" | "orderBy" | "skip" | "take" | "include"
>

export default async function getAreplies({
  where,
  orderBy,
  skip = 0,
  take = 50,
}: GetArepliesInput) {
  const areplies = await db.areply.findMany({
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

  const count = await db.areply.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    areplies,
    nextPage,
    hasMore,
    count,
  }
}
