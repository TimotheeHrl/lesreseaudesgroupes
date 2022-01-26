import db from "db"
import { Ctx } from "blitz"

export default async function getParticipantsByChatId({ id }, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  const list = await db.user.findMany({
    where: { participatesIn: { some: { id: id } } },
    select: {
      name: true,
      id: true,
      avatar: true,
      userDescription: true,
      lien: true,
      createdAt: true,
      role: true,
    },
  })
  return list!
}
