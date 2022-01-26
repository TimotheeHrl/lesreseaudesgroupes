import db, { Prisma } from "db"
//import getCronJobs from "../../utils/cronJob"

type GetTeamsInput = Pick<
  Prisma.TeamFindManyArgs,
  "where" | "orderBy" | "skip" | "take" | "include" | "cursor"
>

export default async function getTeams({ where, orderBy, skip = 0, take, include }: GetTeamsInput) {
  const teams = await db.team.findMany({
    where,
    orderBy: { findIndex: "desc" },
    take,
    skip,
    include: { tags: true },
  })

  const count = await db.team.count({ where })
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { where, orderBy, take, skip: skip + take! } : null

  return {
    teams,
    nextPage,
    hasMore,
    count,
  }
}
