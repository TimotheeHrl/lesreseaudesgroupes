import { Center, Container, Spinner, useDisclosure, Link, Flex } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Router } from "blitz"
import React, { Suspense, useEffect, useState } from "react"
import { Box, Button, Heading, Avatar } from "@chakra-ui/react"
import UpdateNotification from "app/users/components/updateNotification"
import { useQuery, useMutation, useRouter, useParam } from "blitz"
import getUserPerso from "app/users/queries/getUserPerso"
import MessageToAdmin from "app/users/components/MessageToAdmin"
import DeleteOwnAccount from "app/users/mutations/DeleteOwnAccount"
import UserModale from "app/utils/UserModale"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
interface IUser {
  id: string
  role: string
  userDescription: string
  lien: string
  email: string
  avatar: string
  name: string
  createdAt: Date
}
const UsersPage: BlitzPage = () => {
  const user = useParam("userId", "string")
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modaleUser, setModaleUser] = useState<IUser | any>({
    userDescription: "string",
    lien: "string",
    name: "string",
    id: "string",
    avatar: "string",
    createdAt: new Date("1995-12-17T03:24:00"),
    role: "string",
  })
  const currentUser = useCurrentUser()
  let User = currentUser?.user as IUser
  const [UserQuery] = useQuery(
    getUserPerso,
    { where: { id: user } },
    {
      refetchOnWindowFocus: true,
    }
  )

  const [DeleteOwnAccountMutation] = useMutation(DeleteOwnAccount)

  const username = UserQuery?.name as string
  const useravatar = UserQuery?.avatar as string
  useEffect(() => {
    Router.prefetch("/")
  }, [])
  async function DeleteMyAccount() {
    if (window.confirm("êtes vous sûre de vouloir supprimer votre compte?")) {
      await DeleteOwnAccountMutation({ where: { id: user } })
      router.push("/")
    }
  }
  return (
    <Container maxW="2xl" p={8}>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <>
          <UserModale modaleUser={modaleUser} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
          <Center>
            <Link
              onClick={() => [
                setModaleUser({
                  userDescription: User.userDescription as string,
                  lien: User?.lien as string,
                  name: User?.name as string,
                  id: User?.id as string,
                  avatar: User?.avatar as string,
                  createdAt: User?.createdAt as Date,
                  role: User?.role as string,
                }),
                onOpen(),
              ]}
            >
              <Flex>
                <Heading as="h2" size="2xl" margin={"5vh"}>
                  {username}
                </Heading>
                <Avatar
                  margin={"5vh"}
                  size="2xl"
                  name={currentUser?.user?.name}
                  src={currentUser?.user?.avatar}
                />{" "}
              </Flex>
            </Link>
          </Center>

          <Center>
            <Link href={`/users/${user}/edit`}>
              <Button marginBottom="3vh" colorScheme="blue">
                Modifier mes infos
              </Button>
            </Link>
          </Center>

          <Center>
            <Link href={`/users/${user}/editpicture`}>
              <Button marginBottom="3vh" colorScheme="purple">
                Modifier ma photo
              </Button>
            </Link>
          </Center>

          <Center marginBottom="3vh" colorScheme="blue">
            <MessageToAdmin />
          </Center>

          <Center marginBottom="1vh" colorScheme="blue">
            <UpdateNotification />
          </Center>
        </>
        <Center>
          <Button
            size="md"
            colorScheme="red"
            onClick={async () => {
              DeleteMyAccount()
            }}
          >
            supprimer mon compte
          </Button>
        </Center>
      </Suspense>
    </Container>
  )
}

UsersPage.getLayout = (page) => <Layout title={"utilisateur"}>{page}</Layout>

export default UsersPage
