import { Ctx, AuthorizationError, NotFoundError } from "blitz"
import db, { Prisma, User } from "db"
import { sendEmail } from "app/mail"
import { templatemail } from "app/utils/templatemail"

type UpdateTeamInput = Pick<Prisma.TeamUpdateArgs, "where" | "data">
const baseurl = process.env.BASE_URL as string
const url = process.env.BASE_URL as string

export default async function InviteUser({ where, data }: UpdateTeamInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  const team = await db.team.findFirst({
    where,
    select: {
      TeamMastersID: true,
    },
  })

  const teamId = where?.id as string
  if (!team) throw new NotFoundError()
  const teamMastersIds = team.TeamMastersID
  let UserId = ctx.session.userId
  const even = (element) => element === UserId
  const Matched: boolean = teamMastersIds.some(even)
  if (Matched === true) {
    const newMembers = await db.team.update({
      where,
      data: {
        TeamMemberId: data.TeamMemberId,
        users: { connect: { id: (data.users as User).id } },
      },
    })
    sentMail(teamId, ctx)

    return newMembers
  }
  if (Matched === false) {
    throw new AuthorizationError()
  }
}

async function sentMail(teamId: string, ctx: Ctx) {
  const teamMembers = await db.team.findFirst({
    where: { id: teamId as string },
    select: { name: true, users: { select: { email: true, getNotifications: true } } },
  })
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { name: true },
  })
  const teamName = teamMembers?.name as string
  let teamUserLenght = teamMembers?.users.length as number

  const link = `${baseurl}/teams/${teamId}`
  const htmlMessage = `<p>${me!.name!} a invité un nouveau membre dans votre groupe ${teamName}</p>
  <p>C est ici ${link as string}</p>`
  let htmlToSend = templatemail(link, url, htmlMessage) as string

  for (let i = 0; i < teamUserLenght; i++) {
    let teamEmail = teamMembers?.users[i]?.email as string
    let getteamNotifs = teamMembers?.users[i]?.getNotifications as boolean
    if (getteamNotifs === true) {
      await sendEmail({
        from: "info@yourwebsite.com",
        to: teamEmail,
        subject: `${me!.name!}  a invité un nouveau membre dans votre groupe : ${teamName}`,
        text: `${me!.name!} a invité un nouveau membre dans votre groupe : ${teamName}`,
        html: htmlToSend,
      })
    }
  }
}
