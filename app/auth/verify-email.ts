import { hashPassword, verifyPassword } from "./auth-utils"

export async function generateCode(secret: string) {
  return await hashPassword(secret)
}

export async function verifyCode(code: string, secret: string) {
  try {
    const result = await verifyPassword(code, secret)
    return result
  } catch (error) {
    return false
  }
}
