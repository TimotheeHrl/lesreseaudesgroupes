import db, { Prisma } from "db"
import * as z from "zod"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"
type GetteventsInput = Pick<
  Prisma.TeventFindManyArgs,
  "where" | "orderBy" | "skip" | "take" | "include"
>
export default async function getTEventPublic(
  { where, orderBy, skip, take }: GetteventsInput,
  ctx: Ctx
) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  const count = await db.tevent.count()

  const tevents = await db.tevent.findMany({
    where,
    orderBy,
    take,
    skip,
    include: {
      ereplys: true,
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          lien: true,
          userDescription: true,
          createdAt: true,
        },
      },
    },
  })

  return {
    tevents,

    count,
  }
}
