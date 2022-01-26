import { useRef, useState, useMemo } from "react"
import Editor from "app/utils/textEditor/editor"
import { Box, Button, FormLabel, HStack } from "@chakra-ui/react"
import { Link } from "blitz"
import createTpost from "app/tposts/mutations/createTpost"
import { useMutation, useRouter, useParam, Router } from "blitz"

const TpostForm = () => {
  const [createTpostMutation, { isLoading }] = useMutation(createTpost)
  let Tpostid = [...Array(10)].map((i) => (~~(Math.random() * 36)).toString(36)).join("")

  const teamId = useParam("teamId", "string") as string
  const router = useRouter()
  const [content, setContent] = useState<string>("")
  const html = content

  let hheight = "80vh"
  let wwidth = "70vw"
  const quillRef = useRef<any>(null)
  async function post() {
    try {
      const mutation = await createTpostMutation({
        data: {
          id: Tpostid,
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
    <div style={{ marginTop: "5vh" }}>
      <Editor
        quillRef={quillRef}
        hheight={hheight}
        wwidth={wwidth}
        value={content}
        setValue={setContent}
      />

      <HStack p="3vh" mt="5vh" mr="2vw" spacing={4}>
        <Button colorScheme="blue" onClick={postCheck} isLoading={isLoading}>
          {"Créer"}
        </Button>
        <Link href={`/teams/${teamId}/tposts`}>
          <Button ml="2vw" isLoading={isLoading} variant="link">
            Retour{" "}
          </Button>
        </Link>
      </HStack>
    </div>
  )
}

export default TpostForm
