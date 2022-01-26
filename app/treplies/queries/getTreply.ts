import { resolver, NotFoundError } from "blitz"
import db from "db"
import * as z from "zod"

const GetTreply = z.object({
  // This accepts type of undefined, but is required at runtime
  id: z.string().refine(Boolean, "Required"),
})

export default resolver.pipe(resolver.zod(GetTreply), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const treply = await db.treply.findFirst({ where: { id } })

  if (!treply) throw new NotFoundError()

  return treply
})
