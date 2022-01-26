import { useRouter } from "next/router"
import getPublicTeam from "app/publicMap/queries/getPublicTeam"
import { useQuery, Link, useMutation, useParam } from "blitz"
import { Prisma, Team, User } from "db"
import { FormEvent, useState } from "react"
import crypto from "crypto"
import "mapbox-gl/dist/mapbox-gl.css"

import { Chat } from "db"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import {
  FormControl,
  FormLabel,
  Button,
  Textarea,
  Spacer,
  HStack,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Center,
  Stack,
  Switch,
  Box,
  Text,
  Flex,
} from "@chakra-ui/react"
import getUsers from "app/users/queries/getUsers"
import Select from "react-select"
import CreateChate from "app/chats/mutations/createChat"
import firstMessage from "app/chats/mutations/firstMessage"
interface IReactSelect {
  value: string
  label: string
}
interface IUser {
  id: string
  name: string
}

function CreateChat() {
  let chatId = crypto.randomBytes(20).toString("hex")
  const currentUser = useCurrentUser()
  const userId = currentUser?.user?.id as string

  let NotInChat = [] as IReactSelect[]
  const [NonPartUser, setPartUser] = useState<IReactSelect[]>(NotInChat)
  const [values, setValues] = useState<IReactSelect[]>([])

  const [PrivateIsChecked, OnCheked] = useState(true)

  const [users] = useQuery(
    getUsers,
    { where: { isPublic: true }, orderBy: { id: "asc" } },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  let userLenght = users.length as number
  let userss = users as IUser[]
  for (let i = 0; i < userLenght; i++) {
    const element = { value: userss[i]?.id as string, label: userss[i]?.name as string }
    if (element.value !== userId) {
      NotInChat.push(element)
    }
    if (i === userLenght) {
      setPartUser(NotInChat)
    }
  }

  let valuesFilter = [] as string[]

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [MessageValue, setMessageValue] = useState<string>("")
  const [subject, setSubject] = useState<string>("")

  function handleChange(e) {
    setMessageValue(e.target.value)
  }
  function handleSubject(e) {
    setSubject(e.target.value)
  }

  const [UserChatMutation, { isLoading, isError }] = useMutation(CreateChate)
  const [UserMessageMutation] = useMutation(firstMessage)

  const MessageTeamFunction = async (event: FormEvent<HTMLFormElement>) => {
    try {
      if (subject.length > 0 && MessageValue.length > 0) {
        await UserChatMutation({
          data: {
            id: chatId,
            private: PrivateIsChecked,
            subject: subject,
            content: MessageValue,
            participatingUsers: valuesFilter as string[],
          },
        })
      }
      const NewMessage = await UserMessageMutation({
        data: {
          content: MessageValue,
          sentInId: chatId,
          sentFromId: "teamId",
          sentToId: valuesFilter,
        },
      })

      return await NewMessage
    } catch (error) {
      console.log(error)
    }
    document.location.reload()
  }
  for (let i = 0; i < values.length; i++) {
    const element = values[i]?.value as string
    valuesFilter.push(element as string)
  }

  return (
    <>
      <Center mt="1vh">
        <Button colorScheme="blue" onClick={onOpen}>
          Nouvelle conversation
        </Button>
      </Center>
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Créer une nouvelle conversation</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box>
                {PrivateIsChecked ? (
                  <Flex>
                    <Switch mr="1vw" onChange={() => OnCheked(false)} />
                    <Text as="b">Conversation Privée</Text>
                  </Flex>
                ) : (
                  <Flex>
                    <Switch mr="1vw" onChange={() => OnCheked(true)} />
                    <Text as="b">Conversation Public</Text>
                  </Flex>
                )}
              </Box>
              {PrivateIsChecked === true && (
                <Box>
                  <FormLabel>Ajouter des utilisateurs </FormLabel>

                  <Select
                    closeMenuOnSelect={false}
                    isMulti
                    options={NonPartUser}
                    onChange={setValues}
                  />
                </Box>
              )}
              <>
                <form
                  id={"MessageTeam"}
                  onSubmit={(event) => {
                    event.preventDefault()
                    MessageTeamFunction(event)
                  }}
                >
                  <FormControl>
                    <FormLabel>Sujet de la discussion</FormLabel>
                    <Input
                      size={"md"}
                      placeholder="Sujet du tchat"
                      value={subject}
                      onChange={handleSubject}
                      required
                    />
                    <FormLabel>Votre message</FormLabel>

                    <Textarea
                      size={"md"}
                      placeholder="votre message"
                      value={MessageValue}
                      onChange={handleChange}
                    />
                  </FormControl>
                </form>
              </>
            </ModalBody>

            <ModalFooter>
              <>
                <Button
                  mr={10}
                  colorScheme="blue"
                  type="submit"
                  isLoading={isLoading}
                  size="sm"
                  form="MessageTeam"
                  onClick={onClose}
                >
                  Envoyer
                </Button>
                <Button colorScheme="red" mr={10} onClick={onClose}>
                  Annuler
                </Button>
              </>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    </>
  )
}
export default CreateChat
