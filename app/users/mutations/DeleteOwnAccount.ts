import { Ctx, AuthorizationError } from "blitz"
import db, { Prisma } from "db"
import crypto from "crypto"

type UserUpdate = Pick<Prisma.UserUpdateArgs, "where">

export default async function DeleteOwnAccount({ where }: UserUpdate, ctx: Ctx) {
  const dateNow = new Date()
  ctx.session.$authorize(["ADMIN", "NONVERIF", "VERIF"])
  const UserId = ctx.session.userId
  let Name = crypto.randomBytes(10).toString("hex")
  let email = crypto.randomBytes(22).toString("hex")
  let PassWord = crypto.randomBytes(37).toString("hex")

  if (!UserId) {
    throw new AuthorizationError()
  } else {
    await db.user.update({
      where: { id: UserId },
      data: { name: Name, hashedPassword: PassWord, email: email, avatar: "nope" },
    })

    await db.session.updateMany({
      where: { userId: UserId },
      data: {
        publicData: `{"userId":"${UserId}","role":"NONVERIF","emailIsVerified":false}`,
      },
    })
    await db.tpost.updateMany({
      where: { userId: UserId },
      data: {
        content: " ",
      },
    })
    await db.treply.updateMany({
      where: { userId: UserId },
      data: {
        content: " ",
      },
    })
    await db.ereply.updateMany({
      where: { userId: UserId },
      data: {
        content: " ",
      },
    })
    await db.areply.updateMany({
      where: { userId: UserId },
      data: {
        content: " ",
      },
    })

    await db.tevent.updateMany({
      where: { userId: UserId },
      data: {
        subject: " ",
        content: " ",
        endsAt: dateNow,
      },
    })
    await db.message.updateMany({
      where: { sentFromId: UserId },
      data: {
        content: " ",
      },
    })
    await db.session.updateMany({
      where: { userId: UserId },
      data: {
        publicData: `{"userId":"${UserId}","role":"NONVERIF","emailIsVerified":false}`,
      },
    })
    await ctx.session.$revoke()
  }
}
