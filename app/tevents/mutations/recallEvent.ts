import * as schedule from "node-schedule"
import db, { Prisma } from "db"
import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import { sendEmail } from "app/mail"
import * as dayjs from "dayjs"
import * as isLeapYear from "dayjs/plugin/isLeapYear" // import plugin
import "dayjs/locale/fr" // import locale
dayjs.locale("fr") // use locale globally
import { templatemail } from "app/utils/templatemail"

const url = process.env.BASE_URL as string
interface IIvitedIdList {
  participantId: string
}
interface ISingleEvent {
  user: {
    id: string
    name: string
    avatar: string
  }
  id: string
  subject: string
  startAt: Date
  endsAt: Date
  visible: boolean
  teamId: string
  recallEmailSent: boolean
}
const baseurl = process.env.BASE_URL as string

async function callParticipants(TomorowEvents: ISingleEvent[]) {
  for (let i = 0; i < TomorowEvents.length; i++) {
    if (TomorowEvents[i]?.recallEmailSent === false) {
      const SingleEvent = TomorowEvents[i] as ISingleEvent
      const EventId = SingleEvent.id
      const participantsId = (await db.userParticipeEvent.findMany({
        where: { teventId: { equals: EventId } },
        select: {
          participantId: true,
        },
      })) as IIvitedIdList[]
      const SendTo = participantsId.map((userId) => userId.participantId as string)
      const partner = await db.user.findMany({
        where: {
          id: { in: SendTo },
        },
        select: { email: true, getNotifications: true },
      })

      let link = `${baseurl}/teams/${TomorowEvents[i]?.teamId as string}/tevents/sldtevent/${
        TomorowEvents[i]?.id as string
      }`
      if (TomorowEvents[i]?.visible === true) {
        link = `${baseurl}/collectifs/${TomorowEvents[i]?.teamId as string}/publicevent/${
          TomorowEvents[i]?.id as string
        }`
      }
      const EventTime = TomorowEvents[i]?.startAt.toLocaleString("fr", {
        timeZone: "CET",
      }) as string

      let htmlMessage = `Rappel de l'événement " ${
        TomorowEvents[i]?.subject as string
      } ", auquel vous participer, il a lieu le ${EventTime}</br>
  
    Vous pouvez retrouver toutes les informations en suivant le lien présent ci-dessous :`
      let htmlToSend = templatemail(link, url, htmlMessage) as string

      for (let i = 0; i < participantsId.length; i++) {
        let getNotifs = partner[i]?.getNotifications as boolean
        let partEmail = partner[i]?.email as string

        if (getNotifs === true) {
          await sendEmail({
            from: "info@yourwebsite.com",
            to: partEmail,
            subject: `Rappel de l'événement " ${TomorowEvents[i]?.subject as string}`,
            text: `Rappel de l'événement " ${
              TomorowEvents[i]?.subject as string
            } ", auquel vous participer, il a lieu le ${EventTime}</br>
          Vous pouvez retrouver les informations en suivant ce lien ${link as string}`,
            html: htmlToSend,
          })
        }
      }
      await db.tevent.update({
        where: { id: TomorowEvents[i]?.id },
        data: {
          recallEmailSent: true,
        },
      })
    }
  }
}

export default async function recallEvent(hello) {
  console.log(hello)
  const today = Date.now()
  const datee = new Date(today + 24 * 60 * 60 * 1000)

  const dateIso = datee.toISOString()
  const ddate = dateIso.slice(0, 10)
  const TomorowEvents = await db.tevent.findMany({
    where: {
      startAt: {
        gte: new Date(ddate),
      },
    },

    select: {
      id: true,
      subject: true,
      startAt: true,
      endsAt: true,
      visible: true,
      teamId: true,
      recallEmailSent: true,

      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  })
  console.log(TomorowEvents)
  if (TomorowEvents.length > 0) {
    callParticipants(TomorowEvents)
  }
}
