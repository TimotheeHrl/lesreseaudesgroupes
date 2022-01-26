import { useEffect } from "react"
import { Link, useRouter, useQuery, useParam, Router, useMutation } from "blitz"
import gettevent from "app/tevents/queries/getTEvent"
import deletetevent from "app/tevents/mutations/deleteTevent"
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
const teventMenu = () => {
  const router = useRouter()
  const teventId = useParam("teventId", "string") as string
  const teamId = useParam("teamId", "string") as string
  const [deleteteventMutation] = useMutation(deletetevent)
  const [tevent] = useQuery(gettevent, {
    where: { id: teventId },
  })
  let UpdatedAt = tevent.updatedAt.toString()
  let CreatedAt = tevent.createdAt.toString()
  useEffect(() => {
    Router.prefetch(`teams/${teamId}/tevents/sldtevent`)
  }, [])
  return (
    <>
      <Center>
        <Accordion defaultIndex={[1]} allowMultiple>
          <AccordionItem>
            <AccordionButton _expanded={{ bg: "#F4FAFF", color: "black" }}>
              <Box flex="1" textAlign="left">
                <Flex>
                  <p style={{ fontSize: "18px", marginLeft: "2%" }}>{tevent.content}</p>
                  <Spacer />
                  <div>
                    <h1>créer à {CreatedAt.toLocaleLowerCase()}</h1>
                    <Spacer />
                    <p>Mise à jour à {UpdatedAt.toLocaleLowerCase()}</p>
                  </div>
                </Flex>
                <Box
                  mt={5}
                  borderWidth="1px"
                  borderRadius="lg"
                  w="100%"
                  h="500px"
                  dangerouslySetInnerHTML={{ __html: tevent.content }}
                ></Box>
              </Box>
            </AccordionButton>
          </AccordionItem>
        </Accordion>

        <Flex>
          <Button>
            <Link href={`teams/${teamId}/tevents/sldtevent/${tevent.id}/edit`}>
              <a>modifier</a>
            </Link>
          </Button>

          <Button
            type="button"
            onClick={async () => {
              if (window.confirm("êtes vous certain de vouloir annuler cet événement ?")) {
                await deleteteventMutation({ id: tevent.id })
                router.push(`teams/${teamId}/tevents/sldtevent`)
              }
            }}
            style={{ marginLeft: "0.5rem" }}
          >
            Supprimer
          </Button>
        </Flex>
      </Center>
    </>
  )
}
export default teventMenu
