import { Heading, HStack } from "@chakra-ui/react"
import getTeam from "app/teams/queries/getTeam"
import { useParam, useQuery } from "blitz"
import React, { FC } from "react"

const EditTeamHeading: FC = () => {
  const teamId = useParam("teamId", "string")
  const [team] = useQuery(
    getTeam,
    {
      where: { id: teamId },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )

  return (
    <HStack spacing={8} justifyContent="space-between" w="100%">
      <Heading fontSize="2xl" isTruncated>
        Modifier une publication {team.name}
      </Heading>
    </HStack>
  )
}

export default EditTeamHeading
