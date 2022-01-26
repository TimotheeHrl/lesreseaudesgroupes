import db, { Prisma, Chat } from "db"
import { Ctx } from "blitz"
import isUserPart from "./isUserPart"
type GetChatInput = Pick<Prisma.ChatFindFirstArgs, "where">

export default async function getChatById({ where }: GetChatInput, ctx: Ctx) {
  ctx.session.$authorize(["VERIF", "ADMIN"])
  let chatId = where?.id as string
  let userId = ctx.session.userId as string
  isUserPart(chatId, userId)
  const chatPart = await db.chat.findFirst({
    where,
    select: {
      private: true,
      id: true,
    },
  })
  return chatPart
}
