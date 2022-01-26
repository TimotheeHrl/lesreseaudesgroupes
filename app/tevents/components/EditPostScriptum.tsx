import { Link, useParam, useRouter, useQuery, useMutation, Router } from "blitz"
import React, { useEffect, useState } from "react"
import getTeventInvited from "app/tevents/queries/getTeventInvited"
import updateTeventPostscript from "app/tevents/mutations/updateTeventPostscript"
import { Textarea, Box, Button, FormLabel, HStack, Center } from "@chakra-ui/react"
import Select from "react-select"

const options = [
  { value: "Informer", label: "Transmettre un message" },
  { value: "Annuler", label: "Annuler l'événement" },
]
const EditPostScriptum = () => {
  const [selectValue, setSelectValue] = useState({ value: "", label: "Informer ou Annuler ?" })
  const [updateTeventPostscriptMutation] = useMutation(updateTeventPostscript)
  const router = useRouter()
  const teamId = useParam("teamId", "string") as string
  const teventId = useParam("teventId", "string") as string
  const [tevent] = useQuery(
    getTeventInvited,
    {
      where: {
        id: teventId,
      },
    },
    {
      staleTime: 1000,
      cacheTime: 1000,
      refetchOnMount: true,
    }
  )
  let isCanceled = false
  if (selectValue.value === "Annuler") {
    isCanceled = true
  }
  const PostSciptExist = tevent?.postScriptWriterId as string
  const [PostScritum, setPostScritum] = useState<string>(PostSciptExist)
  useEffect(() => {
    Router.prefetch(`/teams/${teamId}/tevents`)
  }, [])
  async function post() {
    try {
      const mutation = await updateTeventPostscriptMutation({
        where: {
          id: teventId,
        },
        data: {
          infoPostscritum: PostScritum,
          postScriptWriterId: "UserId",
          teamId: teamId,
          isCancel: isCanceled,
        },
      })
      await mutation
      router.push(`/teams/${teamId}/tevents`)
    } catch (error) {
      console.log(error)
    }
  }
  function handleInputPostScritum(e) {
    let inputValue = e.target.value
    setPostScritum(inputValue)
  }

  function postCheck() {
    if (PostScritum.length < 2) {
      alert("Le champs est vide")
    } else {
      post()
    }
  }
  return (
    <>
      <Center>
        <FormLabel marginBottom={"1vh"}>Une information à transmettre au participants ?</FormLabel>
      </Center>
      <Select options={options} value={selectValue} onChange={setSelectValue} />
      {selectValue.value === "Informer" ? (
        <>
          <Box rounded={"1vw"} padding={"2vh"} width="44vw" backgroundColor={"blue.100"}>
            <FormLabel>Votre message</FormLabel>
            <Center>
              {" "}
              <Textarea
                backgroundColor={"white"}
                value={PostScritum}
                onChange={handleInputPostScritum}
                placeholder="votre message"
                size="md"
              />
            </Center>
          </Box>
          <HStack p={4} borderTopWidth={1} spacing={4}>
            <Button colorScheme="yellow" onClick={postCheck}>
              {"Envoyer"}
            </Button>
            <Link href={`/teams/${teamId}/tevents`}>
              <Button colorScheme="yellow" variant="link">
                Retour{" "}
              </Button>
            </Link>
          </HStack>
        </>
      ) : (
        <div></div>
      )}
      {selectValue.value === "Annuler" ? (
        <>
          <Box rounded={"1vw"} padding={"2vh"} width="44vw" backgroundColor={"red.100"}>
            <FormLabel>Votre message d'annulation</FormLabel>
            <Center>
              {" "}
              <Textarea
                backgroundColor={"white"}
                value={PostScritum}
                onChange={handleInputPostScritum}
                placeholder="Expliquer les raisons qui vous amènnent à annuler cette événement"
                size="lg"
              />
            </Center>
          </Box>
          <HStack p={4} borderTopWidth={1} spacing={4}>
            <Button colorScheme="yellow" onClick={postCheck}>
              {"Envoyer"}
            </Button>
            <Link href={`/teams/${teamId}/tevents`}>
              <Button colorScheme="yellow" variant="link">
                Retour{" "}
              </Button>
            </Link>
          </HStack>
        </>
      ) : (
        <div></div>
      )}
    </>
  )
}
export default EditPostScriptum
