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
import TpostSelected from "app/treplies/components/selectedTpost"

type TreplyFormProps = {
  initialValues: any
  onSubmit: React.FormEventHandler<HTMLFormElement>
  isLoading: boolean
  isError: boolean
}

const TreplyForm = ({ onSubmit, isLoading, isError, initialValues }: TreplyFormProps) => {
  const alertNode = () => {
    if (!isError) {
      return false
    }

    return (
      <Alert status="error" rounded="md">
        <AlertIcon />
        <AlertTitle>Something went wrong! Please try again.</AlertTitle>
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    )
  }

  return (
    <>
      <div>
        {" "}
        <TpostSelected />{" "}
      </div>

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
                  <FormLabel>votre message</FormLabel>
                  <Textarea size="md" placeholder="..." defaultValue={""} />
                </FormControl>
              </VStack>

              <HStack p={4} borderTopWidth={1} spacing={4}>
                <Button colorScheme="yellow" type="submit" isLoading={isLoading}>
                  {(initialValues.id = "Poster")}
                </Button>
                <Link href={!!initialValues.id ? `/teams/${initialValues.id}` : "/teams/"}>
                  <Button colorScheme="red" isLoading={isLoading} variant="link">
                    Annuler
                  </Button>
                </Link>
              </HStack>
            </VStack>
          </form>
        </Box>
      </VStack>
    </>
  )
}

export default TreplyForm
