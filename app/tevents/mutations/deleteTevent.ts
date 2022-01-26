import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const Deletetevent = z
  .object({
    id: z.string(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(Deletetevent), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  await db.ereply.deleteMany({ where: { teventId: id } })
  const tevent = await db.tevent.deleteMany({ where: { id } })

  return tevent
})
