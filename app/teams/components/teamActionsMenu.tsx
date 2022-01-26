import { Box, Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react"
import deleteTeam from "app/teams/mutations/deleteTeam"
import { Link, useMutation, useParam, useQuery, Router, useRouter } from "blitz"
import React, { FC, useRef } from "react"

const TeamMenu: FC = () => {
  const router = useRouter()
  const teamId = useParam("teamId", "string")

  const [deleteTeamMutation] = useMutation(deleteTeam)
  async function DeleteTeam() {
    if (window.confirm("êtes vous sûre de vouloir supprimer ce groupe ?")) {
      await deleteTeamMutation({ where: { id: teamId } })
      router.push("/teams")
    }
  }

  return (
    <Box>
      <Menu>
        <MenuButton colorScheme="yellow" size="md" p="2vh" as={Button}>
          Actualiser le groupe
        </MenuButton>

        <MenuList fontSize="md">
          <MenuItem>
            <Link href={`/teams/${teamId}/invite`} passHref>
              <Box as="a">Inviter un membre</Box>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href={`/teams/${teamId}/edittag`} passHref>
              <Box as="a">Modifier les mots clefs</Box>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href={`/teams/${teamId}/editcorpus`} passHref>
              <Box as="a">éditer le corpus </Box>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href={`/teams/${teamId}/edit`} passHref>
              <Box as="a" w="100%">
                Modifier les caractéristiques
              </Box>
            </Link>
          </MenuItem>
          <MenuItem>
            <Link href={`/teams/${teamId}/editpicture`} passHref>
              <Box as="a">Modifier la photo</Box>
            </Link>
          </MenuItem>
          <MenuItem
            onClick={async () => {
              DeleteTeam()
            }}
          >
            Supprimer le groupe
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  )
}

export default TeamMenu
