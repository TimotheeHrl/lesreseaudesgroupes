import { Ctx, AuthorizationError } from "blitz"
import db, { Prisma, User } from "db"

type UpdateUserInput = Pick<Prisma.UserUpdateArgs, "where" | "data">

export default async function updateNotifications({ data }: UpdateUserInput, ctx: Ctx) {
  ctx.session.$authorize()
  const userId = ctx.session.userId
  if (!userId) {
    throw new AuthorizationError()
  }
  const notifs = (await db.user.update({
    where: { id: userId },
    data: {
      getNotifications: data.getNotifications,
    },
  })) as User
  return notifs
}
