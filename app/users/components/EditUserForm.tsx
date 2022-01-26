import getUserPerso from "app/users/queries/getUserPerso"
import { useMutation, useParam, useQuery, useRouter, Router, Link } from "blitz"
import { User } from "db"
import updateUser from "app/users/mutations/updateUser"
import React, { FC, useState, useEffect } from "react"
import Mapuserpos from "app/utils/mapInput/mapuserpos"
import {
  Flex,
  Text,
  FormLabel,
  Textarea,
  useDisclosure,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Box,
  Center,
} from "@chakra-ui/react"
interface IValues {
  name: string
  userLat: number
  userLon: number
  userDescription: string
  lien: string
}
const baseurl = process.env.BASE_URL as string

const EditUserForm = () => {
  const router = useRouter()
  const userId = useParam("userId", "string")

  const [userQuery] = useQuery(
    getUserPerso,
    {
      where: { id: userId },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  const [lat, setLat] = useState<number>(userQuery?.userLat as number)
  const [lon, setLon] = useState<number>(userQuery?.userLon as number)
  const [name, setName] = useState<string>(userQuery?.name as string)
  const [Continue, setContinue] = useState<boolean>(false)
  const [userDescription, setUserDescription] = useState<string>(
    userQuery?.userDescription as string
  )
  const [lien, setLien] = useState<string>(userQuery?.lien.slice(8) as string)
  const [updateUserMutation] = useMutation(updateUser)

  useEffect(() => {
    Router.prefetch(`/users/${userId}`)
  }, [])

  let nameLenght = name.length as number
  let lienLenght = lien.length as number
  let descriptionlenght = userDescription.length as number
  async function handleSubmit() {
    if (name.length > 3 && name.length < 21 && userDescription.length < 301 && lien.length < 301) {
      try {
        const result = await updateUserMutation({
          name: name as string,
          userLat: lat,
          userLon: lon,
          userDescription: userDescription as string,
          lien: lien as string,
        })

        switch (result) {
          case "username_exists": {
            alert("ce nom d'utilisateur est déjà utilisé")
            return { name: "ce nom d'utilisateur est déjà utilisé" }
          }
          case "lien_no_ssl":
            {
              alert(
                "Seule les liens commençants par https:// sont autorisés, https sera ajouté automatiquement s'il n'y a pas de préfixe."
              )
            }
            return {
              lien: "Seule les liens commençants par https:// sont autorisés, https sera ajouté automatiquement s'il n'y a pas de préfixe.",
            }

          case "success": {
            router.push(`/users/${userId}`)
            return
          }
          default: {
            alert(result)
          }
        }
      } catch (errors) {
        console.log(errors)
      }
    }
  }

  function handleName(e) {
    let inputValue = e.target.value

    setName(inputValue)
  }

  function handleDescription(e) {
    let inputValue = e.target.value
    setUserDescription(inputValue)
  }
  function handleLien(e) {
    let inputValue = e.target.value
    setLien(inputValue)
  }

  return (
    <>
      <div className="min-h-screen flex justify-center">
        <div className="max-w-md w-full py-12">
          <Center>
            <Text as="b">Mettre à jour votre Profil</Text>
          </Center>

          <div>
            <FormLabel marginTop="2vh">Psoeudonyme</FormLabel>

            <div className="-mt-px relative">
              <Input
                onChange={handleName}
                defaultValue={userQuery?.name as string}
                required
                type="text"
                placeholder="nom d'utilisateur"
                aria-label="nom d'utilisateur"
              />
              {nameLenght < 4 && (
                <Text marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                  entre 4 et 20 caractères et seulement des lettres
                </Text>
              )}
              {nameLenght > 20 && (
                <Text marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                  entre 4 et 20 caractères et seulement des lettres
                </Text>
              )}
            </div>

            <FormLabel marginTop="2vh">Informations sur vous</FormLabel>

            <div className="-mt-px relative">
              <Textarea
                aria-label="userDescription"
                defaultValue={userQuery?.userDescription}
                placeholder="infos optionnelles"
                type="text"
                required
                onChange={handleDescription}
              />
              {descriptionlenght > 299 && (
                <Text marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                  300 caractères max
                </Text>
              )}
            </div>

            <Text marginLeft="0.5vw" as="i" color="grey" fontSize="md">
              Un mot sur vous ?
            </Text>

            <FormLabel marginTop="2vh">Lien vers une page personelle</FormLabel>
            <InputGroup size="sm">
              <InputLeftAddon children="https://" />
              <Input
                aria-label="lien"
                defaultValue={userQuery?.lien.slice(8)}
                placeholder=" Lien vers votre site ou un réseau social"
                type="url"
                onChange={handleLien}
              />
            </InputGroup>

            {lienLenght > 299 && (
              <Text marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                300 caractères max
              </Text>
            )}
            <FormLabel marginTop="2vh">Précisez votre localisation</FormLabel>
            <Text as="i" color="grey" fontSize="md">
              Déplacer la carte pour placer la fèche sur votre localisation
            </Text>
            <Mapuserpos setlat={setLat} setlon={setLon} />
            <Center mt="2vh">
              <Button
                colorScheme="blue"
                size="lg"
                onClick={() => {
                  handleSubmit()
                }}
                mr="2vh"
              >
                Enregistrer{" "}
              </Button>
              <Link href={`/users/${userId as string}`}>
                <Button ml="2vh">Retour </Button>
              </Link>
            </Center>

            <br />
          </div>
        </div>
      </div>
    </>
  )
}

export default EditUserForm
