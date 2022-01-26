import { Ctx, AuthorizationError } from "blitz"
import db, { Prisma } from "db"

type GetteventsInput = Pick<
  Prisma.TeventFindManyArgs,
  "where" | "orderBy" | "skip" | "take" | "include"
>

export default async function gettevents(
  { where, orderBy, skip = 0, take }: GetteventsInput,
  ctx: Ctx
) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  const teventCheck = await db.tevent.findMany({
    where,
    select: {
      teamId: true,
    },
  })
  const teamId = teventCheck[0]?.teamId
  const teamCheck = await db.team.findFirst({
    where: { id: teamId },
    select: {
      TeamMemberId: true,
    },
  })
  const teamMastersIds = teamCheck?.TeamMemberId as string[]
  let UserId = ctx.session.userId
  const even = (element) => element === UserId

  const Matched: boolean = teamMastersIds.some(even)
  if (Matched !== true && typeof teventCheck[0]?.teamId === "string") {
    throw new AuthorizationError()
  }
  const tevents = await db.tevent.findMany({
    where,
    orderBy: { startAt: "desc" },
    take: 5,
    skip,
    include: {
      ereplys: true,
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          lien: true,
          userDescription: true,
          createdAt: true,
        },
      },
    },
  })

  const count = await db.tevent.count()
  const hasMore = typeof take === "number" ? skip + take < count : false
  const nextPage = hasMore ? { take, skip: skip + take! } : null

  return {
    tevents,
    nextPage,
    hasMore,
    count,
  }
}
