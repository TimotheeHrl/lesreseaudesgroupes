import { Center, Container, Spinner, VStack, Button } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import ManageUsers from "app/teams/components/ManageUsers"
import { BlitzPage, Router, useParam } from "blitz"
import React, { Suspense } from "react"

const InviteTeamPage: BlitzPage = () => {
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
          <ManageUsers />
          <Button onClick={redirect} size="sm">
            Fermer
          </Button>
        </VStack>
      </Suspense>
    </Container>
  )
}

InviteTeamPage.getLayout = (page) => <Layout title={"Invite Team"}>{page}</Layout>

export default InviteTeamPage
