import {
  Image,
  Button,
  Center,
  Container,
  Box,
  Spinner,
  VStack,
  Heading,
  Text,
} from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"
import { useParam, Router, useQuery } from "blitz"
import getTeam from "app/teams/queries/getTeam"

import Upload from "app/teams/components/uploadImage"
const NeweditpicturePage: BlitzPage = () => {
  const teamId = useParam("teamId", "string")
  const [team] = useQuery(
    getTeam,
    {
      where: { id: teamId },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )

  return (
    <Box>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <Center>
          {" "}
          <Heading>Création d'un groupe </Heading>
        </Center>
        <Center>
          <Text mt="2vh" as={"b"}>
            étape 2/5 :{" "}
          </Text>
        </Center>
        <Center>
          {" "}
          <Text mt="2vh" as={"i"}>
            Votre groupe est maintenant créée sur la plateforme...
          </Text>
        </Center>
        <Center>
          <Heading mb="3vh" mt="2vh" fontSize="2xl">
            La photo public du groupe
          </Heading>
        </Center>
        <>
          <Upload />

          <Center>
            <Button
              mt="5vh"
              mr="2vh"
              ml="2vh"
              size="lg"
              colorScheme="blue"
              onClick={() => Router.push(`/teams/${teamId}/neweditcorpus`)}
            >
              suivant
            </Button>
            <Button mt="5vh" size="lg" onClick={() => Router.push(`/teams/${teamId}/neweditdesc`)}>
              précédent
            </Button>
          </Center>
        </>{" "}
      </Suspense>
    </Box>
  )
}

NeweditpicturePage.getLayout = (page) => <Layout title={"changer l'image"}>{page}</Layout>

export default NeweditpicturePage
