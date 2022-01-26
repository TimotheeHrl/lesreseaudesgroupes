import db, { Prisma } from "db"
import * as z from "zod"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"
type GetApostInput = Pick<Prisma.ApostFindFirstArgs, "where">

export default async function getTpost({ where }: GetApostInput, ctx: Ctx) {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  ctx.session.$authorize()
  const apost = await db.apost.findFirst({
    where,
    select: {
      content: true,
      createdAt: true,
      user: {
        select: { id: true, name: true, avatar: true },
      },
      areplys: {
        select: {
          id: true,
          content: true,
          createdAt: true,
          user: {
            select: { id: true, name: true, avatar: true, lien: true },
          },
        },
      },
    },
  })

  if (!apost) throw new NotFoundError()
  else {
    return apost
  }
}
