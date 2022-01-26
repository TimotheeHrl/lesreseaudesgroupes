import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import ApostForm from "app/admin/components/ApostCreateForm"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const ApostNewPage: BlitzPage = () => {
  return (
    <Container>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <Center>
          <ApostForm />
        </Center>
      </Suspense>
    </Container>
  )
}

ApostNewPage.getLayout = (page) => <Layout title={"post du page principale"}>{page}</Layout>

export default ApostNewPage
