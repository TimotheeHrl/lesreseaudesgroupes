import { useRouter } from "next/router"
import getPublicTeam from "app/publicMap/queries/getPublicTeam"
import { useQuery, Link, useMutation, useParam } from "blitz"
import { Prisma, Team, User, TeamFollower } from "db"
import unFollowTeam from "app/publicMap/mutations/unFollowTeam"
import FollowTeam from "app/publicMap/mutations/followTeam"
import Isfollower from "app/publicMap/queries/Isfollower"

import "mapbox-gl/dist/mapbox-gl.css"
import { Button, Box, Text } from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

function FollowingTeam() {
  const teamId = useParam("feveid", "string") as string
  const currentUser = useCurrentUser()
  let userId = currentUser?.user?.id as string
  const [SingleTeam] = useQuery(
    getPublicTeam,
    {
      where: { id: teamId },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  const [teamFollower] = useQuery(Isfollower, { where: { followerId: userId, teamId: teamId } })
  const [FollowTeamMutation, { isLoading, isError }] = useMutation(FollowTeam)
  const FollowTeamFunction = async () => {
    try {
      ;(await FollowTeamMutation({
        data: {
          id: follewortableId,
          teamId: teamId,
          followerId: userId,
          team: { id: teamId } as Prisma.TeamCreateNestedManyWithoutTeamFollowersInput,
          user: { id: userId } as Prisma.UserCreateNestedManyWithoutFollowingInput,
        },
      })) as TeamFollower & { user: User[]; team: Team[] }
    } catch (error) {
      console.log(error)
    }
    document.location.reload()
  }
  const isFollowerBool = typeof teamFollower?.id
  const follewortableId = `${teamId}+${userId}` as string
  const [UnFollowTeamMutation] = useMutation(unFollowTeam)
  const UnFollowTeamFunction = async () => {
    try {
      await UnFollowTeamMutation({
        where: { id: follewortableId },
      })
    } catch (error) {
      console.log(error)
    }
    document.location.reload()
  }

  return (
    <>
      {isFollowerBool === "string" ? (
        <Box display={{ base: "row", md: "row", lg: "flex", xl: "flex" }}>
          <Text site="lg" padding="0.5vw" m={{ base: "1vh", md: "1vh", lg: "1vh", xl: "1vh" }}>
            Ne plus recevoir des notifications de ce groupe
          </Text>

          <Button
            m={{ base: "1vh", md: "1vh", lg: "1vh", xl: "1vh" }}
            isLoading={isLoading}
            size="lg"
            form="FollowTeam"
            onClick={UnFollowTeamFunction}
          >
            Ne plus suivre
          </Button>
        </Box>
      ) : (
        <Box display={{ base: "row", md: "row", lg: "flex", xl: "flex" }}>
          {SingleTeam.typeOrg === "Antenne territoriale" ? (
            <>
              {" "}
              <Text padding="0.5vw" m={{ base: "1vh", md: "1vh", lg: "1vh", xl: "1vh" }}>
                Recevoir des notifications de cette Antenne ?
              </Text>
            </>
          ) : (
            <>
              <Text padding="0.5vw" m={{ base: "1vh", md: "1vh", lg: "1vh", xl: "1vh" }}>
                Recevoir des notifications de ce groupe ?
              </Text>
            </>
          )}

          <Button
            marginBottom="2vh"
            m={{ base: "1vh", md: "1vh", lg: "1vh", xl: "1vh" }}
            colorScheme="blue"
            color="white"
            isLoading={isLoading}
            size="lg"
            form="FollowTeam"
            onClick={FollowTeamFunction}
          >
            Suivre
          </Button>
        </Box>
      )}
    </>
  )
}
export default FollowingTeam
