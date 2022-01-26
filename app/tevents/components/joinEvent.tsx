import participatingUsersId from "app/tevents/mutations/joinEventInvited"
import { useMutation, useParam } from "blitz"
import { FC } from "react"
import { Button } from "@chakra-ui/react"
const JoinEvent: FC = () => {
  const teventId = useParam("teventId", "string") as string

  const [participatingUsersIdMutation] = useMutation(participatingUsersId)
  async function Join() {
    try {
      await participatingUsersIdMutation({
        where: { id: teventId },
      })
    } catch (error) {
      console.log(error)
    }
    document.location.reload()
  }

  return (
    <>
      <Button onClick={Join}>Particiter</Button>
    </>
  )
}

export default JoinEvent
