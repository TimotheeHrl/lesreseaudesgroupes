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
  Switch,
  Stack,
  Text,
  Center,
} from "@chakra-ui/react"
import InviteUser from "app/teams/mutations/inviteMember"
import getTeam from "app/teams/queries/getTeam"
import getUser from "app/users/queries/getUser"
import { invoke, useMutation, useParam, useQuery, Router, useRouter } from "blitz"
import { Prisma, Team, User, Tag } from "db"
import MembersList from "app/teams/components/MembersList"
import React, { useEffect, FormEvent, useState, useMemo } from "react"
import Select from "react-select"
import DeleteMember from "app/teams/mutations/deleteMember"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import AddNewTeamAdmin from "app/teams/mutations/addTeamAdmin"
import createUserFromTeam from "app/auth/mutations/createUserFromTeam"

interface IOptions {
  value: string
  label: string
}

const ManageUsers = () => {
  const [selectedUserName, setselectedUserName] = useState("")
  const [selectedUserId, setselectedUserId] = useState("")

  const [InviteUserMail, setInviteUserMail] = useState("")
  const [InviteModal, setInviteModal] = useState(false)
  const [NewUserExit, setNewUserExit] = useState(false)
  const [newUserId, setNewUserId] = useState("")
  const [isChecked, OnCheked] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const currentUser = useCurrentUser()
  let CurUserId = currentUser?.user?.id as string
  const router = useRouter()
  function refreshPage() {
    setTimeout(() => {
      document.location.reload()
    }, 1000)
  }
  const teamId = useParam("teamId", "string")
  const [team] = useQuery(
    getTeam,
    {
      where: { id: teamId },
    },
    {
      staleTime: 5000,
      cacheTime: 5000,
      refetchOnWindowFocus: true,
    }
  )
  const [InviteMemberMutation, { isLoading, isError }] = useMutation(InviteUser)
  const [DeleteMemberMutation] = useMutation(DeleteMember)
  const [AddNewTeamAdminMutation] = useMutation(AddNewTeamAdmin)
  const [createUserFromTeamMutation] = useMutation(createUserFromTeam)

  const teamIdString: String = team.id

  useEffect(() => {
    Router.prefetch(`/teams/${teamId}`)
  }, [])
  let teamMemberLengh = team.TeamMemberId.length as number
  const teamMemberIds = team.TeamMemberId

  let MembersMemo = useMemo(() => MakeArrayOfUser(teamMemberIds), [teamMemberIds])
  function MakeArrayOfUser(teamMemberIds) {
    let arrayOfMemberId = [] as string[]

    for (let i = 0; i < teamMemberLengh; i++) {
      const teamMemberId = teamMemberIds[i] as string
      arrayOfMemberId.push(teamMemberId)
    }
    return arrayOfMemberId
  }
  const handleInviteClick = async (event: FormEvent<HTMLFormElement>) => {
    const userEmail = event.target[0].value.toLowerCase()
    setInviteUserMail(userEmail)
    const user = await invoke(getUser, { where: { email: userEmail } })
    setTimeout(() => {
      setInviteModal(true)
    }, 500)
    setTimeout(() => {
      let newUserId = user?.id
      if (newUserId !== undefined) {
        setNewUserExit(true)
        setNewUserId(newUserId as string)
      }
    }, 200)
  }

  function CloseInviteModale() {
    setNewUserExit(false)
    setNewUserId("")
    setInviteUserMail("")
    setInviteModal(false)
  }
  const CreateUserAndInvite = async (event: FormEvent<HTMLFormElement>) => {
    const createUser = await createUserFromTeamMutation({
      data: {
        userLat: 1,
        userLon: 1,
        name: "data",
        hashedPassword: "temps",
        email: InviteUserMail,
        getNotifications: true,
      },
    })
    const UserCreated = await createUser
    let NewArray = MembersMemo
    const NewNewUserId = (await UserCreated) as string
    const NewUserId = typeof NewNewUserId
    NewArray.push(NewNewUserId as string)
    if (NewUserId === "string") {
      try {
        await InviteMemberMutation({
          where: { id: team.id },
          data: {
            TeamMemberId: NewArray,
            users: { id: NewNewUserId } as Prisma.UserUpdateManyWithoutTeamsInput,
          },
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
  const InviteMember = async (event: FormEvent<HTMLFormElement>) => {
    const ArrayPreview = MembersMemo
    ArrayPreview.push(newUserId)
    try {
      const invite = (await InviteMemberMutation({
        where: { id: team.id },
        data: {
          TeamMemberId: MembersMemo,
          users: { id: newUserId } as Prisma.UserUpdateManyWithoutTeamsInput,
        },
      })) as Team
      if (typeof invite.id === "string") {
        refreshPage()
      }
    } catch (error) {
      console.log(error)
    }
  }
  let teamMasterLengh = team.TeamMastersID.length as number
  const teamMasterIds = team.TeamMemberId

  let MastersMemo = useMemo(() => MakeArrayOfMasters(teamMasterIds), [teamMasterIds])
  function MakeArrayOfMasters(teamMasterIds) {
    let arrayOfMasterId = [] as string[]

    for (let i = 0; i < teamMasterLengh; i++) {
      const teamMasterId = teamMasterIds[i] as string

      arrayOfMasterId.push(teamMasterId)
    }
    return arrayOfMasterId
  }

  async function handleNewAdmin() {
    MastersMemo.push(selectedUserId)
    try {
      ;(await AddNewTeamAdminMutation({
        where: { id: team.id },
        data: {
          TeamMastersID: MastersMemo,
        },
      })) as Team
      refreshPage()
    } catch (error) {
      console.log(error)
    }
  }
  async function handleDelete() {
    for (let i = 0; i < MembersMemo.length; i++) {
      if (MembersMemo[i] === selectedUserId) {
        MembersMemo.splice(i, 1)
      }
    }
    for (let i = 0; i < MastersMemo.length; i++) {
      if (MastersMemo[i] === selectedUserId) {
        MastersMemo.splice(i, 1)
      }
    }
    try {
      ;(await DeleteMemberMutation({
        where: { id: team.id },
        data: {
          TeamMemberId: MembersMemo,
          TeamMastersID: MastersMemo,
          users: { id: selectedUserId } as Prisma.UserUpdateManyWithoutTeamsInput,
        },
      })) as Team & { users: User[]; tags: Tag[] }
      refreshPage()
    } catch (error) {
      console.log(error)
    }
  }

  const handleSelectDelete = (inputValue: IOptions) => {
    setselectedUserName(inputValue.label)
    setselectedUserId(inputValue.value)
  }
  let arrayOfMember = [] as any[]
  let members = team.users
  if (members != null) {
    for (let i = 0; i < members.length; i++) {
      const element = { value: members[i]?.id, label: members[i]?.name } as IOptions
      arrayOfMember.push(element)
    }
  }

  function SwitchSelect() {
    if (isChecked === false) {
      return (
        <Stack align="center" direction="row">
          <Text fontSize="lg" as="b" color="#319795">
            Ajouter un gestionnaire du groupe{" "}
          </Text>
          <Switch onChange={() => OnCheked(true)} />
          <h2>supprimer un membre</h2>
        </Stack>
      )
    } else {
      return (
        <>
          <Stack align="center" direction="row">
            <h2>Ajouter un gestionnaire du groupe</h2>
            <Switch size="lg" onChange={() => OnCheked(false)} />
            <Text fontSize="lg" as="b" color="#319795">
              Supprimer un membre
            </Text>
          </Stack>
        </>
      )
    }
  }

  function ModalInvite() {
    const even = (teamElement) => teamElement === newUserId
    const Matched: boolean = MembersMemo.some(even)
    if (InviteModal === true && Matched === false) {
      return (
        <>
          <Modal isOpen={InviteModal} onClose={CloseInviteModale}>
            <ModalContent>
              <ModalHeader>Ajouter un nouveau membre</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {NewUserExit !== false ? (
                  <h1>Cette personne ({InviteUserMail}) existe bien sur la plateforme.</h1>
                ) : (
                  <h1>
                    Aucune personne avec l'email {InviteUserMail} n'existe pas sur la plateforme.
                    Voulez vous l'invitez quand même ? (un compte sera créer et un email
                    d'invitation lui sera envoyé)
                  </h1>
                )}
              </ModalBody>

              <ModalFooter>
                <>
                  {NewUserExit !== false ? (
                    <>
                      <form
                        onSubmit={(event) => {
                          event.preventDefault()
                          InviteMember(event)
                        }}
                      >
                        <Button type="submit" onClick={refreshPage} variant="ghost" mr={10}>
                          Invitez
                        </Button>
                      </form>
                    </>
                  ) : (
                    <>
                      <form
                        onSubmit={(event) => {
                          event.preventDefault()

                          CreateUserAndInvite(event)
                        }}
                      >
                        <Button onClick={refreshPage} type="submit" variant="ghost" mr={10}>
                          Inviter quand même
                        </Button>
                      </form>
                    </>
                  )}

                  <Button colorScheme="blue" mr={10} onClick={CloseInviteModale}>
                    Annuler
                  </Button>
                </>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Button onClick={onOpen}>Supprimer?</Button>
        </>
      )
    }
    if (InviteModal === true && Matched === true) {
      return (
        <>
          <Modal isOpen={InviteModal} onClose={CloseInviteModale}>
            <ModalContent>
              <ModalHeader>Ajouter un nouveau membre</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <h1>Cette personne ({InviteUserMail}) est déjà membre du groupe.</h1>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={10} onClick={CloseInviteModale}>
                  Annuler
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Button onClick={onOpen}>Supprimer?</Button>
        </>
      )
    }
  }

  function DeleteOrAdminModale() {
    if (selectedUserName !== "" && isChecked === true && CurUserId !== selectedUserId) {
      return (
        <>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              <ModalHeader>Supprimer?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <h1>être vous sûre de supprimer {selectedUserName} du groupe?</h1>
              </ModalBody>

              <ModalFooter>
                <>
                  <Button variant="ghost" mr={10} onClick={() => handleDelete()}>
                    Supprimer le membre
                  </Button>
                  <Button colorScheme="blue" mr={10} onClick={onClose}>
                    Annuler
                  </Button>
                </>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Button onClick={onOpen}>Supprimer ?</Button>
        </>
      )
    }
    if (selectedUserName !== "" && isChecked === true && CurUserId === selectedUserId) {
      return (
        <>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              <ModalHeader>Supprimer?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <h1>être vous sûre de supprimer {selectedUserName} du groupe?</h1>
              </ModalBody>

              <ModalFooter>
                <>
                  <Button colorScheme="blue" mr={10} onClick={onClose}>
                    Vous ne pouvez pas vous supprimez vous même
                  </Button>
                </>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Button onClick={onOpen}>Supprimer ?</Button>
        </>
      )
    }
    if (selectedUserName !== "" && isChecked === true && CurUserId === selectedUserId) {
      return (
        <>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              <ModalHeader>Supprimer?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <h1>être vous sûre de supprimer {selectedUserName} du groupe?</h1>
              </ModalBody>

              <ModalFooter>
                <>
                  <Button colorScheme="blue" mr={10} onClick={onClose}>
                    Vous ne pouvez pas vous supprimez vous même
                  </Button>
                </>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Button onClick={onOpen}>Supprimer ?</Button>
        </>
      )
    }
    if (selectedUserName !== "" && isChecked === false && CurUserId !== selectedUserId) {
      return (
        <>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              <ModalHeader>Ajouter Admin?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <h1>
                  être vous sûre de vouloir ajouter {selectedUserName} en tant que gestionnaire de
                  la page du groupe?
                </h1>
              </ModalBody>

              <ModalFooter>
                {CurUserId === selectedUserId ? (
                  <Button colorScheme="blue" mr={10} onClick={onClose}>
                    Vous ête déjà admin de ce groupe
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" mr={10} onClick={() => handleNewAdmin()}>
                      Ajouter
                    </Button>
                    <Button colorScheme="blue" mr={10} onClick={onClose}>
                      Annuler
                    </Button>
                  </>
                )}
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Button onClick={onOpen}>Ajouter ?</Button>
        </>
      )
    }
    if (selectedUserName !== "" && isChecked === false && CurUserId === selectedUserId) {
      return (
        <>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              <ModalHeader>Ajouter Admin?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <h1>
                  être vous sûre de vouloir ajouter {selectedUserName} en tant que gestionnaire de
                  la page de ce groupe?
                </h1>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={10} onClick={onClose}>
                  Vous ête déjà admin de ce groupe
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Button onClick={onOpen}>Ajouter ?</Button>
        </>
      )
    }
  }

  return (
    <>
      {team.TeamMemberId.length > 0 && (
        <>
          <Text as="b">Les membres de votre groupe</Text>
          <MembersList />
        </>
      )}
      <div>{ModalInvite()}</div>
      <form
        id="invite-users-form"
        onSubmit={(event) => {
          event.preventDefault()
          handleInviteClick(event)
        }}
      >
        <FormControl id="email" isRequired>
          <FormLabel>Entrer l'email d'un nouveau membre</FormLabel>
          <Input placeholder="john@doe.com" type="email" />
          <HStack spacing={4} w="100%">
            <Center>
              <Button
                marginTop="2vh"
                colorScheme="blue"
                type="submit"
                isLoading={isLoading}
                size="md"
                form="invite-users-form"
              >
                Inviter
              </Button>
            </Center>
          </HStack>
        </FormControl>
      </form>
      <div>{SwitchSelect()}</div>
      <Select options={arrayOfMember} onChange={handleSelectDelete} />

      <div>{DeleteOrAdminModale()}</div>
    </>
  )
}

export default ManageUsers
