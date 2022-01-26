import { AuthenticationError, SecurePassword } from "blitz"
import db from "db"
import jwt from "jwt-simple"
interface IVerify {
  valid: Boolean
}
export const hashPassword = async (password: string) => {
  const payload = { valid: true } as IVerify
  const secret = password
  const token = await jwt.encode(payload, secret)
  return await token
}
export const verifyPassword = async (hashedPassword: string, password: string) => {
  const secret = password
  const res = await jwt.decode(hashedPassword, secret)
  return res as IVerify
}

export const authenticateUser = async (email: string, password: string) => {
  const user = await db.user.findUnique({ where: { email } })

  if (!user || !user.hashedPassword) throw new AuthenticationError()

  const isValid = await verifyPassword(user.hashedPassword, password)
  if (isValid.valid === true) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      emailIsVerified: user.emailIsVerified,
      createdAt: user.createdAt,
      lien: user.lien,
      userDescription: user.userDescription,
      userCreatedAt: user.createdAt,
    }
  } else {
    throw new AuthenticationError()
  }
}
