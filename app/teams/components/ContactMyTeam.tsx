import { useRouter } from "next/router"
import getPublicTeam from "app/publicMap/queries/getPublicTeam"
import { useQuery, Link, useMutation, useParam } from "blitz"
import { FormEvent, useState, useEffect } from "react"
import "mapbox-gl/dist/mapbox-gl.css"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import {
  FormControl,
  FormLabel,
  Button,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Box,
  Container,
  Stack,
} from "@chakra-ui/react"
import TeamUserChat from "app/chats/mutations/createChatWithTeam"
import TeamUserMessage from "app/chats/mutations/createTeamMessage"
import getChatByTeamUs from "app/chats/queries/getChatByParticipants"
import checkTeamMembers from "app/teams/queries/checkTeamMembers"
function ContactMyTeam() {
  const teamId = useParam("teamId", "string") as string

  const [team] = useQuery(
    checkTeamMembers,
    {
      where: { id: teamId },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  ) as any
  let participantsChat = team.TeamMemberId as string[]

  const currentUser = useCurrentUser()
  const userId = currentUser?.user?.id as string

  let chatId = `${teamId}+${userId}` as string
  const [chatUnique] = useQuery(getChatByTeamUs, {
    where: { id: chatId },
  })

  const { isOpen, onOpen, onClose } = useDisclosure()

  const [MessageValue, setMessageValue] = useState<string>("")
  const [HasAlreadyWrote] = useState<Boolean>((chatUnique != null) === true)

  function handleChange(e) {
    setMessageValue(e.target.value)
  }

  const [TeamUserChatMutation, { isLoading, isError }] = useMutation(TeamUserChat)
  const [TeamUserMessageMutation] = useMutation(TeamUserMessage)

  const MessageTeamFunction = async (event: FormEvent<HTMLFormElement>) => {
    try {
      await TeamUserChatMutation({
        data: {
          id: chatId,
          teamId: teamId,
          content: MessageValue,
          participatingUsers: team.TeamMemberId as string[],
        },
      })
      const NewMessage = await TeamUserMessageMutation({
        data: {
          content: MessageValue,
          sentInId: chatId,
          sentFromId: "teamId",
          sentToId: participantsChat,
        },
      })
      document.location.reload()

      return await NewMessage
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <>
        <Modal size={"xl"} isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Contacter mon groupe</ModalHeader>
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
                    size={"xl"}
                    minHeight="15vw"
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
                  color="white"
                  type="submit"
                  isLoading={isLoading}
                  size="sm"
                  form="MessageTeam"
                  onClick={onClose}
                >
                  Envoyer
                </Button>
                <Button mr={10} onClick={onClose}>
                  Annuler
                </Button>
              </>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Container>
          {HasAlreadyWrote === false ? (
            <Box display={{ base: "row", md: "row", lg: "flex", xl: "flex" }}>
              <Button
                p="2vh"
                size="lg"
                onClick={onOpen}
                m="1vh"
                colorScheme="purple"
                marginBottom="2vh"
                as="a"
              >
                Contacter
              </Button>
              <Text fontSize="lg" m={{ base: "1vh", md: "1vh", lg: "1vh", xl: "1vh" }}>
                Contacter les membres de mon groupe ?
              </Text>{" "}
            </Box>
          ) : (
            <Box display={{ base: "row", md: "row", lg: "flex", xl: "flex" }}>
              <Button
                p="2vh"
                size="lg"
                m="1vh"
                colorScheme="purple"
                marginBottom="2vh"
                as="a"
                isLoading={isLoading}
              >
                <Link href={`/chats/${chatId}`}>Par ici </Link>{" "}
              </Button>
              <Text fontSize="lg" m={{ base: "1vh", md: "1vh", lg: "1vh", xl: "1vh" }}>
                Vous avez déjà une conversation en cours avec les membres de ce groupe
              </Text>
            </Box>
          )}
        </Container>
      </>
    </>
  )
}
export default ContactMyTeam
