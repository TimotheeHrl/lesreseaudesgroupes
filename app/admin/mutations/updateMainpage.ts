import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"

type MainPageUpdateArgsInput = Pick<Prisma.MainPageUpdateArgs, "data" | "where">
export default async function updateMainpage({ where, data }: MainPageUpdateArgsInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role

  const updateMainpage = await db.mainPage.update({
    where,
    data: {
      maincontent: data.maincontent,
      usesEditor: data.usesEditor,
    },
  })

  return updateMainpage
}
