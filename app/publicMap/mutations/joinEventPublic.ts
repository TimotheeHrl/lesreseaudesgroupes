import db, { Prisma } from "db"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import crypto from "crypto"
import confirmParticipation from "app/tevents/mutations/confirmParticipation"

export default async function joinEventPublic({ where }, ctx: Ctx) {
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

  const EventId = Tevent?.id as string

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
