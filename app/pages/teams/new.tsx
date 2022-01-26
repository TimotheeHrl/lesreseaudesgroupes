import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import CreateTeamForm from "app/teams/components/CreateTeamForm"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { Alert, AlertDescription, AlertIcon, AlertTitle } from "@chakra-ui/react"

const NewTeamPage: BlitzPage = () => {
  const currentUser = useCurrentUser()
  let CurUserId = currentUser?.emailIsVerified as Boolean

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
          <CreateTeamForm />
        </VStack>
      </Suspense>
    </Container>
  )
}

NewTeamPage.getLayout = (page) => <Layout title={"Créer un nouveau groupe"}>{page}</Layout>

export default NewTeamPage
