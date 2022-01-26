import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Text,
  Center,
  Wrap,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
} from "@chakra-ui/react"
import getTeam from "app/teams/queries/getTeam"
import gettevents from "app/tevents/queries/getTevents"
import { Link, usePaginatedQuery, useParam, useQuery } from "blitz"
import React, { useState } from "react"
import Select from "react-select"
import { Tevent } from "db"

const options = [
  { value: "presentiel", label: "En Présentiel" },
  { value: "visio", label: "En Visio-Conférence" },
]

const TeventList = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const teamId = useParam("teamId", "string") as string
  const [{ tevents }] = usePaginatedQuery(
    gettevents,
    {
      orderBy: { updatedAt: "desc" },
      where: {
        teamId: teamId,
      },
    },
    {
      refetchInterval: 4000,
    }
  )

  const [team] = useQuery(getTeam, {
    where: {
      id: teamId,
    },
  })

  const [selectValue, setSelectValue] = useState({ value: "", label: "Type d'événement" })

  const handleChange = (selectValue) => {
    setSelectValue(selectValue)
  }

  if (selectValue.value === "visio") {
    ;<Link href={`/teams/${teamId}/tevent/newvisio`} passHref>
      <Button mr={10} colorScheme="blue" size="sm" onClick={onClose}>
        Continuer
      </Button>
    </Link>
  }

  return (
    <Box>
      <>
        {team.public === false && (
          <Center>
            <Text color="tomato" as="b" fontSize="lg">
              Votre groupe n'est pas encore publiée, vous ne pouvez pas encore créer d'événements
            </Text>
          </Center>
        )}
        {team.public === true && (
          <Center>
            <Button marginTop={"5vh"} as="a" colorScheme="blue" size="lg" onClick={onOpen}>
              Créer un événement
            </Button>
          </Center>
        )}
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Créer un événement</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>En visio ou en présentiel ?</Text>
              <Select options={options} value={selectValue} onChange={handleChange} />
            </ModalBody>
            <ModalFooter>
              <>
                <div>
                  {selectValue.value === "presentiel" ? (
                    <Link href={`/teams/${teamId}/tevents/newpresentiel`} passHref>
                      <Button mr={10} colorScheme="blue" size="sm" onClick={onClose}>
                        Continuer
                      </Button>
                    </Link>
                  ) : (
                    <></>
                  )}{" "}
                </div>
                <div>
                  {selectValue.value === "visio" ? (
                    <Link href={`/teams/${teamId}/tevents/newvisio`} passHref>
                      <Button mr={10} colorScheme="blue" size="sm" onClick={onClose}>
                        Continuer
                      </Button>
                    </Link>
                  ) : (
                    <></>
                  )}{" "}
                </div>
                <Button mr={10} onClick={onClose}>
                  Annuler
                </Button>
              </>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>

      <Center>
        <Link href={`/teams/${teamId}`} passHref key="newTeamButton">
          <Button marginTop={"5vh"} as="a" colorScheme="yellow" size="lg">
            Retour{" "}
          </Button>
        </Link>
      </Center>

      {tevents.length > 0 && (
        <Box
          marginTop={"2vh"}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          bgColor={"white"}
        >
          {tevents.map((tevent) => {
            return (
              <Box padding={"3vh"} key={tevent.id}>
                <Flex>
                  <Avatar
                    size="sm"
                    max={1}
                    name={tevent.user.name as string}
                    src={tevent.user.avatar as string}
                  />
                  <Text marginTop={"1vh"} marginLeft={"1vw"}>
                    {tevent.user.name as string}
                  </Text>
                </Flex>

                <Center>
                  <Text fontSize={"lg"} as="b">
                    {tevent?.subject as string}
                  </Text>
                </Center>
                <Center>
                  <Text fontSize={"md"} as="b">
                    le {tevent?.startAt.toLocaleString("fr", { timeZone: "CET" }) as string}
                  </Text>
                </Center>

                <Center>
                  <Text marginLeft={"1vh"} fontSize={"lg"}>
                    jusqu'à {tevent?.endsAt.toLocaleTimeString()}
                  </Text>
                  <Text marginLeft={"1vh"} marginTop={"1vh"} fontSize={"lg"}>
                    {" "}
                    (le {tevent?.endsAt.toLocaleDateString("fr", { timeZone: "CET" })})
                  </Text>
                </Center>

                <Center>
                  <Flex>
                    <Button marginLeft={"2vh"} marginTop="1vw">
                      <Link href={`/teams/${teamId}/tevents/sldtevent/${tevent.id}`} passHref>
                        Voir
                      </Link>
                    </Button>

                    <Button marginLeft={"2vh"} color={"blue"} marginTop="1vw">
                      <Link href={`/teams/${teamId}/tevents/sldtevent/${tevent.id}/edit`} passHref>
                        Ajouter des infos
                      </Link>
                    </Button>
                  </Flex>
                </Center>
              </Box>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default TeventList
