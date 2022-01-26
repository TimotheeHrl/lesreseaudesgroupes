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
type FaqDelete = Pick<Prisma.FaqDeleteArgs, "where">
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
        decrement: 1,
      },
    },
  })
}
export default async function DeleteFaqItem({ where }: FaqDelete, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN"])
  const Role = ctx?.session.role
  const Order = await db.faq.findFirst({
    where,
    select: { orderSubject: true },
  })
  const order = Order?.orderSubject as number
  const existing = await getExistingFaq()
  const resExisting = existing
  const existingtoUpdate = await makeArr(resExisting, order)
  const arrayToUptdate = await existingtoUpdate
  if (arrayToUptdate === null) {
    await db.faq.delete({
      where,
    })
  } else {
    await updateSuperiorOrder(arrayToUptdate)
    await db.faq.delete({
      where,
    })
  }

  sentMail(ctx)
}

async function sentMail(ctx: Ctx) {
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
      text: `à supprimé un item du FAQ`,
      html: `<p>à supprimé un item du FAQ</p>
    <p> ${link as string}</p>`,
    })
  }
}
