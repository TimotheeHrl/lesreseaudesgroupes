import { Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type GetTeamInput = Pick<Prisma.TeamFindFirstArgs, "where">

export default async function getTeamName({ where }: GetTeamInput) {
  const teamName = await db.team.findFirst({
    where,
    select: {
      id: true,
      name: true,
    },
  })
  if (!teamName) throw new NotFoundError()

  return teamName
}
