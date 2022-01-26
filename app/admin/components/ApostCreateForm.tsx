import { Box, Button, Center, FormLabel, HStack } from "@chakra-ui/react"
import { Link } from "blitz"
import { useMutation, useRouter, Router } from "blitz"
import Editor from "app/utils/textEditor/editor"
import React, { useEffect, useState, useMemo, useRef } from "react"

import createApost from "app/admin/mutations/createApost"

const ApostForm = () => {
  const router = useRouter()

  useEffect(() => {
    Router.prefetch("/apostList")
  }, [])
  const [createApostMutation, { isLoading }] = useMutation(createApost)
  const [content, setContent] = useState<string>("")
  const html = content

  let hheight = "80vh"
  let wwidth = "70vw"
  const quillRef = useRef<any>(null)

  async function post() {
    try {
      const mutation = await createApostMutation({
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
  function postCheck() {
    if (content.length === 8) {
      alert("Le champs est vide")
    } else {
      post()
    }
  }
  return (
    <Box>
      <FormLabel>Créer une publication</FormLabel>

      <Center mt="5vh">
        <Editor
          quillRef={quillRef}
          hheight={hheight}
          wwidth={wwidth}
          value={content}
          setValue={setContent}
        />
      </Center>

      <HStack p="3vh" mt="5vh" mr="2vw" spacing={4}>
        <Button colorScheme="blue" onClick={postCheck} isLoading={isLoading}>
          {"Créer"}
        </Button>
        <Link href={`/apostList`}>
          <Button colorScheme="yellow" isLoading={isLoading} variant="link">
            Retour{" "}
          </Button>
        </Link>
      </HStack>
    </Box>
  )
}

export default ApostForm
