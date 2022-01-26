import { Ctx } from "blitz"
import db, { Prisma } from "db"
type ChatUpdateInput = Pick<Prisma.ChatUpdateArgs, "where">

export default async function leaveChat({ where }: ChatUpdateInput, ctx: Ctx) {
  ctx.session.$authorize()
  await db.chat.update({
    where,
    data: {
      participatingUsers: { disconnect: { id: ctx.session.userId } },
    },
  })
}
