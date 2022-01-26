import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import CreateLocalTevent from "app/tevents/components/CreateLocalTevent"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const NewTeventPresPage: BlitzPage = () => {
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
          <CreateLocalTevent />
        </VStack>
      </Suspense>
    </Container>
  )
}

NewTeventPresPage.getLayout = (page) => (
  <Layout title={"Créer un événement en présentiel"}>{page}</Layout>
)

export default NewTeventPresPage
