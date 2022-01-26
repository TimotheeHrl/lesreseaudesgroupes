import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import EditPostScriptum from "app/tevents/components/EditPostScriptum"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const EditPostScriptumPage: BlitzPage = () => {
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
          <EditPostScriptum />
        </VStack>
      </Suspense>
    </Container>
  )
}

EditPostScriptumPage.getLayout = (page) => <Layout title={"modifier un post"}>{page}</Layout>

export default EditPostScriptumPage
