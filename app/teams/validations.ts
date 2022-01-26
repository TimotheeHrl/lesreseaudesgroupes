import * as z from "zod"

export const createTeamVal = z.object({
  name: z.string().min(10).max(100),
  description: z.string().min(10).max(100),
})
