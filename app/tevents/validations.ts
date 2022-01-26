import * as z from "zod"

export const Createtevent = z
  .object({
    id: z.string(),
    content: z.string().min(10).max(100),
    teamID: z.string(),
  })
  .nonstrict()
