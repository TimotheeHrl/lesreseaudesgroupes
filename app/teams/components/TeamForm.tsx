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

const TeamForm = ({
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
                  <FormLabel>Nom du groupe</FormLabel>
                  <FormLabel marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                    Le nom du groupe ne sera pas modifiable par la suite
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

                <FormLabel>Précisez la localisation de votre groupe</FormLabel>
                <FormLabel marginLeft="0.5vw" as="i" color="tomato" fontSize="md">
                  La localisation du groupe ne sera pas modifiable par la suite
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

                <FormControl id="secteur">
                  <FormLabel>Secteur de votre organisation</FormLabel>
                  <FormLabel marginLeft="0.5vw" as="i" color="grey" fontSize="md">
                    Le secteur ne sera pas modifiable par la suite
                  </FormLabel>
                  <Select
                    placeholder="Secteur d'activité votre organisation"
                    options={SectorNaf as INaf[]}
                    onChange={setSelectedSector}
                  />
                </FormControl>

                <FormControl id="typeOrg" isDisabled={isLoading}>
                  <FormLabel>Caractéristiques de l'organisation</FormLabel>
                  <FormLabel marginLeft="0.5vw" as="i" color="grey" fontSize="md">
                    Les caractéristiques de l'organisation ne seront pas modifiables par la suite
                  </FormLabel>
                  <SSelect bg="white">
                    <option value="TPE">TPE (moins de 10 salariés)</option>
                    <option value="PME">PMI (10 à 50 salariés)</option>
                    <option value="PME">PME (50 à 250 salariés)</option>
                    <option value="ETI">ETI (250 à 5000 salariés)</option>
                    <option value="Grande Entreprise">
                      Grande Entreprise (au moins 5 000 salariés)
                    </option>

                    <option value="Association">Association</option>
                    <option value="Services Publics">Services Publics</option>
                    <option value="Autres">Autres</option>
                  </SSelect>
                </FormControl>
                <FormControl id="taille" isDisabled={isLoading}>
                  <FormLabel>Nombre de personnes impliquées dans le groupe</FormLabel>
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

export default TeamForm
