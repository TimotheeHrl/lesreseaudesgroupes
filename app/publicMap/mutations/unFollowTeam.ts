import { Ctx } from "blitz"
import db, { Prisma } from "db"

type DeleteTeamFollowerInput = Pick<Prisma.TeamFollowerDeleteArgs, "where">

export default async function unFollowTeam({ where }: DeleteTeamFollowerInput, ctx: Ctx) {
  ctx.session.$authorize()

  let userId = ctx.session.userId as string
  if (where.id?.includes(userId)) {
    const FollowTeam = await db.teamFollower.deleteMany({
      where,
    })

    return FollowTeam
  }
}
