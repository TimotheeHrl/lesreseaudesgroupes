import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetTeamsInput = Pick<Prisma.TeamFindManyArgs, "where">

export default async function getTeamsSelect({ where }: GetTeamsInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role

  const teamSelect = await db.team.findMany({
    where,
    select: { id: true, name: true, public: true },
  })

  return teamSelect
}
