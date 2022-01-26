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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Center,
} from "@chakra-ui/react"
import { Link, useParam } from "blitz"
import React from "react"

type TeamPreFormProps = {
  initialValues: any
  onSubmit: React.FormEventHandler<HTMLFormElement>
  isLoading: boolean
  isError: boolean
}

const TeamPreForm = ({ onSubmit, isLoading, isError, initialValues }: TeamPreFormProps) => {
  const alertNode = () => {
    if (!isError) {
      return false
    }

    return (
      <Alert status="error" rounded="md">
        <AlertIcon />
        <AlertTitle>Oups</AlertTitle>
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    )
  }

  return (
    <>
      <VStack spacing={4} align="left">
        {alertNode()}

        <Box bgColor="white" rounded="md" shadow="sm" borderWidth={1}>
          <Center>
            <Heading>Modifier la description </Heading>
          </Center>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              onSubmit(event)
            }}
          >
            <VStack spacing={0} align="center">
              <VStack spacing={4} align="center" p={4}>
                <FormControl id="description" isDisabled={isLoading}>
                  <FormLabel>Description Courte</FormLabel>
                  <Textarea
                    placeholder="Description courte..."
                    defaultValue={initialValues.description}
                  />
                </FormControl>
                <FormControl id="taille" isDisabled={isLoading}>
                  <FormLabel>Nombre de personnes impliquées dans le groupe</FormLabel>
                  <NumberInput step={1} defaultValue={initialValues.taille} min={1} max={50}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl id="anneeCreation" isDisabled={isLoading}>
                  <FormLabel>Année de création</FormLabel>

                  <NumberInput defaultValue={initialValues.anneeCreation} min={1980} max={2023}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </VStack>

              <HStack p={4} borderTopWidth={1} spacing={20}>
                <Button colorScheme="blue" type="submit" isLoading={isLoading}>
                  Modifier
                </Button>
                <Link href={!!initialValues.id ? `/teams/${initialValues.id}` : "/teams/"}>
                  <Button colorScheme="red" isLoading={isLoading} variant="link">
                    annuler
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

export default TeamPreForm
