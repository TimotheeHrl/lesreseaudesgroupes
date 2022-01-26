import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"

type GetTeamInput = Pick<Prisma.TeamFindFirstArgs, "where">

export default async function getTeamTags({ where }: GetTeamInput, ctx: Ctx) {
  ctx.session.$authorize()

  const teamTags = await db.tag.findMany({
    where: {
      AND: [{ teams: { some: { id: where?.id } } }, { catSpecific: "ctag" }],
    },
    select: {
      id: true,
      isPublic: true,
    },
  })
  const teamTagsSpe = await db.tag.findMany({
    where: {
      AND: [{ teams: { some: { id: where?.id } } }],
      NOT: [{ catSpecific: "ctag" }],
    },
    select: {
      id: true,
      catSpecific: true,
    },
  })
  return { teamTags, teamTagsSpe }
}
