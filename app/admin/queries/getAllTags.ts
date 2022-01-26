import { Select } from "@material-ui/core"
import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetTagsInput = Pick<Prisma.TagFindManyArgs, "orderBy" | "skip" | "take">

export default async function getAllTags({ orderBy, skip = 0, take }: GetTagsInput) {
  const tags = await db.tag.findMany({
    where: { catSpecific: "ctag" },
    include: {
      teams: {
        select: {
          public: true,
        },
      },
    },
    orderBy: {
      id: "asc",
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
