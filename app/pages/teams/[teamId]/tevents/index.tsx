import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import TeventList from "app/tevents/components/TeventList"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const TeventsListPage: BlitzPage = () => {
  return (
    <Container maxW="2xl" p={5} bgColor={"whitesmoke"}>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <VStack spacing={5} w="100%" align="center">
          <TeventList />
        </VStack>
      </Suspense>
    </Container>
  )
}

TeventsListPage.getLayout = (page) => <Layout title={"évemment du groupe"}>{page}</Layout>

export default TeventsListPage
