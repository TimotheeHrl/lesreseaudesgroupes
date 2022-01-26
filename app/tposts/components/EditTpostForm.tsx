import { Box, Button, FormLabel, HStack } from "@chakra-ui/react"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"

import React, { useEffect, useState, FC, useRef, useMemo } from "react"
import { useMutation, useRouter, useParam, useQuery, Link, Router } from "blitz"
import getTpost from "app/tposts/queries/getTpost"
import updateTpost from "app/tposts/mutations/updateTpost"

import Editor from "app/utils/textEditor/editor"
const { convert } = require("html-to-text")

const EditTpostForm: FC = () => {
  const teamId = useParam("teamId", "string") as string
  const router = useRouter()
  const tpostId = useParam("tpostId", "string") as string
  const [tpost] = useQuery(
    getTpost,
    {
      where: { id: tpostId },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  const [content, setContent] = useState<string>(tpost?.content)
  const html = content

  let hheight = "80vh"
  let wwidth = "70vw"
  const quillRef = useRef<any>(null)

  useEffect(() => {
    Router.prefetch(`/teams/${teamId}/tposts`)
  }, [])
  const [updateTpostMutation, { isLoading, isError }] = useMutation(updateTpost)
  async function post() {
    try {
      const mutation = await updateTpostMutation({
        where: { id: tpostId },
        data: {
          content: content as string,
          teamId: teamId,
          userId: "a",
        },
      })
      await mutation
      router.push(`/teams/${teamId}/tposts`)
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
      <div style={{ marginTop: "5vh" }}>
        <Editor
          quillRef={quillRef}
          hheight={hheight}
          wwidth={wwidth}
          value={content}
          setValue={setContent}
        />

        <HStack p="3vh" mt="5vh" mr="2vw" spacing={4}>
          <Button colorScheme="blue" type="submit" onClick={postCheck} isLoading={isLoading}>
            {"Modifier"}
          </Button>
          <Link href={`/teams/${teamId}/tposts`}>
            <Button isLoading={isLoading} variant="link">
              Retour{" "}
            </Button>
          </Link>
        </HStack>
      </div>
    </>
  )
}
export default EditTpostForm
