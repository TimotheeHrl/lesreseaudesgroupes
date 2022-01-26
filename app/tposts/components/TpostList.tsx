import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  Heading,
  Text,
  Spacer,
  Center,
  Wrap,
  Flex,
} from "@chakra-ui/react"
import getTeam from "app/teams/queries/getTeam"

import getTposts from "app/tposts/queries/getTposts"
import { Link, usePaginatedQuery, useParam, useQuery } from "blitz"
import React from "react"

const TpostList = () => {
  const teamId = useParam("teamId", "string") as string
  const [{ tposts }] = usePaginatedQuery(
    getTposts,
    {
      orderBy: { updatedAt: "desc" },
      where: {
        teamId: teamId,
      },
    },
    {
      staleTime: 200,
      cacheTime: 200,
      refetchOnMount: true,
    }
  )
  const [team] = useQuery(getTeam, {
    where: {
      id: teamId,
    },
  })

  return (
    <Box mt="2vh">
      <Box bgColor={"whitesmoke"}>
        <Center>
          <Heading marginBottom={"2vh"}>Les Publications</Heading>{" "}
        </Center>
        {team.public === false && (
          <Center>
            <Text color="tomato" as="b" fontSize="lg" mt="2vh" mb="2vh">
              Votre groupe n'est pas encore publiée, vous ne pouvez pas encore créer de publications
            </Text>
          </Center>
        )}
        {team.public === true && (
          <Center>
            <Link href={`/teams/${teamId}/tposts/new`} passHref key="newTeamButton">
              <Button as="a" colorScheme="blue" size="lg">
                Créer une nouvelle publication
              </Button>
            </Link>
          </Center>
        )}
        <Center>
          {" "}
          <Link href={`/teams/${teamId}`} passHref key="newTeamButton">
            <Button as="a" marginTop="3vw" size="lg">
              Retour{" "}
            </Button>
          </Link>
        </Center>
        <Wrap spacing="30px" justify="center">
          <Box
            marginTop={"5vh"}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            bgColor={"white"}
          >
            {tposts.map((tpost) => {
              let CreatedAt = tpost.createdAt.toLocaleString("fr", { timeZone: "CET" })
              let content = tpost.content

              return (
                <Box marginTop="2vh" marginBottom={"2vh"} key={tpost.id} mr="10vw" ml="10vw">
                  <Flex>
                    <div>
                      <Center>
                        {" "}
                        <Avatar
                          margin={"2vh"}
                          name={tpost.user.name}
                          src={tpost.user.avatar as string}
                          size={"lg"}
                        />
                        <h1>{tpost.user.name}</h1>{" "}
                      </Center>
                      <Center>
                        <Text fontSize="lg" as="i">
                          publié le {CreatedAt.toLocaleLowerCase()}
                        </Text>
                      </Center>
                    </div>
                    <Spacer />
                    <Button color={"blue"} marginTop="3vw">
                      <Link href={`/teams/${teamId}/tposts/sldtpost/${tpost.id}/edit`} passHref>
                        Modifier
                      </Link>
                    </Button>
                  </Flex>
                  <div style={{ fontSize: "2vh" }}>
                    <Box
                      mt={5}
                      borderWidth="1px"
                      borderRadius="lg"
                      w="70vw"
                      h="auto"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  </div>
                </Box>
              )
            })}
          </Box>
        </Wrap>
      </Box>
    </Box>
  )
}

export default TpostList
