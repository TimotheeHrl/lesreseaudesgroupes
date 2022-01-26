import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"

type GetTeamInput = Pick<Prisma.TeamFindFirstArgs, "where">

export default async function IsTeamMember({ where }: GetTeamInput, ctx: Ctx) {
  ctx.session.$authorize(["VERIF", "ADMIN", "NONVERIF"])

  const teamM = await db.team.findFirst({
    where,
    select: {
      TeamMemberId: true,
      TeamMastersID: true,
    },
  })

  const teamMastersIds = teamM?.TeamMastersID as string[]
  const teamMembersIds = teamM?.TeamMemberId as string[]
  let UserId = ctx.session.userId
  const even = (element) => element === UserId
  const MatchedTeamMaster: boolean = teamMastersIds.some(even)
  const MatchedTeamMember: boolean = teamMembersIds.some(even)

  return { MatchedTeamMaster, MatchedTeamMember }
}
