import db, { Prisma } from "db"

type GetTagsInput = Pick<Prisma.TagFindManyArgs, "where" | "orderBy" | "skip" | "take" | "cursor">

export default async function getTags(
  { where, orderBy, cursor, take, skip }: GetTagsInput,
  ctx: Record<any, any> = {}
) {
  const tags = await db.tag.findMany({
    where,
    orderBy,
    cursor,
    take,
    skip,
  })

  return tags
}
