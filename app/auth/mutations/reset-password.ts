import { resolver } from "blitz"
import * as passwordReset from "../resetpassword"
import * as z from "zod"

export default resolver.pipe(resolver.zod(z.object({ email: z.string() })), async ({ email }) => {
  await passwordReset.invoke(email)
})
