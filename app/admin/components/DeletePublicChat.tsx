import { Flex, Heading, Box, Button, Stack, Text, Checkbox, CheckboxGroup } from "@chakra-ui/react"
import PublicChatPreview from "app/admin/components/publicChatPreview"
import { Head, useQuery, BlitzPage, useMutation } from "blitz"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import Layout from "app/core/layouts/Layout"
import React, { Suspense, useState } from "react"
import { Center, Spinner } from "@chakra-ui/react"
import getAllPublicChat from "app/admin/queries/getAllPublicChat"
import deletePublicChatMut from "app/admin/mutations/deletePublicChat"

interface ICheckbox {
  id: string
  isChecked: boolean
}
const DeletePublicChat = () => {
  const [chats] = useQuery(getAllPublicChat, null, { refetchInterval: 5000 })
  const currentUser = useCurrentUser()
  const [AllCheckedVal, setAllCheckedVal] = useState<string[]>([])
  const [deletePublicChat] = useMutation(deletePublicChatMut)

  function addValueToArray(val: string) {
    const arrayPush = AllCheckedVal.concat([val]) as string[]
    setAllCheckedVal(arrayPush)
  }
  function DeleteValueToArray(val: string) {
    const arrayFilter = AllCheckedVal.filter((CheckedVal) => CheckedVal !== val) as string[]
    setAllCheckedVal(arrayFilter)
  }
  return (
    <>
      <Center>
        <Heading>Supprimer une conversation publique</Heading>{" "}
      </Center>
      <Flex alignSelf="center" textAlign="center" direction="column" width="full">
        {chats.length > 0 && (
          <Stack textAlign="left">
            <CheckboxGroup>
              {chats.map((chat) => {
                const parts = chat.participatingUsers.filter((u) => u.id != currentUser?.user?.id)
                return (
                  <Box>
                    <Checkbox
                      isChecked={AllCheckedVal[chat.id as string]}
                      value={chat.id as string}
                      onChange={(e) => {
                        const val = e.target.value as string
                        if (e.target.checked === true) {
                          addValueToArray(val)
                        } else if (e.target.checked === false) {
                          DeleteValueToArray(val)
                        }
                      }}
                    >
                      <PublicChatPreview
                        key={chat.id}
                        chatId={chat.id as string}
                        name={parts}
                        lastMessage={chat.lastMessage!}
                      />
                    </Checkbox>
                  </Box>
                )
              })}
            </CheckboxGroup>
          </Stack>
        )}
        {chats.length === 0 && <Text>Aucun tchat public</Text>}
      </Flex>
      {AllCheckedVal.length > 0 && (
        <Center>
          <Button
            marginRight={"2vw"}
            onClick={async () => {
              if (window.confirm("êtes vous sûr êtes vous de supprimer ces conversion ?")) {
                await deletePublicChat(AllCheckedVal)
              }
              document.location.reload()
            }}
          >
            Supprimer
          </Button>
        </Center>
      )}
    </>
  )
}

export default DeletePublicChat
