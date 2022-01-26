import React, { useState, useEffect } from "react"
import { useRouter, BlitzPage, Router, useMutation } from "blitz"
import Layout from "app/core/layouts/Layout"
import loginMutation from "app/auth/mutations/login"
import resetPasswordMutation from "../mutations/reset-password"
import {
  Link,
  Text,
  FormLabel,
  Center,
  Input,
  InputGroup,
  Button,
  InputRightElement,
  Box,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Stack,
} from "@chakra-ui/react"

const LoginPage: BlitzPage = () => {
  const router = useRouter()
  const [show, setShow] = React.useState(false)

  const [Password, setPassword] = useState<string>("")

  const [login] = useMutation(loginMutation)
  const [email, setEmail] = useState<string>("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [resetEmail, setResetEmail] = useState<string>("")

  const [resetPassword] = useMutation(resetPasswordMutation)

  const handleClick = () => setShow(!show)
  useEffect(() => {
    Router.prefetch(`/collectifs`)
  }, [])
  async function Log(email, Password) {
    if (
      email.length > 4 &&
      email.length < 200 &&
      email.includes("@") &&
      email.includes(".") &&
      Password.length > 9 &&
      Password.length < 101
    ) {
      try {
        await login({ email: email, password: Password })

        router.push("/collectifs")
      } catch (error) {
        if (error.name === "AuthenticationError") {
          alert("Désolé, les identifiants saisie sont invalides")
        }
        if (error.toString().includes("Signature")) {
          return {
            error: alert("Mot de passe incorrecte"),
          }
        } else {
          return {
            error: alert("Il n'y pas pas d'utilisateur avec cette email"),
          }
        }
      }
    }
  }

  async function ResetPassword(resetEmail) {
    if (
      resetEmail.length > 4 &&
      resetEmail.length < 200 &&
      resetEmail.includes("@") &&
      resetEmail.includes(".")
    ) {
      try {
        await resetPassword({ email: resetEmail })
        alert(
          "si votre email est bien inscript chez ici, un email permettant de ré-initialisé votre email vous à été envoyé"
        )
      } catch (error) {
        console.log(error)
      }
    }
  }

  function handlePassword(e) {
    let inputValue = e.target.value

    setPassword(inputValue)
  }

  function handleEmail(e) {
    let inputValue = e.target.value
    setEmail(inputValue)
  }
  function handleResetEmail(e) {
    let inputValue = e.target.value
    setResetEmail(inputValue)
  }
  return (
    <>
      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            <Text as="b" color="grey" marginTop="1vh">
              Mot de passe oublié ?
            </Text>
          </ModalHeader>

          <ModalCloseButton />
          <ModalBody>
            <Center>
              {" "}
              <Text as="b" color="grey" mt="3vh">
                Merci d'entrer votre email :
              </Text>
            </Center>{" "}
            <Center>
              <Input
                required
                type="email"
                onChange={handleResetEmail}
                placeholder="Email"
                value={resetEmail}
                aria-label="Email address"
              />
            </Center>{" "}
            <Center>
              {!resetEmail.includes(".") && (
                <Text marginLeft="0.5vw" mr="2vw" as="i" color="tomato" fontSize="md">
                  Doit contenir ' . '
                </Text>
              )}

              {!resetEmail.includes("@") && (
                <Text marginLeft="2vw" as="i" color="tomato" fontSize="md">
                  Doit contenir ' @ '
                </Text>
              )}
            </Center>
            <Box mt="3vh">
              <Button
                colorScheme="blue"
                mr="2vw"
                onClick={() => {
                  ;[ResetPassword(resetEmail), onClose]
                }}
              >
                Renouveler mot de passe{" "}
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="min-h-screen flex justify-center">
        <div className="max-w-md w-full py-12">
          <Center>
            <Text fontSize="lg" as="b">
              Se connecter
            </Text>
          </Center>

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
            <Center mt="3vh">
              <Stack flexDirection={{ sm: "row", md: "row", lg: "row", xl: "row" }}>
                <Box mt="1vh">
                  <Button
                    colorScheme="blue"
                    mr="2vw"
                    onClick={() => {
                      Log(email, Password)
                    }}
                  >
                    Se Connecter{" "}
                  </Button>
                </Box>

                <Box ml="2vw">
                  <Button onClick={onOpen}>Mot de Passe Oublié ?</Button>
                </Box>
              </Stack>
            </Center>
            <Center mt="3vh">
              <Link href="/signup">
                <Button colorScheme="blue" mr="2vw">
                  S'incrire{" "}
                </Button>
              </Link>
            </Center>
          </div>
        </div>
      </div>
    </>
  )
}

LoginPage.getLayout = (page) => <Layout title="se connecter">{page}</Layout>

export default LoginPage
