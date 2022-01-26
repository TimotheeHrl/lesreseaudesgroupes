import {
  Avatar,
  Grid,
  Box,
  Text,
  Center,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Link,
} from "@chakra-ui/react"
import UserModale from "app/utils/UserModale"

import checkTeamMembers from "app/teams/queries/checkTeamMembers"
import { useParam, useQuery } from "blitz"
import React, { FC, useState } from "react"
interface IUser {
  userDescription: string
  lien: string
  name: string
  id: string
  avatar: string
  createdAt: Date
  role: string
}
const MembersList: FC = () => {
  let teamId = useParam("teamId", "string")
  if (teamId === undefined) {
    teamId = useParam("feveid", "string")
  }
  const [team] = useQuery(checkTeamMembers, {
    where: { id: teamId },
  }) as any
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modaleUser, setModaleUser] = useState<IUser>({
    userDescription: "string",
    lien: "string",
    name: "string",
    id: "string",
    avatar: "string",
    createdAt: new Date("1995-12-17T03:24:00"),
    role: "string",
  })
  const avatarsNode = () =>
    team.users.map((user) => {
      return (
        <Box key={user.id}>
          <Link margin="3vh">
            <Box
              onClick={() => [
                setModaleUser({
                  userDescription: user.userDescription,
                  lien: user.lien,
                  name: user.name,
                  id: user.id,
                  avatar: user.avatar,
                  createdAt: user.createdAt,
                  role: user.role,
                }),
                onOpen(),
              ]}
            >
              <Avatar
                marginLeft="1vw"
                name={user.name as string}
                size="lg"
                src={user.avatar as string}
              />
              <Center marginLeft="0.5vw">
                <Text marginTop="1vh"> {user.name as string} </Text>
              </Center>
            </Box>
          </Link>
        </Box>
      )
    })

  return (
    <>
      <UserModale modaleUser={modaleUser} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      <Grid
        h="auto"
        marginTop={"2vh"}
        templateRows="repeat(auto, auto)"
        templateColumns={{
          base: "repeat(2, 1fr)",
          md: "repeat(3, 1fr)",
          lg: "repeat(5, 1fr)",
          xl: "repeat(5, 1fr)",
        }}
        gap={3}
      >
        {avatarsNode()}
      </Grid>
    </>
  )
}

export default MembersList
