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
type CreatefaqInput = Pick<Prisma.FaqCreateArgs, "data">
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
function makeArr(resExisting: MakeArray, order: number) {
  let arrToUpdate = [] as number[]
  for (let i = 0; i < resExisting.lenght; i++) {
    if (
      (resExisting.existingFaq[i]?.orderSubject as number) > order ||
      (resExisting.existingFaq[i]?.orderSubject as number) === order
    ) {
      arrToUpdate.push(resExisting.existingFaq[i]?.orderSubject as number)
    }
  }
  if (arrToUpdate.length > 0) {
    return arrToUpdate
  } else {
    return null
  }
}
async function updateSuperiorOrder(arrayToUptdate: number[]) {
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
}
export default async function CreateFaqItem({ data }: CreatefaqInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role
  const order = data.orderSubject as number

  const existing = await getExistingFaq()
  const resExisting = existing
  const existingtoUpdate = await makeArr(resExisting, order)
  const arrayToUptdate = await existingtoUpdate
  if (arrayToUptdate === null) {
    await db.faq.create({
      data: {
        subject: data.subject,
        content: data.content,
        orderSubject: order,
      },
    })
  } else {
    await updateSuperiorOrder(arrayToUptdate)
    await db.faq.create({
      data: {
        subject: data.subject,
        content: data.content,
        orderSubject: order,
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
      text: `suject du FAQ : ${data.subject as string} Contenue de ce FAQ: ${
        data.content as string
      } `,
      html: `<p>suject du FAQ : </p><p>${data.subject as string}</p> 
      <p>Contenue de ce FAQ:</p>
      <p>${data.content as string}</p>
    <p>répondre ${link as string}</p>`,
    })
  }
}
