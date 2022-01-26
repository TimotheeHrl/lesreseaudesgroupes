import { Center, Container, Spinner } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import EditApostForm from "app/admin/components/EditApostForm"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const ApostEditPage: BlitzPage = () => {
  return (
    <Container>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <div>
          <EditApostForm />
        </div>
      </Suspense>
    </Container>
  )
}

ApostEditPage.getLayout = (page) => <Layout title={"post du page principale"}>{page}</Layout>

export default ApostEditPage
