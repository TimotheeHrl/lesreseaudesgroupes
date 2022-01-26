import { Link, BlitzPage, useQuery } from "blitz"
import Layout from "app/core/layouts/Layout"
import ApostListPublic from "app/admin/components/ApostListPublic"
import getMainpage from "app/admin/queries/getMainpage"
import { Box, Center, Spinner } from "@chakra-ui/react"
import { Alert, AlertDescription, AlertIcon, AlertTitle, Text } from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import React, { Suspense } from "react"

const Home: BlitzPage = () => {
  const [mainpage] = useQuery(getMainpage, {
    where: { id: 1 },
  })
  const Mainpage = mainpage?.maincontent as string

  return (
    <Box width="100vw">
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <Box mb="10vh" mt="2vh">
          {mainpage?.usesEditor === true ? (
            <div style={{ fontSize: "2vh" }}>
              <Box
                mr="15vw"
                ml="15vw"
                minWidth="70vw"
                dangerouslySetInnerHTML={{ __html: Mainpage }}
              ></Box>
            </div>
          ) : (
            <Box width="100vw" dangerouslySetInnerHTML={{ __html: Mainpage }}></Box>
          )}
        </Box>
        <Center>
          <ApostListPublic />
        </Center>
      </Suspense>
    </Box>
  )
}

Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Groupes sur Toile">{page}</Layout>

export default Home
