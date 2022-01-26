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
  ModalFooter,
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
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { Link, usePaginatedQuery, useParam, useQuery, useMutation } from "blitz"
import React, { useState } from "react"
import ApostCreateReplyForm from "app/publicMap/mutations/createAreplyApost"
import UserModale from "app/utils/UserModale"
import getAposts from "app/admin/queries/getAposts"
import getAreplies from "app/admin/queries/getAreplies"
interface IUser {
  userDescription: string
  lien: string
  name: string
  id: string
  avatar: string
  createdAt: Date
  role: string
}
interface IAReply {
  aposId: string
  Replycontent: string
}
const ApostListPublic = () => {
  const currentUser = useCurrentUser()
  let userId = currentUser?.user?.id as string
  const isUserIdAString = typeof userId
  const [createAreplyFromApostMutation, { isLoading, isError }] = useMutation(ApostCreateReplyForm)
  const [replyEvent, setReplyEvent] = useState<IAReply>({ aposId: "", Replycontent: "" })
  const [modaleUser, setModaleUser] = useState<IUser>({
    userDescription: "string",
    lien: "string",
    name: "string",
    id: "string",
    avatar: "string",
    createdAt: new Date("1995-12-17T03:24:00"),
    role: "string",
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [{ aposts }] = usePaginatedQuery(
    getAposts,
    {
      orderBy: { updatedAt: "desc" },
    },
    {
      staleTime: 7000,
      cacheTime: 10000,
      refetchInterval: 7000,
    }
  )
  async function CreateAreply() {
    if (replyEvent.Replycontent.length > 0 && replyEvent.Replycontent.length < 500) {
      try {
        await createAreplyFromApostMutation({
          data: {
            id: "TreplyId",
            content: replyEvent.Replycontent,
            apostId: replyEvent.aposId,
            userId: "a",
          },
        })
      } catch (error) {
        return { error }
      }
      setReplyEvent({ aposId: "", Replycontent: "" } as IAReply)
    }
  }
  if (replyEvent.Replycontent.length > 500) {
    alert("Votre réponse doit compter moins de 499 caractères")
  }
  function handleInputChange(e) {
    let inputValue = e.target.value as string

    let AposId = e.target.name as string
    setReplyEvent({ aposId: AposId, Replycontent: inputValue } as IAReply)
  }
  return (
    <div>
      {aposts.map((apost) => {
        let UpdatedAt = apost.updatedAt.toLocaleString("fr", { timeZone: "CET" })
        let PostContent = apost.content as string
        let apostId = apost.id as string

        const [areplies] = useQuery(
          getAreplies,
          {
            orderBy: { createdAt: "asc" },
            where: {
              apostId: apostId,
            },
          },
          {
            refetchInterval: 3000,
          }
        )
        const areply = areplies.areplies.map((reply) => (
          <Box key={reply?.id}>
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

                  <p style={{ padding: "0.5vh", fontSize: "lg" }}> {reply.user.name as string} </p>
                </Flex>
              </Box>
              <Spacer />

              <Text style={{ fontSize: "lg", marginTop: "3px" }}>
                {reply.createdAt.toLocaleString("fr", { timeZone: "CET" })}
              </Text>
            </Flex>

            <Text
              as="i"
              padding="2vh"
              marginTop="1vh"
              marginBottom="2vh"
              style={{ fontSize: "2vh" }}
            >
              {reply.content}
            </Text>
            <Grid marginBottom="2vh" templateColumns="repeat(1, 1fr)">
              <Center>
                <GridItem w="50vw" mb="2vh" mt="2vh" colSpan={1} h="1px" bg="gray.600" />
              </Center>
            </Grid>
          </Box>
        ))
        return (
          <Box key={apostId} w={{ base: "90vw", md: "90vw", lg: "80vw", xl: "70vw" }}>
            <UserModale modaleUser={modaleUser} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

            <Flex>
              <Box
                onClick={() => [
                  setModaleUser({
                    userDescription: apost.user.userDescription,
                    lien: apost.user.lien,
                    name: apost.user.name,
                    id: apost.user.id,
                    avatar: apost.user.avatar,
                    createdAt: apost.user.createdAt,
                    role: apost.user.role,
                  }),
                  onOpen(),
                ]}
              >
                <Flex>
                  <Avatar
                    marginLeft="1vw"
                    name={apost.user.name as string}
                    src={apost.user.avatar as string}
                  />
                  <p style={{ padding: "0.5vh", fontSize: "lg" }}> {apost.user.name as string} </p>
                </Flex>
              </Box>
              <Spacer />

              <Box>
                <Text fontSize="lg">le {UpdatedAt}</Text>
              </Box>
            </Flex>
            <div style={{ fontSize: "2vh" }}>
              <Box
                paddingLeft="5vw"
                marginTop="2vh"
                dangerouslySetInnerHTML={{ __html: PostContent }}
              />
            </div>

            <Box mt="3vh"> {areply} </Box>

            <Flex mb="5vh">
              <FormControl id={apostId} name={apostId} isRequired isDisabled={isLoading}>
                {replyEvent.Replycontent.length > 0 && (
                  <Text>{replyEvent.Replycontent.length}/499 caractères maximum</Text>
                )}
                <Flex>
                  <Textarea
                    size="md"
                    name={apostId}
                    placeholder="..."
                    value={replyEvent.Replycontent as string}
                    onChange={handleInputChange}
                  />

                  {isUserIdAString === "string" ? (
                    <Button margin="0.5vw" onClick={CreateAreply} colorScheme="blue" size="lg">
                      Répondre{" "}
                    </Button>
                  ) : (
                    <Link href="/login">
                      <Button margin="0.5vw" onClick={CreateAreply} colorScheme="blue" size="lg">
                        Se connecter{" "}
                      </Button>
                    </Link>
                  )}
                </Flex>
              </FormControl>
            </Flex>
            <Grid marginBottom="2vh" templateColumns="repeat(1, 1fr)">
              <GridItem margin="2vh" color="blue.500" colSpan={1} h="2px" bg="gray.600" />
            </Grid>
          </Box>
        )
      })}
    </div>
  )
}

export default ApostListPublic
