import {
  Stack,
  HStack,
  Container,
  Link,
  Text,
  Spacer,
  Flex,
  Box,
  Avatar,
  AvatarGroup,
  Center,
} from "@chakra-ui/react"
import { InfoIcon } from "@chakra-ui/icons"
import { Message } from "app/chats/queries/getChatsWithLastMessage"
import { Link as BlitzLink } from "blitz"

interface ChatPreviewProps {
  chatId: string
  name: { id: string; name: string; avatar: string }[]
  lastMessage: Message
}
export default function ChatPreview({ chatId, name, lastMessage }: ChatPreviewProps) {
  const displayPart = name.map((part) => (
    <Avatar key={part.id} name={part.name} src={part.avatar as string} />
  ))
  return (
    <Container
      mr={{ sm: "2.5vw", md: "2.5vw", lg: "15vw", xl: "20vw" }}
      ml={{ sm: "2.5vw", md: "2.5vw", lg: "15vw", xl: "20vw" }}
    >
      <Link key={chatId} href={`/chats/${chatId}`}>
        <Stack
          spacing="0.1rem"
          textAlign="left"
          borderWidth="2px"
          borderRadius="5px"
          padding="0.5rem"
          w={{ sm: "95vw", md: "95vw", lg: "70vw", xl: "60vw" }}
        >
          <Flex>
            <AvatarGroup size="sm" max={5}>
              {displayPart}
            </AvatarGroup>

            <Spacer />
            <Text textAlign={"right"} fontSize="lg">
              {lastMessage?.sentAt.toLocaleString("fr", { timeZone: "CET" })}
            </Text>
          </Flex>

          <Flex>
            {lastMessage?.sentIn.subject.length > 30 ? (
              <Text marginLeft="1vw" marginRight="4vw" fontSize="2vh" fontWeight="semibold">
                {`${lastMessage?.sentIn.subject}...`}{" "}
              </Text>
            ) : (
              <Text marginLeft="1vw" marginRight="4vw" fontSize="2vh" fontWeight="semibold">
                {lastMessage?.sentIn.subject}
              </Text>
            )}

            <Spacer />
            <Box>
              {lastMessage?.sentIn.private === true ? (
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
              ) : (
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
              )}
            </Box>
          </Flex>

          <Flex>
            <HStack>
              <Text fontSize="lg" fontWeight="semibold">
                {lastMessage?.sentFrom?.name + ": "}
              </Text>

              {lastMessage?.content.length > 30 ? (
                <Text fontSize="lg" isTruncated as="i">
                  {`${lastMessage?.content.slice(0, 30)}...`}
                </Text>
              ) : (
                <Text fontSize="lg" isTruncated as="i">
                  {lastMessage?.content}
                </Text>
              )}
            </HStack>

            <Spacer />
          </Flex>
        </Stack>
      </Link>
    </Container>
  )
}
