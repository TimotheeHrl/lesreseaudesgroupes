import {
  Avatar,
  GridItem,
  Grid,
  Button,
  Flex,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Center,
  Text,
} from "@chakra-ui/react"
import useOnclickOutside from "react-cool-onclickoutside"

import getTEventPublic from "app/tevents/queries/getTEventPublic"
import { Link, usePaginatedQuery, useParam } from "blitz"
import React from "react"
import * as dayjs from "dayjs"
import * as isLeapYear from "dayjs/plugin/isLeapYear" // import plugin
import "dayjs/locale/fr" // import locale
dayjs.locale("fr") // use locale globally
interface ITeamEvent {
  id: string
  creator: string
  creatorAvatar: string
  subject: string
  startTime: Date
  EndTime: Date
}
const EventListPublic = () => {
  const teamId = useParam("feveid", "string") as string
  const [{ tevents }] = usePaginatedQuery(
    getTEventPublic,
    {
      orderBy: { startAt: "desc" },
      where: {
        teamId: teamId,
      },
    },
    {
      refetchInterval: 4000,
    }
  )
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box>
      <>
        {tevents.length > 0 && (
          <Text as="i" fontSize="5vh" color="gray.600">
            Les événements
          </Text>
        )}
      </>
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
              <>
                <Box key={tevent?.id} padding={"3vh"} minWidth="50vw">
                  <Flex>
                    <Box margin="3vh">
                      <Modal isOpen={isOpen} onClose={onClose}>
                        <ModalContent>
                          <Center>
                            <ModalHeader>{tevent.user?.name}</ModalHeader>
                          </Center>
                          <Center>
                            <Avatar
                              name={tevent.user?.name as string}
                              src={tevent.user.avatar as string}
                              size="xl"
                            />
                          </Center>
                          <ModalCloseButton />
                          <ModalBody>
                            <Text a="i" color="grey" marginTop="1vh">
                              {tevent.user.createdAt.toLocaleDateString("fr", { timeZone: "CET" })}
                            </Text>{" "}
                            <Text a="b" color="grey" marginTop="1vh">
                              Page personelle :
                            </Text>
                            {(tevent.user?.lien.length as number) > 0 && (
                              <a href={tevent.user?.lien} target="_blank" rel="noopener noreferrer">
                                {tevent.user?.lien}
                              </a>
                            )}
                            <Text a="b" color="grey" marginTop="1vh">
                              En quelques mots :
                            </Text>
                            {(tevent.user?.userDescription.length as number) > 0 && (
                              <Link href={tevent.user?.userDescription}>
                                <a>{tevent.user?.userDescription}</a>
                              </Link>
                            )}
                          </ModalBody>
                        </ModalContent>
                      </Modal>
                    </Box>
                    <Box onClick={onOpen}>
                      <Avatar
                        marginLeft="1vw"
                        name={tevent.user.name as string}
                        src={tevent.user.avatar as string}
                      />
                      <p style={{ marginLeft: "1vw" }}> {tevent.user.name as string} </p>
                    </Box>
                  </Flex>

                  <Center>
                    <Text fontSize={"xl"}>{tevent?.subject as string}</Text>
                  </Center>
                  <Center>
                    <Text fontSize={"2vh"}>
                      début :{tevent?.startAt.toLocaleString("fr", { timeZone: "CET" }) as string}
                    </Text>
                  </Center>

                  <Center>
                    <Text fontSize={"2vh"}>
                      fin : {tevent?.endsAt.toLocaleString("fr", { timeZone: "CET" })}
                    </Text>
                  </Center>
                  <Link href={`/collectifs/${teamId}/publicevent/${tevent.id}`} passHref>
                    <Center>
                      <Flex>
                        <Button marginLeft={"2vh"} colorScheme="blue" size="lg" marginTop="1vw">
                          Voir
                        </Button>
                      </Flex>
                    </Center>
                  </Link>
                  {tevents?.length > 1 && (
                    <Grid marginBottom="2vh" templateColumns="repeat(1, 1fr)">
                      <Center>
                        <GridItem w="50vw" mb="2vh" mt="2vh" colSpan={1} h="1px" bg="gray.600" />
                      </Center>
                    </Grid>
                  )}
                </Box>
              </>
            )
          })}
        </Box>
      )}
    </Box>
  )
}

export default EventListPublic
