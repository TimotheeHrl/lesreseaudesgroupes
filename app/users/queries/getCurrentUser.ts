import { Ctx } from "blitz"
import db from "db"

export default async function getCurrentUser(_ = null, { session }: Ctx) {
  if (!session.userId) return null
  let emailIsVerified = session?.emailIsVerified
  const user = await db.user.findFirst({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      role: true,
      teams: true,
      avatar: true,
      name: true,
      createdAt: true,
      userDescription: true,
      lien: true,
    },
  })

  return { user, emailIsVerified }
}
