import { useParam, Router } from "blitz"
import React from "react"
import { Button, Center } from "@chakra-ui/react"

import Upload from "app/teams/components/uploadImage"
const UpdatePictureTeamForm = () => {
  const teamId = useParam("teamId", "string")

  return (
    <>
      <Upload />
      <Center>
        <Button size="lg" colorScheme="blue" onClick={() => Router.push(`/teams/${teamId}`)}>
          Retour
        </Button>
      </Center>
    </>
  )
}
export default UpdatePictureTeamForm
