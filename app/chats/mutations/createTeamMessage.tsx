import { Ctx } from "blitz"
import db, { Prisma, Chat, Message, User } from "db"
import crypto from "crypto"
import { sendEmail } from "app/mail"
import { templatemail } from "app/utils/templatemail"

const url = process.env.BASE_URL as string

export default async function TeamUserMessage({ data }: any, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  const currentUser = ctx.session.userId as string
  let messageId = crypto.randomBytes(20).toString("hex")

  let sentToId = data.sentToId as string[]
  const sentInIDD = data.sentInId as string
  const sentToIDD = sentToId as string[]
  const contenTT = data.content as string
  let Messagetoteam = await db.message.create({
    data: {
      id: messageId,
      content: data.content as string,
      sentInId: data.sentInId as string,
      sentFromId: currentUser as string,
      sentToId: sentToId as string[],
    },
  })
  await db.message.update({
    where: { id: messageId },
    data: {
      sentIn: { connect: { id: data.sentInId as string } },
      sentFrom: { connect: { id: currentUser as string } },
      sentTo: { connect: sentToId.map((userId) => ({ id: userId })) },
    },
  })

  sentMail({ sentInIDD, contenTT, sentToIDD }, ctx)

  return Messagetoteam
}

async function sentMail({ sentInIDD, sentToIDD, contenTT }, ctx: Ctx) {
  const sentToIDDLe = sentToIDD as string[]
  const sentoLenght = sentToIDDLe.length
  //const sentToNumber = sentToLengh as number
  const partner = await db.user.findMany({
    where: {
      OR: sentToIDD.map((userId) => ({ id: userId })),
    },
    select: { email: true, getNotifications: true },
  })
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { name: true },
  })
  const link = `${url}/chats/${sentInIDD}`
  const htmlMessage = `voir et répondre par ici !`
  let htmlToSend = templatemail(link, url, htmlMessage) as string

  for (let i = 0; i < sentoLenght; i++) {
    let getNotifs = partner[i]?.getNotifications as boolean
    let partEmail = partner[i]?.email as string
    if (getNotifs === true) {
      await sendEmail({
        from: "info@yourwebsite.com",
        to: partEmail,
        subject: `nouveau message de ${me!.name!} à destination de votre groupe`,
        text: htmlMessage,
        html: htmlToSend,
      })
    }
  }
}
