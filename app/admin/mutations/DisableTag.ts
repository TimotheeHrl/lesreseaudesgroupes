import { Ctx } from "blitz"
import db, { Prisma } from "db"

type TagDisab = Pick<Prisma.TagUpdateArgs, "where">

export default async function DisableTag({ where }: TagDisab, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role
  await db.tag.update({
    where,
    data: {
      isPublic: false,
      teams: {
        set: [],
      },
    },
  })
}
