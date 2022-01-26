import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import FaqList from "app/faq/components/FaqList"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const FaqListAdminPage: BlitzPage = () => {
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
          <FaqList />
        </VStack>
      </Suspense>
    </Container>
  )
}

FaqListAdminPage.getLayout = (page) => <Layout title={"FAQ"}>{page}</Layout>

export default FaqListAdminPage
