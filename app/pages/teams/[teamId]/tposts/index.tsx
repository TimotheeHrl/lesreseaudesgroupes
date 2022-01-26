import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import TpostList from "app/tposts/components/TpostList"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const TpostListPage: BlitzPage = () => {
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
          <TpostList />
        </VStack>
      </Suspense>
    </Container>
  )
}

TpostListPage.getLayout = (page) => <Layout title={"post du groupe"}>{page}</Layout>

export default TpostListPage
