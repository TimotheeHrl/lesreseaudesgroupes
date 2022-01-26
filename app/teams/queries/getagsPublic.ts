import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetTagsInput = Pick<Prisma.TagFindManyArgs, "where" | "orderBy" | "skip" | "take">

export default async function getagsPublic({ where, orderBy, skip = 0, take }: GetTagsInput) {
  const tags = await db.tag.findMany({
    where: { isPublic: true },
    select: {
      id: true,
      isPublic: true,
      catSpecific: true,
      teams: { select: { public: true } },
    },
    orderBy: {
      catSpecific: "asc",
    },
    take: 300,
    skip: 0,
  })

  const count = await db.tag.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    tags,
    nextPage,
    hasMore,
    count,
  }
}
