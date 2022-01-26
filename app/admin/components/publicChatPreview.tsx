import {
  Stack,
  HStack,
  Container,
  Text,
  Spacer,
  Flex,
  Box,
  Avatar,
  AvatarGroup,
  Center,
  Link,
} from "@chakra-ui/react"
import { InfoIcon } from "@chakra-ui/icons"
import { Message } from "app/chats/queries/getChatsWithLastMessage"

interface ChatPreviewProps {
  chatId: string
  name: { id: string; name: string; avatar: string }[]
  lastMessage: Message
}
export default function PublicChatPreview({ chatId, name, lastMessage }: ChatPreviewProps) {
  let today = new Date()

  const displayPart = name.map((part) => (
    <Avatar key={part.id} name={part.name} src={part.avatar as string} />
  ))
  const displayPartName = name.map((part) => <div key={part.id}>{part.name} </div>)
  return (
    <Container
      key={chatId}
      mr={{ sm: "2.5vw", md: "2.5vw", lg: "15vw", xl: "20vw" }}
      ml={{ sm: "2.5vw", md: "2.5vw", lg: "15vw", xl: "20vw" }}
    >
      <Link href={`/chats/${chatId}`}>
        {lastMessage.sentIn.private === true ? (
          <Stack
            spacing="0.1rem"
            textAlign="left"
            margin="0.5rem"
            borderWidth="2px"
            borderRadius="5px"
            padding="0.5rem"
          >
            <Text fontSize="sm" fontWeight="semibold">
              <Flex>
                <AvatarGroup size="sm" max={5}>
                  {displayPart}
                </AvatarGroup>
                <HStack>{displayPartName}</HStack>
              </Flex>
            </Text>
            <Center>
              <Flex>
                <Text marginTop="0.5vh" fontSize="sm" fontWeight="semibold" color="grey">
                  Sujet :
                </Text>
                <Text marginLeft="1vw" marginRight="4vw" fontSize="lg" fontWeight="semibold">
                  {lastMessage.sentIn.subject}
                </Text>
                <Text
                  fontSize="sm"
                  padding="5px"
                  paddingTop="10px"
                  rounded="7px"
                  fontWeight="semibold"
                  backgroundColor="#2D3748"
                  color="#76E4F7"
                >
                  Conversation Privée
                </Text>
              </Flex>
            </Center>

            <Flex>
              {lastMessage && (
                <HStack>
                  {lastMessage.sentFrom ? (
                    <Text fontWeight="semibold">{lastMessage.sentFrom.name + ": "}</Text>
                  ) : (
                    <InfoIcon color="brandSilver.800" />
                  )}

                  {lastMessage.content.length > 70 ? (
                    <Text isTruncated as="i">
                      {lastMessage.content.slice(0, 70)}
                    </Text>
                  ) : (
                    <Text isTruncated as="i">
                      {lastMessage.content}
                    </Text>
                  )}
                </HStack>
              )}
              <Spacer />
              {lastMessage!.sentAt.toDateString() == today.toDateString() ? (
                <Text fontSize="sm">{lastMessage && lastMessage.sentAt.toLocaleTimeString()}</Text>
              ) : (
                <Text fontSize="sm">
                  {lastMessage && lastMessage.sentAt.toLocaleDateString("fr", { timeZone: "CET" })}
                </Text>
              )}
            </Flex>
          </Stack>
        ) : (
          <Stack
            spacing="0.1rem"
            textAlign="left"
            margin="0.5rem"
            borderWidth="2px"
            borderRadius="5px"
            padding="0.5rem"
          >
            <Center>
              <Flex>
                <Text marginTop="0.5vh" fontSize="sm" fontWeight="semibold" color="grey">
                  Sujet :
                </Text>
                <Text marginLeft="1vw" marginRight="4vw" fontSize="lg" fontWeight="semibold">
                  {lastMessage.sentIn.subject}
                </Text>
                <Text
                  fontSize="sm"
                  padding="5px"
                  paddingTop="10px"
                  rounded="7px"
                  fontWeight="semibold"
                  backgroundColor="#2D3748"
                  color="#9AE6B4"
                >
                  Conversation Publique
                </Text>
              </Flex>
            </Center>

            <Flex>
              {lastMessage && (
                <HStack>
                  {lastMessage.sentFrom ? (
                    <Text fontWeight="semibold">{lastMessage.sentFrom.name + ": "}</Text>
                  ) : (
                    <InfoIcon color="brandSilver.800" />
                  )}

                  {lastMessage.content.length > 70 ? (
                    <Text isTruncated as="i">
                      {lastMessage.content.slice(0, 70)}
                    </Text>
                  ) : (
                    <Text isTruncated as="i">
                      {lastMessage.content}
                    </Text>
                  )}
                </HStack>
              )}
              <Spacer />
              {lastMessage!.sentAt.toDateString() == today.toDateString() ? (
                <Text fontSize="sm">{lastMessage && lastMessage.sentAt.toLocaleTimeString()}</Text>
              ) : (
                <Text fontSize="sm">
                  {lastMessage && lastMessage.sentAt.toLocaleDateString("fr", { timeZone: "CET" })}
                </Text>
              )}
            </Flex>
          </Stack>
        )}
      </Link>
    </Container>
  )
}
