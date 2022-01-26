import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import TpostSelected from "app/treplies/components/selectedTpost"
const tpostselectPage: BlitzPage = () => {
  return (
    <Container maxW="2xl" centerContent p={8}>
      <Suspense fallback={<Center h="100vh"></Center>}>
        <VStack spacing={8} w="100%" align="left">
          <TpostSelected />
        </VStack>
      </Suspense>
    </Container>
  )
}

tpostselectPage.getLayout = (page) => <Layout title={"tpostSelected"}>{page}</Layout>

export default tpostselectPage
