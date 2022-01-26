import React, { useEffect, useState, useMemo } from "react"
import {
  Box,
  Stack,
  FormLabel,
  Center,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react"
import { useQuery, useParam } from "blitz"
import getUsersLocation from "app/users/queries/getUsersLocation"
import Select from "react-select"
import getTeam from "app/teams/queries/getTeam"

interface IReactSelect {
  value: string
  label: string
}

interface IInvitePerLocationVisio {
  setPartUser: any
  setUserList: any
  setSelectValue: any
  selectValue: IReactSelect
}

const options = [
  { value: "Tous", label: "Tous les utilisateurs" },
  { value: "Selectionner", label: "Sélectionner les invités" },
]

function InvitePerLocationVisio(props: IInvitePerLocationVisio) {
  let { selectValue, setSelectValue, setPartUser, setUserList } = props
  const teamId = useParam("teamId", "string") as string

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
  const [distances, setDistances] = useState<number>(30)

  const [users] = useQuery(getUsersLocation, { where: { role: "VERIF", getNotifications: true } })
  let teamLat = team.teamLatitude
  let teamLon = team.teamLongitude
  const memoizedusersLocalArray = useMemo(
    () => usersLocalArray(users, teamLat, teamLon, distances),
    [users, teamLat, teamLon, distances]
  )

  function usersLocalArray(users, teamLat, teamLon, distances) {
    let UsersList = [] as IReactSelect[]
    for (let i = 0; i < users.users.length; i++) {
      let lat1 = users.users[i]?.userLat as number
      let lon1 = users.users[i]?.userLon as number
      var R = 6371 // Radius of the earth in km
      var dLat = deg2rad(teamLat - lat1) // deg2rad below
      var dLon = deg2rad(teamLon - lon1)
      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
          Math.cos(deg2rad(teamLat)) *
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
    setUserList(memoizedusersLocalArray)
  }, [memoizedusersLocalArray, setPartUser])
  return (
    <>
      <Stack>
        <Text fontSize="xl" as="b" mt="2vh" mb="2vh">
          Choisir une modalité d'invitation :
        </Text>

        <Select options={options} value={selectValue} onChange={setSelectValue} />
      </Stack>
      {selectValue.value === "Tous" && (
        <>
          <Center>
            <Text fontSize="md" mt="1vh">
              Inviter les utilisateurs dans un rayon de
              <span style={{ color: "red" }}> {distances} km </span> autour de la locasation de
              votre groupe
            </Text>
          </Center>

          <Center>
            <Slider
              defaultValue={60}
              min={30}
              max={1000}
              step={30}
              value={distances}
              onChange={setDistances}
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
            <Box width="60vw">
              <Slider
                defaultValue={60}
                min={30}
                max={1000}
                step={30}
                value={distances}
                onChange={setDistances}
              >
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb fontSize="sm" boxSize="32px" children={distances} />
              </Slider>
            </Box>
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
    </>
  )
}

export default InvitePerLocationVisio
