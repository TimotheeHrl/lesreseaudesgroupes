import Layout from "app/core/layouts/Layout"
import {
  BlitzPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
  useMutation,
  useRouter,
  Router,
} from "blitz"
import {
  Flex,
  Text,
  FormLabel,
  Center,
  Input,
  InputGroup,
  Button,
  InputRightElement,
  Box,
} from "@chakra-ui/react"
import React, { useState, useEffect } from "react"

import * as passwordReset from "../../../resetpassword"
import setNewPasswordMutation from "../../../mutations/set-new-password"
import { FORM_ERROR } from "final-form"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const email = ctx.query.email as string
  const code = ctx.query.code as string

  return {
    props: {
      found: await passwordReset.isValidCode(email, code),
      code,
      email,
    },
  }
}

const ResetPassword: BlitzPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  const { found, code, email } = props
  const [show, setShow] = React.useState(false)

  const router = useRouter()
  const [setNewPassword] = useMutation(setNewPasswordMutation)
  const [newpassword, setPassword] = useState<string>("")

  if (!found) {
    return <div>"Nous n'avons pas trouvé votre email!"</div>
  }
  const handleClick = () => setShow(!show)
  useEffect(() => {
    Router.prefetch(`/collectifs`)
  }, [])
  async function ResetYourPassword(newpassword) {
    try {
      await setNewPassword({
        email,
        code,
        newPassword: newpassword as string,
      })

      router.push("/collectifs")
    } catch (error) {
      return { [FORM_ERROR]: error.toString() }
    }
  }
  function handleNewPassword(e) {
    let inputValue = e.target.value

    setPassword(inputValue)
  }
  return (
    <div className="min-h-screen flex justify-center">
      <div className="max-w-md w-full py-12">
        <Center>
          <FormLabel marginTop="2vh">saisir un nouveau mot de passe</FormLabel>
        </Center>

        <InputGroup size="md">
          <Input
            required
            pr="4.5rem"
            type={show ? "text" : "password"}
            placeholder="Enter password"
            value={newpassword}
            onChange={handleNewPassword}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Cacher" : "Voir"}
            </Button>
          </InputRightElement>
        </InputGroup>
        {newpassword.length < 9 && (
          <Text marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
            entre 10 et 100 caractères et seulement des lettres
          </Text>
        )}
        {newpassword.length > 101 && (
          <Text marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
            entre 10 et 100 caractères et seulement des lettres
          </Text>
        )}
        <Box mt="1vh">
          <Button
            colorScheme="blue"
            mr="2vw"
            onClick={() => {
              ResetYourPassword(newpassword)
            }}
          >
            Confirmer{" "}
          </Button>
        </Box>
      </div>
    </div>
  )
}

ResetPassword.getLayout = (page) => <Layout title="Nouveau mot de passe">{page}</Layout>

export default ResetPassword
