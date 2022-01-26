import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import FaqCreateForm from "app/faq/components/FaqCreateForm"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const FaqDispalyNewPage: BlitzPage = () => {
  return (
    <Container maxW="2xl" p={5}>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <VStack spacing={5} w="100%" align="center">
          <FaqCreateForm />
        </VStack>
      </Suspense>
    </Container>
  )
}

FaqDispalyNewPage.getLayout = (page) => <Layout title={"FAQ nouvel item"}>{page}</Layout>

export default FaqDispalyNewPage
