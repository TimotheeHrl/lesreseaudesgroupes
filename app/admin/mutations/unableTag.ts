import { Ctx } from "blitz"
import db, { Prisma } from "db"

export default async function unableTag({ where }, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role
  await db.tag.update({
    where,
    data: {
      isPublic: true,
    },
  })
}
