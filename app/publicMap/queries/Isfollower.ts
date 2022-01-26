import { Ctx, NotFoundError } from "blitz"
import db, { Prisma } from "db"

type TeamFollowerFind = Pick<Prisma.TeamFollowerFindFirstArgs, "where">

export default async function Isfollower({ where }: TeamFollowerFind, ctx: Ctx) {
  const teamFollower = await db.teamFollower.findFirst({
    where,
    select: {
      id: true,
    },
  })
  return teamFollower
}
