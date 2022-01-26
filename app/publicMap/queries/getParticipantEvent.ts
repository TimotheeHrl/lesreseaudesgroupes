import db, { Prisma } from "db"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"
type UserParticipeEvent = Pick<Prisma.UserParticipeEventFindManyArgs, "where">

export default async function getPartiCipantsEvent({ where }: UserParticipeEvent, ctx: Ctx) {
  ctx.session.$authorize()
  const UserId = ctx.session.userId

  const Eventparticipants = await db.userParticipeEvent.findMany({
    where,
    select: {
      id: true,
      participantId: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          lien: true,
          userDescription: true,
          role: true,
          createdAt: true,
        },
      },
    },
  })
  let IsUserPart = [] as string[]
  const count = await db.userParticipeEvent.count()

  for (let i = 0; i < Eventparticipants.length; i++) {
    const partId = Eventparticipants[i]?.id as string
    const Match = Eventparticipants[i]?.participantId === UserId
    if (Match === true) {
      IsUserPart.push(partId)
    }
  }

  return { Eventparticipants, count, IsUserPart }
}
