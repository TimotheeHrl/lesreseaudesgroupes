import { Ctx, AuthorizationError, NotFoundError } from "blitz"
import db, { Prisma, User } from "db"

type UpdateTeamInput = Pick<Prisma.TeamUpdateArgs, "where">

export default async function leaveTeam({ where }: UpdateTeamInput, ctx: Ctx) {
  ctx.session.$authorize()
  const UserId = ctx.session.userId as string
  const team = await db.team.findFirst({
    where,
    select: {
      TeamMemberId: true,
      TeamMastersID: true,
    },
  })

  const TeamMastersIDs = team?.TeamMastersID as string[]
  const TeamMemberIds = team?.TeamMemberId as string[]
  let filteredTeamMemberIds = TeamMemberIds.filter(function (value) {
    return value !== UserId
  })
  const messageNope: boolean = false
  const even = (element) => element === UserId
  const IsTheMaster: boolean = TeamMastersIDs.some(even)
  if (IsTheMaster === true) {
    return messageNope
  } else {
    await db.team.update({
      where,
      data: {
        TeamMemberId: filteredTeamMemberIds,
        users: { disconnect: { id: UserId } },
      },
    })
  }
}
