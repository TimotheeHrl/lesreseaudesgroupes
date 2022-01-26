import db, { Chat } from "db"
import { Ctx, AuthorizationError } from "blitz"

export default async function isUserPart(chatId, userId) {
  const ChatId = chatId as string
  const UserId = userId as string
  const chatSpe = await db.chat.findFirst({
    where: {
      id: ChatId,
      participatingUsers: { some: { id: UserId } },
    },
    select: {
      id: true,
    },
  })
  const chatPub = await db.chat.findFirst({
    where: {
      id: ChatId,
    },
    select: {
      id: true,
      private:true
    },
  })
  if (chatSpe?.id !== undefined ) {
    return true
  } 
  else if ( chatPub?.private === false) {
    return true
  } 
  else {
    throw new AuthorizationError()
  }


}