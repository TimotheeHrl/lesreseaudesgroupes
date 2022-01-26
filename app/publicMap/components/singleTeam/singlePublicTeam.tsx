import getPublicTeam from "app/publicMap/queries/getPublicTeam"
import { useQuery, useParam } from "blitz"
import { Heading, Box, Tag, Text, Center, Flex, Container, Image } from "@chakra-ui/react"

function SingleTeam() {
  const teamId = useParam("feveid", "string") as string

  const [SingleTeam] = useQuery(
    getPublicTeam,
    {
      where: { id: teamId },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  let corpus = SingleTeam.corpus

  return (
    <>
      <div style={{ fontSize: "2vh" }}>
        <Box dangerouslySetInnerHTML={{ __html: corpus as string }} />
      </div>
    </>
  )
}
export default SingleTeam
