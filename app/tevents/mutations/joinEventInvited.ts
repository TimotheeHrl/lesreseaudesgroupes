import db, { Prisma } from "db"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import crypto from "crypto"
import confirmParticipation from "app/tevents/mutations/confirmParticipation"
interface IIvitedIdList {
  id: string
}
export default async function joinEventInvited({ where }, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  let UserId = ctx.session.userId
  let participatingUsersId = crypto.randomBytes(20).toString("hex")
  const Tevent = await db.tevent.findFirst({
    where,
    select: {
      userId: true,
      id: true,
      startAt: true,
      subject: true,
      visible: true,
      teamId: true,
      user: { select: { name: true } },
      invitedUsers: {
        select: {
          id: true,
        },
      },
    },
  })
  const EventCreatorId = Tevent?.userId
  const InvitedUsers = Tevent?.invitedUsers as IIvitedIdList[]
  const EventId = Tevent?.id as string
  let checkIf = InvitedUsers.some((item) => item.id === UserId)
  if (!Tevent) throw new NotFoundError()

  if (checkIf === true || EventCreatorId === UserId) {
    const tevent = await db.userParticipeEvent.create({
      data: {
        id: participatingUsersId,
        teventId: EventId,
        participantId: UserId,
        tevent: { connect: { id: EventId as string } },
        user: { connect: { id: UserId as string } },
      },
    })
    confirmParticipation(Tevent, ctx)

    return tevent
  }
  if (checkIf === false) {
    throw new AuthorizationError()
  }
}
