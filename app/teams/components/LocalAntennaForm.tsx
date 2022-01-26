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
  Input,
  Textarea,
  VStack,
  Select as SSelect,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  VisuallyHidden,
  FormHelperText,
} from "@chakra-ui/react"

import MapInput from "app/utils/mapInput/mapInput"
import { SectorNaf } from "app/utils/SectorsNaf"
import { Link } from "blitz"
import React, { useState, CSSProperties } from "react"
import Select from "react-select"

interface INaf {
  value: string
  label: string
}
;[]
interface ISetSecteur {
  setSelectedSector
}
type TeamFormProps = {
  initialValues: any
  onSubmit: React.FormEventHandler<HTMLFormElement>
  isLoading: boolean
  isError: boolean
  setSelectedSector: any
}

const LocalAntennaForm = ({
  onSubmit,
  isLoading,
  isError,
  initialValues,
  setSelectedSector,
}: TeamFormProps) => {
  const [lat, setLat] = useState<number>(3)
  const [lon, setLon] = useState<number>(3)
  let [DescriptionValue, setDescriptionValue] = React.useState("")

  let handleInputChange = (e) => {
    let inputValue = e.target.value
    setDescriptionValue(inputValue)
  }

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
          <form
            onSubmit={(event) => {
              event.preventDefault()
              onSubmit(event)
            }}
          >
            <VStack spacing={0} align="left">
              <VStack spacing={4} align="left" p={4}>
                <FormControl id="name" isRequired isDisabled={isLoading}>
                  <FormLabel>Nom de l'antenne</FormLabel>
                  <FormLabel marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                    Le nom de l'antenne ne sera pas modifiable par la suite
                  </FormLabel>
                  <Input placeholder="Nom de votre groupe" defaultValue={""} />
                </FormControl>

                <FormControl isRequired id="description" isDisabled={isLoading}>
                  <FormLabel>Une description courte</FormLabel>
                  <FormLabel marginLeft="0.5vw" as="i" color="grey" fontSize="md">
                    Environ 60-100 caractères
                  </FormLabel>
                  <FormLabel marginLeft="0.5vw" as="i" color="grey" fontSize="md">
                    Il y a {DescriptionValue.length as number} caractères
                  </FormLabel>

                  <Textarea
                    placeholder="une description courte"
                    defaultValue={initialValues.description}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormLabel>Précisez la localisation de l'antenne</FormLabel>
                <FormLabel marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                  La localisation de l'antenne ne sera pas modifiable par la suite
                </FormLabel>
                <FormLabel marginLeft="0.5vw" as="i" color="grey" fontSize="md">
                  Déplacer la carte pour placer la fèche sur votre localisation
                </FormLabel>

                <MapInput setlat={setLat} setlon={setLon} />
                <FormControl id="teamLatitude" isDisabled={isLoading}>
                  <VisuallyHidden>
                    <Input value={lat} />
                  </VisuallyHidden>
                </FormControl>
                <FormControl id="teamLongitude" isDisabled={isLoading}>
                  <VisuallyHidden>
                    <Input value={lon} />
                  </VisuallyHidden>
                </FormControl>

                <FormControl id="taille" isDisabled={isLoading}>
                  <FormLabel>Nombre de personnes impliquées dans l'antenne</FormLabel>
                  <NumberInput step={1} defaultValue={1} min={1} max={50}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <FormControl id="anneeCreation" isDisabled={isLoading}>
                  <FormLabel>Année de création</FormLabel>

                  <NumberInput defaultValue={2021} min={1980} max={2023}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </VStack>

              <FormControl id="teamLatitude" isDisabled={isLoading}>
                <FormLabel></FormLabel>
              </FormControl>
              <FormControl id="teamLongitude" isDisabled={isLoading}>
                <FormLabel></FormLabel>
              </FormControl>
              <HStack p={4} borderTopWidth={1} spacing={4}>
                <Button mr="3vw" colorScheme="blue" type="submit" isLoading={isLoading}>
                  Créer
                </Button>
                <Link href={!!initialValues.id ? `/teams/${initialValues.id}` : "/teams/"}>
                  <Button ml="3vw" colorScheme="red" isLoading={isLoading} variant="link">
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

export default LocalAntennaForm
