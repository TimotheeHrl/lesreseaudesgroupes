import db, { Prisma } from "db"
import * as z from "zod"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"
type GetFaqInput = Pick<Prisma.FaqFindFirstArgs, "where">

export default async function getFaqItem({ where }: GetFaqInput, ctx: Ctx) {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  ctx.session.$authorize()
  const faqItem = await db.faq.findFirst({
    where,
  })

  if (!faqItem) throw new NotFoundError()
  else {
    return faqItem
  }
}
