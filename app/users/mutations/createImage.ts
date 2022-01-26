import { Ctx } from "blitz"
import db, { Prisma } from "db"

type CreateImageInput = Pick<Prisma.ImageCreateArgs, "data">
export default async function createImage({ data }: CreateImageInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "NONVERIF", "VERIF"])
  const userId = ctx.session.userId
  const image = await db.image.create({
    data: {
      asset_id: data.asset_id,
      url: data.url,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  })

  return image
}
