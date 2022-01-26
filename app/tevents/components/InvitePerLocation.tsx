import React, { useEffect, useMemo, useState } from "react"
import {
  Button,
  Box,
  Flex,
  Stack,
  FormLabel,
  Center,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Container,
} from "@chakra-ui/react"
import { useQuery } from "blitz"
import MapInput from "app/utils/mapInput/mapInput"
import getUsersLocation from "app/users/queries/getUsersLocation"
import Select from "react-select"

interface IReactSelect {
  value: string
  label: string
}

interface IInvitePerLocation {
  setlatitude: any
  setlongitude: any
  setPartUser: any
  setUserList: any
  setSelectValue: any
  selectValue: IReactSelect
}

const options = [
  { value: "Tous", label: "Tous les utilisateurs" },
  { value: "Selectionner", label: "Sélectionner les invités" },
]

function InvitePerLocation(props: IInvitePerLocation) {
  let { selectValue, setSelectValue, setlatitude, setlongitude, setPartUser, setUserList } = props
  const [EventLat, setLat] = useState<number>(3)
  const [EventLon, setLon] = useState<number>(3)
  const [distances, setDistances] = useState<number>(30)

  const [users] = useQuery(getUsersLocation, {
    where: {
      OR: [
        { role: "VERIF", getNotifications: true },
        { role: "ADMIN", getNotifications: true },
      ],
    },
  })

  const memoizedusersLocalArray = useMemo(
    () => usersLocalArray(users, EventLat, EventLon, distances),
    [users, EventLat, EventLon, distances]
  )

  function usersLocalArray(users, EventLat, EventLon, distances) {
    let UsersList = [] as IReactSelect[]
    for (let i = 0; i < users.users.length; i++) {
      let lat1 = users.users[i]?.userLat as number
      let lon1 = users.users[i]?.userLon as number
      var R = 6371 // Radius of the earth in km
      var dLat = deg2rad(EventLat - lat1) // deg2rad below
      var dLon = deg2rad(EventLon - lon1)
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(EventLat)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      var d = R * c // Distance in km
      if (d < distances) {
        const element = {
          value: users.users[i]?.id as string,
          label: users.users[i]?.name as string,
        }
        UsersList.push(element)
      }
    }
    function deg2rad(deg) {
      return deg * (Math.PI / 180)
    }
    return UsersList
  }
  useEffect(() => {
    setlongitude(EventLon)
    setlatitude(EventLat)
    setUserList(memoizedusersLocalArray)
  }, [EventLon, EventLat, memoizedusersLocalArray, setPartUser])
  return (
    <Stack>
      <Text fontSize="2vh" as="b" mt="1vh" mb="1vh">
        Précisez le lieu de l'événement
      </Text>

      <MapInput setlat={setLat} setlon={setLon} />

      <Text fontSize="2vh" as="b" mt="1vh" mb="1vh">
        Choisir une modalité d'invitation :
      </Text>
      <Select options={options} value={selectValue} onChange={setSelectValue} />

      {selectValue.value === "Tous" && (
        <>
          <Center>
            <Text fontSize="md" mt="1vh">
              Inviter les utilisateurs dans un rayon de
              <span style={{ color: "red" }}> {distances} km </span> autour de la locasation de
              votre groupe
            </Text>
          </Center>{" "}
          <Center>
            <Slider
              defaultValue={60}
              min={30}
              max={1000}
              step={30}
              value={distances}
              onChange={setDistances}
              width="50vw"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb fontSize="sm" boxSize="32px" children={distances} />
            </Slider>
          </Center>
        </>
      )}

      {selectValue.value === "Selectionner" && (
        <>
          <Center>
            <Text fontSize="md" mt="1vh">
              Inviter les utilisateurs dans un rayon de
              <span style={{ color: "red" }}> {distances} km </span> autour de la locasation de
              votre groupe
            </Text>
          </Center>{" "}
          <Center>
            <Slider
              defaultValue={60}
              min={30}
              max={1000}
              step={30}
              value={distances}
              onChange={setDistances}
              width="50vw"
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb fontSize="sm" boxSize="32px" children={distances} />
            </Slider>
          </Center>
          <Text fontSize="md" as="b" mt="1vh">
            Selectionner les invités :
          </Text>
          <Select
            closeMenuOnSelect={false}
            isMulti
            options={memoizedusersLocalArray}
            onChange={setPartUser}
          />
        </>
      )}
    </Stack>
  )
}

export default InvitePerLocation
