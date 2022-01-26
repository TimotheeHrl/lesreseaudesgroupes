import { Ctx, AuthorizationError, NotFoundError } from "blitz"
import db, { Prisma, User } from "db"

type UpdateUserInput = Pick<Prisma.UserUpdateArgs, "where" | "data">

export default async function updatePictureUser({ where, data }: UpdateUserInput, ctx: Ctx) {
  ctx.session.$authorize()
  const userId = ctx.session.userId

  const avatar = await db.user.update({
    where: { id: userId },
    data: {
      avatar: data.avatar,
    },
  })

  return avatar
}
