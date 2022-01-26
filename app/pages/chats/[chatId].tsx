import {
  Flex,
  Heading,
  Stack,
  HStack,
  Text,
  Textarea,
  IconButton,
  Box,
  Avatar,
  Spacer,
  Center,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
  Button,
  Grid,
  GridItem,
  Container,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  DrawerBody,
  DrawerContent,
  Drawer,
  DrawerHeader,
  DrawerOverlay,
  DrawerFooter,
} from "@chakra-ui/react"
import { useMediaQuery } from "react-responsive"

import leaveChat from "app/chats/mutations/leaveChat"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import getMessagesByChat from "app/chats/queries/getMessagesByChat"
import getChatById from "app/chats/queries/getChatById"
import getParticipantsByChatId from "../../chats/queries/getParticipantsByChatId"
import sendMessage from "../../chats/mutations/sendMessage"
import React, { useEffect, useRef, useState, Suspense } from "react"
import { RiMailSendLine } from "react-icons/ri"
import { BlitzPage } from "blitz"
import { useQuery, useParam, useRouter, useMutation, Head, AuthorizationError } from "blitz"
import { AddIcon } from "@chakra-ui/icons"

import Layout from "app/core/layouts/Layout"
import AddMembers from "app/chats/components/addMembers"
import EditorChat from "app/utils/textEditor/editorchat"
const { convert } = require("html-to-text")
import UserModale from "app/utils/UserModale"
import { useSocketConnect } from "app/core/hooks/useSocketConnect"
import { useSocketStore } from "app/core/hooks/useSocketStore"

interface IUser {
  userDescription: string
  lien: string
  name: string
  id: string
  avatar: string
  createdAt: Date
  role: string
}

interface Message {
  sentFrom: {
    userDescription: string
    lien: string
    name: string
    id: string
    avatar: string
    createdAt: Date
    role: string
  }

  sentIn: {
    private: boolean
  }
  id?: string
  sentAt: Date
  content: string
  htmlContent: string
  sentInId: string
}

const Chat: BlitzPage = () => {
  let chatId = useParam("chatId", "string") as string
  const [content, setContent] = useState<string>("")
  const html = content
  const text = convert(html, {
    wordwrap: 130,
  })
  const socket = useSocketStore((state) => state.socket)
  const quillRef = useRef<any>(null)
  const router = useRouter()
  const currentUser = useCurrentUser()

  const UserId = currentUser?.user?.id as string
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1200px)" })
  let hheight = "14vw"
  let wwidth = "auto"
  if (isTabletOrMobile === true) {
    hheight = "50vw"
  }
  const [getChatCaracteristics] = useQuery(getChatById, { where: { id: chatId! } })
  const [participants] = useQuery(getParticipantsByChatId, { id: chatId! })
  let partis = participants.map((part) => part.id.includes(UserId))

  let IsPartOfThatTchat = partis.includes(true) as boolean

  const Chatparticipants = participants.filter((u) => u.id != currentUser?.user?.id)
  const ChatparticipantsId = Chatparticipants.map((u) => u.id)
  const [messages] = useQuery(getMessagesByChat, { chatId }, { refetchOnMount: true }) as
    | Message[]
    | any

  const [sendMessageMutation] = useMutation(sendMessage)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ParamDrawer, setDrawer] = useState<boolean>(false)

  const [modaleUser, setModaleUser] = useState<IUser>({
    userDescription: "string",
    lien: "string",
    name: "string",
    id: "string",
    avatar: "string",
    createdAt: new Date("1995-12-17T03:24:00"),
    role: "string",
  })
  const [leaveChatMutation] = useMutation(leaveChat)
  const DateNow = new Date()

  const newMessage = {
    sentFrom: {
      userDescription: currentUser?.user?.userDescription,
      lien: currentUser?.user?.lien,
      name: currentUser?.user?.name,
      id: currentUser?.user?.id,
      avatar: currentUser?.user?.avatar,
      createdAt: currentUser?.user?.createdAt,
      role: currentUser?.user?.role,
    },

    sentIn: {
      id: getChatCaracteristics?.id,
      private: getChatCaracteristics?.private as boolean,
    },
    sentInId: chatId,
    sentAt: DateNow,
    content: text,
    htmlContent: content,
  } as Message
  async function send() {
    if (!text) {
      ;("Il n'y a pas de message ?")
    }
    try {
      await sendMessageMutation({
        data: {
          htmlContent: content as string,
          content: text as string,
          sentIn: chatId as string,
          sentTo: ChatparticipantsId as string[],
        },
      })
      socket?.emit("new-message", newMessage)
    } catch (error) {
      console.log(error)
    }
    setContent("")
  }
  const [liveMessages, setLiveMessages] = useState<Message[]>([])
  console.log(liveMessages)
  const sentInId = chatId
  useSocketConnect({ sentInId }, [
    {
      on: "new-remote-message",
      listener: (data: Message) => {
        console.log("new-remote-message", data)
        setLiveMessages((liveMessages) => [...liveMessages, data])
      },
    },
  ])

  useEffect(() => {
    setLiveMessages((liveMessages) =>
      liveMessages.filter(
        (liveMessage) => !messages.some((message) => message.id === liveMessage.id)
      )
    )
  }, [messages])
  const displayPart = () =>
    Chatparticipants.map((user) => {
      return (
        <Box
          key={user.id}
          onClick={() => [
            setModaleUser({
              userDescription: user.userDescription,
              lien: user.lien,
              name: user.name,
              id: user.id,
              avatar: user.avatar,
              createdAt: user.createdAt,
              role: user.role,
            }),
            onOpen(),
          ]}
        >
          <Box>
            <Avatar
              marginLeft="2vw"
              name={user.name as string}
              size="sm"
              src={user.avatar as string}
            />
            <Center marginLeft="0.5vw">
              <Text marginTop="1vh"> {user.name as string} </Text>
            </Center>
          </Box>
        </Box>
      )
    })

  async function quit() {
    try {
      const mutation = await leaveChatMutation({
        where: { id: chatId as string },
      })
      await mutation
      router.push(`/chats/chats`)
    } catch (error) {
      console.log(error)
    }
  }
  const AlwaysScrollToBottom = () => {
    const elementRef = useRef() as any
    useEffect(() => elementRef.current.scrollIntoView())
    return <div ref={elementRef} />
  }

  const onpenDrawer = () => {
    setDrawer(true)
  }
  const closeDrawer = () => {
    setDrawer(false)
  }
  return (
    <>
      <Head>
        <title>Le Réseau des groupes | Forum</title>
        <meta
          name="Le Réseau des groupes | Forum "
          content="Cette application est en phase de pré-production. 
          Elle est destiné à favoriser l'échange entre des salariés intra-entrepreneur,
           qui entreprennent ou bien qui voudraient entreprendre des actions dans leurs entreprises,
            qui s'inscrivent dans des thèmatiques variées liées au bien-commun "
        />
      </Head>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <Container maxWidth="100vw" mt="10vh">
          {isTabletOrMobile ? (
            <Drawer placement={"left"} onClose={onClose} isOpen={ParamDrawer} size={"lg"}>
              <DrawerOverlay />

              <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Paramètres de la conversation</DrawerHeader>
                <DrawerBody>
                  <Box marginBottom="2vh">
                    {getChatCaracteristics?.private === true && (
                      <>
                        <Grid
                          h="auto"
                          marginTop={"2vh"}
                          templateRows="repeat(auto, auto)"
                          templateColumns={{
                            base: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                          }}
                          gap={12}
                        >
                          {displayPart()}
                        </Grid>
                        <AddMembers />
                        <Center>
                          <Button mt="2vh" onClick={quit}>
                            Quitter ce chat
                          </Button>
                        </Center>
                      </>
                    )}
                    {getChatCaracteristics?.private === false && IsPartOfThatTchat === true && (
                      <>
                        <Center>
                          <Text> Ne plus recevoir de notifications pour cette conversation</Text>
                        </Center>
                        <Center>
                          <Button onClick={quit}>Plus de notifs!</Button>
                        </Center>
                      </>
                    )}
                  </Box>
                </DrawerBody>
                <DrawerFooter borderTopWidth="1px">
                  <Button colorScheme={"blue"} mr={3} onClick={closeDrawer}>
                    Fermer
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ) : (
            <Drawer placement={"left"} onClose={onClose} isOpen={ParamDrawer} size={"lg"}>
              <DrawerOverlay />

              <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Paramètres de la conversation</DrawerHeader>
                <DrawerBody>
                  <Box marginBottom="2vh">
                    {getChatCaracteristics?.private === true && (
                      <>
                        <Grid
                          h="auto"
                          marginTop={"2vh"}
                          templateRows="repeat(auto, auto)"
                          templateColumns={{
                            base: "repeat(2, 1fr)",
                            md: "repeat(3, 1fr)",
                          }}
                          gap={12}
                        >
                          {displayPart()}
                        </Grid>
                        <AddMembers />
                        <Center>
                          <Button mt="4vh" onClick={quit}>
                            Quitter ce chat
                          </Button>
                        </Center>
                      </>
                    )}
                    {getChatCaracteristics?.private === false && IsPartOfThatTchat === true && (
                      <>
                        <Center>
                          <Text> Ne plus recevoir de notifications pour cette conversation</Text>
                        </Center>
                        <Center>
                          <Button onClick={quit}>Plus de notifs!</Button>
                        </Center>
                      </>
                    )}
                  </Box>
                </DrawerBody>
                <DrawerFooter borderTopWidth="1px">
                  <Button colorScheme="blue" mr={5} onClick={closeDrawer}>
                    Fermer
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
          <UserModale modaleUser={modaleUser} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
          {isTabletOrMobile === true ? (
            <>
              <Box position={"absolute"} top="35%" left={"5%"}>
                <Button
                  position={"absolute"}
                  rounded={"50%"}
                  colorScheme="teal"
                  onClick={onpenDrawer}
                >
                  <AddIcon />
                </Button>
              </Box>
            </>
          ) : (
            <Box onClick={onpenDrawer} position={"absolute"} top="30%" left={"5%"}>
              <Button rounded={"50%"} colorScheme="teal">
                {" "}
                <AddIcon />
              </Button>
              <Text mt="1vh"> Paramètres</Text>
            </Box>
          )}
          {isTabletOrMobile === true ? (
            <>
              <Stack
                height="40vh"
                maxHeight="50vh"
                mb="0.5vh"
                id="messages"
                width="100vw"
                overflowY="auto"
                padding="0.5rem"
              >
                {messages.map((m) => {
                  return (
                    <>
                      <div key={m?.id}>
                        <Flex>
                          <Link margin="3vh">
                            <Box
                              onClick={() => {
                                ;[
                                  setModaleUser({
                                    userDescription: m.sentFrom?.userDescription,
                                    lien: m.sentFrom?.lien,
                                    name: m.sentFrom?.name,
                                    id: m.sentFrom?.id,
                                    avatar: m.sentFrom?.avatar,
                                    createdAt: m.sentFrom?.createdAt,
                                    role: m.sentFrom?.role,
                                  }),
                                  onOpen(),
                                ]
                              }}
                            >
                              <Flex>
                                <Avatar
                                  marginLeft="1vw"
                                  name={m.sentFrom?.name as string}
                                  size="sm"
                                  src={m.sentFrom?.avatar as string}
                                />
                                <Text marginLeft="1vw" marginTop={"2vh"}>
                                  {m.sentFrom?.name as string}
                                </Text>
                              </Flex>
                            </Box>
                          </Link>
                          <Spacer />
                          <>
                            <Text marginTop={"5vh"} fontSize="lg">
                              {m.sentAt.toLocaleString("er-FR")}
                            </Text>
                          </>
                        </Flex>
                        <Center>
                          {m.htmlContent !== undefined && m.htmlContent !== null ? (
                            <h2 style={{ fontSize: "4vh" }}>
                              <div dangerouslySetInnerHTML={{ __html: m.htmlContent as string }} />
                            </h2>
                          ) : (
                            <h2 style={{ fontSize: "4vh" }}>{m.content} </h2>
                          )}
                        </Center>
                      </div>
                      <Grid templateColumns="repeat(1, 1fr)">
                        <Center>
                          <GridItem colSpan={1} h="1px" bg="gray.300" w="70vw" />
                        </Center>
                      </Grid>
                    </>
                  )
                })}
                {liveMessages.map((m) => {
                  const Key = (m.sentAt.toString() + m.sentFrom.id) as string

                  return (
                    <>
                      <div key={Key}>
                        <Flex>
                          <Link margin="3vh">
                            <Box
                              onClick={() => {
                                ;[
                                  setModaleUser({
                                    userDescription: m.sentFrom?.userDescription,
                                    lien: m.sentFrom?.lien,
                                    name: m.sentFrom?.name,
                                    id: m.sentFrom?.id,
                                    avatar: m.sentFrom?.avatar,
                                    createdAt: m.sentFrom?.createdAt,
                                    role: m.sentFrom?.role,
                                  }),
                                  onOpen(),
                                ]
                              }}
                            >
                              <Flex>
                                <Avatar
                                  marginLeft="1vw"
                                  name={m.sentFrom?.name as string}
                                  size="sm"
                                  src={m.sentFrom?.avatar as string}
                                />
                                <Text marginLeft="1vw" marginTop={"2vh"}>
                                  {m.sentFrom?.name as string}
                                </Text>
                              </Flex>
                            </Box>
                          </Link>
                          <Spacer />
                          <>
                            <Text marginTop={"5vh"} fontSize="lg">
                              {m.sentAt.toLocaleString("er-FR")}
                            </Text>
                          </>
                        </Flex>
                        <Center>
                          {m.htmlContent !== undefined && m.htmlContent !== null ? (
                            <h2 style={{ fontSize: "4vh" }}>
                              <div dangerouslySetInnerHTML={{ __html: m.htmlContent as string }} />
                            </h2>
                          ) : (
                            <h2 style={{ fontSize: "4vh" }}>{m.content} </h2>
                          )}
                        </Center>
                      </div>
                      <Grid templateColumns="repeat(1, 1fr)">
                        <Center>
                          <GridItem colSpan={1} h="1px" bg="gray.300" w="70vw" />
                        </Center>
                      </Grid>
                    </>
                  )
                })}
                <AlwaysScrollToBottom />
              </Stack>

              <Center>
                <Flex>
                  <div
                    style={{
                      bottom: "0px",
                      width: "75vw",
                      minHeight: "35vh",
                      left: "2vh",
                      overflowY: "scroll",
                    }}
                  >
                    <EditorChat
                      quillRef={quillRef}
                      hheight={hheight}
                      wwidth={wwidth}
                      value={content}
                      setValue={setContent}
                    />
                  </div>
                  <Box
                    pos="absolute"
                    right="1vw"
                    background="white"
                    w="10vh"
                    position="absolute"
                    type="submit"
                    onClick={send}
                  >
                    <>
                      <IconButton
                        aria-label="submit"
                        icon={<RiMailSendLine color="blue" size="5vh" />}
                      />
                    </>
                  </Box>
                </Flex>
              </Center>
            </>
          ) : (
            <>
              <Stack
                maxHeight="70vh"
                mb="0.5vh"
                id="messages"
                width="80vw"
                overflowY="auto"
                padding="0.5rem"
                marginLeft="9vw"
                mr="12vw"
              >
                {messages.map((m) => {
                  return (
                    <div key={m?.id}>
                      <div>
                        <Flex>
                          <Link margin="3vh">
                            <Box
                              onClick={() => {
                                ;[
                                  setModaleUser({
                                    userDescription: m.sentFrom?.userDescription,
                                    lien: m.sentFrom?.lien,
                                    name: m.sentFrom?.name,
                                    id: m.sentFrom?.id,
                                    avatar: m.sentFrom?.avatar,
                                    createdAt: m.sentFrom?.createdAt,
                                    role: m.sentFrom?.role,
                                  }),
                                  onOpen(),
                                ]
                              }}
                            >
                              <Flex>
                                <Avatar
                                  marginLeft="1vw"
                                  name={m.sentFrom?.name as string}
                                  size="lg"
                                  src={m.sentFrom?.avatar as string}
                                />
                                <Text marginLeft="1vw" marginTop={"2vh"}>
                                  {m.sentFrom?.name as string}
                                </Text>
                              </Flex>
                            </Box>
                          </Link>
                          <Spacer />
                          <>
                            <Text marginTop={"5vh"} fontSize="lg">
                              {m.sentAt.toLocaleString("er-FR") as any}
                            </Text>
                          </>
                        </Flex>
                        <Center>
                          {m.htmlContent !== undefined && m.htmlContent !== null ? (
                            <h2 style={{ fontSize: "2vh" }}>
                              <div dangerouslySetInnerHTML={{ __html: m.htmlContent as string }} />
                            </h2>
                          ) : (
                            <h2 style={{ fontSize: "2vh" }}>{m.content} </h2>
                          )}
                        </Center>
                      </div>
                      <Grid templateColumns="repeat(1, 1fr)">
                        <Center>
                          <GridItem colSpan={1} h="1px" bg="gray.300" w="70vw" />
                        </Center>
                      </Grid>
                    </div>
                  )
                })}{" "}
                {liveMessages.map((m) => {
                  const Key = (m.sentAt.toString() + m.sentFrom.id) as string

                  return (
                    <div key={Key}>
                      <div>
                        <Flex>
                          <Link margin="3vh">
                            <Box
                              onClick={() => {
                                ;[
                                  setModaleUser({
                                    userDescription: m.sentFrom?.userDescription,
                                    lien: m.sentFrom?.lien,
                                    name: m.sentFrom?.name,
                                    id: m.sentFrom?.id,
                                    avatar: m.sentFrom?.avatar,
                                    createdAt: m.sentFrom?.createdAt,
                                    role: m.sentFrom?.role,
                                  }),
                                  onOpen(),
                                ]
                              }}
                            >
                              <Flex>
                                <Avatar
                                  marginLeft="1vw"
                                  name={m.sentFrom?.name as string}
                                  size="lg"
                                  src={m.sentFrom?.avatar as string}
                                />
                                <Text marginLeft="1vw" marginTop={"2vh"}>
                                  {m.sentFrom?.name as string}
                                </Text>
                              </Flex>
                            </Box>
                          </Link>
                          <Spacer />
                          <>
                            <Text marginTop={"5vh"} fontSize="lg">
                              {m.sentAt.toLocaleString("er-FR")}
                            </Text>
                          </>
                        </Flex>
                        <Center>
                          {m.htmlContent !== undefined && m.htmlContent !== null ? (
                            <h2 style={{ fontSize: "2vh" }}>
                              <div dangerouslySetInnerHTML={{ __html: m.htmlContent as string }} />
                            </h2>
                          ) : (
                            <h2 style={{ fontSize: "2vh" }}>{m.content} </h2>
                          )}
                        </Center>
                      </div>
                      <Grid templateColumns="repeat(1, 1fr)">
                        <Center>
                          <GridItem colSpan={1} h="1px" bg="gray.300" w="70vw" />
                        </Center>
                      </Grid>
                    </div>
                  )
                })}
                <AlwaysScrollToBottom />
              </Stack>
              <Box
                pos="absolute"
                top="73vh"
                background="white"
                right="4vh"
                border="2px solid"
                borderRadius={8}
                _focusWithin={{
                  borderColor: "red.500",
                  boxShadow: "md",
                }}
                p="2vh"
                position="absolute"
                type="submit"
                onClick={send}
              >
                <>
                  <IconButton
                    aria-label="submit"
                    icon={<RiMailSendLine color="blue" size="4vh" />}
                  />
                </>
              </Box>
              <Center>
                <div
                  style={{
                    backgroundColor: "white",
                    position: "absolute",
                    top: "70vh",
                    maxHeight: "30vh",
                    padding: "1vh",
                    height: "40vh",
                    bottom: "0px",
                    width: "80vw",
                    overflowY: "scroll",
                  }}
                >
                  <EditorChat
                    quillRef={quillRef}
                    hheight={hheight}
                    wwidth={wwidth}
                    value={content}
                    setValue={setContent}
                  />
                </div>
              </Center>
            </>
          )}
        </Container>
      </Suspense>
    </>
  )
}

Chat.authenticate = { redirectTo: "/" }
Chat.getLayout = (page) => <Layout>{page}</Layout>

export default Chat
