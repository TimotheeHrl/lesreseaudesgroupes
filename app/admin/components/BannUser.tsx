import {
  Button,
  Heading,
  Text,
  Center,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react"
import { invoke, useMutation, useQuery, useRouter } from "blitz"
import getUsersNotAdmin from "app/admin/queries/getUsersNotAdmin"
import React, { useState } from "react"
import Select from "react-select"
import { User, Tpost } from "prisma"
import getBannedUsers from "app/admin/queries/getBannedUsers"
import Bann from "app/admin/mutations/Bann"
interface IOptions {
  value: string
  label: string
}
interface Banned {
  id: string
  ip: string
  name: string
  createdAt: Date
  email: string
}
const BannUser = () => {
  const [selectedUserName, setselectedUserName] = useState("")
  const [selectedUserId, setselectedUserId] = useState("")
  const [BannMutation] = useMutation(Bann)
  const [NonAdminArray] = useQuery(getUsersNotAdmin, {
    where: { role: "VERIF" },
  }) as IOptions[]
  const [bann] = useQuery(getBannedUsers, {
    where: { role: "BANNED" },
  }) as any

  function handleSelectChange(inputValue: IOptions) {
    setselectedUserName(inputValue.label)
    setselectedUserId(inputValue.value)
  }

  async function bannusermutation() {
    if (window.confirm("êtes vous sûr êtes vous de Bannir cet utilisateur ?")) {
      await BannMutation({ where: { id: selectedUserId } })
    }
    document.location.reload()
  }
  return (
    <>
      <Center>
        <Heading>Bannir un utilisateur</Heading>{" "}
      </Center>

      <Select options={NonAdminArray!} onChange={handleSelectChange} />
      <>
        <>
          {selectedUserId?.length > 4 && (
            <>
              <Center>
                {" "}
                <Text> Bannir {selectedUserName} ?</Text>
              </Center>
              <Center>
                {" "}
                <Text>Ces données publics seront effacées </Text>
              </Center>
              <Center>
                {" "}
                <Button marginRight={"2vw"} onClick={bannusermutation}>
                  {" "}
                  Bannir
                </Button>
              </Center>
            </>
          )}
        </>
        <>
          <Center mt="3vh" mb="3vh">
            <Text as="b" size="lg">
              Utilisateurs bannis
            </Text>
          </Center>
          <Accordion allowMultiple minWidth={"50vh"}>
            {bann?.map((bannusr: Banned) => (
              <AccordionItem>
                <AccordionButton
                  _expanded={{ bg: "#F4FAFF", color: "black" }}
                  style={{ borderStyle: "groove" }}
                >
                  {" "}
                  <Center>
                    nom: {bannusr?.name}, email: {bannusr?.email}
                  </Center>{" "}
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <Text>ip : {bannusr?.ip} </Text>
                  <Text>
                    créé le : {bannusr.createdAt.toLocaleString("fr", { timeZone: "CET" })}
                  </Text>
                  <Text>id : {bannusr?.id} </Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      </>
    </>
  )
}

export default BannUser
