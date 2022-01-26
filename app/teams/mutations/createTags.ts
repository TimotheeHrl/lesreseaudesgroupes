import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma, Tag } from "db"

type UpdateTeamInput = Pick<Prisma.TeamUpdateArgs, "data" | "where">
interface ISpe {
  id: string
  catSpecific: string
}
async function recreatedTagSpec(teamId, teamTagsSpe) {
  for (let i = 0; i < teamTagsSpe.length; i++) {
    await db.team.update({
      where: { id: teamId },
      data: {
        tags: {
          connectOrCreate: {
            where: { id: teamTagsSpe[i]?.id as string },
            create: {
              id: teamTagsSpe[i]?.id as string,
              catSpecific: teamTagsSpe[i]?.catSpecific as string,
            },
          },
        },
      },
    })
  }
}

export default async function updateTagTeam({ where, data }: UpdateTeamInput, ctx: Ctx) {
  ctx.session.$authorize()
  const teamTagsSpe = await db.tag.findMany({
    where: {
      AND: [{ teams: { some: { id: where.id } } }],
      NOT: [{ catSpecific: "ctag" }],
    },
    select: {
      id: true,
      catSpecific: true,
    },
  })
  const team = await db.team.findFirst({
    where,
    select: {
      TeamMastersID: true,
      id: true,
      tags: { select: { id: true, catSpecific: true } },
    },
  })

  const teamId = team?.id
  if (!team) throw new NotFoundError()
  const teamMastersIds = team.TeamMastersID
  let PrevteamTags = team?.tags
  let TagSpeOnly = PrevteamTags.filter((tag) => tag.catSpecific !== "ctag")
  let UserId = ctx.session.userId
  const even = (element) => element === UserId
  const Matched: boolean = teamMastersIds.some(even)
  if (Matched === true) {
    await db.team.update({
      where,
      data: {
        tags: {
          set: [],
        },
      },
    })

    await db.team.update({
      where,
      data: {
        tags: data.tags,
      },
    })

    recreatedTagSpec(teamId, teamTagsSpe)
  }
  if (Matched === false) {
    throw new AuthorizationError()
  }
  return team
}
