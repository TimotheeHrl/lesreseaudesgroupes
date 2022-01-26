import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import EditUserForm from "app/users/components/EditUserForm"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const EditUserInfoPage: BlitzPage = () => {
  return (
    <Container maxW="2xl" p={8}>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <VStack spacing={8} w="100%" align="left"></VStack>
        <EditUserForm />
      </Suspense>
    </Container>
  )
}

EditUserInfoPage.getLayout = (page) => <Layout title={"change l'image"}>{page}</Layout>

export default EditUserInfoPage
