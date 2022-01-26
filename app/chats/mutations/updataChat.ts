import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma, User } from "db"

type ChatUpdateInput = Pick<Prisma.ChatUpdateArgs, "data" | "where">

interface IMemberIdList {
  id: string
}

export default async function updateUserChat({ where, data }, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  let UserId = ctx.session.userId

  let ChatMembersIds = [] as string[]
  const chat = await db.chat.findFirst({
    where,
    select: {
      participatingUsers: {
        select: {
          id: true,
        },
      },
    },
  })
  let chatM = chat?.participatingUsers.length as number
  let chatMember = chat?.participatingUsers as IMemberIdList[]

  let checkIf = chatMember.some((item) => item.id === UserId)

  if (checkIf === true) {
    await db.chat.update({
      where,
      data: {
        participatingUsers: {
          connect: data.participatingUsers.map((userId) => ({ id: userId as string })),
        } as any,
      },
    })

    //deleteConnectionUser()
  }
  /**
async function deleteConnectionUser(){  
await db.chat.update({
  where,
  data: {
    participatingUsers: {
    set: []
   },
 },
})
}
setNewUsers()
}
 */
  if (checkIf === false) {
    throw new AuthorizationError()
  }
  return chat
}
