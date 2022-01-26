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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react"
import getFaqAll from "app/faq/queries/getFaqAll"
import { Link, usePaginatedQuery, useRouter } from "blitz"
import React from "react"

const FaqPublic = () => {
  const [{ faqs }] = usePaginatedQuery(
    getFaqAll,
    {
      orderBy: { orderSubject: "asc" },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )

  return (
    <Box>
      <Box>
        <Accordion allowToggle minWidth="70vw">
          {faqs.map((faq) => {
            return (
              <AccordionItem key={faq.id}>
                <h2>
                  <AccordionButton>
                    <Box maxWidth="70vw" flex="1" as="a" textAlign="left">
                      {faq.subject}
                    </Box>

                    <AccordionIcon />
                  </AccordionButton>
                </h2>

                <AccordionPanel maxWidth="70vw" pb={4}>
                  <div style={{ fontSize: "2vh" }}>
                    <Box dangerouslySetInnerHTML={{ __html: faq?.content }}></Box>
                  </div>
                </AccordionPanel>
              </AccordionItem>
            )
          })}
        </Accordion>
      </Box>
    </Box>
  )
}

export default FaqPublic
