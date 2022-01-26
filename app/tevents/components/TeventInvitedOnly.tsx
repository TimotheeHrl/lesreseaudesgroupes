import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spacer,
  Box,
  Button,
  Avatar,
  Flex,
  Center,
  Text,
  Grid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalContent,
  ModalHeader,
  GridItem,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
} from "@chakra-ui/react"
import UnParticipatingUsersId from "app/tevents/mutations/UnJoinEventInvited"
import getTeventInvited from "app/tevents/queries/getTeventInvited"
import CreateEreplyEventForm from "app/ereplies/components/CreateReplyToEvent"
import getUser from "app/users/queries/getUser"
import getPartiCipantsInvitedOnly from "app/tevents/queries/getParticipantInvited"
import getereplies from "app/ereplies/queries/getAllEreplies"
import { usePaginatedQuery, useParam, useRouter, useQuery, useMutation } from "blitz"
import React, { useEffect, useState } from "react"
import getTeamName from "app/publicMap/queries/getTeamName"
import EventLocation from "app/utils/mapInput/location"
import JoinEvent from "app/tevents/components/joinEvent"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import { useClipboard } from "use-clipboard-copy"
import UserModale from "app/utils/UserModale"

interface IUser {
  userDescription: string
  lien: string
  name: string
  id: string
  avatar: string
  createdAt: Date
  role: string
}
const teventSelected = () => {
  const [modaleUser, setModaleUser] = useState<IUser>({
    userDescription: "string",
    lien: "string",
    name: "string",
    id: "string",
    avatar: "string",
    createdAt: new Date("1995-12-17T03:24:00"),
    role: "string",
  })
  const [UnParticipatingUsersIdMutation] = useMutation(UnParticipatingUsersId)
  const router = useRouter()
  const currentUser = useCurrentUser()
  const currentUserId = currentUser?.user?.id as string
  const teamId = useParam("teamId", "string") as string
  const teventId = useParam("teventId", "string") as string
  const clipboard = useClipboard()
  const [Copied, setCopied] = useState(false)
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

  const [TeamName] = useQuery(
    getTeamName,
    {
      where: {
        id: teamId,
      },
    },

    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  const teventUserId = tevent?.userId as string
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [ereplies] = usePaginatedQuery(
    getereplies,
    {
      orderBy: { createdAt: "desc" },
      where: {
        teventId: teventId,
      },
    },
    {
      refetchInterval: 10000,
    }
  )
  const [user] = usePaginatedQuery(
    getUser,
    {
      where: {
        id: teventUserId,
      },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  const User = user as IUser
  const [Eventparticipants] = usePaginatedQuery(
    getPartiCipantsInvitedOnly,
    {
      where: {
        id: teventId,
      },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  let isUserPartipant = Eventparticipants?.IsUserPart as string[]
  const isUserPartipantStr = isUserPartipant[0] as string
  const MaxPart = tevent?.maxParticipants as number
  const teventParticipantss = Eventparticipants?.Eventparticipants
  const teventParticipantIdLenght = Eventparticipants?.count as number
  const LinkForVisio = tevent?.linkVisio as string

  let participants = teventParticipantss?.map((participants) => (
    <div key={participants.id}>
      {participants.user.map((part) => (
        <Box key={part.id}>
          <Link
            mt={{ base: "2vh", md: "2vh", lg: "0vh", xl: "0vh" }}
            onClick={() => [
              setModaleUser({
                userDescription: part.userDescription,
                lien: part.lien,
                name: part.name,
                id: part.id,
                avatar: part.avatar,
                createdAt: part.createdAt,
                role: part.role,
              }),
              onOpen(),
            ]}
          >
            <Avatar
              marginLeft="3vw"
              name={part.name as string}
              size="lg"
              src={part.avatar as string}
            />
            <Center marginLeft="0.5vw">
              <Text marginTop="1vh"> {part.name as string} </Text>
            </Center>
          </Link>
        </Box>
      ))}
    </div>
  ))

  const ereply = ereplies.ereplies.map((reply) => (
    <div key={reply.id}>
      <Flex>
        <Link
          mt={{ base: "2vh", md: "2vh", lg: "0vh", xl: "0vh" }}
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
          <Avatar size="sm" max={1} name={reply.user.name} src={reply.user.avatar as string} />
          <h3 style={{ fontSize: "14px", marginLeft: "2%", marginTop: "3px" }}>
            {reply.user.name}
          </h3>
        </Link>
        <Spacer />
        <h3 style={{ fontSize: "14px", marginTop: "3px" }}>
          {reply.createdAt.toLocaleString("fr", { timeZone: "CET" })}
        </h3>
      </Flex>

      <Text marginLeft={"2vh"} marginTop={"1vh"} fontSize={"2vh"}>
        {reply.content}
      </Text>
      <Grid templateColumns="repeat(1, 1fr)">
        <Center>
          <GridItem colSpan={1} mb="2vh" mt="1vh" h="1px" bg="gray.300" w="70vw" />
        </Center>
      </Grid>
    </div>
  ))
  async function UnJoin() {
    try {
      await UnParticipatingUsersIdMutation({
        where: { id: isUserPartipantStr },
      })
    } catch (error) {
      console.log(error)
    }
    document.location.reload()
  }

  function handelClickchange() {
    clipboard.copy(LinkForVisio)
    setCopied(true)
    setTimeout(function () {
      setCopied(false)
    }, 1000)
  }
  return (
    <Box mt="3vh">
      <UserModale modaleUser={modaleUser} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      <Box>
        <Center>
          <Box display={{ base: "row", md: "row", lg: "flex", xl: "flex" }}>
            <Text as="b" marginTop={"1vh"} marginLeft={"1vw"} fontSize="2vh">
              Organisateur :
            </Text>
            <Box
              onClick={() => [
                setModaleUser({
                  userDescription: User.userDescription as string,
                  lien: User.lien,
                  name: User.name,
                  id: User.id,
                  avatar: User.avatar,
                  createdAt: User.createdAt,
                  role: User.role,
                }),
                onOpen(),
              ]}
            >
              <Link>
                <Flex>
                  <Avatar
                    marginLeft="1vw"
                    name={tevent?.user.name as string}
                    src={tevent?.user.avatar as string}
                  />
                  <Text fontSize="2vh" m="0.5vw">
                    {" "}
                    {tevent?.user.name as string}{" "}
                  </Text>
                </Flex>
              </Link>
            </Box>

            <Text marginTop={"1vh"} marginLeft={"1vw"} fontSize="2vh">
              du groupe {TeamName.name}
            </Text>
          </Box>
        </Center>
      </Box>
      <Center mt="2vh" mb="2vh">
        <Text as="b" fontSize={"xl"}>
          {tevent?.subject as string}
        </Text>
      </Center>
      <Center>
        <Text fontSize={"lg"}>
          Début {tevent?.startAt.toLocaleString("fr", { timeZone: "CET" }) as string}
        </Text>
      </Center>
      <Center>
        <Text marginLeft={"1vh"} fontSize={"lg"}>
          Fin : {tevent?.endsAt.toLocaleString("fr", { timeZone: "CET" })}
        </Text>
      </Center>
      {tevent?.isCancel === true ? (
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            L'événement à été annulé !
          </AlertTitle>
          <AlertDescription maxWidth="sm">{tevent.infoPostscritum}</AlertDescription>
        </Alert>
      ) : (
        <div></div>
      )}
      {tevent?.isCancel === false && (tevent?.infoPostscritum?.length as number) > 0 ? (
        <Alert
          status="info"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            Information post-scriptum :
          </AlertTitle>
          <AlertDescription maxWidth="sm">{tevent.infoPostscritum}</AlertDescription>
        </Alert>
      ) : (
        <div></div>
      )}
      <Center>
        <div style={{ fontSize: "2vh" }}>
          <Box
            mt="2vh"
            ml={{ base: "5vw", md: "5vw", lg: "10vw", xl: "15vw" }}
            mr={{ base: "5vw", md: "5vw", lg: "10vw", xl: "15vw" }}
            w="70vw"
            h="auto"
            dangerouslySetInnerHTML={{ __html: tevent?.content as string }}
          ></Box>
        </div>
      </Center>
      {tevent?.visioPres === false && (
        <>
          <Center>
            <Text mt="2vh" ml="10vw" as="b" fontSize={"lg"}>
              Informations sur le lieu :{" "}
            </Text>
          </Center>
          <Center mt="1vh" mb="2vh">
            <Text fontSize={"lg"}>{tevent?.locationDescription}</Text>
          </Center>
          <Box
            mt="3vh"
            ml={{ base: "5vw", md: "5vw", lg: "10vw", xl: "20vw" }}
            mr={{ base: "5vw", md: "5vw", lg: "10vw", xl: "20vw" }}
          >
            <EventLocation />
          </Box>
        </>
      )}
      <Center marginTop={"1vh"}>
        <Text>nombre de participants maximum : {tevent?.maxParticipants}</Text>{" "}
      </Center>
      {isUserPartipant.length > 0 && teventParticipantIdLenght < MaxPart ? (
        <Center marginTop={"1vh"}>
          <Text>places disponibles : {(MaxPart - isUserPartipant.length) as number}</Text>{" "}
        </Center>
      ) : (
        <Text></Text>
      )}
      {isUserPartipant.length === 0 &&
      teventParticipantIdLenght < MaxPart &&
      currentUserId !== (tevent?.userId as string) ? (
        <Center marginTop={"1vh"}>
          <JoinEvent />{" "}
        </Center>
      ) : (
        <></>
      )}
      {isUserPartipant.length > 0 && (
        <Center marginTop={"1vh"}>
          <Button marginTop={"1vh"} size="lg" colorScheme="red" onClick={UnJoin}>
            Ne plus participer
          </Button>
        </Center>
      )}
      {isUserPartipant.length > 0 && tevent?.visioPres === true && (
        <>
          <Center marginTop="3vh">
            {" "}
            <Flex>
              <Text marginRight="1vh" marginTop="3vh">
                Rendez vous ici :
              </Text>{" "}
              <Box border="solid" padding="20px" rounded="1vw" borderColor="blue">
                <Button
                  marginRight="1vh"
                  marginLeft="1vh"
                  value={LinkForVisio}
                  onClick={handelClickchange}
                >
                  {Copied ? (
                    <Text fontSize="2vh" backgroundColor="grey" color="orange">
                      Copié!
                    </Text>
                  ) : (
                    <Text color="black">Copier</Text>
                  )}
                </Button>
                <Center marginTop="3vh">
                  <Text>{LinkForVisio}</Text>
                </Center>
              </Box>
            </Flex>
          </Center>

          <Center>
            <Text marginLeft={"2vw"}>Code visio : {tevent.visioCode}</Text>
          </Center>
        </>
      )}
      {(teventParticipantIdLenght as number) > 0 ? (
        <Box
          mt="3vh"
          ml={{ base: "5vw", md: "5vw", lg: "10vw", xl: "20vw" }}
          mr={{ base: "5vw", md: "5vw", lg: "10vw", xl: "20vw" }}
        >
          <Text as="b">Participants</Text>

          <Grid
            h="auto"
            marginTop={"2vh"}
            templateRows="repeat(auto, auto)"
            templateColumns={{
              base: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)",
              xl: "repeat(8, 1fr)",
            }}
            gap={12}
          >
            {participants}
          </Grid>
        </Box>
      ) : (
        <div></div>
      )}
      <Box
        mt="3vh"
        ml={{ base: "5vw", md: "5vw", lg: "10vw", xl: "20vw" }}
        mr={{ base: "5vw", md: "5vw", lg: "10vw", xl: "20vw" }}
      >
        <Box flex="1" textAlign="left">
          {tevent?.ereplys.length === 0 && (
            <h2 style={{ fontSize: "16px", textAlign: "end" }}>Pas d'échanges pour le moment</h2>
          )}
        </Box>

        <div> {ereply} </div>

        <CreateEreplyEventForm />
      </Box>
    </Box>
  )
}

export default teventSelected
