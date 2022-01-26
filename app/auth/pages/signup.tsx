import React, { useState, useEffect } from "react"
import { useRouter, BlitzPage, Link, useMutation, Router } from "blitz"
import Layout from "app/core/layouts/Layout"
import signup from "app/auth/mutations/signup"
import MapInput from "app/utils/mapInput/mapInput"

import {
  Center,
  Flex,
  Text,
  FormLabel,
  Textarea,
  useDisclosure,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Box,
} from "@chakra-ui/react"

const SignupPage: BlitzPage = () => {
  const router = useRouter()
  const [signupMutation] = useMutation(signup)
  const [lat, setLat] = useState<number>(3)
  const [lon, setLon] = useState<number>(3)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [chartre, setCharte] = useState<boolean>(false)
  const [Password, setPassword] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [userDescription, setUserDescription] = useState<string>("")
  const [lien, setLien] = useState<string>("")
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  useEffect(() => {
    Router.prefetch(`/collectifs`)
  }, [])

  let nameLenght = name.length as number
  let lienLenght = lien.length as number
  let descriptionlenght = userDescription.length as number
  async function handleSubmit() {
    if (
      email.length > 4 &&
      email.length < 200 &&
      email.includes("@") &&
      email.includes(".") &&
      name.length > 3 &&
      name.length < 21 &&
      userDescription.length < 301 &&
      lien.length < 301 &&
      Password.length > 9 &&
      Password.length < 101
    ) {
      try {
        const result = await signupMutation({
          email: email,
          password: Password,
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
          case "email_exists": {
            alert("cet email est déjà utilisé")
            return { email: "cet email est déjà utilisé" }
          }
          case "lien_no_ssl": {
            alert(
              "Seule les liens commençants par https:// sont autorisés, https sera ajouté automatiquement s'il n'y a pas de préfixe."
            )
            return {
              lien: "Seule les liens commençants par https:// sont autorisés, https sera ajouté automatiquement s'il n'y a pas de préfixe.",
            }
          }

          case "success": {
            router.push(`/collectifs`)
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
  function handlePassword(e) {
    let inputValue = e.target.value

    setPassword(inputValue)
  }

  function handleEmail(e) {
    let inputValue = e.target.value
    setEmail(inputValue)
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
      {chartre === (false as boolean) && (
        <div className="min-h-screen flex justify-center">
          <div className="max-w-md w-full py-12">
            <Text>Lorem Ipsum is simply dummy text : </Text>
            <Text>&#9679; of the printing and typesetting industry.</Text>
            <Text>
              &#9679; Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </Text>
            <Text>
              {" "}
              &#9679; Lorem Ipsum is simply dummy text of the printing and typesetting industry.
            </Text>
            <Text as="b" marginTop="1vh">
              {" "}
              Lorem Ipsum is :
            </Text>
            <Text>
              {" "}
              &#9679; simply dummy text, Lorem Ipsum has been the industry standard dummy text ever
              since the 1500s, when an unknown printer.
            </Text>
            <Text>&#9679; simply dummy text, Lorem Ipsum has been the industry </Text>
            <Text>&#9679; simply dummy text, Lorem Ipsum has been the industry</Text>
            <Text as="b" marginTop="1vh">
              {" "}
              Lorem Ipsum is simply dummy text of the printing and typesetting industry.{" "}
            </Text>{" "}
            standard dummy text ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.
            <Text as="b" marginTop="1vh">
              {" "}
              Lorem Ipsum is simply dummy text{" "}
            </Text>{" "}
            <Text as="b" marginTop="1vh">
              Lorem Ipsum has been the industry s standard dummy text ever since the 1500s, when an
              unknown printer took a galley of type and scrambled it to make a type specimen book.
            </Text>{" "}
            <Flex mt="3vh">
              <Button colorScheme="blue" mr="2vw" onClick={() => setCharte(true)}>
                Accepter
              </Button>

              <Link href="/">
                <Button ml="2vw">Refuser</Button>
              </Link>
            </Flex>
          </div>
        </div>
      )}

      {chartre === true && (
        <>
          <div className="min-h-screen flex justify-center">
            <div className="max-w-md w-full py-12">
              <p className="mt-6 text-sm leading-5 text-center text-gray-900">S'inscrire</p>

              <div>
                <FormLabel marginTop="2vh">Email</FormLabel>

                <div className="-mt-px relative">
                  <Input
                    required
                    type="email"
                    onChange={handleEmail}
                    placeholder="Email"
                    value={email}
                    aria-label="Email address"
                  />
                  {!email.includes(".") && (
                    <Text marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                      Doit contenir ' . '
                    </Text>
                  )}
                  {!email.includes("@") && (
                    <Text marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                      Doit contenir ' @ '
                    </Text>
                  )}
                </div>
                <FormLabel marginTop="2vh">Mot de passe</FormLabel>

                <div className="-mt-px relative">
                  <InputGroup size="md">
                    <Input
                      required
                      pr="4.5rem"
                      type={show ? "text" : "password"}
                      placeholder="Enter password"
                      value={Password}
                      onChange={handlePassword}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Cacher" : "Voir"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {Password.length < 10 && (
                    <Text marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                      entre 10 et 100 caractères et seulement des lettres
                    </Text>
                  )}
                  {Password.length > 100 && (
                    <Text marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                      entre 10 et 100 caractères et seulement des lettres
                    </Text>
                  )}
                </div>
                <FormLabel marginTop="2vh">Psoeudonyme</FormLabel>

                <div className="-mt-px relative">
                  <Input
                    onChange={handleName}
                    value={name}
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
                    value={userDescription}
                    placeholder="infos optionnelles"
                    type="text"
                    required
                    onChange={handleDescription}
                  />
                  {descriptionlenght > 300 && (
                    <Text marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                      300 caractères max
                    </Text>
                  )}
                </div>

                <Text marginLeft="0.5vw" as="i" color="grey" fontSize="md">
                  Un mot sur vous ?
                </Text>

                <FormLabel marginTop="2vh">Lien page personelle</FormLabel>
                <InputGroup size="sm">
                  <InputLeftAddon children="https://" />
                  <Input
                    aria-label="lien"
                    value={lien}
                    placeholder=" Lien vers votre site ou un réseau social"
                    type="url"
                    onChange={handleLien}
                  />
                </InputGroup>

                {lienLenght > 300 && (
                  <Text marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                    300 caractères max
                  </Text>
                )}
                <FormLabel marginTop="2vh">Précisez votre localisation</FormLabel>
                <Text marginLeft="0.5vw" as="i" color="grey" fontSize="md">
                  Déplacer la carte pour placer la fèche sur votre localisation
                </Text>

                <MapInput setlat={setLat} setlon={setLon} />
                <Center>
                  <Box mt="1vh">
                    <Button
                      colorScheme="blue"
                      size="lg"
                      onClick={() => {
                        handleSubmit()
                      }}
                    >
                      Enregistrer{" "}
                    </Button>
                  </Box>
                </Center>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

SignupPage.getLayout = (page) => <Layout title="S'incrire">{page}</Layout>

export default SignupPage
