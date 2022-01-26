import {
  Center,
  Container,
  Spinner,
  VStack,
  Box,
  Button,
  Heading,
  HStack,
  Icon,
  Flex,
  Image,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Text,
} from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import MembersList from "app/teams/components/MembersList"
import tagsComponent from "app/teams/components/tagsComponent"
import getTeam from "app/teams/queries/getTeam"
import { BlitzPage, useQuery, useMutation, useRouter, useParam, Link } from "blitz"
import React, { Suspense } from "react"
import leaveTeam from "app/teams/mutations/leaveTeam"
import IsTeamMember from "app/teams/queries/IsTeamMember"
import ContactMyTeam from "app/teams/components/ContactMyTeam"
import publishTeam from "app/teams/mutations/publish"

const ShowTeamPage: BlitzPage = () => {
  const teamId = useParam("teamId", "string") as string
  const router = useRouter()
  const [leaveTeamMutation] = useMutation(leaveTeam)
  const [team] = useQuery(
    getTeam,
    {
      where: { id: teamId },
    },
    {
      staleTime: 10000,
      cacheTime: 10000,
      refetchOnWindowFocus: true,
    }
  )
  const [MatchedTeamMaster] = useQuery(
    IsTeamMember,
    {
      where: { id: teamId },
    },
    {
      staleTime: 10000,
      cacheTime: 10000,
      refetchOnWindowFocus: false,
    }
  )
  const [PublishTeamMutation] = useMutation(publishTeam)

  async function LeaveTeam() {
    try {
      const mutation = await leaveTeamMutation({
        where: {
          id: teamId,
        },
      })
      await mutation
      if (mutation === false) {
        alert(
          "Pour quitter ce groupe en tant qu'Administrateur vous devait soit demande à un autre Administeur de vous supprimer de ce groupe ou bien vous pouvez supprimer le groupe"
        )
      } else {
        router.push(`/teams`)
      }
    } catch (error) {
      console.log(error)
    }
  }

  let corpus = team.corpus
  const status = team.public
  async function Publish() {
    {
      if (
        window.confirm(
          "Pour cette version d'exemple de cette plateforme, votre groupe sera publier sans la supervision des administrateurs \n êtes vous sûre de vouloir publier ce groupe ?"
        )
      ) {
        await PublishTeamMutation({ where: { id: teamId } })
        document.location.reload()
      }
    }
  }

  return (
    <Container>
      <Suspense fallback={<Center h="100vh"></Center>}>
        {status === false && team.publishDemand === false && (
          <Alert
            status="warning"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Votre groupe n'est encore publiée.
            </AlertTitle>
            <AlertDescription maxWidth="sm">Merci de publier votre groupe</AlertDescription>
          </Alert>
        )}
        {status === false && team.publishDemand === true && (
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="200px"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Merci, votre groupe sera bientôt publiée !
            </AlertTitle>
          </Alert>
        )}
        <Center>
          <Heading mt="4vh" as="h2" size="2xl">
            {team.name}
          </Heading>
        </Center>
        <Center>
          <Box>
            <HStack marginBottom="2vh" spacing={10}>
              {" "}
              <Center>
                <MembersList />
              </Center>
            </HStack>
            <Box display={{ base: "row", md: "row", lg: "flex", xl: "flex" }}>
              <Link href={`/teams/${teamId}/tposts`} passHref>
                <Button p="2vh" m="3vh" colorScheme="green" marginBottom="2vh" as="a">
                  Créer une publication
                </Button>
              </Link>
              <Link href={`/teams/${teamId}/tevents`} passHref>
                <Button p="2vh" m="3vh" colorScheme="blue" marginBottom="2vh" as="a">
                  Créer un événement
                </Button>
              </Link>
              <Box>
                {MatchedTeamMaster.MatchedTeamMaster === true && (
                  <Link href={`/teams/${teamId}/adminteam`} passHref>
                    <Button colorScheme="yellow" p="2vh" m="3vh" marginBottom="2vh">
                      {" "}
                      Actualiser le groupe
                    </Button>
                  </Link>
                )}
              </Box>
            </Box>
            <Box display={{ base: "row", md: "row", lg: "flex", xl: "flex" }}>
              <Box mt="3vh" ml={{ sm: "7vw", md: "3vw", lg: "0.5vw", xl: "0.5vw" }}>
                {" "}
                {status === false && MatchedTeamMaster.MatchedTeamMaster === true && (
                  <Button
                    p="2vh"
                    mt="2vh"
                    ml="3vh"
                    marginBottom="2vh"
                    onClick={() => {
                      Publish()
                    }}
                  >
                    {" "}
                    Publier
                  </Button>
                )}
              </Box>
              <Button
                p="2vh"
                mt="5vh"
                ml={{ sm: "5vw", md: "4vw", lg: "3vh", xl: "3vh" }}
                colorScheme="red"
                onClick={() => {
                  LeaveTeam()
                }}
              >
                Quitter le groupe
              </Button>
              <Box mt="4vh" ml={{ sm: "2vw", md: "1vw", lg: "0.5vw", xl: "0.5vw" }}>
                <ContactMyTeam />
              </Box>
            </Box>

            <Box mt={{ sm: "3vw", md: "3vw", lg: "5vw", xl: "5vw" }}>
              <Container width={{ sm: "90vw", md: "90vw", lg: "35vw", xl: "35vw" }}>
                <Image
                  fallbackSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cumulus_clouds_in_Russia._img_067.jpg/1925px-Cumulus_clouds_in_Russia._img_067.jpg"
                  src={team.image}
                  alt={team.name}
                  maxHeight="40vh"
                />

                <Heading as="h3" size="lg" marginTop={"2vh"} marginBottom={"2vh"}>
                  Description courte:
                </Heading>
                <Text fontSize="lg" as="i">
                  {team.description}{" "}
                </Text>

                <Heading as="h3" size="lg" marginTop={"2vh"} marginBottom={"2vh"}>
                  {" "}
                  Mots clefs :
                </Heading>
                <Center>
                  <Box>{tagsComponent()} </Box>
                </Center>

                <Heading as="h3" size="lg" marginTop={"2vh"} marginBottom={"2vh"}>
                  {" "}
                  Corpus :
                </Heading>
                <Center>
                  <div style={{ fontSize: "2vh" }}>
                    <Box
                      marginBottom={"3vh"}
                      minWidth="70vw"
                      w="auto"
                      h="auto"
                      dangerouslySetInnerHTML={{ __html: corpus }}
                    ></Box>
                  </div>
                </Center>
              </Container>
            </Box>
          </Box>
        </Center>
      </Suspense>
    </Container>
  )
}

ShowTeamPage.getLayout = (page) => <Layout title={"le groupe"}>{page}</Layout>
export default ShowTeamPage
