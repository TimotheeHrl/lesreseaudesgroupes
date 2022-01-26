import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"

type UpdateApostInput = Pick<Prisma.ApostUpdateArgs, "data" | "where">
export default async function updateTpost({ data, where }: UpdateApostInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role

  let userId = ctx.session.userId as string
  const apost = await db.apost.update({
    where,
    data: {
      content: data.content,
      userId: userId,
    },
  })

  return apost
}
