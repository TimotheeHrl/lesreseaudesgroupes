import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Spacer,
  Box,
  Button,
  Avatar,
  Flex,
} from "@chakra-ui/react"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
//import { Tpost } from "app/pages/teams/[teamId]/tposts/[tpostId]";
import getTpost from "app/publicMap/queries/getTpost"
import getTrepliesAll from "app/treplies/queries/getTrepliesAll"
import { Link, usePaginatedQuery, useParam, useRouter, useQuery } from "blitz"
import React from "react"
import getTeamName from "app/publicMap/queries/getTeamName"

const TpostSelected = () => {
  const router = useRouter()
  const currentUser = useCurrentUser()
  const teamId = useParam("teamId", "string") as string
  const tpostId = useParam("tpostId", "string") as string
  const [tpost] = useQuery(
    getTpost,
    {
      where: {
        id: tpostId,
      },
    },
    {
      staleTime: 1000,
      cacheTime: 1000,
      refetchOnMount: true,
    }
  )

  const [TeamName] = useQuery(
    getTeamName,
    {
      where: {
        id: teamId,
      },
    },

    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )

  const [treplies] = usePaginatedQuery(
    getTrepliesAll,
    {
      orderBy: { createdAt: "desc" },
      where: {
        tpostId: tpostId,
      },
    },
    {
      staleTime: 1000,
      cacheTime: 1000,
      refetchOnMount: true,
    }
  )

  let UpdatedAt = tpost.updatedAt.toLocaleString("fr", { timeZone: "CET" })
  let tpostUserName = tpost.user.name as string
  let tpostUserAvatar = tpost.user.avatar as string
  let TpostId = tpost.id
  const treply = treplies.treplies.map((reply) => (
    <div key={reply.id}>
      <Flex>
        <Avatar size="sm" max={1} src={reply.user.avatar as string} />
        <h3 style={{ fontSize: "14px", marginLeft: "2%", marginTop: "3px" }}>{reply.user.name}</h3>
        <Spacer />
        <h3 style={{ fontSize: "14px", marginTop: "3px" }}>
          {reply.createdAt.toLocaleString("fr", { timeZone: "CET" })}
        </h3>
      </Flex>

      <h3 style={{ fontSize: "14px" }}>{reply.content}</h3>
    </div>
  ))
  return (
    <>
      <Accordion defaultIndex={[1]} allowMultiple>
        <AccordionItem>
          <h2>
            <AccordionButton
              _expanded={{ bg: "#F4FAFF", color: "black" }}
              style={{ borderStyle: "groove" }}
            >
              <Box flex="1" textAlign="left">
                <Flex>
                  <Avatar size="sm" max={1} src={tpostUserAvatar} />

                  <p style={{ fontSize: "18px", marginLeft: "2%" }}>{tpostUserName}</p>
                  <Spacer />
                  <p>par {UpdatedAt}</p>
                </Flex>
                <p style={{ fontSize: "16px", fontStyle: "italic" }}>de {TeamName.name}</p>
                <h1>post content</h1>
                {tpost.treplys.length > 0 && (
                  <h2 style={{ fontSize: "16px", textAlign: "end" }}>
                    {tpost.treplys.length} réponses
                  </h2>
                )}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <div> {treply} </div>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </>
  )
}

export default TpostSelected
