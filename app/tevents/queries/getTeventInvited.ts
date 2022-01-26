import db, { Prisma } from "db"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"
type GetteventInput = Pick<Prisma.TeventFindFirstArgs, "where">
interface IIvitedIdList {
  id: string
}
export default async function getTeventInvited({ where }: GetteventInput, ctx: Ctx) {
  ctx.session.$authorize()
  let UserId = ctx.session.userId

  const Tevent = await db.tevent.findFirst({
    where,
    select: {
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

  let checkIf = InvitedUsers.some((item) => item.id === UserId)
  if (!Tevent) throw new NotFoundError()

  if (checkIf === true || EventCreatorId === UserId) {
    const tevent = await db.tevent.findFirst({
      where,
      include: {
        ereplys: true,
        usersParticipeEvent: true,
        teamRef: false,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
            lien: true,
            userDescription: true,
            createdAt: true,
            role: true,
          },
        },
      },
    })
    return tevent
  }

  if (checkIf === false) {
    throw new AuthorizationError()
  }
}
