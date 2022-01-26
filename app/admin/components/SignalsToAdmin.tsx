import {
  Avatar,
  AvatarGroup,
  Box,
  Grid,
  Heading,
  Text,
  VStack,
  Center,
  Image,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react"
import { Chat } from "prisma"
import tagsComponent from "app/teams/components/tagsComponent"
import getTeams from "app/teams/queries/getTeams"
import { usePaginatedQuery, useMutation } from "blitz"
import React from "react"
import publishTeamAdmin from "app/admin/mutations/publishAdmin"
import { useRouter } from "next/router"
import getPublicTeam from "app/publicMap/queries/getPublicTeam"
import { useQuery, Link } from "blitz"
import { FormEvent, useState } from "react"
import crypto from "crypto"
import "mapbox-gl/dist/mapbox-gl.css"
import { Team, User } from "prisma"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import {
  FormControl,
  FormLabel,
  Button,
  Textarea,
  FormHelperText,
  HStack,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Switch,
  Stack,
  Flex,
} from "@chakra-ui/react"
import CheckIcon from "@chakra-ui/icon"
import updateTpost from "app/admin/mutations/treatSignal"
import getSignals from "app/admin/queries/getSignals"
import { SignalAdmin } from "prisma"

const SignalsToAdmin = () => {
  const currentUser = useCurrentUser()
  const router = useRouter()
  const [SignalId, setSignalId] = useState<string | undefined>(undefined)
  const [userSignals] = useQuery(getSignals, {
    orderBy: { createdAt: "desc" },
    where: {
      isTreated: false,
    },
  }) as SignalAdmin

  const [updateTpostMutation, { isLoading, isError }] = useMutation(updateTpost)
  if (SignalId !== undefined) {
    setInterval(function () {
      TreatSignalFunction()
    }, 1000)
  }
  async function TreatSignalFunction() {
    try {
      await updateTpostMutation({
        where: { id: SignalId as string },
        data: {
          isTreated: true,
        },
      })
      document.location.reload()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Text as="b" fontSize="lg">
        {userSignals.length} messages :
      </Text>
      <Accordion allowToggle>
        <>
          {userSignals.map((userSignal) => (
            <AccordionItem key={userSignal.id}>
              <h2>
                <AccordionButton>
                  <Box width={"50vw"}>
                    {" "}
                    <Flex>
                      <Avatar
                        key={userSignal.userSending.id}
                        name={userSignal.userSending.name}
                        src={userSignal.userSending.avatar as string}
                      />
                      <Box marginLeft="1vw" marginTop="1vh" textAlign="left">
                        {userSignal.userSending.name}
                      </Box>
                      <Box marginTop="1vh" marginLeft="5vw" fontSize="lg" as="b">
                        {userSignal.subject}
                      </Box>
                    </Flex>
                    <Box marginTop="1vh" fontSize="lg">
                      {userSignal.createdAt.toLocaleString("fr", { timeZone: "CET" })}
                    </Box>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Box>{userSignal.content}</Box>
                <Flex>
                  <>
                    <Button marginRight="3vw" onClick={() => setSignalId(userSignal.id as string)}>
                      C'est régler
                    </Button>
                  </>
                  <Link href={`chats/${userSignal.chatId}`}>
                    <Button marginLeft="3vw">Répondre</Button>
                  </Link>
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </>
      </Accordion>
    </>
  )
}

export default SignalsToAdmin
