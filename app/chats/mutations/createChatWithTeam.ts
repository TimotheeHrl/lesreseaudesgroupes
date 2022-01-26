import { Ctx } from "blitz"
import db, { Chat } from "db"

export default async function TeamUserChat({ data }, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  const userId = ctx?.session.userId as string
  const userName = await db.user.findFirst({
    where: { id: userId },
    select: {
      name: true,
    },
  })
  const team = await db.team.findFirst({
    where: { id: data.teamId },
    select: {
      name: true,
    },
  })
  const Subject = `${userName?.name as string} à ${team?.name as string}`
  const chatParticipants = data.participatingUsers
  const element = ctx.session.userId
  chatParticipants.push(element)

  const chatwithteam = (await db.chat.create({
    data: {
      id: data.id,
      subject: Subject,
      private: true,
      participatingUsers: { connect: chatParticipants.map((userId) => ({ id: userId as string })) },
    },
  })) as Chat

  return chatwithteam
}
