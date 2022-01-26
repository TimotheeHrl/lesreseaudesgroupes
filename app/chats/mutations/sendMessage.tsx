import db, { User } from "db"
import { Ctx } from "blitz"
import { sendEmail } from "app/mail"
import crypto from "crypto"
import isUserPart from "app/chats/queries/isUserPart"
import { templatemail } from "app/utils/templatemail"
import createDOMPurify, { DOMPurifyI } from "dompurify"
import { JSDOM } from "jsdom"

const url = process.env.BASE_URL as string

export default async function sendMessage({ data }, ctx: Ctx) {
  let messageId = crypto.randomBytes(20).toString("hex")
  let userId = ctx.session.userId as string
  const chatId = data.sentIn as string
  const isChatPublic = await db.chat.findFirst({
    where: { id: chatId },
    select: {
      private: true,
      subject: true,
    },
  })
  const ChatSuject = isChatPublic?.subject as string
  const res = await isUserPart(chatId as string, userId)
  let check = await res
  if (check === true && isChatPublic?.private === true) {
    ctx.session.$authorize(["ADMIN", "VERIF"])
    const HtmlContent = data.htmlContent as string

    const windowEmulator: any = new JSDOM("").window
    const DOMPurify: DOMPurifyI = createDOMPurify(windowEmulator)
    let sanitizedhtml = DOMPurify.sanitize(HtmlContent, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
    })
    await db.message.create({
      data: {
        id: messageId,
        htmlContent: sanitizedhtml.toString() as string,
        content: data.content as string,
        sentIn: { connect: { id: data.sentIn as string } },
        sentFrom: { connect: { id: userId } as User },
        sentTo: { connect: data.sentTo.map((userId) => ({ id: userId })) as User },
      },
    })
    sentMail({ data }, ctx, chatId, ChatSuject)
  }
  if (isChatPublic?.private === false) {
    ctx.session.$authorize(["ADMIN", "VERIF"])
    await db.chat.update({
      where: { id: chatId },
      data: {
        participatingUsers: {
          connect: { id: userId as string },
        },
      },
    })
    await db.message.create({
      data: {
        id: messageId,
        htmlContent: data.htmlContent as string,
        content: data.content as string,
        sentIn: { connect: { id: data.sentIn as string } },
        sentFrom: { connect: { id: userId } as User },
        sentTo: { connect: data.sentTo.map((userId) => ({ id: userId })) as User },
      },
    })

    sentMail({ data }, ctx, chatId, ChatSuject)
  }
}

async function sentMail({ data }, ctx: Ctx, chatId: string, ChatSuject: string) {
  let SentTo = data.sentTo as string[]
  let sentToLengh = SentTo.length //as ISendPartLenght

  const sentToNumber = sentToLengh as number
  const partner = await db.user.findMany({
    where: {
      OR: SentTo.map((userId) => ({ id: userId as string })),
    },
    select: { email: true, getNotifications: true },
  })
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { name: true },
  })
  const link = `${url}/chats/${chatId as string}`
  const htmlMessage = `nouveau message de ${me!.name!} sur le sujet de : ${ChatSuject as string}`
  let htmlToSend = templatemail(link, url, htmlMessage) as string

  for (let i = 0; i < sentToNumber; i++) {
    let getNotifs = partner[i]?.getNotifications as boolean
    let partEmail = partner[i]?.email as string
    if (getNotifs === true) {
      await sendEmail({
        from: "info@yourwebsite.com",
        to: partEmail,
        subject: `nouveau message de ${me!.name!} sur le sujet de : ${ChatSuject as string}`,
        text: `nouveau message de ${me!.name!} sur le sujet de : ${ChatSuject as string}`,
        html: htmlToSend,
      })
    }
  }
}
