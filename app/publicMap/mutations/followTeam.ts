import { Ctx } from "blitz"
import db, { Prisma } from "db"

type CreateTeamFollowerInput = Pick<Prisma.TeamFollowerCreateArgs, "data">

export default async function FollowTeam({ data }: CreateTeamFollowerInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])

  let userId = ctx.session.userId as string
  let teamUnkown = data.teamId as string | undefined
  let teamString = data.teamId as string
  let Followid = `${data.teamId}+${userId}`
  const FollowTeam = await db.teamFollower.create({
    data: {
      id: Followid,
      followerId: userId,
      teamId: teamString,
      user: { connect: { id: userId } },
      team: { connect: { id: teamUnkown } },
    },
  })

  return FollowTeam
}
