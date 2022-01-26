import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import TreplyFormTevent from "./ReplyFormTevent"
import createEreplyFromTevent from "app/ereplies/mutations/createEreplyTevent"
import { useMutation, useRouter, useParam, Router } from "blitz"
import { FC, useEffect } from "react"

const CreateTreplyEventForm: FC = () => {
  const router = useRouter()
  const [createEreplyFromTeventMutation, { isLoading, isError }] =
    useMutation(createEreplyFromTevent)
  let teventId = useParam("teventId", "string") as string

  let teamId = useParam("teamId", "string") as string
  if (teventId === undefined) {
    teventId = useParam("eventId", "string") as string
  }
  if (teamId === undefined) {
    teamId = useParam("feveid", "string") as string
  }

  let TreplyId = [...Array(10)].map((i) => (~~(Math.random() * 36)).toString(36)).join("")
  return (
    <>
      <TreplyFormTevent
        initialValues={{}}
        isLoading={isLoading}
        isError={isError}
        onSubmit={async (event) => {
          try {
            await createEreplyFromTeventMutation({
              data: {
                id: TreplyId,
                content: event.target[0].value,
                teamId: teamId,
                userId: "a",
                teventId: teventId,
              },
            })
          } catch (error) {
            return { error: error.toString() }
          }
          document.location.reload()
        }}
      />
    </>
  )
}

export default CreateTreplyEventForm
