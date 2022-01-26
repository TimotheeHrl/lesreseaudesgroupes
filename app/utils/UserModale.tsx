import {
  Text,
  Avatar,
  Center,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Link,
  Image,
} from "@chakra-ui/react"
const UserModale = (props: {
  modaleUser: {
    userDescription: string
    lien: string
    name: string
    id: string
    avatar: string
    createdAt: Date
    role: string
  }
  onOpen: () => void
  onClose: () => void
  isOpen: boolean
}) => {
  let {
    modaleUser: { userDescription, lien, name, id, avatar, createdAt, role },
    onOpen,
    onClose,
    isOpen,
  } = props

  return (
    <>
      <Modal size="lg" onClose={onClose} isOpen={isOpen}>
        <ModalContent>
          <Center>
            <ModalHeader>{name}</ModalHeader>
          </Center>
          <Center>
            <Image name={name as string} src={avatar as string} />
          </Center>
          <ModalCloseButton />
          <ModalBody>
            <Text a="i" color="grey" marginTop="1vh">
              Membre depuis : {createdAt.toLocaleDateString("fr", { timeZone: "CET" })}
            </Text>
            <Text a="b" color="grey" marginTop="1vh">
              Page personelle :
            </Text>
            {(lien.length as number) > 0 && (
              <a href={lien} target="_blank" rel="noopener noreferrer">
                {lien}
              </a>
            )}
            <Text a="b" color="grey" marginTop="1vh">
              En quelques mots :
            </Text>
            {(userDescription.length as number) > 0 && (
              <Text href={userDescription}>{userDescription}</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
export default UserModale
