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
import { Link, usePaginatedQuery, useParam, useMutation } from "blitz"
import React from "react"
import getAposts from "app/admin/queries/getAposts"
const ApostList = () => {
  const [{ aposts }] = usePaginatedQuery(
    getAposts,
    {
      orderBy: { updatedAt: "desc" },
    },
    {
      refetchOnWindowFocus: true,
    }
  )

  return (
    <Box bgColor={"whitesmoke"}>
      <Center>
        <Heading marginTop={"5vh"} marginBottom={"2vh"}>
          Les Publications
        </Heading>{" "}
      </Center>
      <Center>
        <Link href={`/aposts/new`} passHref key="newAdminButton">
          <Button as="a" colorScheme="blue" size="lg">
            Créer une publication
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
      <Wrap spacing="30px" justify="center">
        <Box
          marginTop={"5vh"}
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          bgColor={"white"}
        >
          {aposts.map((apost) => {
            let UpdatedAt = apost?.updatedAt.toLocaleString("fr", { timeZone: "CET" })
            let CreatedAt = apost?.createdAt.toLocaleString("fr", { timeZone: "CET" })
            let content = apost?.content
            return (
              <Box marginTop="lg" marginBottom={"2vh"} key={apost?.id}>
                <div>
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
                  <Center>
                    <div style={{ fontSize: "2vh" }}>
                      <Box w="70vw" h="auto" dangerouslySetInnerHTML={{ __html: content }}></Box>
                    </div>
                  </Center>
                  <Center>
                    <Button color={"blue"} marginTop="3vw">
                      <Link href={`/aposts/${apost.id}/edit`} passHref>
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

export default ApostList
