import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"

type SignalAdminUpdate = Pick<Prisma.SignalAdminUpdateArgs, "data" | "where">
export default async function updateTpost({ data, where }: SignalAdminUpdate, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role

  const signal = await db.signalAdmin.update({
    where,
    data: {
      isTreated: true,
    },
    select: { isTreated: true },
  })

  return signal
}
