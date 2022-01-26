import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"

type GetTeamInput = Pick<Prisma.TeamFindFirstArgs, "where">

export default async function getTeamTags({ where }: GetTeamInput, ctx: Ctx) {
  ctx.session.$authorize()

  const teamTags = await db.team.findFirst({
    where,

    select: {
      id: true,
      tags: {
        select: {
          id: true,
          isPublic: true,
          catSpecific: true,
        },
      },
    },
  })
  return teamTags
}
