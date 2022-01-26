import db from "db"
import { Ctx } from "blitz"
import isUserPart from "./isUserPart"

export default async function getMessagesByChat({ chatId }, ctx: Ctx) {
  ctx.session.$authorize(["VERIF", "ADMIN"])
  let userId = ctx.session.userId as string
  const res = await isUserPart(chatId as string, userId)
  let check = await res

  if (check === true) {
    const messages = db.message.findMany({
      where: { sentInId: chatId },
      orderBy: { sentAt: "asc" },
      select: {
        id: true,
        content: true,
        htmlContent: true,
        sentAt: true,
        sentInId: true,
        sentIn: { select: { private: true } },
        sentFrom: {
          select: {
            name: true,
            id: true,
            avatar: true,
            lien: true,
            userDescription: true,
            createdAt: true,
            role: true,
          },
        },
      },
    })

    return messages
  }
}
