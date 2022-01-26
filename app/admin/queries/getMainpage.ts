import db, { Prisma } from "db"
import { Ctx } from "blitz"
type MainPage = Pick<Prisma.MainPageFindFirstArgs, "where">

export default async function getMainpage({ where }: MainPage, ctx: Ctx) {
  const mainpage = await db.mainPage.findFirst({
    where,
    select: { maincontent: true, usesEditor: true },
  })
  return mainpage
}
