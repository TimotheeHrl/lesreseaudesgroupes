import { Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type GetTeamInput = Pick<Prisma.TeamFindFirstArgs, "where">

export default async function getPublicTeam({ where }: GetTeamInput) {
  const team = await db.team.findFirst({
    where,
    include: {
      users: { select: { id: true, name: true, avatar: true } },
      tags: true,
      teamFollowers: true,
    },
  })

  return team
}
