import { Center, Container, Spinner, Box } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import teventSelected from "app/tevents/components/TeventInvitedOnly"
const teventPage: BlitzPage = () => {
  return (
    <Container maxW="2xl" centerContent p={8}>
      <Suspense fallback={<Center h="100vh"></Center>}>
        <Box>
          <div>{teventSelected()}</div>
        </Box>
      </Suspense>
    </Container>
  )
}

teventPage.getLayout = (page) => <Layout title={"event"}>{page}</Layout>

export default teventPage
