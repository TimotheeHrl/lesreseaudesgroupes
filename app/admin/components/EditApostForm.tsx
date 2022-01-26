import { Box, Button, FormLabel, Flex, Center } from "@chakra-ui/react"

import React, { useEffect, useState, useMemo, useRef } from "react"
import { useMutation, useRouter, useParam, useQuery, Link, Router } from "blitz"

import Editor from "app/utils/textEditor/editor"
import deleteApost from "app/admin/mutations/deleteApost"

import getApost from "app/admin/queries/getApost"
import updateApost from "app/admin/mutations/updateApost"
const EditApostForm = () => {
  const [deleteApostMutation] = useMutation(deleteApost)

  const router = useRouter()
  const apostId = useParam("apostId", "string") as string
  const [apost] = useQuery(
    getApost,
    {
      where: { id: apostId },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  let apostContent = apost.content
  const [content, setContent] = useState<string>(apostContent)
  const html = content

  let hheight = "80vh"
  let wwidth = "70vw"
  const quillRef = useRef<any>(null)

  useEffect(() => {
    Router.prefetch("/apostList")
  }, [])

  const [updateApostMutation, { isLoading, isError }] = useMutation(updateApost)
  async function post() {
    try {
      const mutation = await updateApostMutation({
        where: { id: apostId },
        data: {
          content: content as string,
          userId: "a",
        },
      })
      await mutation
      router.push(`/apostList`)
    } catch (error) {
      console.log(error)
    }
  }
  async function deletethatPost() {
    try {
      const mutation = await deleteApostMutation({
        where: { id: apostId as string },
      })
      await mutation
      Router.push(`/apostList`)
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
      <FormLabel>Modifier une publication</FormLabel>
      <div>
        <Center mt="5vh">
          <Editor
            quillRef={quillRef}
            hheight={hheight}
            wwidth={wwidth}
            value={content}
            setValue={setContent}
          />
        </Center>
      </div>
      <Flex>
        <Button mr="3vw" colorScheme="blue" type="submit" onClick={postCheck} isLoading={isLoading}>
          {"Modifier"}
        </Button>
        <Button mr="3vw" color={"blue"} onClick={deletethatPost}>
          {" "}
          supprimer
        </Button>
        <Box mr="3vw">
          <Link href={`/apostList`}>
            <Button isLoading={isLoading} colorScheme="blue" variant="link">
              Retour{" "}
            </Button>
          </Link>
        </Box>
      </Flex>
    </>
  )
}
export default EditApostForm
