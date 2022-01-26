import db, { Prisma } from "db"
import * as z from "zod"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"
type GetteventInput = Pick<Prisma.TeventFindFirstArgs, "where">

export default async function getteventlocation({ where }: GetteventInput, ctx: Ctx) {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  ctx.session.$authorize()
  const tevent = await db.tevent.findFirst({
    where,
    select: {
      eventLat: true,
      eventLon: true,
    },
  })

  if (!tevent) throw new NotFoundError()
  else {
    return tevent
  }
}
