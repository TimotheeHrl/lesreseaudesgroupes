import { resolver, Ctx } from "blitz"

export default resolver.pipe(async (_, ctx: Ctx) => {
  await ctx.session.$revoke()
})
