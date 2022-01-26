import { Box, Button, FormLabel, HStack, Center } from "@chakra-ui/react"

import React, { useRef, useMemo, useState, FC } from "react"
import { useMutation, useRouter, useParam, useQuery, Link } from "blitz"
import Editor from "app/utils/textEditor/editor"
const { convert } = require("html-to-text")

import getTeam from "app/teams/queries/getTeam"
import updateCorpus from "app/teams/mutations/CorpusUpdate"
const CorpusInput: FC = () => {
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
    <>
      <Box bgColor="white" rounded="md" shadow="sm" borderWidth={1}>
        <FormLabel>Décrire votre groupe</FormLabel>
        <div style={{ marginTop: "3vh" }}>
          <Editor
            quillRef={quillRef}
            hheight={hheight}
            wwidth={wwidth}
            value={content}
            setValue={setContent}
          />
        </div>
        <HStack p="3vh" mt="5vh" mr="2vw" spacing={4}>
          <Button colorScheme="blue" type="submit" onClick={postCheck} isLoading={isLoading}>
            {"Modifier"}
          </Button>
          <Link href={`/teams/${teamId}/tposts`}>
            <Button colorScheme="yellow" isLoading={isLoading} variant="link">
              Retour{" "}
            </Button>
          </Link>
        </HStack>
      </Box>
    </>
  )
}

export default CorpusInput
