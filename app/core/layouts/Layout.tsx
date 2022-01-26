import React from "react"
import { Stack, Heading, Text, Button, useDisclosure, Link, Grid, GridItem } from "@chakra-ui/react"
import { HamburgerIcon } from "@chakra-ui/icons"
import { ReactNode, Suspense, useState, useEffect } from "react"
import useOnclickOutside from "react-cool-onclickoutside"

import {
  Center,
  Flex,
  Spinner,
  Box,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { Head, Router, Image, useMutation } from "blitz"
import logoutMutation from "app/auth/mutations/logout"

import { useCurrentUser } from "app/core/hooks/useCurrentUser"

export interface LayoutProps {
  title?: string
  children: ReactNode
}

const Layout = ({ title, children }: LayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const currentUser = useCurrentUser()
  let userId = currentUser?.user?.id
  let emailValidated = currentUser?.emailIsVerified as Boolean
  const role = currentUser?.user?.role as string
  function redirect() {
    Router.push(`https://www.google.fr/`)
  }
  if (role === "BANNED") {
    redirect()
  }
  const [logout] = useMutation(logoutMutation)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [agreedCookies, setAgreedCookie] = useState(
    localStorage.getItem("cookiesplateformeshowcase_AgreeToCookies" || null)
  )
  let ModaleCookies = agreedCookies === null
  const ref = useOnclickOutside(() => {
    setMobileMenu(false)
  })

  function setAgreed() {
    if (typeof window !== "undefined") {
      localStorage.setItem("cookiesplateformeshowcase_AgreeToCookies", "true")
      setAgreedCookie("true")
    }
  }
  async function Logout() {
    await logout()
    userId = undefined

    Router.push("/")
  }
  return (
    <Box w="100vw" height="100vh">
      <Box mb="9vh"></Box>
      <Head>
        <meta
          name="Groupes sur toile"
          content="Cette application est en phase de pré-production. 
          Elle est destiné à favoriser l'échange entre des salariés intra-entrepreneur,
           qui entreprennent ou bien qui voudraient entreprendre des actions dans leurs entreprises,
            qui s'inscrivent dans des thèmatiques variées liées au bien-commun "
        />
      </Head>
      <Box mt="3vh">
        <Modal onClose={onClose} isOpen={ModaleCookies}>
          <ModalContent>
            <Center>
              <ModalHeader>{"Cookies"}</ModalHeader>
            </Center>

            <ModalCloseButton />
            <ModalBody>
              <Text textAlign="left" a="i" marginTop="1vh">
                Un cookie est un simple fichier texte, une information qui est déposée sur votre
                disque dur dans le dossier du navigateur. Ils permettent par exemple sur cette
                application de ne pas devoir s'authentifier entre chaque nouvelle utilisation. Le
                Réseau des groupes utilise des cookies pour des cas d'utilisations simples liés au
                fonctionnement de l'application. Ces élèments d'information ne sont pas partagées ou
                utilisées à des fins publicitaires.
                <Center>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      setAgreed()
                    }}
                  >
                    Je suis d'accord
                  </Button>
                </Center>
              </Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
      {emailValidated === false && (
        <Center>
          <Alert
            mt="4vh"
            width="100%"
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Merci de valider votre adresse email
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              En utilisant le lien présent dans l'email qui vous a était envoyé lors de votre
              inscription. Ou alors, en réintialisant votre mot de passe (aller dans connexion puis
              mot de passe oublié)
            </AlertDescription>
          </Alert>
        </Center>
      )}
      <Head>
        <title>{title || "Le Réseau des groupes"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box position="fixed" top="0vh" pt="2vh" pb="2vh" zIndex="1" w="100vw" bgColor="white">
        <Flex ref={ref} as="nav" align="center" justify="space-between" wrap="wrap">
          <Flex ml="1vw" align="center">
            <Link href="/collectifs">
              <span className="flex items-center ml-1">
                <Image aria-label="collectifs" width={40} height={40} src="/logo.png" alt="Logo" />

                <Heading mt="0.5vh" ml="1vw" as="h1" size="lg" letterSpacing={"tighter"}>
                  Groupes sur toile
                </Heading>
              </span>
            </Link>
          </Flex>

          <Box
            display={{ base: "block", md: "none" }}
            position="absolute"
            top="3vh"
            right="5vw"
            onClick={() => {
              mobileMenu === false ? setMobileMenu(true) : setMobileMenu(false)
            }}
            ref={ref}
          >
            <HamburgerIcon w={6} h={6} />
          </Box>
          <Stack
            mr="3vh"
            ml="3vh"
            direction={{ base: "column", md: "row", lg: "row", xl: "row" }}
            display={{
              base: mobileMenu ? "block" : "none",
              md: "flex",
              lg: "flex",
              xl: "flex",
            }}
            width={{ base: "full", md: "auto" }}
            alignItems="center"
            flexGrow={1}
            spacing={10}
            mt={{ base: "0.5vh", md: "0.5vh", lg: "0.5vh", xl: "0.5vh" }}
          >
            <Link href="/collectifs">
              <Box
                mt={{ base: "2vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                pl={{ base: "13vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                pr={{ base: "3vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                pt={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                pb={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
              >
                <Text fontSize={{ base: "xl", md: "2vh", lg: "lg", xl: "xl" }}>Les Groupes</Text>
              </Box>
              {mobileMenu === true && (
                <Grid templateColumns={{ base: "repeat(1, 1fr)" }}>
                  <GridItem
                    mr={{ base: "15vw" }}
                    ml={{ base: "15vw" }}
                    w={{ base: "50vw" }}
                    colSpan={{ base: 1 }}
                    h={{ base: "1px" }}
                    bg={{ base: "gray.200" }}
                  />
                </Grid>
              )}
            </Link>
            <Link href="/">
              <Box
                pl={{ base: "13vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                pr={{ base: "3vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                pt={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                pb={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
              >
                <Text fontSize={{ base: "xl", md: "2vh", lg: "lg", xl: "xl" }}>Actualités</Text>
              </Box>
              {mobileMenu === true && (
                <Grid templateColumns={{ base: "repeat(1, 1fr)" }}>
                  <GridItem
                    mr={{ base: "15vw" }}
                    ml={{ base: "15vw" }}
                    w={{ base: "50vw" }}
                    colSpan={{ base: 1 }}
                    h={{ base: "1px" }}
                    bg={{ base: "gray.200" }}
                  />
                </Grid>
              )}
            </Link>
          </Stack>
          <Box>
            {userId === undefined ? (
              <Stack
                mr="3vh"
                ml="3vh"
                direction={{ base: "column", md: "row" }}
                display={{ base: mobileMenu ? "block" : "none", md: "flex" }}
                width={{ base: "full", md: "auto" }}
                alignItems="center"
                flexGrow={1}
                spacing={10}
                mt={{ base: "0.5vh", md: "0.5vh", lg: "0.5vh", xl: "0.5vh" }}
              >
                <Link href="/faq" isExternal>
                  <Box
                    pl={{ base: "13vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pr={{ base: "3vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pt={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pb={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                  >
                    <Text fontSize="lg">FAQ</Text>
                  </Box>
                  {mobileMenu === true && (
                    <Center>
                      <Grid templateColumns={{ base: "repeat(1, 1fr)" }}>
                        <GridItem
                          w={{ base: "50vw" }}
                          colSpan={{ base: 1 }}
                          h={{ base: "1px" }}
                          bg={{ base: "gray.200" }}
                        />
                      </Grid>
                    </Center>
                  )}
                </Link>
                <Link href="/login">
                  <Box
                    pl={{ base: "13vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pr={{ base: "3vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pt={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pb={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                  >
                    <Text fontSize="lg">Connexion</Text>
                  </Box>
                </Link>
              </Stack>
            ) : (
              <Stack
                mr="3vh"
                ml="3vh"
                direction={{ base: "column", md: "row" }}
                display={{ base: mobileMenu ? "block" : "none", md: "flex" }}
                width={{ base: "full", md: "auto" }}
                alignItems="center"
                flexGrow={1}
                spacing={10}
                mt={{ base: "0.5vh", md: "0.5vh", lg: "0.5vh", xl: "0.5vh" }}
              >
                <Link href={"/chats/chats"}>
                  <Box
                    pl={{ base: "13vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pr={{ base: "3vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pt={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pb={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                  >
                    <Text fontSize="lg">Messagerie</Text>
                  </Box>
                  {mobileMenu === true && (
                    <Grid templateColumns={{ base: "repeat(1, 1fr)" }}>
                      <GridItem
                        mr={{ base: "15vw" }}
                        ml={{ base: "15vw" }}
                        w={{ base: "50vw" }}
                        colSpan={{ base: 1 }}
                        h={{ base: "1px" }}
                        bg={{ base: "gray.200" }}
                      />
                    </Grid>
                  )}
                </Link>

                <Link href={`/users/${userId}`}>
                  <Box
                    pl={{ base: "13vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pr={{ base: "3vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pt={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pb={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                  >
                    <Text fontSize="lg">Mon Profil</Text>
                  </Box>
                  {mobileMenu === true && (
                    <Grid templateColumns={{ base: "repeat(1, 1fr)" }}>
                      <GridItem
                        mr={{ base: "15vw" }}
                        ml={{ base: "15vw" }}
                        w={{ base: "50vw" }}
                        colSpan={{ base: 1 }}
                        h={{ base: "1px" }}
                        bg={{ base: "gray.200" }}
                      />
                    </Grid>
                  )}
                </Link>

                <Link href={`/teams`}>
                  <Box
                    pl={{ base: "13vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pr={{ base: "3vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pt={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pb={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                  >
                    <Text fontSize="lg">Mon groupe</Text>
                  </Box>
                  {mobileMenu === true && (
                    <Grid templateColumns={{ base: "repeat(1, 1fr)" }}>
                      <GridItem
                        mr={{ base: "15vw" }}
                        ml={{ base: "15vw" }}
                        w={{ base: "50vw" }}
                        colSpan={{ base: 1 }}
                        h={{ base: "1px" }}
                        bg={{ base: "gray.200" }}
                      />
                    </Grid>
                  )}
                </Link>
                <Link href="/faq" isExternal>
                  <Box
                    pl={{ base: "13vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pr={{ base: "3vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pt={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                    pb={{ base: "1vh", md: "0vh", lg: "0vh", xl: "0vh" }}
                  >
                    <Text fontSize="lg">FAQ</Text>
                  </Box>
                  {mobileMenu === true && (
                    <Grid templateColumns={{ base: "repeat(1, 1fr)" }}>
                      <GridItem
                        mr={{ base: "15vw" }}
                        ml={{ base: "15vw" }}
                        w={{ base: "50vw" }}
                        colSpan={{ base: 1 }}
                        h={{ base: "1px" }}
                        bg={{ base: "gray.200" }}
                      />
                    </Grid>
                  )}
                </Link>
                <Box display={{ base: mobileMenu ? "block" : "none", md: "block" }}>
                  <Button
                    ml={{ base: "20vw", md: "0vh", lg: "0vh", xl: "0vh" }}
                    _hover={{ bg: "red.400", borderColor: "red.700" }}
                    onClick={async () => {
                      Logout()
                    }}
                  >
                    Déconnexion
                  </Button>
                </Box>
              </Stack>
            )}
          </Box>
        </Flex>
      </Box>
      <main>
        <Suspense
          fallback={
            <Center h="100vh">
              <Spinner />
            </Center>
          }
        >
          {children}
        </Suspense>
      </main>
    </Box>
  )
}

export default Layout
