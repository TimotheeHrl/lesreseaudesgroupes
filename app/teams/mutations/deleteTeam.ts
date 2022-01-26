import { Ctx, AuthorizationError, NotFoundError } from "blitz"
import db, { Prisma } from "db"
import crypto from "crypto"

type DeleteTeamInput = Pick<Prisma.TeamDeleteArgs, "where">

async function deleteAll(teamId) {
  const cryptName = crypto.randomBytes(12).toString("hex") as string
  const cryptoDesc = crypto.randomBytes(21).toString("hex") as string
  const cryptoCorpus = crypto.randomBytes(21).toString("hex") as string

  const TeamId = teamId as string
  const cryptoUser = crypto.randomBytes(12).toString("hex") as string

  await db.treply.deleteMany({ where: { teamId: TeamId } })
  await db.tpost.deleteMany({ where: { teamId: TeamId } })
  await db.ereply.deleteMany({ where: { teamId: TeamId } })
  try {
    await db.team.update({
      where: { id: TeamId },
      data: {
        name: cryptName,
        description: cryptoDesc,
        corpus: cryptoCorpus,
        teamLatitude: 1,
        teamLongitude: 1,
        image: "https://upload.wikimedia.org/wikipedia/commons/7/70/Solid_white.svg?uselang=fr",
        imageCover:
          "https://upload.wikimedia.org/wikipedia/commons/7/70/Solid_white.svg?uselang=fr",
        publishDemand: false,
        public: false,
        TeamMastersID: {
          set: [cryptoUser],
        },
        TeamMemberId: {
          set: [cryptoUser],
        },
        teamFollowers: {
          set: [],
        },
        tevents: {
          set: [],
        },
      },
    })
  } catch (error) {
    console.log(error)
  }
}
export default async function deleteTeam({ where }: DeleteTeamInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  const team = await db.team.findFirst({
    where,
    select: {
      TeamMastersID: true,
      id: true,
      TeamMemberId: true,
      teamFollowers: true,
    },
  })
  let teamId = team?.id as string
  const teamMemberIds = team?.TeamMastersID as string[]
  const teamEvent = await db.tevent.findMany({
    where: { teamId: teamId },
    select: {
      id: true,
    },
  })

  const teventLenght = teamEvent?.length as number
  const teamMemberLenght = teamMemberIds?.length as number
  if (!team) throw new NotFoundError()
  const teamMastersIds = team.TeamMastersID
  let UserId = ctx.session.userId
  const even = (element) => element === UserId
  const Matched: boolean = teamMastersIds.some(even)
  if (Matched === true) {
    for (let i = 0; i < teamMemberLenght; i++) {
      let teamM = teamMemberIds[i]
      await db.team.update({
        where,
        data: {
          users: { disconnect: { id: teamM } },
        },
      })
      for (let i = 0; i < team.teamFollowers.length; i++) {
        let temFId = team.teamFollowers[i]?.id! as string
        await db.team.update({
          where,
          data: {
            teamFollowers: { disconnect: { id: temFId } },
          },
        })
      }

      for (let i = 0; i < teventLenght; i++) {
        const teventId = teamEvent[i]?.id as string
        await db.userParticipeEvent.deleteMany({
          where: { teventId: teventId },
        })
      }
      for (let i = 0; i < teventLenght; i++) {
        const teventId = teamEvent[i]?.id as string
        await db.tevent.delete({ where: { id: teventId } })
      }
    }
    deleteAll(teamId)
  } else {
    throw new AuthorizationError()
  }
}
