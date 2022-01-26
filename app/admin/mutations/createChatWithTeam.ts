import { Ctx } from "blitz"
import db, { Chat } from "db"

export default async function TeamUserChat({ data }, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"]) 
           
  const team = await db.team.findFirst({
    where:{id:data.teamId},
    select: {
      name: true,
    },
  })
const Subject = `Admins à ${team?.name as string}`
  const chatParticipants = data.participatingUsers as string[]
  const element = ctx.session.userId
  chatParticipants.push(element)

  const chatwithteam = (await db.chat.create({
    data: {
      id: data.id,
      subject:Subject,
      private:true,
      participatingUsers: { connect: chatParticipants.map((userId) => ({ id: userId as string })) },
    },
  })) as Chat

  return chatwithteam
}
