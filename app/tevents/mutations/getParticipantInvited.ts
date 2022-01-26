import db, { Prisma } from "db"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"
type GetteventInput = Pick<Prisma.TeventFindFirstArgs, "where">
interface IIvitedIdList {
  id: string
}

export default async function getPartiCipantsInvitedOnly({ where }: GetteventInput, ctx: Ctx) {
  ctx.session.$authorize()
  const UserId = ctx.session.userId

  const Tevent = await db.tevent.findFirst({
    where,
    select: {
      id: true,
      userId: true,
      invitedUsers: {
        select: {
          id: true,
        },
      },
    },
  })
  const EventCreatorId = Tevent?.userId
  const InvitedUsers = Tevent?.invitedUsers as IIvitedIdList[]
  const eventId = Tevent?.id as string
  let checkIf = InvitedUsers.some((item) => item.id === UserId)
  if (!Tevent) throw new NotFoundError()

  if (checkIf === true || EventCreatorId === UserId) {
    const Eventparticipants = await db.userParticipeEvent.findMany({
      where: { teventId: eventId },
      select: {
        id: true,
        participantId: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    })
    let IsUserPart = [] as string[]
    const count = await db.userParticipeEvent.count()

    for (let i = 0; i < Eventparticipants.length; i++) {
      const Match = Eventparticipants[i]?.participantId === UserId
      const ParticipantId = Eventparticipants[i]?.id as string
      if (Match === true) {
        IsUserPart.push(ParticipantId)
      }
    }

    return { Eventparticipants, count, IsUserPart }
  }

  if (checkIf === false) {
    throw new AuthorizationError()
  }
}
