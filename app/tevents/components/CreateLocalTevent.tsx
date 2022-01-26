import {
  Textarea,
  Box,
  Button,
  FormLabel,
  HStack,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Switch,
  Stack,
  Input,
  Tag,
  TagLabel,
  Grid,
  Text,
} from "@chakra-ui/react"
import { Center } from "@chakra-ui/react"
import { Link } from "blitz"
import createtevent from "app/tevents/mutations/createTevent"
import { useMutation, useRouter, useParam, Router } from "blitz"
import Editor from "app/utils/textEditor/editor"
import React, { useEffect, useState, useMemo, useRef } from "react"

import InvitePerLocation from "app/tevents/components/InvitePerLocation"
import DateTime from "app/utils/dateTime"

interface IReactSelect {
  value: string
  label: string
}

const CreateLocalTevent = () => {
  const [isChecked, OnCheked] = useState(true)
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [correctStart, setCorrectStart] = useState<Date>(new Date())
  const [EndDate, setEndDate] = useState<Date>(new Date())
  const teamId = useParam("teamId", "string") as string
  const router = useRouter()
  const [lat, setlatitude] = useState<number>(3)
  const [lon, setlongitude] = useState<number>(3)
  const [selectValue, setSelectValue] = useState({
    value: "selectionInviter",
    label: "selectionner les invités ou inviter tout le monde ?",
  })
  const [content, setContent] = useState<string>("")
  const html = content

  let hheight = "80vh"
  let wwidth = "70vw"

  const quillRef = useRef<any>(null)

  const [descriptionLieu, setDescriptionLieu] = useState<string>("")
  const [subject, setSubject] = useState<string>("")
  const [MaxPart, setMaxPart] = React.useState(0)
  const [InvitedUser, setPartUser] = useState<IReactSelect[]>([
    { value: "users.users[i].id", label: "users.users[i].name" },
  ])
  const [allUserList, setUserList] = useState<IReactSelect[]>([
    { value: "users.users[i].id", label: "users.users[i].name" },
  ])
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
  const [createteventMutation, { isLoading }] = useMutation(createtevent)
  useEffect(() => {
    Router.prefetch(`/teams/${teamId}/tevents`)
  }, [])

  async function post() {
    try {
      const mutation = await createteventMutation({
        data: {
          id: teventid,
          content: content as string,
          teamId: teamId,
          userId: "a",
          subject: subject,
          maxParticipants: MaxPart,
          eventLat: lat,
          eventLon: lon,
          locationDescription: descriptionLieu,
          visible: isChecked,
          startAt: startDate,
          endsAt: EndDate,
          invitedUsers: memoizedInvited,
          visioPres: false,
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
      InvitedToArray.length > 0
    ) {
      post()
    }
  }
  function handleInputSubject(e) {
    let inputValue = e.target.value
    setSubject(inputValue)
  }
  function handleInputDescriptionLieux(e) {
    let inputValue = e.target.value
    setDescriptionLieu(inputValue)
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
            Visibilité de l'événement :
          </Text>
          <Stack mb="2vh" align="center" direction="row">
            <Text fontSize="lg" as="b" color="#319795">
              L'événement sera visible{" "}
            </Text>
            <Switch onChange={() => OnCheked(true)} />
            <h2>L'événement ne sera pas visible</h2>
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
            Visibilité de l'événement :
          </Text>
          <Stack mb="2vh" align="center" direction="row">
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
      <Center>
        <Text mr="2vw" fontSize="xl" as="b" mt="2vh" mb="2vh">
          Création d'un événement local
        </Text>{" "}
      </Center>
      <Center>
        <Text fontSize="lg" mr="2vw" as="b" mt="2vh" mb="2vh">
          Titre
        </Text>
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
        {" "}
        Informations sur le lieu de l'évenement
      </Text>{" "}
      <Center>
        {" "}
        <Textarea
          value={descriptionLieu}
          onChange={handleInputDescriptionLieux}
          placeholder="Informations sur le lieu"
          size="sm"
        />
      </Center>
      <InvitePerLocation
        selectValue={selectValue}
        setSelectValue={setSelectValue}
        setlatitude={setlatitude}
        setlongitude={setlongitude}
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
      <Text fontSize="2vh" as="b" mt="2vh" mb="2vh">
        Description de l'événement :
      </Text>
      <Center mb="5vh" mt="5vh">
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
                `êtes vous sûr d'envoyer cette invitation à vos ${
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

export default CreateLocalTevent
