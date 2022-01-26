import db, { Prisma } from "db"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"

import { sendEmail } from "app/mail"
import { templatemail } from "app/utils/templatemail"
const url = process.env.BASE_URL as string

export default async function confirmParticipation(Tevent, ctx: Ctx) {
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { email: true },
  })

  const StartDate = Tevent.startAt
  const DateNow = Date.now()
  const numberOdDays = new Date(StartDate - DateNow)
  const NumberDayFormat = numberOdDays.getDay()

  const myEmail = me?.email as string
  const Subject = `${Tevent.subject as string} organisé par ${Tevent?.user.name} `
  let link = `${url}/teams/${Tevent.teamId as string}/tevents/sldtevent/${Tevent.id as string}`
  if (Tevent.visible === false) {
    link = `${url}/collectifs/${Tevent.teamId as string}/publicevent/${Tevent.id as string}`
  }
  const htmlMessage = `<p>Vous participé à l'événement sur le sujet de : ${
    Tevent.subject as string
  }, c'est organisé par ${Tevent?.user.name}, prévue le ${Tevent?.startAt.toLocaleString("fr", {
    timeZone: "CET",
  })}  </br> retrouver toutes les infos avec le lien çi-dessous :</p>`
  const Message = `Vous participé à l'événement sur le sujet de : ${
    Tevent.subject as string
  }, c'est organisé par ${Tevent?.user.name}, prévue le ${Tevent?.startAt.toLocaleString("fr", {
    timeZone: "CET",
  })} `

  let htmlToSend = templatemail(link, url, htmlMessage) as string

  await sendEmail({
    from: "info@yourwebsite.com",
    to: myEmail,
    subject: Subject,
    text: Message,
    html: htmlToSend,
  })
}
