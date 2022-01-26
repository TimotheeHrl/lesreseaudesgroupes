import { Ctx, AuthorizationError, NotFoundError } from "blitz"
import db, { Prisma } from "db"
import { sendEmail } from "app/mail"
import { templatemail } from "app/utils/templatemail"

const url = process.env.BASE_URL as string
type TeamUpdateInput = Pick<Prisma.TeamUpdateArgs, "where">
export default async function publishTeamAdmin({ where }: TeamUpdateInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role
  const teamId = where?.id as string
  await db.team.update({
    where,
    data: {
      public: true,
      publishDemand: false,
    },
  })
  sentMail(teamId, ctx)
}

async function sentMail(teamId: string, ctx: Ctx) {
  const team = await db.team.findFirst({
    where: { id: teamId },
    select: { name: true, description: true },
  })
  const teamName = team?.name as string
  const teamDescription = team?.description
  const partner = await db.user.findMany({
    where: { getNotifications: true },
    select: { email: true },
  })

  const link = `${url}/collectifs/${teamId}`
  const htmlMessage = `Bienvenue au groupe : ${teamName as string} <br/> ${teamDescription}`
  let htmlToSend = templatemail(link, url, htmlMessage) as string

  for (let i = 0; i < partner.length; i++) {
    let partEmail = partner[i]?.email as string

    await sendEmail({
      from: "info@yourwebsite.com",
      to: partEmail,
      subject: `Il y a un nouveau groupe !`,
      text: `Bienvenue au groupe : ${teamName as string} sur cette plateforme !`,
      html: htmlToSend,
    })
  }
}
