import {
  Avatar,
  AvatarGroup,
  Box,
  Grid,
  Heading,
  Text,
  VStack,
  Center,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react"
import { Chat } from "prisma"
import getTeams from "app/teams/queries/getTeams"
import { usePaginatedQuery, useMutation } from "blitz"
import React from "react"
import publishTeamAdmin from "app/admin/mutations/publishAdmin"
import { useRouter } from "next/router"
import { useQuery, Link } from "blitz"
import { FormEvent, useState } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import { Team, User } from "prisma"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import {
  FormControl,
  FormLabel,
  Button,
  Textarea,
  FormHelperText,
  HStack,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Switch,
  Stack,
  Flex,
} from "@chakra-ui/react"
import TeamUserChat from "app/admin/mutations/createChatWithTeam"
import TeamUserMessage from "app/chats/mutations/createTeamMessage"
import getChatByTeamUs from "app/chats/queries/getChatByParticipants"
import NotAgreedPublishTeam from "app/admin/mutations/NotAgreedPublishTeam"
const teamsToValid = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const [TeamId, setTeamID] = useState<string>("")
  const [TeamMaster, setTeamMaster] = useState<string[]>([""])
  const userId = currentUser?.user?.id
  const [{ teams }] = usePaginatedQuery(
    getTeams,
    {
      orderBy: { updatedAt: "desc" },
      where: {
        publishDemand: true,
      },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  const [PublishTeamMutation] = useMutation(publishTeamAdmin)
  const [NotAgreedPublishTeamMutation] = useMutation(NotAgreedPublishTeam)
  let participantsChat = TeamMaster as string[]

  let chatId = `admin${TeamId}+${userId}` as string
  let chatIdLenght = chatId.length as number

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [MessageValue, setMessageValue] = useState<string>("")

  function handleChange(e) {
    setMessageValue(e.target.value)
  }

  const [TeamUserChatMutation, { isLoading, isError }] = useMutation(TeamUserChat)
  const [TeamUserMessageMutation] = useMutation(TeamUserMessage)
  function ContacteTeam(TeamId, TeamMasterIds, exist) {
    setTeamID(TeamId)
    setTeamMaster(TeamMasterIds)

    if (exist !== true) {
      onOpen()
    }
  }
  const MessageTeamFunction = async (event: FormEvent<HTMLFormElement>) => {
    try {
      await TeamUserChatMutation({
        data: {
          id: chatId,
          teamId: TeamId,
          content: MessageValue,
          participatingUsers: TeamMaster as string[],
        },
      })
      const NewMessage = await TeamUserMessageMutation({
        data: {
          content: MessageValue,
          sentInId: chatId,
          sentFromId: "teamId",
          sentToId: participantsChat,
          //sentIn: '{connect:{id: data.id as string}}',
          //sentFrom: '{connect:{id: currentUser as string}}',
          //sentTo: {connect: team.TeamMemberId.map((userId) => ({id: userId}  )) as Prisma.UserCreateNestedManyWithoutReceivedMessagesInput },
        },
      })
      return await NewMessage
    } catch (error) {
      console.log(error)
    }
    document.location.reload()
  }

  const CorpusNode = (team: Team) => {
    return (
      <Box p={4}>
        <Center>
          <Box
            minWidth="70vw"
            minHeight="50vh"
            h="auto"
            dangerouslySetInnerHTML={{ __html: team.corpus }}
          ></Box>
        </Center>
      </Box>
    )
  }
  const ImageNode = (team: Team) => {
    return (
      <Box p={4}>
        <Center>
          <Image
            fallbackSrc={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cumulus_clouds_in_Russia._img_067.jpg/1925px-Cumulus_clouds_in_Russia._img_067.jpg"
            }
            src={team.image}
            alt={team.name}
          />
        </Center>
      </Box>
    )
  }

  const descriptionNode = (team: Team) => {
    return (
      <Box p={4} borderTopWidth={1}>
        <Center>
          <Text>{team.description}</Text>
        </Center>
        <Center>
          <Text size="md">{`année de création : ${team.anneeCreation}`}</Text>
        </Center>
        <Center>
          <Text size="md">{`nombre de personne dans ce ce groupe : ${team.taille}`}</Text>
        </Center>
        <Center>
          <Text size="md">{`opère au sein d'une organisation de type : ${team.typeOrg}`}</Text>
        </Center>
        <Center>
          <Text size="md">{`secteur : ${team.secteur}`}</Text>
        </Center>
      </Box>
    )
  }

  const userAvatarsNode = (
    team: Team & {
      users: User[]
    }
  ) => {
    if (!team.users.length) {
      return false
    }

    const avatarsNode = () =>
      team.users.map((user) => {
        return <Avatar key={user.id} name={user.name} src={user.avatar as string} />
      })
    return (
      <Box p={4} borderTopWidth={1}>
        <AvatarGroup size="sm" max={5}>
          {avatarsNode()}
        </AvatarGroup>
      </Box>
    )
  }

  return (
    <>
      <Heading> {`${teams?.length} demandes de publication`} </Heading>
      {teams.map((team) => {
        let TeamId = team.id as string
        let TeamMastersIds = team.TeamMastersID as string[]
        let adminChat = `admin${TeamId}+${userId}` as string
        let [chatUnique] = useQuery(getChatByTeamUs, {
          where: { id: adminChat },
        }) as Chat
        let uniqueChatId = chatUnique?.id as string
        let exist = false as boolean

        if (uniqueChatId !== undefined) {
          exist = true as boolean
        }

        return (
          <>
            <Accordion allowMultiple minWidth={"50vh"}>
              <AccordionItem>
                <AccordionButton
                  _expanded={{ bg: "#F4FAFF", color: "black" }}
                  style={{ borderStyle: "groove" }}
                >
                  {team.name}
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Box as="a" bgColor="white" rounded="md" shadow="sm" borderWidth={1}>
                    <VStack align="left" spacing={0}>
                      {ImageNode(team)}
                      {descriptionNode(team)}
                      {userAvatarsNode(team)}
                      {CorpusNode(team)}
                    </VStack>{" "}
                    <>
                      <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalContent>
                          <ModalHeader>Contacter ce ce groupe</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <form
                              id={"MessageTeam"}
                              onSubmit={(event) => {
                                event.preventDefault()
                                MessageTeamFunction(event)
                              }}
                            >
                              <FormControl>
                                <FormLabel>Votre message</FormLabel>
                                <Textarea
                                  size={"md"}
                                  placeholder="écrivez votre message"
                                  value={MessageValue}
                                  onChange={handleChange}
                                />
                              </FormControl>
                            </form>
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
                      <>
                        {uniqueChatId === undefined ? (
                          <Button
                            marginRight={"2vw"}
                            onClick={() => {
                              ContacteTeam(TeamId, TeamMastersIds, exist)
                            }}
                          >
                            Contacter ce ce groupe
                          </Button>
                        ) : (
                          <>
                            <Flex marginTop={"3vh"}>
                              <Button marginLeft={"2vw"}>
                                <Link href={`/chats/${adminChat}`}>Le chat est par ici </Link>{" "}
                              </Button>
                            </Flex>
                          </>
                        )}
                      </>
                      <Text>Après avoir envoyer le message</Text>
                      <Flex>
                        <Button
                          marginRight={"2vw"}
                          onClick={async () => {
                            if (
                              window.confirm(
                                "êtes vous sûre de vouloir rendre publique ce groupe ?"
                              )
                            ) {
                              await PublishTeamMutation({ where: { id: team.id } })
                            }
                            document.location.reload()
                          }}
                        >
                          {" "}
                          Publier
                        </Button>
                        <Button
                          marginLeft={"2vw"}
                          onClick={async () => {
                            if (
                              window.confirm("êtes vous sûre de vouloir refusez cette demande ?")
                            ) {
                              await NotAgreedPublishTeamMutation({ where: { id: team.id } })
                            }
                            document.location.reload()
                          }}
                        >
                          Refuser{" "}
                        </Button>
                      </Flex>
                    </>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </>
        )
      })}
    </>
  )
}

export default teamsToValid
