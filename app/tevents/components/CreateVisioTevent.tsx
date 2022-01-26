import {
  Box,
  Button,
  FormLabel,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  Input,
  Tag,
  TagLabel,
  Grid,
  Text,
  Stack,
} from "@chakra-ui/react"
import InvitePerLocationVisio from "app/tevents/components/InvitePerLocationVisio"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import { Center } from "@chakra-ui/react"
import { Link } from "blitz"
import getUsersLocation from "app/users/queries/getUsersLocation"
import createteventVisio from "app/tevents/mutations/createTeventVisio"
import { useMutation, useRouter, useParam, useQuery, Router } from "blitz"
import getTeam from "app/teams/queries/getTeam"
import Select from "react-select"
import DateTime from "app/utils/dateTime"

import Editor from "app/utils/textEditor/editor"
const { convert } = require("html-to-text")
import React, { useEffect, useState, useMemo, useRef } from "react"

interface IReactSelect {
  value: string
  label: string
}
interface IUser {
  name: string
  avatar: string
  id: string
  userLat: number
  userLon: number
}

const options = [
  { value: "Tous", label: "Tous les utilisateurs" },
  { value: "Selectionner", label: "Sélectionner les invités" },
]
const CreateVisioTevent = () => {
  const teamId = useParam("teamId", "string") as string
  const [isChecked, OnCheked] = useState(true)
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [correctStart, setCorrectStart] = useState<Date>(new Date())
  const [EndDate, setEndDate] = useState<Date>(new Date())
  const [distances, setDistances] = useState<number>(30)
  let UsersList = [] as IReactSelect[]
  const [team] = useQuery(
    getTeam,
    {
      where: { id: teamId },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  const router = useRouter()

  const [selectValue, setSelectValue] = useState({
    value: "selectionner les invités ou inviter tout le monde ?",
    label: "Tous ou selection",
  })
  const [subject, setSubject] = useState<string>("")
  const [linkVisio, setLinkVisio] = useState<string>("")
  const [visioCode, setCodeVisio] = useState<string>("")

  const [MaxPart, setMaxPart] = React.useState(0)
  const [InvitedUser, setPartUser] = useState<IReactSelect[]>([
    { value: "users.users[i].id", label: "users.users[i].name" },
  ])
  const [allUserList, setUserList] = useState<IReactSelect[]>([
    { value: "users.users[i].id", label: "users.users[i].name" },
  ])

  const [content, setContent] = useState<string>("")
  const html = content

  let hheight = "80vh"
  let wwidth = "70vw"
  const quillRef = useRef<any>(null)

  const [users] = useQuery(getUsersLocation, { where: { isPublic: true } })
  const Users = users.users as IUser[]

  const memoizedInvited = useMemo(
    () => InvitedToArray(InvitedUser, allUserList),
    [InvitedUser, allUserList]
  )

  function InvitedToArray(InvitedUser, allUserList) {
    let invited = [] as string[]

    if (selectValue.value === ("Selectionner" as string)) {
      for (let i = 0; i < InvitedUser.length; i++) {
        const EElement = InvitedUser[i]?.value as string
        invited.push(EElement)
      }
    }
    if (selectValue.value === ("Tous" as string)) {
      for (let i = 0; i < allUserList.length; i++) {
        const element = allUserList[i]?.value as string
        invited.push(element)
      }
    }
    return invited
  }

  let teventid = [...Array(10)].map((i) => (~~(Math.random() * 36)).toString(36)).join("")

  const [createteventVisioMutation, { isLoading }] = useMutation(createteventVisio)
  useEffect(() => {
    Router.prefetch(`/teams/${teamId}/tevents`)
  }, [])
  async function post() {
    try {
      const mutation = await createteventVisioMutation({
        data: {
          id: teventid,
          content: content as string,
          teamId: teamId,
          userId: "a",
          subject: subject,
          maxParticipants: MaxPart,
          eventLat: team.teamLatitude as number,
          eventLon: team.teamLongitude as number,
          visible: isChecked,
          startAt: startDate,
          endsAt: EndDate,
          invitedUsers: memoizedInvited,
          visioPres: true,
          linkVisio: linkVisio,
          visioCode: visioCode,
        },
      })
      await mutation
      router.push(`/teams/${teamId}/tevents`)
    } catch (error) {
      console.log(error)
    }
  }
  let ContentstringLength = content.length
  function postCheck() {
    if (ContentstringLength === 8) {
      alert("La description de l'événement est vide")
      if ((selectValue.value as string) === "selectionInviter") {
        alert("Vous devez choisir la modalités de vos invitations")
      }
    }
    if (
      ContentstringLength > 8 &&
      (selectValue.value as string) !== "selectionInviter" &&
      memoizedInvited.length > 0
    ) {
      post()
    }
  }
  function handleInputSubject(e) {
    let inputValue = e.target.value
    setSubject(inputValue)
  }

  function handleInputLinkVisio(e) {
    let inputValue = e.target.value
    setLinkVisio(inputValue)
  }
  function handleInputCodeVisio(e) {
    let inputValue = e.target.value
    setCodeVisio(inputValue)
  }
  let invitedDisplay = allUserList?.map((part) => (
    <div key={part.value}>
      <Tag size={"md"} key={part.value} borderRadius="full" variant="solid" colorScheme="green">
        <TagLabel>{part.label}</TagLabel>
      </Tag>
    </div>
  ))
  const handleMaxPartNumber = (value) => setMaxPart(value)
  function SwitchSelect() {
    if (isChecked === false) {
      return (
        <>
          <Text fontSize="2vh" as="b" mt="2vh" mb="3vh">
            {" "}
            Visibilité de l'événement :
          </Text>
          <Stack align="center" direction="row">
            <Text fontSize="lg" color="#319795" as="b">
              L'événement sera visible{" "}
            </Text>
            <Switch onChange={() => OnCheked(true)} />
            <p>L'événement ne sera pas visible</p>
          </Stack>
          <p>
            Les utilisateurs que vous n'avez pas inviter pourront également voir l'événement sur la
            page de votre groupe et décider d'y participer. Vos invités recevront un email
            d'invitation.
          </p>
        </>
      )
    } else {
      return (
        <>
          <Text fontSize="2vh" as="b" mt="2vh" mb="3vh">
            {" "}
            Visibilité de l'événement :
          </Text>
          <Stack align="center" direction="row">
            <h2>L'événement sera visible</h2>
            <Switch size="lg" onChange={() => OnCheked(false)} />
            <Text fontSize="lg" as="b" color="#319795">
              L'événement ne sera pas visible
            </Text>
          </Stack>
          <p>
            Seule les utilisateur que vous invitez seront mis au courrant de cette événement par un
            l'e-mail d'invitation. Vos invités recevront un email d'invitation.
          </p>

          <p>L'évenement ne sera pas visible sur la page de du groupe.</p>
        </>
      )
    }
  }

  return (
    <>
      {" "}
      <Center>
        <Text mr="2vw" fontSize="xl" as="b" mt="2vh" mb="2vh">
          Création d'un événement distantiel
        </Text>{" "}
      </Center>
      <Center>
        <Text mr="2vw" fontSize="lg" as="b" mt="2vh" mb="2vh">
          Titre
        </Text>{" "}
        <Input
          value={subject}
          onChange={handleInputSubject}
          placeholder="Titre ou sujet de l'événement"
          size="sm"
        />
      </Center>
      <DateTime
        EndDate={EndDate}
        setEndDate={setEndDate}
        startDate={startDate}
        setStartDate={setStartDate}
        setCorrectStart={setCorrectStart}
        correctStart={correctStart}
      />
      <Text fontSize="2vh" as="b" mt="2vh">
        Le lien de la visio :
      </Text>
      <Center>
        {" "}
        <Input
          value={linkVisio}
          onChange={handleInputLinkVisio}
          placeholder="Le lien de la visio"
          size="sm"
        />
      </Center>
      <Text fontSize="2vh" as="b" mt="2vh">
        Le code d'accès (optionnel) :
      </Text>
      <Center>
        {" "}
        <Input
          value={visioCode}
          onChange={handleInputCodeVisio}
          placeholder="Le lien de la visio"
          size="sm"
        />
      </Center>
      <InvitePerLocationVisio
        selectValue={selectValue}
        setSelectValue={setSelectValue}
        setPartUser={setPartUser}
        setUserList={setUserList}
      />
      {selectValue.value === "Tous" && (
        <>
          <Text fontSize="2vh" as="b" mt="2vh" mb="2vh">
            Les invités :
          </Text>
          <Grid mb="2vh" templateRows="repeat(auto, 1fr)" templateColumns="repeat(4, 1fr)" gap={1}>
            {invitedDisplay}
          </Grid>
        </>
      )}
      <Center>
        <Box width={"60vw"}>
          <Text fontSize="2vh" as="b" mt="2vh" mb="2vh">
            Nombre de participants maximum
          </Text>
          <Slider
            flex="1"
            focusThumbOnChange={false}
            value={MaxPart}
            onChange={handleMaxPartNumber}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb fontSize="sm" boxSize="32px" children={MaxPart} />
          </Slider>{" "}
        </Box>{" "}
      </Center>{" "}
      <Center>
        <Text fontSize="2vh" as="b" mt="1vh" mb="1vh">
          Description de l'événement
        </Text>
      </Center>
      <Center mt="5vh" mb="5vh">
        <Editor
          quillRef={quillRef}
          hheight={hheight}
          wwidth={wwidth}
          value={content}
          setValue={setContent}
        />
      </Center>
      <div>{SwitchSelect()}</div>
      <HStack p={4} borderTopWidth={1} spacing={4}>
        <Button
          colorScheme="blue"
          size="lg"
          onClick={() => {
            if (
              window.confirm(
                `êtes vous sûr d'envoyer cette invitation à ces ${
                  memoizedInvited.length as number
                } invités ?`
              )
            ) {
              postCheck()
            }
          }}
          isLoading={isLoading}
        >
          {"Créer"}
        </Button>
        <Link href={`/teams/${teamId}/tevents`}>
          <Button size="lg" isLoading={isLoading} variant="link">
            Retour{" "}
          </Button>
        </Link>
      </HStack>
    </>
  )
}

export default CreateVisioTevent
