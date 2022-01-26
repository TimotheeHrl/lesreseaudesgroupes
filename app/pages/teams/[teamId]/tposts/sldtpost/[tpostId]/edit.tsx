import { Center, Container, Spinner, VStack, HStack, Heading } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import EditTpostForm from "app/tposts/components/EditTpostForm"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const EditTpostPage: BlitzPage = () => {
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
              Modifier une publication
            </Heading>
          </HStack>

          <Center>
            <EditTpostForm />
          </Center>
        </>
      </Suspense>
    </Container>
  )
}

EditTpostPage.getLayout = (page) => <Layout title={"modifier un post"}>{page}</Layout>

export default EditTpostPage
