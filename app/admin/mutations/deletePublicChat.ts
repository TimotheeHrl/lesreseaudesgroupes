import { Ctx } from "blitz"
import db, { Prisma } from "db"

type ChatDisab = Pick<Prisma.ChatDeleteArgs, "where">

export default async function deletePublicChatMut(AllCheckedVal: String[], ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role
  for (let i = 0; i < AllCheckedVal.length; i++) {
    let chatId = AllCheckedVal[i] as string
    await db.chat.update({
      where: { id: chatId },
      data: {
        IsDeletedByAdmin: true,
      },
    })
  }
}
