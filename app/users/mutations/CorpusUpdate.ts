import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"

type UpdateUserCorpusInput = Pick<Prisma.UserUpdateArgs, "data" | "where">
export default async function updateCorpus({ where, data }: UpdateUserCorpusInput, ctx: Ctx) {
  ctx.session.$authorize()
  const userId = ctx.session.userId
  if (!userId) {
    throw new AuthorizationError()
  }

  const userBio = await db.user.update({
    where: { id: userId },
    data: {
      bio: data.bio,
    },
  })

  return userBio
}
