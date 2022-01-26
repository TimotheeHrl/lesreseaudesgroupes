import { useEffect } from "react"
import { Router, Link, useRouter, useQuery, useParam, useMutation } from "blitz"
import getTpost from "app/tposts/queries/getTpost"
import {
  Center,
  Button,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  Box,
  Spacer,
} from "@chakra-ui/react"

const TpostMenu = () => {
  const router = useRouter()
  const tpostId = useParam("tpostId", "string") as string
  const teamId = useParam("teamId", "string") as string
  const [tpost] = useQuery(getTpost, {
    where: { id: tpostId },
  })
  let UpdatedAt = tpost.updatedAt.toString()
  let CreatedAt = tpost.createdAt.toString()
  useEffect(() => {
    Router.prefetch(`/teams/${teamId}/tposts`)
  }, [])

  return (
    <>
      <Center>
        <Accordion defaultIndex={[1]} allowMultiple>
          <AccordionItem>
            <AccordionButton _expanded={{ bg: "#F4FAFF", color: "black" }}>
              <Box flex="1" textAlign="left">
                <Flex>
                  <p style={{ fontSize: "18px", marginLeft: "2%" }}>{tpost.content}</p>
                  <Spacer />
                  <div>
                    <h1>créer à {CreatedAt.toLocaleLowerCase()}</h1>
                    <Spacer />
                    <p>Mise à jour à {UpdatedAt.toLocaleLowerCase()}</p>
                  </div>
                </Flex>
                <div style={{ fontSize: "2vh" }}>
                  <Box
                    mt={5}
                    borderWidth="1px"
                    borderRadius="lg"
                    w="100%"
                    h="500px"
                    dangerouslySetInnerHTML={{ __html: tpost.content }}
                  />
                </div>
              </Box>
            </AccordionButton>
          </AccordionItem>
        </Accordion>

        <Flex>
          <Button>
            <Link href={`teams/${teamId}/tposts/sldtpost/${tpost.id}/edit`}>
              <a>Modifier</a>
            </Link>
          </Button>
        </Flex>
      </Center>
    </>
  )
}
export default TpostMenu
