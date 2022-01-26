import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import ApostList from "app/admin/components/ApostList"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const ApostListPage: BlitzPage = () => {
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
          <ApostList />
        </VStack>
      </Suspense>
    </Container>
  )
}

ApostListPage.getLayout = (page) => <Layout title={"post du page principale"}>{page}</Layout>

export default ApostListPage
