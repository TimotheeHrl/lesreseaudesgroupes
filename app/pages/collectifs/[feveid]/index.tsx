import {
  HStack,
  Center,
  Container,
  Text,
  Heading,
  Flex,
  Spinner,
  Image,
  Box,
  Stack,
} from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import SingleTeam from "app/publicMap/components/singleTeam/singlePublicTeam"
import React, { Suspense } from "react"
import MembersList from "app/teams/components/MembersList"
import { useQuery, useParam, BlitzPage } from "blitz"
import getPublicTeam from "app/publicMap/queries/getPublicTeam"
import FollowingTeam from "app/publicMap/components/singleTeam/FollowTeam"
import TpostList from "app/publicMap/components/singleTeam/TpostList"
import WriteMessageTeam from "app/publicMap/components/singleTeam/MesssageTeam"
import TagsComponent from "app/teams/components/tagsComponent"
import EventListPublic from "app/publicMap/components/singleTeam/EventList"
import IsTeamMember from "app/teams/queries/IsTeamMember"
const SingleTeamMapPage: BlitzPage = () => {
  const teamId = useParam("feveid", "string") as string
  const [team] = useQuery(
    getPublicTeam,
    {
      where: { id: teamId },
    },
    {
      staleTime: 10000,
      cacheTime: 10000,
      refetchOnWindowFocus: true,
    }
  )
  const [MatchedTeamMember] = useQuery(
    IsTeamMember,
    {
      where: { id: teamId },
    },
    {
      staleTime: 10000,
      cacheTime: 10000,
      refetchOnWindowFocus: true,
    }
  )

  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner />
        </Center>
      }
    >
      <Box>
        <Center>
          <Image
            width="100vw"
            src={team.image}
            alt={team.name}
            fallbackSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cumulus_clouds_in_Russia._img_067.jpg/1925px-Cumulus_clouds_in_Russia._img_067.jpg"
          />
        </Center>
        <Center>
          {team.name.length > 15 ? (
            <Text
              position="absolute"
              top={{ base: "20vh", md: "25vh", lg: "30vh", xl: "30vh" }}
              color="white"
              textAlign="center"
              fontSize={{ base: "3vh", md: "7vh", lg: "7vh", xl: "9vh" }}
              textShadow="#000 0px 0px 3px"
            >
              {team.name}
            </Text>
          ) : (
            <Text
              position="absolute"
              top={{ base: "20vh", md: "25vh", lg: "30vh", xl: "30vh" }}
              color="white"
              fontSize={{ base: "6vh", md: "7vh", lg: "7vh", xl: "18vh" }}
              textShadow="#000 0px 0px 3px"
            >
              {team.name}
            </Text>
          )}
        </Center>
      </Box>

      <Box marginLeft="5vw" marginRight="5vw">
        <Box marginTop="5vh">
          <Center>
            <Text fontSize="5vh" color="gray.500" as="i">
              " {team.description} "
            </Text>
          </Center>
        </Box>
        <Center>
          <MembersList />
        </Center>
        <Center>
          <Box display={{ base: "row", md: "row", lg: "flex", xl: "flex" }}>
            <Center>
              <Box marginTop={"2vh"} marginBottom={"3vh"}>
                {MatchedTeamMember.MatchedTeamMember === false && (
                  <>
                    <FollowingTeam />
                    <WriteMessageTeam />
                  </>
                )}
              </Box>
            </Center>

            <Box marginTop={"2vh"}>
              <Box
                ml={{ base: "5vw", md: "5vw", lg: "6vw", xl: "10vw" }}
                mr={{ base: "5vw", md: "5vw", lg: "6vw", xl: "10vw" }}
                marginBottom="1vh"
                marginTop="1vh"
              >
                <Text as="i" fontSize="lg" color="gray.600">
                  {" "}
                  <span style={{ color: "gray", marginRight: "0.5vw" }}>Créée en :</span>
                  {team.anneeCreation}
                </Text>
              </Box>
              <Box
                ml={{ base: "5vw", md: "5vw", lg: "6vw", xl: "10vw" }}
                mr={{ base: "5vw", md: "5vw", lg: "6vw", xl: "10vw" }}
                marginBottom="1vh"
                marginTop="1vh"
              >
                {" "}
                <Text as="i" fontSize="lg" color="gray.600">
                  <span style={{ color: "gray", marginRight: "0.5vw" }}>Nombre de membres :</span>
                  {team.taille}
                </Text>
              </Box>
              <Box
                ml={{ base: "5vw", md: "5vw", lg: "6vw", xl: "10vw" }}
                mr={{ base: "5vw", md: "5vw", lg: "6vw", xl: "10vw" }}
                marginBottom="1vh"
                marginTop="1vh"
              >
                {" "}
                <Text as="i" fontSize="lg" color="gray.600">
                  <span style={{ color: "gray", marginRight: "0.5vw" }}>
                    Caractéristiques de l'organisation :
                  </span>
                  {team.typeOrg}
                </Text>
              </Box>
              <Box
                mt="1vh"
                marginBottom="1vh"
                ml={{ base: "5vw", md: "5vw", lg: "6vw", xl: "10vw" }}
                mr={{ base: "5vw", md: "5vw", lg: "6vw", xl: "10vw" }}
              >
                {" "}
                <Text as="i" fontSize="lg" color="gray.600">
                  {" "}
                  <span style={{ color: "gray", marginRight: "0.5vw" }}>Secteur :</span>
                  {team.secteur}
                </Text>
              </Box>{" "}
              <Box
                marginTop="1vh"
                ml={{ base: "5vw", md: "5vw", lg: "6vw", xl: "10vw" }}
                mr={{ base: "5vw", md: "5vw", lg: "6vw", xl: "10vw" }}
              >
                <Text as="i" fontSize="lg" style={{ color: "gray" }}>
                  Les Thèmatiques :
                </Text>
                <Box>
                  {" "}
                  <TagsComponent />{" "}
                </Box>
              </Box>
            </Box>
          </Box>
        </Center>

        <Center>
          <Box marginTop={"3vh"} marginBottom={"3vh"}>
            <SingleTeam />
          </Box>
        </Center>
        <Center />

        <Center>
          <Box marginTop={"3vh"} marginBottom={"3vh"}>
            <EventListPublic />
          </Box>
        </Center>
        <Center>
          <Box marginTop={"3vh"} marginBottom={"3vh"}>
            <TpostList />
          </Box>
        </Center>
      </Box>
    </Suspense>
  )
}

SingleTeamMapPage.getLayout = (page) => <Layout title={"Teams"}>{page}</Layout>

export default SingleTeamMapPage
