import { Heading, HStack } from "@chakra-ui/react"
import React, { FC } from "react"

const CreateTpostHeading: FC = () => {
  return (
    <HStack spacing={8} justifyContent="space-between" w="100%">
      <Heading fontSize="2xl" isTruncated>
        Localisation du groupe
      </Heading>
    </HStack>
  )
}

export default CreateTpostHeading
