import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetUsersInput = Pick<Prisma.UserFindManyArgs, "where" | "orderBy" | "select">
interface IOptions {
  value: string
  label: string
}

export default async function getUsersNotAdmin({ orderBy, where }: GetUsersInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role

  const users = await db.user.findMany({
    where,
    select: { name: true, id: true },
    orderBy,
  })
  const NonAdminArray = [] as IOptions[]

  for (let i = 0; i < users?.length; i++) {
    const userName = users[i]?.name as string
    const userId = users[i]?.id as string
    const element = { value: userId, label: userName } as IOptions
    NonAdminArray.push(element)
  }

  return NonAdminArray
}
