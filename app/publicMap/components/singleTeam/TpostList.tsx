import {
  Box,
  Button,
  Avatar,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spacer,
  Modal,
  ModalContent,
  ModalHeader,
  HStack,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Center,
  Text,
  GridItem,
  Grid,
  FormControl,
  Textarea,
} from "@chakra-ui/react"

import getTposts from "app/publicMap/queries/getTposts"
import getTreplies from "app/treplies/queries/getTreplies"
import { Link, usePaginatedQuery, useParam, useQuery, useMutation } from "blitz"
import createTreplyFromTpost from "app/treplies/mutations/createTreplyTpost"
import React, { useState } from "react"
import UserModale from "app/utils/UserModale"

interface ITReply {
  tposId: string
  Replycontent: string
}
interface IUser {
  userDescription: string
  lien: string
  name: string
  id: string
  avatar: string
  createdAt: Date
  role: string
}
const TpostList = () => {
  const [createTreplyFromTpostMutation, { isLoading, isError }] = useMutation(createTreplyFromTpost)
  const [replyEvent, setReplyEvent] = useState<ITReply>({ tposId: "", Replycontent: "" })
  const [modaleUser, setModaleUser] = useState<IUser>({
    userDescription: "string",
    lien: "string",
    name: "string",
    id: "string",
    avatar: "string",
    createdAt: new Date("1995-12-17T03:24:00"),
    role: "string",
  })
  const teamId = useParam("feveid", "string") as string
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [{ tposts }] = usePaginatedQuery(
    getTposts,
    {
      orderBy: { updatedAt: "desc" },
      where: {
        teamId: teamId,
      },
    },
    {
      staleTime: 3000,
      cacheTime: 3000,
      refetchInterval: 4000,
    }
  )
  async function CreateTreply() {
    if (replyEvent.Replycontent.length > 0) {
      try {
        await createTreplyFromTpostMutation({
          data: {
            id: "TreplyId",
            content: replyEvent.Replycontent,
            teamId: teamId,
            tpostId: replyEvent.tposId,
            userId: "a",
          },
        })
      } catch (error) {
        return { error }
      }
      setReplyEvent({ tposId: "", Replycontent: "" } as ITReply)
    }
  }
  function handleInputChange(e) {
    let inputValue = e.target.value as string

    let tposId = e.target.name as string
    setReplyEvent({ tposId: tposId, Replycontent: inputValue } as ITReply)
  }
  return (
    <div>
      {tposts.map((tpost) => {
        let UpdatedAt = tpost.updatedAt.toLocaleString("fr", { timeZone: "CET" })
        let PostContent = tpost.content as string
        let tpostId = tpost.id as string
        let TteamId = tpost.teamId as string

        let TpostId = tpost.id

        const [treplies] = useQuery(
          getTreplies,
          {
            orderBy: { createdAt: "asc" },
            where: {
              tpostId: TpostId,
            },
          },
          {
            refetchInterval: 3000,
          }
        )
        const treply = treplies.treplies.map((reply) => (
          <div key={reply?.id}>
            <Flex>
              <Box
                onClick={() => [
                  setModaleUser({
                    userDescription: reply.user.userDescription,
                    lien: reply.user.lien,
                    name: reply.user.name,
                    id: reply.user.id,
                    avatar: reply.user.avatar,
                    createdAt: reply.user.createdAt,
                    role: reply.user.role,
                  }),
                  onOpen(),
                ]}
              >
                <Flex>
                  <Avatar name={reply.user.name as string} src={reply.user.avatar as string} />

                  <p style={{ padding: "0.5vh", fontSize: "2vh" }}> {reply.user.name as string} </p>
                </Flex>
              </Box>
              <Spacer />
              <Text style={{ fontSize: "2vh", marginTop: "3px" }}>
                {reply.createdAt.toLocaleString("fr", { timeZone: "CET" })}
              </Text>
            </Flex>

            <Text
              as="i"
              padding="2vh"
              marginTop="1vh"
              marginBottom="2vh"
              style={{ fontSize: "3vh" }}
            >
              {reply.content}
            </Text>
            <Grid marginBottom="2vh" templateColumns="repeat(1, 1fr)">
              <Center>
                <GridItem w="50vw" mb="2vh" mt="2vh" colSpan={1} h="1px" bg="gray.600" />
              </Center>
            </Grid>
          </div>
        ))
        return (
          <Box key={tpostId} w={{ base: "90vw", md: "90vw", lg: "80vw", xl: "70vw" }}>
            <UserModale modaleUser={modaleUser} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

            <Box>
              <Flex>
                <Box
                  onClick={() => [
                    setModaleUser({
                      userDescription: tpost.user.userDescription,
                      lien: tpost.user.lien,
                      name: tpost.user.name,
                      id: tpost.user.id,
                      avatar: tpost.user.avatar,
                      createdAt: tpost.user.createdAt,
                      role: tpost.user.role,
                    }),
                    onOpen(),
                  ]}
                >
                  <Flex>
                    <Avatar
                      marginLeft="1vw"
                      name={tpost.user.name as string}
                      src={tpost.user.avatar as string}
                    />
                    <p style={{ padding: "0.5vh", fontSize: "2vh" }}>
                      {" "}
                      {tpost.user.name as string}{" "}
                    </p>
                  </Flex>
                </Box>
                <Spacer />
                <Box>
                  <Text fontSize="2vh" mr="1vw">
                    le {UpdatedAt}
                  </Text>
                  {tpost.treplys.length > 0 && (
                    <Text fontSize="2vh" mr="1vw">
                      {tpost.treplys.length} réponses
                    </Text>
                  )}{" "}
                </Box>
              </Flex>
            </Box>
            <Center mb="2vh">
              <div style={{ fontSize: "2vh" }}>
                <Box
                  paddingLeft="5vw"
                  marginTop="2vh"
                  dangerouslySetInnerHTML={{ __html: PostContent }}
                />
              </div>
            </Center>

            <Text
              as="i"
              padding="2vh"
              marginTop="1vh"
              marginBottom="2vh"
              style={{ fontSize: "2vh" }}
            >
              {" "}
              {treply}{" "}
            </Text>

            <Flex>
              <FormControl id={tpostId} name={tpostId} isRequired isDisabled={isLoading}>
                <Flex>
                  <Textarea
                    size="md"
                    name={tpostId}
                    placeholder="......"
                    value={replyEvent.Replycontent as string}
                    onChange={handleInputChange}
                  />
                  <Button margin="0.5vw" onClick={CreateTreply} colorScheme="blue" size="lg">
                    Répondre{" "}
                  </Button>
                </Flex>
              </FormControl>
            </Flex>
            <Grid mt="2vh" mb="2vh" marginBottom="2vh" templateColumns="repeat(1, 1fr)">
              <Center>
                <GridItem w="70vw" mb="2vh" mt="2vh" colSpan={1} h="1px" bg="gray.600" />
              </Center>
            </Grid>
          </Box>
        )
      })}
    </div>
  )
}

export default TpostList
