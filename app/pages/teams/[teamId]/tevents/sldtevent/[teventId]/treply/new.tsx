import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import CreateReplyForm from "app/treplies/components/CreateReplyForm"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const NewTeventPage: BlitzPage = () => {
  return (
    <Container maxW="2xl" centerContent p={8}>
      <Suspense fallback={<Center h="100vh"></Center>}>
        <VStack spacing={8} w="100%" align="left">
          <CreateReplyForm />
        </VStack>
      </Suspense>
    </Container>
  )
}

NewTeventPage.getLayout = (page) => <Layout title={"tevent"}>{page}</Layout>

export default NewTeventPage
