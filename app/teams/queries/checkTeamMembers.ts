import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"

type GetTeamInput = Pick<Prisma.TeamFindFirstArgs, "where">

export default async function checkTeamMembers({ where }: GetTeamInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])

  const team = await db.team.findFirst({
    where,
    include: {
      users: {
        select: {
          name: true,
          avatar: true,
          id: true,
          lien: true,
          userDescription: true,
          createdAt: true,
        },
      },
    },
  })
  return team
}
