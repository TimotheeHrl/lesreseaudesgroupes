import { resolver } from "blitz"
import db from "db"
import * as z from "zod"

const DeleteTreply = z
  .object({
    id: z.string(),
  })
  .nonstrict()

export default resolver.pipe(resolver.zod(DeleteTreply), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const treply = await db.treply.deleteMany({ where: { id } })

  return treply
})
