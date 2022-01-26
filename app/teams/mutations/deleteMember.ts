import { Ctx, AuthorizationError, NotFoundError } from "blitz"
import db, { Prisma, User } from "db"

type UpdateTeamInput = Pick<Prisma.TeamUpdateArgs, "where" | "data">

export default async function DeleteMember({ where, data }: UpdateTeamInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  const team = await db.team.findFirst({
    where,
    select: {
      TeamMastersID: true,
    },
  })
  if (!team) throw new NotFoundError()
  const teamMastersIds = team.TeamMastersID
  let UserId = ctx.session.userId
  const even = (element) => element === UserId
  const Matched: boolean = teamMastersIds.some(even)
  if (Matched === true) {
    await db.team.update({
      where,
      data: {
        TeamMemberId: data.TeamMemberId,
        TeamMastersID: data.TeamMastersID,
        users: { disconnect: { id: (data.users as User).id } },
      },
    })
  }
  if (Matched === false) {
    throw new AuthorizationError()
  }
  return team
}
