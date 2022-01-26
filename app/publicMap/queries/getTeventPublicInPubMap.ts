import db, { Prisma } from "db"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"
type GetteventInput = Pick<Prisma.TeventFindFirstArgs, "where">
interface IIvitedIdList {
  id: string
}
export default async function getTeventPublic({ where }: GetteventInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  let UserId = ctx.session.userId

  const tevent = await db.tevent.findFirst({
    where,
    include: {
      ereplys: true,
      invitedUsers: {
        select: {
          id: true,
          avatar: true,
          name: true,
          role: true,
          lien: true,
          userDescription: true,
          createdAt: true,
        },
      },
      usersParticipeEvent: true,
      teamRef: false,
      user: {
        select: {
          id: true,
          avatar: true,
          name: true,
          role: true,
          lien: true,
          userDescription: true,
          createdAt: true,
        },
      },
    },
  })

  return tevent
}
