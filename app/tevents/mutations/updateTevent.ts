import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"

type UpdateteventInput = Pick<Prisma.TeventUpdateArgs, "data" | "where">
export default async function updatetevent({ data, where }: UpdateteventInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])

  const teamId = data.teamId as string
  const team = await db.team.findFirst({
    where: { id: teamId },
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
    const content = data.content as string

    let userIdd = ctx.session.userId as string
    const userId = userIdd as string
    const teamId = data.teamId as string
    await db.tevent.update({
      where,
      data: {
        content,
        teamId,
        userId,
      },
    })
  }
  if (Matched === false) {
    throw new AuthorizationError()
  }

  return teamId
}
