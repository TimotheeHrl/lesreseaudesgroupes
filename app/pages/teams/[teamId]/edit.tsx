import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import EditTeamForm from "app/teams/components/EditTeamForm"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const EditTeamPage: BlitzPage = () => {
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
          <EditTeamForm />
        </VStack>
      </Suspense>
    </Container>
  )
}

EditTeamPage.getLayout = (page) => <Layout title={"Edit Team"}>{page}</Layout>

export default EditTeamPage
