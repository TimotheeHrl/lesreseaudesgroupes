import { Ctx } from "blitz"
import db, { Prisma, User, Tag } from "db"

type CreateTeamInput = Pick<Prisma.TeamCreateArgs, "data">

interface ITeamSpecItems {
  id: string
  secteur: string
  typeOrg: string
}

interface ITeamSpec {
  team: { ITeamSpecItems }
}

export default async function createTeam({ data }: CreateTeamInput, ctx: Ctx) {
  const { users, ...rest } = data
  ctx.session.$authorize(["ADMIN", "VERIF"])

  let userId = ctx.session.userId
  let name = data.name
  let description = data.description
  let latitude = data.teamLatitude as number
  let longitude = data.teamLongitude as number
  const anneeCreation = data.anneeCreation as number
  let secteurTag = `${data.secteur} ~ Secteur`
  let typeOrgTag = `${data.typeOrg}`
  const team = await db.team.create({
    data: {
      name: name,
      description: description,
      teamLatitude: latitude,
      teamLongitude: longitude,
      secteur: data.secteur,
      typeOrg: data.typeOrg,
      taille: data.taille,
      anneeCreation: anneeCreation,
      TeamMastersID: userId,
      TeamMemberId: userId,
      users: { connect: { id: userId } },
      tags: {
        connectOrCreate: [
          {
            where: {
              id: secteurTag,
            },
            create: {
              id: secteurTag,
              catSpecific: "secteur",
            },
          },
          {
            where: {
              id: typeOrgTag,
            },
            create: {
              id: typeOrgTag,
              catSpecific: "aaaatypeOrg",
            },
          },
        ],
      },
    },
  })

  return team
}
