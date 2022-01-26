import { Box, Button, FormLabel, HStack, Textarea, Center } from "@chakra-ui/react"

import React, { useEffect, useState, useRef, useMemo } from "react"
import { useMutation, useRouter, useQuery, Link, Router } from "blitz"
import Editor from "app/utils/textEditor/editor"
const { convert } = require("html-to-text")
import getMainpage from "app/admin/queries/getMainpage"
import updateMainpage from "app/admin/mutations/updateMainpage"
const EditMainpage = () => {
  const router = useRouter()
  const [mainpage] = useQuery(getMainpage, {
    where: { id: 1 },
  })
  let Maincontent = mainpage?.maincontent as string

  const [content, setContent] = useState<string>(Maincontent)
  const html = content

  let hheight = "80vh"
  let wwidth = "70vw"
  const quillRef = useRef<any>(null)

  const [isEditor, setIsEditor] = useState<Boolean>(true)
  const [HtmlDirecte, setHtmlDirecte] = useState<string>(content)
  function EditInHtml() {
    setIsEditor(false)
  }

  useEffect(() => {
    Router.prefetch("/adminpage")
  }, [])
  const [updateMainpageMutation, { isLoading }] = useMutation(updateMainpage)
  async function post() {
    try {
      const mutation = await updateMainpageMutation({
        where: { id: 1 },
        data: {
          maincontent: content,
          usesEditor: true,
        },
      })
      await mutation
      router.push(`/adminpage`)
    } catch (error) {
      console.log(error)
    }
  }
  async function posthtmlEdit() {
    try {
      const mutation = await updateMainpageMutation({
        where: { id: 1 },
        data: {
          maincontent: HtmlDirecte,
          usesEditor: false,
        },
      })
      await mutation
      router.push(`/adminpage`)
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
  function handleInputChange(e) {
    let val = e.target.value

    setHtmlDirecte(val)
  }
  return (
    <>
      <Box>
        <FormLabel>La page principage du site</FormLabel>
        {isEditor === true && (
          <Button colorScheme="teal" variant="solid" onClick={EditInHtml} isLoading={isLoading}>
            éditer en html
          </Button>
        )}
        {isEditor === true ? (
          <Center mt="5vh">
            <Editor
              quillRef={quillRef}
              hheight={hheight}
              wwidth={wwidth}
              value={content}
              setValue={setContent}
            />
          </Center>
        ) : (
          <Textarea
            maxWidth="70vw"
            minWidth="100vw"
            w="auto"
            minHeight="50vh"
            h="auto"
            defaultValue={Maincontent as string}
            value={HtmlDirecte}
            onChange={handleInputChange}
          ></Textarea>
        )}

        <HStack p="3vh" mt="5vh" mr="2vw" spacing={4}>
          {isEditor === true ? (
            <Button colorScheme="yellow" type="submit" onClick={postCheck} isLoading={isLoading}>
              Enregistrer
            </Button>
          ) : (
            <Button colorScheme="blue" type="submit" onClick={posthtmlEdit} isLoading={isLoading}>
              Enregistrer
            </Button>
          )}
          <Link href={`/adminpage`}>
            <Button colorScheme="yellow" isLoading={isLoading} variant="link">
              Retour{" "}
            </Button>
          </Link>
        </HStack>
      </Box>
    </>
  )
}

export default EditMainpage
