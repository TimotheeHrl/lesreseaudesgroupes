import TeamPreForm from "app/teams/components/TeamPreFormEdit"
import getTeam from "app/teams/queries/getTeam"
import { useMutation, useParam, useQuery, useRouter, Router } from "blitz"
import React, { FC, useEffect } from "react"
import updateTeam from "app/teams/mutations/updateTeam"

const EditTeamForm: FC = () => {
  const router = useRouter()
  const teamId = useParam("teamId", "string")

  const [team] = useQuery(
    getTeam,
    {
      where: { id: teamId },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  const [updateTeamMutation, { isLoading, isError }] = useMutation(updateTeam)
  useEffect(() => {
    Router.prefetch(`/teams/${teamId}`)
  }, [])
  return (
    <TeamPreForm
      initialValues={team}
      isLoading={isLoading}
      isError={isError}
      onSubmit={async (event) => {
        try {
          await updateTeamMutation({
            where: { id: team.id },
            data: {
              description: event.target[0].value,
              taille: parseInt(event.target[1].value) as number,
              anneeCreation: parseInt(event.target[2].value) as number,
            },
          })
          router.push(`/teams/${teamId}`)
        } catch (error) {
          console.log(error)
        }
      }}
    />
  )
}
export default EditTeamForm
