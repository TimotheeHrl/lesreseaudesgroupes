import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"
import createDOMPurify, { DOMPurifyI } from "dompurify"
import { JSDOM } from "jsdom"
type UpdateTpostInput = Pick<Prisma.TpostUpdateArgs, "data" | "where">
export default async function updateTpost({ data, where }: UpdateTpostInput, ctx: Ctx) {
  ctx.session.$authorize()

  const teamId = data.teamId as string
  const team = await db.team.findFirst({
    where: { id: teamId },
    select: {
      TeamMemberId: true,
    },
  })
  if (!team) throw new NotFoundError()
  const teamMastersIds = team.TeamMemberId
  let UserId = ctx.session.userId
  const HtmlContent = data.content as string
  const windowEmulator: any = new JSDOM("").window
  const DOMPurify: DOMPurifyI = createDOMPurify(windowEmulator)
  let sanitizedhtml = DOMPurify.sanitize(HtmlContent, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  })
  const even = (element) => element === UserId
  const Matched: boolean = teamMastersIds.some(even)

  if (Matched === true) {
    const content = data.content as string

    let userIdd = ctx.session.userId as string
    const userId = userIdd as string
    const teamId = data.teamId as string
    await db.tpost.update({
      where,
      data: {
        content: sanitizedhtml.toString(),
        teamId,
        userId,
      },
    })
  }
  if (Matched === false) {
    throw new AuthorizationError()
  }

  return teamId
}
