import React, { useState } from "react"
import { Button, Box, Center, FormLabel } from "@chakra-ui/react"
import updateUserChat from "app/chats/mutations/updataChat"
import { useMutation, useRouter, useQuery, useParam } from "blitz"
import getNonParticipantsByChatId from "app/chats/queries/getNonParticipantsByChatId"
import Select from "react-select"
import { Prisma } from "db"

interface IReactSelect {
  value: string
  label: string
}

const AddMembers = () => {
  let NotInChat = [] as IReactSelect[]
  const [NonPartUser, setNonPartUser] = useState<IReactSelect[]>(NotInChat)
  const [values, setValues] = useState<IReactSelect[]>([])
  const chatId = useParam("chatId", "string") as string

  const [Nonparticipants] = useQuery(
    getNonParticipantsByChatId,
    { id: chatId! },
    { refetchOnWindowFocus: true }
  )
  for (let i = 0; i < Nonparticipants.length; i++) {
    const element = {
      value: Nonparticipants[i]?.id as string,
      label: Nonparticipants[i]?.name as string,
    }
    NotInChat.push(element)
    if (i === Nonparticipants.length) {
      setNonPartUser(NotInChat)
    }
  }

  const [updateUserChatMutation, { isLoading, isError }] = useMutation(updateUserChat)
  let valuesFilter = [] as string[]
  for (let i = 0; i < values.length; i++) {
    const element = values[i]?.value as string
    valuesFilter.push(element as string)
  }
  async function aller(event) {
    event.preventDefault()
    try {
      await updateUserChatMutation({
        where: { id: chatId },
        data: {
          participatingUsers: valuesFilter as Prisma.UserUpdateManyWithoutParticipatesInInput,
        },
      })
    } catch (error) {
      return { error: error.toString() }
    }
    document.location.reload()
  }
  return (
    <Box>
      <FormLabel>Ajouter des utilisateur </FormLabel>
      <Center>
        <Box mt="2vh" width="70vw">
          <Select closeMenuOnSelect={false} isMulti options={NotInChat} onChange={setValues} />
        </Box>
      </Center>
      <Center>
        <Button
          mt="2vh"
          marginLeft="2vw"
          minWidth="10vw"
          onClick={aller}
          colorScheme="yellow"
          isLoading={isLoading}
        >
          {"Ajouter"}
        </Button>
      </Center>
    </Box>
  )
}

export default AddMembers
