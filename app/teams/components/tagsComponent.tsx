import getTeamTags from "app/teams/queries/getTeamTags"
import { useQuery, useParam } from "blitz"
import "mapbox-gl/dist/mapbox-gl.css"
import { Stack, Tag, Text, Box } from "@chakra-ui/react"

function TagsComponent() {
  let teamId = useParam("teamId", "string") as string
  if (teamId === undefined) {
    teamId = useParam("feveid", "string") as string
  }

  const [TeamTags] = useQuery(
    getTeamTags,
    {
      where: { id: teamId },
    },
    {
      refetchOnWindowFocus: true,
    }
  )

  return (
    <>
      <Box
        mt="1vh"
        ml={{ base: "5vw", md: "5vw", lg: "6vw", xl: "10vw" }}
        mr={{ base: "5vw", md: "5vw", lg: "6vw", xl: "10vw" }}
      >
        <Stack direction={{ base: "column", md: "column", lg: "column", xl: "row" }}>
          {TeamTags.teamTags.length !== 0 ? (
            TeamTags.teamTags.map((tag) => (
              <Tag
                w={{ base: "50vw", md: "40vw", lg: "20vw", xl: "7vw" }}
                key={tag.id}
                variant="solid"
                colorScheme={"gray"}
              >
                {tag.id}
              </Tag>
            ))
          ) : (
            <>
              <Text fontSize="lg" as="i" color="gray">
                Aucun mot clef
              </Text>
            </>
          )}
        </Stack>
      </Box>
    </>
  )
}
export default TagsComponent
