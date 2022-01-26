import { Center, Container, Spinner, VStack, Heading, Text } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage } from "blitz"
import { Button, HStack } from "@chakra-ui/react"
import React, { Suspense, useRef, useState, useMemo } from "react"

import Editor from "app/utils/textEditor/editor"
const { convert } = require("html-to-text")

import { useMutation, useRouter, useParam, useQuery, Link } from "blitz"

import getTeam from "app/teams/queries/getTeam"
import updateCorpus from "app/teams/mutations/CorpusUpdate"
const neweditcorpus: BlitzPage = () => {
  const router = useRouter()
  const teamId = useParam("teamId", "string") as string
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
  const [content, setContent] = useState<string>(team.corpus)
  const html = content

  let hheight = "80vh"
  let wwidth = "70vw"
  const quillRef = useRef<any>(null)

  const [updateCorpusMutation, { isLoading, isError }] = useMutation(updateCorpus)
  async function post() {
    try {
      const mutation = await updateCorpusMutation({
        where: { id: teamId },
        data: {
          corpus: content,
        },
      })
      await mutation
      router.push(`/teams/${teamId}/newedittag`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <>
          <Center>
            <Heading>Création d'un groupe </Heading>
          </Center>
          <Center>
            <Text mt="2vh" as={"b"}>
              étape 3/5 :{" "}
            </Text>
          </Center>
          <Center>
            {" "}
            <Text as="b" mt="2vh" color="grey" fontSize="lg">
              Une description plus approfondie de votre groupe
            </Text>
          </Center>

          <Center mt="5vh">
            <Editor
              quillRef={quillRef}
              hheight={hheight}
              wwidth={wwidth}
              value={content}
              setValue={setContent}
            />
          </Center>

          <HStack mt="5vh" mr="2vw" spacing={10}>
            <Button size="lg" colorScheme="blue" type="submit" onClick={post} isLoading={isLoading}>
              {"Enregistrer et suivant"}
            </Button>
            <Link href={`/teams/${teamId}/neweditpicture`}>
              <Button>précédent </Button>
            </Link>
          </HStack>
        </>
      </Suspense>
    </Container>
  )
}

neweditcorpus.getLayout = (page) => <Layout title={"Corpus"}>{page}</Layout>

export default neweditcorpus
