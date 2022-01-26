import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import TpostMenu from "app/tevents/components/teventMenu"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const replyEventPage: BlitzPage = () => {
  return (
    <Container maxW="2xl" centerContent p={8}>
      <Suspense fallback={<Center h="100vh"></Center>}>
        <VStack spacing={8} w="100%" align="left">
          <TpostMenu />
        </VStack>
      </Suspense>
    </Container>
  )
}

replyEventPage.getLayout = (page) => <Layout title={"tpost"}>{page}</Layout>

export default replyEventPage
