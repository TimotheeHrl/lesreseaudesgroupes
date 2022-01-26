import { Center, Container, Spinner, VStack, Heading, HStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import TpostForm from "app/tposts/components/TpostCreateForm"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const NewNewTpostPage: BlitzPage = () => {
  return (
    <Container p={8}>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <>
          <HStack spacing={8} justifyContent="space-between" w="100%">
            <Heading fontSize="2xl" isTruncated>
              Créer une publication
            </Heading>
          </HStack>
          <VStack spacing={8} w="100%" align="left">
            <Center>
              <TpostForm />
            </Center>
          </VStack>
        </>
      </Suspense>
    </Container>
  )
}

NewNewTpostPage.getLayout = (page) => <Layout title={"Créer une publication"}>{page}</Layout>

export default NewNewTpostPage
