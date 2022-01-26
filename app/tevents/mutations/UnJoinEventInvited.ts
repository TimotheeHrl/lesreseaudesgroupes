import db, { Prisma } from "db"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import crypto from "crypto"

type UserParticipeEventDelete = Pick<Prisma.UserParticipeEventDeleteArgs, "where">

export default async function UnJoinEventInvited({ where }: UserParticipeEventDelete, ctx: Ctx) {
  ctx.session.$authorize()
  let UserId = ctx.session.userId as string
  const partId = await db.userParticipeEvent.findFirst({
    where,
    select: { participantId: true },
  })
  if ((partId?.participantId as string) === UserId) {
    const unjoin = await db.userParticipeEvent.delete({
      where,
    })
  }
}
