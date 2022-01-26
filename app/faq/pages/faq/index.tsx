import { Center, Container, Spinner, VStack, Heading } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import FaqPublic from "app/faq/components/FaqPublic"
const FaqIndexPage: BlitzPage = () => {
  return (
    <Container>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <VStack>
          <Center>
            <Heading>Questions Fréquentes</Heading>
          </Center>
          <Center>
            <FaqPublic />
          </Center>
        </VStack>
      </Suspense>
    </Container>
  )
}

FaqIndexPage.getLayout = (page) => <Layout title={"FAQ"}>{page}</Layout>

export default FaqIndexPage
