import db, { Prisma, Chat } from "db"
import { Ctx } from "blitz"

type GetChatInput = Pick<Prisma.ChatFindFirstArgs, "where">

export default async function getChatByTeamUs({ where }: GetChatInput, ctx: Ctx) {
  ctx.session.$authorize()

  const chatUnique = await db.chat.findFirst({
    where,
    select: {
      id: true,
    },
  })
  return chatUnique as string | null
}
