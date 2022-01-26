import TreplyForm from "./ReplyForm"
import createTreplyFromTpost from "app/treplies/mutations/createTreplyTpost"
import { useMutation, useRouter, useParam, Router } from "blitz"
import { FC, useEffect } from "react"

const CreateTreplyForm: FC = () => {
  const router = useRouter()
  const [createTreplyFromTpostMutation, { isLoading, isError }] = useMutation(createTreplyFromTpost)
  const tpostId = useParam("tpostId", "string") as string
  const teamId = useParam("teamId", "string") as string
  useEffect(() => {
    Router.prefetch(`/collectifs/${teamId}`)
  }, [])

  let TreplyId = [...Array(10)].map((i) => (~~(Math.random() * 36)).toString(36)).join("")
  return (
    <>
      <TreplyForm
        initialValues={{}}
        isLoading={isLoading}
        isError={isError}
        onSubmit={async (event) => {
          try {
            await createTreplyFromTpostMutation({
              data: {
                id: TreplyId,
                content: event.target[0].value,
                teamId: teamId,
                tpostId: tpostId,
                userId: "a",
              },
            })

            router.push(`/collectifs/${teamId}`)
          } catch (error) {
            return { error: error.toString() }
          }
        }}
      />
    </>
  )
}

export default CreateTreplyForm
