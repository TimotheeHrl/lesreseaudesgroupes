import { Center, Container, Spinner, VStack, Button, Heading, Text, Box } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Link } from "blitz"
import React, { Suspense } from "react"

const chartreCreateTeam: BlitzPage = () => {
  return (
    <Container maxW="2xl" p={5}>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <VStack spacing={5} w="100%" align="center">
          <Heading>Création d'un groupe </Heading>
          <Center>
            <Text as={"b"}>étape 0/5 : </Text>
          </Center>
          <Heading fontSize="2xl" isTruncated>
            Agréer à la Chartre
          </Heading>

          <Box>
            <Text>Lorem Ipsum is simply dummy text : </Text>
            <Text>&#9679; of the printing and typesetting industry.</Text>
            <Text>
              &#9679; Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </Text>
            <Text>
              {" "}
              &#9679; Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </Text>
            <Text as="b" marginTop="1vh">
              {" "}
              Lorem Ipsum is :
            </Text>
            <Text>
              {" "}
              &#9679; simply dummy text, Lorem Ipsum has been the industry standard dummy text ever
              since the 1500s, when an unknown printer.
            </Text>
            <Text>&#9679; simply dummy text, Lorem Ipsum has been the industry </Text>
            <Text>&#9679; simply dummy text, Lorem Ipsum has been the industry</Text>
            <Text as="b" marginTop="1vh">
              {" "}
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.{" "}
            </Text>{" "}
            standard dummy text ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
            <Text as="b" marginTop="1vh">
              {" "}
              Lorem Ipsum is simply dummy text{" "}
            </Text>{" "}
            <Text as="b" marginTop="1vh">
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an
              unknown printer took a galley of type and scrambled it to make a type specimen book.
            </Text>{" "}
          </Box>
          <Center>
            {" "}
            <Link href="/teams/new">
              <Button as="a" colorScheme="blue" marginRight="2vw">
                J'accepte
              </Button>
            </Link>
            <Link href="/teams">
              <Button marginLeft="2vw" mr={3}>
                Retour
              </Button>
            </Link>
          </Center>
        </VStack>
      </Suspense>
    </Container>
  )
}

chartreCreateTeam.getLayout = (page) => <Layout title={"évemment du groupe"}>{page}</Layout>

export default chartreCreateTeam
