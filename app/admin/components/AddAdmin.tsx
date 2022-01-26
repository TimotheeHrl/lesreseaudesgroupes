import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  Stack,
  Center,
  Heading,
} from "@chakra-ui/react"
import { User } from "prisma"
import { invoke, useMutation, useQuery, useRouter } from "blitz"
import getUsersNotAdmin from "app/admin/queries/getUsersNotAdmin"
import React, { useState } from "react"
import Select from "react-select"
import NewAdmin from "app/admin/mutations/NewAdmin"
interface IOptions {
  value: string
  label: string
}

const AddAdmin = () => {
  const [selectedUserName, setselectedUserName] = useState("")
  const [selectedUserId, setselectedUserId] = useState("")

  const [NewAdminMutation] = useMutation(NewAdmin)
  const [NonAdminArray] = useQuery(getUsersNotAdmin, {
    where: { role: "VERIF" },
  }) as any

  function handleSelectChange(inputValue: IOptions) {
    setselectedUserName(inputValue.label)
    setselectedUserId(inputValue.value)
  }

  return (
    <>
      <Center>
        <Heading>Ajouter un nouvel admin</Heading>{" "}
      </Center>

      <Select options={NonAdminArray! as IOptions[]} onChange={handleSelectChange} />

      {selectedUserId?.length > 4 && (
        <>
          <Center>
            {" "}
            <Text>êtes vous sur ajouter {selectedUserName} en tant qu'administrateur ?</Text>
          </Center>
          <Center>
            {" "}
            <Button
              marginRight={"2vw"}
              onClick={async () => {
                if (window.confirm("êtes vous sûre d'ajouter cet utilisateur en tant qu'admin ?")) {
                  await NewAdminMutation({ where: { id: selectedUserId } })
                }
                document.location.reload()
              }}
            >
              {" "}
              Ajouter
            </Button>
          </Center>
        </>
      )}
    </>
  )
}

export default AddAdmin
