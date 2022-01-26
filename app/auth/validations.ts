import * as z from "zod"

export const SignupInput = z.object({
  email: z.string().email(),
  password: z.string().min(10).max(100),
  name: z.string().min(4).max(20),
  userLat: z.number(),
  userLon: z.number(),
  userDescription: z.string().max(300),
  lien: z.string().max(300),
})
export const userUpdateInput = z.object({
  name: z.string().min(4).max(20),
  userLat: z.number(),
  userLon: z.number(),
  userDescription: z.string().max(300),
  lien: z.string().max(300),
})

export type SignupInputType = z.infer<typeof SignupInput>

export const LoginInput = z.object({
  email: z.string().email(),
  password: z.string(),
})
export type LoginInputType = z.infer<typeof LoginInput>

export const ResetPassword = z.object({
  email: z.string().email(),
  password: z.string().min(10).max(100),
})
