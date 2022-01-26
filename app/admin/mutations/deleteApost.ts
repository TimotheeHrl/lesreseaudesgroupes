import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"

type UpdateApostInput = Pick<Prisma.ApostDeleteArgs, "where">
export default async function deleteTpost({ where }: UpdateApostInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])

  await db.apost.delete({
    where,
  })

  return "apost deleted"
}
