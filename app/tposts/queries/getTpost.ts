import db, { Prisma } from "db"
import * as z from "zod"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"
type GetTpostInput = Pick<Prisma.TpostFindFirstArgs, "where">

export default async function getTpost({ where }: GetTpostInput, ctx: Ctx) {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  ctx.session.$authorize()
  const tpost = await db.tpost.findFirst({
    where,
  })

  if (!tpost) throw new NotFoundError()
  else {
    return tpost
  }
}
