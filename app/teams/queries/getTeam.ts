import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"

type GetTeamInput = Pick<Prisma.TeamFindFirstArgs, "where">

export default async function getTeam({ where }: GetTeamInput, ctx: Ctx) {
  ctx.session.$authorize()
  const team = await db.team.findFirst({
    where,
    include: {
      users: { select: { id: true, name: true, avatar: true } },
      tags: true,
    },
  })
  if (!team) throw new NotFoundError()
  const TeamMemberId = team.TeamMemberId
  let UserId = ctx.session.userId

  const even = (element) => element === UserId
  const Matched: boolean = TeamMemberId.some(even)
  if (Matched === true) {
    await db.team.findFirst({
      where,
      include: {
        users: { select: { id: true, name: true, avatar: true } },
      },
    })
  }
  if (Matched === false) {
    throw new AuthorizationError()
  }
  return team
}
