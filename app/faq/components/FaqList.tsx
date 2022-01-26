import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Grid,
  Heading,
  Text,
  VStack,
  Center,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import getFaqAll from "app/faq/queries/getFaqAll"
import { Link, usePaginatedQuery, useRouter } from "blitz"
import React from "react"

const FaqList = () => {
  const [{ faqs }] = usePaginatedQuery(
    getFaqAll,
    {
      orderBy: { orderSubject: "asc" },
    },
    {
      staleTime: 10000,
      cacheTime: 10000,
      refetchOnWindowFocus: true,
    }
  )

  return (
    <Box bgColor={"whitesmoke"}>
      <Center>
        <Heading marginTop={"5vh"} marginBottom={"2vh"}>
          Les sujects FAQ
        </Heading>{" "}
      </Center>
      <Center>
        <Link href={`/faq/new`} passHref key="newAdminButton">
          <Button as="a" colorScheme="blue" size="lg">
            Créer un nouvel item FAQ
          </Button>
        </Link>
      </Center>
      <Center>
        <Link href={`/adminpage`} passHref key="newTeamButton">
          <Button as="a" colorScheme="yellow" size="lg">
            Retour{" "}
          </Button>
        </Link>
      </Center>
      <Wrap justify="center">
        <Box marginTop={"5vh"} bgColor={"white"}>
          {faqs.map((faq) => {
            let UpdatedAt = faq.updatedAt.toLocaleString("fr", { timeZone: "CET" })
            let CreatedAt = faq.createdAt.toLocaleString("fr", { timeZone: "CET" })
            let content = faq.content

            return (
              <Box
                border="solid"
                borderWidth="1px"
                borderRadius="lg"
                marginTop="2vh"
                marginBottom={"2vh"}
                key={faq.id}
              >
                <div>
                  <Center>
                    <Text fontSize="lg" as="i">
                      Titre : {faq.subject}
                    </Text>
                  </Center>
                  <Center>
                    <Text fontSize="lg" as="i">
                      créer à {CreatedAt.toLocaleLowerCase()}
                    </Text>
                  </Center>
                  <Center>
                    <Text fontSize="lg" as="i">
                      mis à jour à {UpdatedAt.toLocaleLowerCase()}
                    </Text>
                  </Center>
                  <div style={{ fontSize: "2vh" }}>
                    <Box
                      mt={5}
                      borderWidth="1px"
                      borderRadius="lg"
                      w="90vw"
                      h="auto"
                      dangerouslySetInnerHTML={{ __html: content }}
                    ></Box>
                  </div>
                  <Center>
                    <Button marginBottom={"2vh"} color={"blue"} marginTop="3vw">
                      <Link href={`/faq/${faq.id}/edit`} passHref>
                        Modifier
                      </Link>
                    </Button>
                  </Center>
                </div>
              </Box>
            )
          })}
        </Box>
      </Wrap>
    </Box>
  )
}

export default FaqList
