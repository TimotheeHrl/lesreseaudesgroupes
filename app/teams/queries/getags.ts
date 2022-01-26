import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetTagsInput = Pick<Prisma.TagFindManyArgs, "where" | "orderBy" | "skip" | "take">

export default async function getTags({ where, orderBy, skip = 0, take }: GetTagsInput) {
  const tags = await db.tag.findMany({
    where: {
      AND: [{ catSpecific: "ctag" }, { isPublic: true }],
      NOT: [{ catSpecific: "secteur" }],
    },
    select: {
      id: true,
      isPublic: true,
      catSpecific: true,
      teams: { select: { public: true } },
    },
    orderBy: {
      catSpecific: "asc",
    },
    take: 200,
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
