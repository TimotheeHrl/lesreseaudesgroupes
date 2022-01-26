import { Center, Heading, Image, Spinner, Text, VStack } from "@chakra-ui/react"
import React, { FC, ReactNode } from "react"

type IProps = {
  icon?: string
  heading: string
  text: string
  buttons?: ReactNode[]
}

const EmptyState: FC<IProps> = ({ icon, heading, text, buttons }) => {
  return (
    <Center>
      <VStack spacing={4} maxW="md" textAlign="center">
        <Heading fontSize="2xl" isTruncated>
          {heading}
        </Heading>
        <Text>{text}</Text>
        {buttons}
      </VStack>
    </Center>
  )
}

export default EmptyState
