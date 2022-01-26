import { Center, Container, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
//import EditTagForm from "app/teams/components/TagForm";

import { BlitzPage, useQuery } from "blitz"
import React, { Suspense } from "react"
import Tags from "app/teams/components/tags"
const EditTeamTag: BlitzPage = () => {
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
          <Tags />
        </VStack>
      </Suspense>
    </Container>
  )
}

EditTeamTag.getLayout = (page) => <Layout title={"ajouter des tags"}>{page}</Layout>

export default EditTeamTag
