import { Center, Container, Spinner, Box } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import Tevent from "app/publicMap/components/singleTeam/Tevent"
const eventPage: BlitzPage = () => {
  return (
    <Box margi>
      <Suspense
        fallback={
          <Center>
            <Spinner marginTop="40vh" w="3vh" h="3vh"></Spinner>{" "}
          </Center>
        }
      >
        <Tevent />
      </Suspense>
    </Box>
  )
}

eventPage.getLayout = (page) => <Layout title={"event"}>{page}</Layout>
export default eventPage
