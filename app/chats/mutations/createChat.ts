import { Ctx } from "blitz"
import db, { Chat } from "db"
import { sendEmail } from "app/mail"
import { templatemail } from "app/utils/templatemail"

const url = process.env.BASE_URL as string

export default async function CreateChate({ data }, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { name: true },
  })
  const Subject = data.subject as string
  const chatParticipants = data.participatingUsers
  const CurrentUserId = ctx.session.userId
  const Private = data.private as boolean
  const chatId = data.id as string
  chatParticipants.push(CurrentUserId)
  if (Private === false) {
    const NewChat = (await db.chat.create({
      data: {
        id: data.id,
        subject: Subject,
        private: Private,
        participatingUsers: { connect: { id: CurrentUserId as string } },
      },
    })) as Chat
    sendMailtoAdmins(chatId, Subject, me)
    return NewChat
  } else {
    const NewChat = (await db.chat.create({
      data: {
        id: data.id,
        subject: Subject,
        private: Private,
        participatingUsers: {
          connect: chatParticipants.map((userId) => ({ id: userId as string })),
        },
      },
    })) as Chat

    return NewChat
  }
}
async function sendMailtoAdmins(chatId, Subject, me) {
  const baseurl = process.env.BASE_URL as string

  const partner = await db.user.findMany({
    where: {
      role: "ADMIN",
    },
    select: { email: true },
  })

  const link = `${url}/chats/${chatId}`
  const htmlMessage = `<p>${me!.name!} à créer une conversation publique</p>
  <p>Sujet: ${Subject}</p>
<p> Par ici :  ${link as string}</p>
`
  let htmlToSend = templatemail(link, url, htmlMessage) as string
  for (let i = 0; i < partner.length; i++) {
    let partEmail = partner[i]?.email as string
    await sendEmail({
      from: "info@yourwebsite.com",
      to: partEmail,
      subject: `Nouvelle conversation public créée par ${me!.name!}`,
      text: `${me!.name!} a créer une conversation publique sur le sujet de : ${Subject}`,
      html: htmlToSend,
    })
  }
}
