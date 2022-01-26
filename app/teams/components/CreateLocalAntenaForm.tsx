import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import LocalAntennaForm from "app/teams/components/LocalAntennaForm"
import createAntena from "app/teams/mutations/createAntena"
import { useMutation, useRouter } from "blitz"
import { Prisma } from "db"
import { Heading, HStack, Text, Center } from "@chakra-ui/react"
import React, { useState } from "react"

interface INaf {
  value: string
  label: string
}
;[]

const CreateLocalAntenaForm = () => {
  const router = useRouter()
  const [createAntenaMutation, { isLoading, isError }] = useMutation(createAntena)
  const currentUser = useCurrentUser()
  const [selectedSector, setSelectedSector] = useState<INaf>({ value: "secteur", label: "secteur" })
  return (
    <>
      <Center>
        {" "}
        <Heading>Création d'une Antenne Térritoriale </Heading>
      </Center>
      <Center>
        <Text as={"b"}>étape 1/5 : </Text>
      </Center>
      <Center>
        <Text color="red">
          Les étapes suivantes seront les mêmes que celles pour créer un groupe{" "}
        </Text>
      </Center>
      <Center>
        <Text color="red">
          La création d'une Antenne est accessible aux administrateurs seulement{" "}
        </Text>
      </Center>
      <Center>
        <Text color="red">
          Si le gérant de l'antenne ne souhaite pas être administrateur, l'administrateur peut créer
          l'antenne puis inviter le gérant en tant que gestionnaire du collectif(qui peut ajouter et
          supprimer des membres)
        </Text>
      </Center>
      <Center>
        {" "}
        <Heading fontSize="2xl" isTruncated>
          Les caractéristiques de l'Antenne
        </Heading>
      </Center>

      <LocalAntennaForm
        setSelectedSector={setSelectedSector}
        initialValues={{}}
        isLoading={isLoading}
        isError={isError}
        onSubmit={async (event) => {
          if (event.target[1].value.length < 300 && event.target[1].value.length > 0) {
            try {
              const team = await createAntenaMutation({
                data: {
                  name: event.target[0].value,
                  description: event.target[1].value,
                  teamLatitude: parseFloat(event.target[5].value) as number,
                  teamLongitude: parseFloat(event.target[6].value) as number,
                  secteur: "Association" as string,
                  typeOrg: "Antenne territoriale" as string,
                  taille: parseInt(event.target[7].value) as number,
                  anneeCreation: parseInt(event.target[8].value) as number,
                  TeamMastersID: "TeamCreatorId",
                  TeamMemberId: "TeamCreatorId",
                  users: currentUser as Prisma.UserCreateNestedManyWithoutTeamsInput,
                },
              })
              router.push(`/teams/${team.id}/neweditpicture`)
            } catch (error) {
              return { error: error.toString() }
            }
          }
        }}
      />
    </>
  )
}

export default CreateLocalAntenaForm
