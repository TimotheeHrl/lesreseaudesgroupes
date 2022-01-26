import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import TeamForm from "app/teams/components/TeamForm"
import createTeam from "app/teams/mutations/createTeam"
import { useMutation, useRouter } from "blitz"
import { Prisma } from "db"
import { Heading, HStack, Text, Center } from "@chakra-ui/react"
import React, { useState } from "react"

interface INaf {
  value: string
  label: string
}
;[]

const CreateTeamForm = () => {
  const router = useRouter()
  const [createTeamMutation, { isLoading, isError }] = useMutation(createTeam)
  const currentUser = useCurrentUser()
  const [selectedSector, setSelectedSector] = useState<INaf>({ value: "secteur", label: "secteur" })
  return (
    <>
      <Center>
        {" "}
        <Heading>Création d'un groupe </Heading>
      </Center>
      <Center>
        <Text as={"b"}>étape 1/5 : </Text>
      </Center>
      <Center>
        {" "}
        <Heading fontSize="2xl" isTruncated>
          Les caractéristiques de votre groupe
        </Heading>
      </Center>

      <TeamForm
        setSelectedSector={setSelectedSector}
        initialValues={{}}
        isLoading={isLoading}
        isError={isError}
        onSubmit={async (event) => {
          if (event.target[1].value.length < 300 && event.target[1].value.length > 0) {
            try {
              const team = await createTeamMutation({
                data: {
                  name: event.target[0].value,
                  description: event.target[1].value,
                  teamLatitude: parseFloat(event.target[5].value) as number,
                  teamLongitude: parseFloat(event.target[6].value) as number,
                  secteur: selectedSector.value as string,
                  typeOrg: event.target[8].value as string,
                  taille: parseInt(event.target[9].value) as number,
                  anneeCreation: parseInt(event.target[10].value) as number,
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

export default CreateTeamForm
