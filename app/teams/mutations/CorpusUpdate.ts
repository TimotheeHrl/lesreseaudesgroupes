import { Ctx, NotFoundError, AuthorizationError } from "blitz"
import db, { Prisma } from "db"
import createDOMPurify, { DOMPurifyI } from "dompurify"
import { JSDOM } from "jsdom"
type UpdateTeamCorpusInput = Pick<Prisma.TeamUpdateArgs, "data" | "where">
export default async function updateCorpus({ where, data }: UpdateTeamCorpusInput, ctx: Ctx) {
  ctx.session.$authorize(["ADMIN", "VERIF"])

  const team = await db.team.findFirst({
    where,
    select: {
      TeamMastersID: true,
    },
  })
  if (!team) throw new NotFoundError()
  const teamMastersIds = team.TeamMastersID
  let UserId = ctx.session.userId
  const even = (element) => element === UserId
  const Matched: boolean = teamMastersIds.some(even)
  const HtmlContent = data.corpus as string

  const windowEmulator: any = new JSDOM("").window
  const DOMPurify: DOMPurifyI = createDOMPurify(windowEmulator)
  let sanitizedhtml = DOMPurify.sanitize(HtmlContent, {
    ADD_TAGS: ["iframe"],
    ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
  })
  if (Matched === true) {
    await db.team.update({
      where,
      data: {
        corpus: sanitizedhtml.toString(),
      },
    })
  }
  if (Matched === false) {
    throw new AuthorizationError()
  }

  return team
}
