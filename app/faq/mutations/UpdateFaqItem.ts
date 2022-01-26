import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"
import { sendEmail } from "app/mail"
interface ExistingOrder {
  id: String
  orderSubject: number
}
interface MakeArray {
  existingFaq: ExistingOrder[]
  lenght: number
}
type UpdatefaqInput = Pick<Prisma.FaqUpdateArgs, "data" | "where">
const baseurl = process.env.BASE_URL as string
async function getExistingFaq() {
  const existingFaq = (await db.faq.findMany({
    select: {
      id: true,
      orderSubject: true,
    },
  })) as ExistingOrder[]
  let lenght = existingFaq?.length as number

  return { existingFaq, lenght }
}
function makeArr(
  resExisting: MakeArray,
  newOrder: number,
  PreviousOrder: number,
  PrevMinorNewOrder: number
) {
  let arrToUpdatIncrement = [] as number[]
  if (PrevMinorNewOrder > 0) {
    for (let i = 0; i < resExisting.lenght; i++) {
      if (
        ((resExisting.existingFaq[i]?.orderSubject as number) > newOrder ||
          (resExisting.existingFaq[i]?.orderSubject as number) === newOrder) &&
        ((resExisting.existingFaq[i]?.orderSubject as number) === PreviousOrder ||
          (resExisting.existingFaq[i]?.orderSubject as number) < PreviousOrder)
      ) {
        arrToUpdatIncrement.push(resExisting.existingFaq[i]?.orderSubject as number)
      }
    }

    return arrToUpdatIncrement
  } else {
    for (let i = 0; i < resExisting.lenght; i++) {
      if (
        ((resExisting.existingFaq[i]?.orderSubject as number) < newOrder ||
          (resExisting.existingFaq[i]?.orderSubject as number) === newOrder) &&
        (resExisting.existingFaq[i]?.orderSubject as number) > PreviousOrder
      ) {
        arrToUpdatIncrement.push(resExisting.existingFaq[i]?.orderSubject as number)
      }
    }

    return arrToUpdatIncrement
  }
}
async function updateSuperiorOrder(arrayToUptdate: number[], PrevMinorNewOrder: number) {
  if (PrevMinorNewOrder > 0) {
    await db.faq.updateMany({
      where: {
        orderSubject: { in: arrayToUptdate },
      },
      data: {
        orderSubject: {
          increment: 1,
        },
      },
    })
  } else {
    await db.faq.updateMany({
      where: {
        orderSubject: { in: arrayToUptdate },
      },
      data: {
        orderSubject: {
          decrement: 1,
        },
      },
    })
  }
}
export default async function UpdateFaqItem({ where, data }: UpdatefaqInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role
  const newOrder = data.orderSubject as number
  const previousOrder = await db.faq.findFirst({
    where,
    select: { orderSubject: true },
  })

  const PreviousOrder = (await previousOrder?.orderSubject) as number
  const PrevMinorNewOrder = PreviousOrder - newOrder

  const existing = await getExistingFaq()
  const resExisting = existing
  const existingtoUpdate = await makeArr(resExisting, newOrder, PreviousOrder, PrevMinorNewOrder)
  const arrayToUptdate = await existingtoUpdate
  if (arrayToUptdate.length === 0) {
    await db.faq.update({
      where,
      data: {
        subject: data.subject,
        content: data.content,
        orderSubject: newOrder,
      },
    })
  } else {
    await updateSuperiorOrder(arrayToUptdate, PrevMinorNewOrder)
    await db.faq.update({
      where,
      data: {
        subject: data.subject,
        content: data.content,
        orderSubject: newOrder,
      },
    })
  }

  sentMail({ data }, ctx)
}

async function sentMail({ data }, ctx: Ctx) {
  const partner = await db.user.findMany({
    where: { role: "ADMIN" },
    select: { email: true },
  })
  const me = await db.user.findFirst({
    where: { id: ctx.session.userId! },
    select: { name: true },
  })
  const link = `${baseurl}/faq`

  for (let i = 0; i < partner.length; i++) {
    let partEmail = partner[i]?.email as string

    await sendEmail({
      from: "info@yourwebsite.com",
      to: partEmail,
      subject: `${me!.name!} à actualiser le FAQ`,
      text: `suject: ${data.subject as string} contenue : ${data.content as string} `,
      html: `<p>Sujet</p><p>${data.subject as string}</p> <p>Nouveau contenu</p><p>${
        data.content as string
      }</p>
    <p>répondre ${link as string}</p>`,
    })
  }
}
