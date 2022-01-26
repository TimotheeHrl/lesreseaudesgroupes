import { Center, Container, Spinner, Box } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import EditMainpage from "app/admin/components/MainPageUpdate"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const NewMainPage: BlitzPage = () => {
  return (
    <Container>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <Box>
          <Center>
            <EditMainpage />
          </Center>
        </Box>
      </Suspense>
    </Container>
  )
}

NewMainPage.getLayout = (page) => <Layout title={"Nouvelle Page Principale"}>{page}</Layout>
export default NewMainPage
