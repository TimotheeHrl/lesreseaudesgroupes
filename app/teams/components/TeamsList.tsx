import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  Center,
  Image,
} from "@chakra-ui/react"
import { Team, User } from "@prisma/client"
import EmptyState from "app/core/components/EmptyState"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import getTeams from "app/teams/queries/getTeams"
import { Link, usePaginatedQuery } from "blitz"
import React from "react"
import { MdAdd } from "react-icons/md"

const TeamsList = () => {
  const currentUser = useCurrentUser()
  const [{ teams }] = usePaginatedQuery(
    getTeams,
    {
      orderBy: { updatedAt: "desc" },
      where: {
        users: {
          some: {
            id: currentUser?.user?.id,
          },
        },
      },
    },
    {
      staleTime: 300,
      cacheTime: 300,
      refetchOnMount: true,
    }
  )

  if (!teams.length) {
    return (
      <EmptyState
        heading="Créer un nouveau groupe"
        text="Editez la page du groupe.
        le groupe sera public un fois valider par
        les administrateurs."
        buttons={[
          <Link href="/charte" passHref key="newTeamButton">
            <Button as="a" colorScheme="blue" size="lg" leftIcon={<MdAdd />}>
              Créer un nouvelle groupe
            </Button>
          </Link>,
        ]}
      />
    )
  }

  const nameNode = (team: Team) => {
    return (
      <Box p={4}>
        <Center>
          <Heading size="sm">{team.name}</Heading>
        </Center>
      </Box>
    )
  }
  const ImageNode = (team: Team) => {
    return (
      <Box p={4}>
        <Center>
          <Image
            fallbackSrc={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cumulus_clouds_in_Russia._img_067.jpg/1925px-Cumulus_clouds_in_Russia._img_067.jpg"
            }
            src={team.image}
            alt={team.name}
          />
        </Center>
      </Box>
    )
  }

  const descriptionNode = (team: Team) => {
    if (!team.description) {
      return false
    }

    return (
      <Box p={4} borderTopWidth={1}>
        <Center>
          <Text fontSize="sm">{team.description}</Text>
        </Center>
      </Box>
    )
  }

  const userAvatarsNode = (team) => {
    if (!team.users.length) {
      return false
    }

    const avatarsNode = () =>
      team.users.map((user) => {
        return <Avatar key={user.id} name={user.name} src={user.avatar as string} />
      })
    return (
      <Box p={4} borderTopWidth={1}>
        <AvatarGroup size="sm" max={5}>
          {avatarsNode()}
        </AvatarGroup>
      </Box>
    )
  }

  return (
    <Grid templateColumns={["repeat(1, 1fr)", "repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={8} w="100%">
      {teams.map((team) => {
        return (
          <Link key={team.id} href={`/teams/${team.id}`} passHref>
            <Box as="a" bgColor="white" rounded="md" shadow="sm" borderWidth={1}>
              <VStack align="left" spacing={0}>
                {nameNode(team)}
                {ImageNode(team)}
                {descriptionNode(team)}
                {userAvatarsNode(team)}
              </VStack>
            </Box>
          </Link>
        )
      })}
    </Grid>
  )
}

export default TeamsList
