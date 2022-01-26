import { Center, Container, Spinner, Box } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import FaqUpdateForm from "app/faq/components/FaqUpdateForm"
const FaqEditPage: BlitzPage = () => {
  return (
    <Container maxW="2xl" p={5}>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <Box>
          <FaqUpdateForm />
        </Box>
      </Suspense>
    </Container>
  )
}

FaqEditPage.getLayout = (page) => <Layout title={"éditer un item du FAQ"}>{page}</Layout>

export default FaqEditPage
