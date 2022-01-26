import { Ctx } from "blitz"
import db, { Chat, SignalAdmin, User } from "db"
import crypto from "crypto"
import createChatWithAdmin from "app/chats/mutations/createChatWithAdmin"
import { sendEmail } from "app/mail"
const baseurl = process.env.BASE_URL as string

export default async function createAdminSignal({ data }, ctx: Ctx) {
  ctx.session.$authorize(["NONVERIF", "NONVERIF", "VERIF", "ADMIN"])

  let ChatId = crypto.randomBytes(20).toString("hex")
  let MessageId = crypto.randomBytes(20).toString("hex")
  const Content = data.content as string
  const Subject = data.subject as string
  let chatParticipants = [] as string[]
  let sentToId = [] as string[]
  let UserId = ctx.session.userId as string
  chatParticipants.push(UserId)
  const adminId = await db.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true },
  })
  for (let i = 0; i < adminId.length; i++) {
    const singleId = adminId[i]?.id as string
    chatParticipants.push(singleId)
    sentToId.push(singleId)
  }
  let sendtoLenght = sentToId.length as number
  let adminLenght = adminId.length as number
  if (sendtoLenght === adminLenght) {
    await createChatWithAdmin({ chatParticipants, ChatId }, ctx as Ctx)

    await db.message.create({
      data: {
        id: MessageId,
        content: Content as string,
        sentIn: { connect: { id: ChatId as string } },
        sentFrom: { connect: { id: UserId } as User },
        sentTo: { connect: sentToId.map((userId) => ({ id: userId })) as any },
      },
    })
    sentMail({ ChatId, UserId, Content, sentToId, Subject }, ctx)

    await db.signalAdmin.create({
      data: {
        chatId: ChatId,
        content: Content,
        subject: Subject,
        userSending: { connect: { id: UserId as string } },
      },
    })
    return ChatId
  }
}

async function sentMail({ ChatId, UserId, Content, sentToId, Subject }, ctx: Ctx) {
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
  const link = `${baseurl}/chats/${ChatId}`
  const linkAdmin = `${baseurl}/adminpage`

  for (let i = 0; i < sentoLenght; i++) {
    let partEmail = partner[i]?.email as string
    await sendEmail({
      from: "info@yourwebsite.com",
      to: partEmail,
      subject: `Pour les Admin du RF : ${Subject as string} de ${me!.name!}`,
      text: `${Content as string} `,
      html: `<p>${Content as string}</p>
    <p> répondre ${link as string}</p>
    <p> voir tout les messages destinés aux admins : ${linkAdmin}`,
    })
  }
}
