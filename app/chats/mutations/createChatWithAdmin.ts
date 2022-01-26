import db, { Chat } from "db"
import { Ctx } from "blitz"

export default async function createChatWithAdmin({ chatParticipants, ChatId }, ctx: Ctx) {
  const userId = ctx?.session.userId as string
  const userName = await db.user.findFirst({
    where: { id: userId },
    select: {
      name: true,
    },
  })

  const Subject = `${userName?.name as string} à admin`
  const chatwithAdmin = (await db.chat.create({
    data: {
      id: ChatId,
      subject: Subject,
      private: true,
      participatingUsers: { connect: chatParticipants.map((userId) => ({ id: userId as string })) },
    },
  })) as Chat

  return chatwithAdmin
}
