import { Center, Container, Spinner, Link, Box } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import { Button } from "@chakra-ui/react"
import deleteTeam from "app/teams/mutations/deleteTeam"

import { useMutation, useRouter, useParam } from "blitz"

const adminteam: BlitzPage = () => {
  const teamId = useParam("teamId", "string")
  const router = useRouter()

  const [deleteTeamMutation] = useMutation(deleteTeam)
  async function DeleteTeam() {
    if (window.confirm("êtes vous sûre de vouloir supprimer ce groupe ?")) {
      await deleteTeamMutation({ where: { id: teamId } })
      router.push("/teams")
    }
  }

  return (
    <Container maxW="2xl" p={8}>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <Box mt="10vh">
          <Center>
            <Link href={`/teams/${teamId}/edittag`} passHref>
              <Button marginBottom="3vh" colorScheme="blue">
                Modifier les mots clefs
              </Button>
            </Link>
          </Center>

          <Center>
            <Link href={`/teams/${teamId}/invite`} passHref>
              <Button marginBottom="3vh" colorScheme="purple">
                Inviter un membre
              </Button>
            </Link>
          </Center>

          <Center marginBottom="3vh" colorScheme="blue">
            <Link href={`/teams/${teamId}/editcorpus`} passHref>
              <Button marginBottom="3vh" colorScheme="green" as="a">
                éditer le corpus{" "}
              </Button>
            </Link>
          </Center>

          <Center marginBottom="1vh" colorScheme="blue">
            <Link href={`/teams/${teamId}/edit`} passHref>
              <Button marginBottom="3vh" colorScheme="blue" as="a">
                Modifier la description
              </Button>
            </Link>
          </Center>
          <Center marginBottom="1vh" colorScheme="blue">
            <Link href={`/teams/${teamId}/editpicture`} passHref>
              <Button marginBottom="3vh" colorScheme="yellow" as="a">
                Modifier la photo du groupe
              </Button>
            </Link>
          </Center>

          <Center marginBottom="1vh">
            <Button
              marginBottom="3vh"
              size="md"
              colorScheme="red"
              onClick={async () => {
                DeleteTeam()
              }}
            >
              Supprimer le groupe
            </Button>
          </Center>
          <Center marginBottom="1vh" colorScheme="blue">
            <Link href={`/teams/${teamId}`} passHref>
              <Button marginBottom="3vh" as="a">
                Retour
              </Button>
            </Link>
          </Center>
        </Box>
      </Suspense>
    </Container>
  )
}

adminteam.getLayout = (page) => <Layout title={"Mettre à jours le groupe"}>{page}</Layout>

export default adminteam
