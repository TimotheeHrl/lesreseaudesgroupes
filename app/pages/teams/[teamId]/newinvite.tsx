import {
  Center,
  Container,
  Spinner,
  VStack,
  Heading,
  Text,
  Button,
  Link,
  Box,
} from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import ManageUsers from "app/teams/components/ManageUsers"
import { BlitzPage, useParam, Router } from "blitz"
import React, { Suspense } from "react"

const NewinviteTeam: BlitzPage = () => {
  const teamId = useParam("teamId", "string") as string

  function redirect() {
    Router.push(`/teams/${teamId}`)
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
        <VStack spacing={8} w="100%" align="left">
          <Center>
            <Heading>Création d'un groupe </Heading>
          </Center>
          <Center>
            <Text as={"b"}>étape 5/5 : </Text>
          </Center>
          <Center>
            {" "}
            <Heading fontSize="2xl" isTruncated>
              Inviter des membres dans votre groupe
            </Heading>
          </Center>
          <Center>
            {" "}
            <Text fontSize="lg" as="i">
              Les membres que vous enregistrez en tant que gestionnaire pourront éditer ces contenus
            </Text>
          </Center>
          <ManageUsers />

          <Center mt="5vh">
            <Box display="flex">
              <Button mr="4vw" colorScheme="blue" onClick={redirect} size="md">
                Enregistrer et suivant
              </Button>
              <Link href={`/teams/${teamId}/newedittag`}>
                <Button variant="link">précédant </Button>
              </Link>
            </Box>
          </Center>
        </VStack>
      </Suspense>
    </Container>
  )
}

NewinviteTeam.getLayout = (page) => <Layout title={"Invite Team"}>{page}</Layout>

export default NewinviteTeam
