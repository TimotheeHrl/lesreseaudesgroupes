import { useMutation, useParam } from "blitz"
import { FormEvent, useState } from "react"
import "mapbox-gl/dist/mapbox-gl.css"

import {
  FormControl,
  FormLabel,
  Button,
  Textarea,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
} from "@chakra-ui/react"
import createAdminSignal from "app/users/mutations/createAdminSignal"
function MessageToAdmin() {
  const userId = useParam("userId", "string") as string

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ChatAdminId, setChatAdminId] = useState<string | undefined>(undefined)

  const [MessageValue, setMessageValue] = useState<string>("")
  const [Subject, setSubject] = useState<string>("")

  function handleChange(e) {
    setMessageValue(e.target.value)
  }
  function handleSubjectChange(e) {
    setSubject(e.target.value)
  }

  const [createAdminSignalMutation, { isLoading }] = useMutation(createAdminSignal)

  const MessageTeamFunction = async (event: FormEvent<HTMLFormElement>) => {
    try {
      const signalAdmin = await createAdminSignalMutation({
        data: {
          userId: userId,
          content: MessageValue,
          chatId: "ee",
          subject: Subject,
        },
      })
      await signalAdmin
      setChatAdminId(signalAdmin)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalContent>
            <ModalHeader>Signaler un problème</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <form
                id={"MessageTeam"}
                onSubmit={(event) => {
                  event.preventDefault()
                  MessageTeamFunction(event)
                }}
              >
                <FormControl>
                  <FormLabel>Sujet</FormLabel>
                  <Input
                    size={"md"}
                    placeholder="le sujet de votre message"
                    value={Subject}
                    onChange={handleSubjectChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Votre message</FormLabel>
                  <Textarea
                    size={"md"}
                    placeholder="écrivez votre message"
                    value={MessageValue}
                    onChange={handleChange}
                  />
                </FormControl>
              </form>
            </ModalBody>

            <ModalFooter>
              <>
                <Button
                  mr={10}
                  colorScheme="blue"
                  type="submit"
                  isLoading={isLoading}
                  size="sm"
                  form="MessageTeam"
                  onClick={onClose}
                >
                  Envoyer
                </Button>
                <Button colorScheme="red" mr={10} onClick={onClose}>
                  Annuler
                </Button>
              </>
            </ModalFooter>
          </ModalContent>
        </Modal>
        {ChatAdminId !== undefined ? (
          <>
            <Text>Votre message a été envoyé</Text>
          </>
        ) : (
          <Button onClick={onOpen}>Signaler un problème</Button>
        )}
      </>
    </>
  )
}
export default MessageToAdmin
