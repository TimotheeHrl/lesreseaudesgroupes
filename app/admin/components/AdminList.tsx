import { Avatar, Grid, Flex } from "@chakra-ui/react"
import getAdmin from "app/admin/queries/getAdmin"
import { useParam, useQuery } from "blitz"
import React, { useState } from "react"
import UserModale from "app/utils/UserModale"

import { Text, Box, Link, useDisclosure } from "@chakra-ui/react"
import useOnclickOutside from "react-cool-onclickoutside"
interface IUser {
  userDescription: string
  lien: string
  name: string
  id: string
  avatar: string
  createdAt: Date
  role: string
}
const AdminList = () => {
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
  const ref = useOnclickOutside(() => {})
  let teamId = useParam("teamId", "string")
  if (teamId === undefined) {
    teamId = useParam("feveid", "string")
  }
  const [users] = useQuery(getAdmin, {
    where: { role: "ADMIN" },
  })
  const UsersAvatars = () =>
    users?.map((user) => {
      return (
        <Box key={user.id} ref={ref} margin="3vh">
          <Link
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
            <Box onClick={onOpen}>
              <Avatar marginLeft="1vw" name={user.name as string} src={user.avatar as string} />
              <p style={{ marginLeft: "1vw" }}> {user.name as string} </p>
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
        templateColumns="repeat(2, 1fr)"
        gap={2}
      >
        {UsersAvatars()}
      </Grid>
    </>
  )
}

export default AdminList
