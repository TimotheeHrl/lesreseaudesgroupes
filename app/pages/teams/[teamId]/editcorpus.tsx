import { Center, Container, Spinner, VStack, Heading, Text } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { Button, HStack } from "@chakra-ui/react"
import { useMutation, useRouter, useParam, useQuery, Link, BlitzPage } from "blitz"
import React, { Suspense, useRef, useMemo, useState, FC } from "react"

import Editor from "app/utils/textEditor/editor"
const { convert } = require("html-to-text")

import getTeam from "app/teams/queries/getTeam"
import updateCorpus from "app/teams/mutations/CorpusUpdate"

const EditTeamCorpusPage: BlitzPage = () => {
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

  const [content, setContent] = useState<string>(team?.corpus)
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
      router.push(`/teams/${teamId}`)
    } catch (error) {
      console.log(error)
    }
  }
  function postCheck() {
    if (content.length === 8) {
      alert("Le champs est vide")
    } else {
      post()
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
        <VStack w="70%">
          <Center>
            {" "}
            <Text as="b" mt="2vh" color="grey" fontSize="lg">
              Description plus approfondie de votre groupe
            </Text>
          </Center>

          <>
            <Center bgColor="white">
              <div style={{ marginTop: "3vh" }}>
                <Editor
                  quillRef={quillRef}
                  hheight={hheight}
                  wwidth={wwidth}
                  value={content}
                  setValue={setContent}
                />
              </div>
            </Center>
            <HStack p="3vh" mt="5vh" mr="2vw" spacing={4}>
              <Button
                mr="6vw"
                colorScheme="blue"
                type="submit"
                onClick={post}
                isLoading={isLoading}
              >
                {"Enregistrer"}
              </Button>
              <Link href={`/teams/${teamId}`}>
                <Button isLoading={isLoading} variant="link">
                  Retour{" "}
                </Button>
              </Link>
            </HStack>
          </>
        </VStack>
      </Suspense>
    </Container>
  )
}
EditTeamCorpusPage.getLayout = (page) => <Layout title={"Corpus"}>{page}</Layout>

export default EditTeamCorpusPage
