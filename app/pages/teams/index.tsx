import { Button, Center, Container, Heading, HStack, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import TeamsList from "app/teams/components/TeamsList"
import { BlitzPage, Link } from "blitz"
import React, { Suspense } from "react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
const TeamsPage: BlitzPage = () => {
  const user = useCurrentUser()
  const userRole = user?.user?.role
  const headingNode = () => {
    return (
      <HStack spacing={8} justifyContent="space-between" w="100%">
        <Heading fontSize="2xl" isTruncated>
          Vos groupes
        </Heading>

        <Center>
          <Link href="/charte" passHref>
            <Button as="a" colorScheme="yellow" size="sm">
              Créer un nouveau groupe
            </Button>
          </Link>
        </Center>
      </HStack>
    )
  }

  return (
    <Container maxW="2xl" centerContent p={8}>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <VStack spacing={8} w="100%" align="left">
          {headingNode()}
          {userRole === "ADMIN" && (
            <Center>
              <Link href="/teams/newlocalantena" passHref>
                <Button as="a" colorScheme="green" size="sm">
                  Créer une nouvelle Antenne Territoriale
                </Button>
              </Link>
            </Center>
          )}
          <TeamsList />
        </VStack>
      </Suspense>
    </Container>
  )
}

TeamsPage.getLayout = (page) => <Layout title={"Teams"}>{page}</Layout>

export default TeamsPage
