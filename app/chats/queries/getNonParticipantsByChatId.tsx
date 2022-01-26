import db from "db"
import { Ctx } from "blitz"

export default async function getNonParticipantsByChatId({ id }, ctx: Ctx) {
  ctx.session.$authorize()
  const list = await db.user.findMany({
    where: {
      NOT: {
        participatesIn: {
          some: { id: id as string },
        },
      },
    },
    select: {
      name: true,
      id: true,
      avatar: true,
    },
  })
  // const count = await db.user.count();

  return list!
}
