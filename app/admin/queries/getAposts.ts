import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetApostsInput = Pick<
  Prisma.ApostFindManyArgs,
  "where" | "orderBy" | "skip" | "take" | "include"
>

export default async function getAposts({ where, orderBy, skip = 0, take }: GetApostsInput) {
  const aposts = await db.apost.findMany({
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
          createdAt: true,
          role: true,
        },
      },
    },
  })

  const count = await db.tpost.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    aposts,
    nextPage,
    hasMore,
    count,
  }
}
