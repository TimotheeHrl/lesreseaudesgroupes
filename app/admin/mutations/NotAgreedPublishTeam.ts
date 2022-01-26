import { Ctx, AuthorizationError, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type TeamUpdateInput = Pick<Prisma.TeamUpdateArgs, "where">
export default async function NotAgreedPublishTeam({ where }: TeamUpdateInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role

  await db.team.update({
    where,
    data: {
      public: false,
      publishDemand: false,
    },
  })
}
