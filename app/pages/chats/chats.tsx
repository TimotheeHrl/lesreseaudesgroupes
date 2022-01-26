import { Flex, Heading, Stack, Text, Center, Box } from "@chakra-ui/react"
import ChatPreview from "../../chats/components/chatPreview"
import { Head, useQuery, BlitzPage } from "blitz"
import getChatsWithLastMessage from "../../chats/queries/getChatsWithLastMessage"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import React, { Suspense } from "react"
import { Spinner } from "@chakra-ui/react"
import CreateChat from "app/chats/components/createChat"
const Chats: BlitzPage = () => {
  const [chats] = useQuery(getChatsWithLastMessage, null, { refetchInterval: 3000 })
  const currentUser = useCurrentUser()

  return (
    <>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <Head>
          <title>Plateforme Groupe showcase | m</title>
        </Head>
        <>
          <Flex alignSelf="center" textAlign="center" direction="column" width="full">
            <Heading
              as="h2"
              fontWeight="bolder"
              fontSize="4xl"
              textAlign="center"
              alignSelf="center"
              marginY="1rem"
            >
              Messagerie
            </Heading>
            <Box mb="3vh">
              <CreateChat />
            </Box>
            {chats.length > 0 && (
              <Box>
                {chats.map((chat) => {
                  const parts = chat.participatingUsers.filter((u) => u.id != currentUser?.user?.id)
                  return (
                    <ChatPreview
                      key={chat.id}
                      chatId={chat.id as string}
                      name={parts}
                      lastMessage={chat.lastMessage!}
                    />
                  )
                })}
              </Box>
            )}

            {chats.length === 0 && (
              <Center>
                <Text height="2vh">Vous n'avez pas de discussions en cours</Text>
              </Center>
            )}
          </Flex>
        </>
      </Suspense>
    </>
  )
}

Chats.authenticate = { redirectTo: "/" }
Chats.getLayout = (page) => <Layout title={"chats"}>{page}</Layout>

export default Chats
