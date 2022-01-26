import db from "db"
import { Ctx } from "blitz"

export interface Message {
  content: string
  sentAt: Date
  sentFrom?: { name: string | null }
  sentIn: { subject: string; private: boolean }
}

export default async function getAllPublicChat(_ = null, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const userId = ctx.session.userId as string
  // { AND:[{participatingUsers: { some: { id: userId} }}, {private:false}] },
  const chats = await db.chat.findMany({
    where: {
      private: false,
      IsDeletedByAdmin: {
        not: true,
      },
    },
    select: {
      id: true,
      participatingUsers: { select: { id: true, name: true, avatar: true } },
    },
  })

  const chatsAndMessage = chats.map(async ({ id, participatingUsers }) => {
    const lastMessage: Message | null = await db.message.findFirst({
      where: { sentInId: id },
      orderBy: { sentAt: "desc" },
      select: {
        sentIn: { select: { subject: true, private: true, id: true } },
        content: true,
        sentAt: true,
        sentFrom: { select: { name: true } },
      },
    })
    return {
      lastMessage: lastMessage,
      id: id,
      participatingUsers: participatingUsers,
    }
  })
  const result = await Promise.all(chatsAndMessage.reverse())
  return result
}
