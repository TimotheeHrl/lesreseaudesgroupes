import { Button, Center, Box, Container, Heading, HStack, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import TeamsPublic from "app/publicMap/components/publicMap"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const TeamMapPage: BlitzPage = () => {
  return (
    <Container maxW="full">
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <>
          <Center>
            <TeamsPublic />
          </Center>
        </>
      </Suspense>
    </Container>
  )
}

TeamMapPage.getLayout = (page) => <Layout title={"le groupe"}>{page}</Layout>

export default TeamMapPage
