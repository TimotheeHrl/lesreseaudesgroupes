import joinEventPublic from "app/publicMap/mutations/joinEventPublic"
import { useMutation, useParam } from "blitz"
import { FC } from "react"
import { Button } from "@chakra-ui/react"

const JoinEvent: FC = () => {
  const teventId = useParam("eventId", "string") as string

  const [participatingMutation] = useMutation(joinEventPublic)
  async function Join() {
    try {
      await participatingMutation({
        where: { id: teventId },
      })
    } catch (error) {
      console.log(error)
    }
    document.location.reload()
  }

  return (
    <>
      <Button onClick={Join} size="lg" colorScheme="blue">
        Particiter
      </Button>
    </>
  )
}

export default JoinEvent
