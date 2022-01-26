import { Ctx, AuthorizationError, NotFoundError } from "blitz"
import db, { Prisma } from "db"
import { sendEmail } from "app/mail"
const baseurl = process.env.BASE_URL as string
type TeamUpdateInput = Pick<Prisma.TeamUpdateArgs, "where">
export default async function publishTeam({ where }: TeamUpdateInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  let sentToId = [] as string[]

  const team = await db.team.findFirst({
    where,
    select: {
      TeamMastersID: true,
      id: true,
    },
  })
  const adminId = await db.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  })
  for (let i = 0; i < adminId.length; i++) {
    const singleId = adminId[i]?.id as string
    sentToId.push(singleId)
  }
  if (!team) throw new NotFoundError()
  const teamMastersIds = team.TeamMastersID
  let UserId = ctx.session.userId
  const even = (element) => element === UserId
  const Matched: boolean = teamMastersIds.some(even)
  if (Matched === true) {
    await db.team.update({
      where,
      data: {
        public: true,
        publishDemand: true,
      },
    })
  }

  if (Matched === false) {
    throw new AuthorizationError()
  }
  sentMail({ sentToId }, ctx)

  return team
}
async function sentMail({ sentToId }, ctx: Ctx) {
  const sentoLenght = sentToId.length
  const partner = await db.user.findMany({
    where: {
      OR: sentToId.map((userId) => ({ id: userId })),
    },
    select: { email: true },
  })
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { name: true },
  })
  const linkAdmin = `${baseurl}/adminpage`

  for (let i = 0; i < sentoLenght; i++) {
    let partEmail = partner[i]?.email as string
    await sendEmail({
      from: "info@yourwebsite.com",
      to: partEmail,
      subject: `Pour les Admin du RF : demande de publication de ${me!.name!}`,
      text: `Pour les Admin du RF : demande de publication de ${me!.name!}`,
      html: `<p>Pour les Admin du RF : demande de publication de ${me!.name!}</p>
    <p> rdv sur la page admin : ${linkAdmin}</p>`,
    })
  }
}
