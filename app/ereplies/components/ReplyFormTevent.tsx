import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  FormControl,
  FormLabel,
  HStack,
  Textarea,
  VStack,
} from "@chakra-ui/react"
import { Link } from "blitz"
import React, { useState } from "react"

type TreplyFormProps = {
  initialValues: any
  onSubmit: React.FormEventHandler<HTMLFormElement>
  isLoading: boolean
  isError: boolean
}

const TreplyFormTevent = ({ onSubmit, isLoading, isError, initialValues }: TreplyFormProps) => {
  const alertNode = () => {
    if (!isError) {
      return false
    }

    return (
      <Alert status="error" rounded="md">
        <AlertIcon />
        <AlertTitle>Oups !</AlertTitle>
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    )
  }

  return (
    <>
      <VStack spacing={4} align="left">
        {alertNode()}
        <Box bgColor="white" rounded="md" shadow="sm" borderWidth={1}>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              onSubmit(event)
            }}
          >
            <VStack spacing={0} align="left">
              <VStack spacing={4} align="left" p={4}>
                <FormControl id="content" isRequired isDisabled={isLoading}>
                  <FormLabel>Vous avez une question ?</FormLabel>
                  <Textarea size="sm" placeholder="Votre question" defaultValue={""} />
                </FormControl>
              </VStack>

              <HStack p={4} borderTopWidth={1} spacing={4}>
                <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                  Envoyer
                </Button>
              </HStack>
            </VStack>
          </form>
        </Box>
      </VStack>
    </>
  )
}

export default TreplyFormTevent
