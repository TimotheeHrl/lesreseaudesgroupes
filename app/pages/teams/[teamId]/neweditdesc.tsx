import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import Newreeditdesc from "app/teams/components/newreeditdesc"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const EditTeamPageNew: BlitzPage = () => {
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
          <Newreeditdesc />
        </VStack>
      </Suspense>
    </Container>
  )
}

EditTeamPageNew.getLayout = (page) => <Layout title={"Edit Team"}>{page}</Layout>

export default EditTeamPageNew
