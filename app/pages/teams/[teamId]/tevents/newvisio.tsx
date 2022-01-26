import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import CreateVisioTevent from "app/tevents/components/CreateVisioTevent"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const NewTeventVisioPage: BlitzPage = () => {
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
          <CreateVisioTevent />
        </VStack>
      </Suspense>
    </Container>
  )
}

NewTeventVisioPage.getLayout = (page) => (
  <Layout title={"Créer un événement en visio"}>{page}</Layout>
)

export default NewTeventVisioPage
