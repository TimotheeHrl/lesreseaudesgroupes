import { Ctx } from "blitz"
import db, { Prisma } from "db"

type GetFaqInput = Pick<Prisma.FaqFindManyArgs, "orderBy">

export default async function getFaqAll({ orderBy }: GetFaqInput, ctx: Ctx) {
  const faqs = await db.faq.findMany({
    orderBy,
  })
  return { faqs }
}
