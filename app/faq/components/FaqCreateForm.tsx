import {
  Box,
  Button,
  FormLabel,
  HStack,
  Center,
  Input,
  FormControl,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react"
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import { Link } from "blitz"
import React, { useRef, useState, useMemo } from "react"

import Editor from "app/utils/textEditor/editor"
const { convert } = require("html-to-text")

import { useMutation, useRouter, usePaginatedQuery } from "blitz"

import CreateFaqItem from "app/faq/mutations/CreateFaqItem"
import getFaqAll from "app/faq/queries/getFaqAll"

type TeamPreFormProps = {
  initialValues: any
  onSubmit: React.FormEventHandler<HTMLFormElement>
  isLoading: boolean
  isError: boolean
}

const FaqCreateForm = () => {
  const router = useRouter()
  const [subject, setSubject] = useState<string>("")
  const [value, setOrder] = useState<number | string>(0)

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

  const faqLenght = faqs?.length as number

  const OrderMax = (faqLenght + 1) as number

  let Value = value
  const type = typeof Value
  let orderValue = 0 as number
  if (type === "string") {
    orderValue = parseInt(Value as string) as number
  } else {
    orderValue = Value as number
  }
  const [content, setContent] = useState<string>("")
  const html = content

  let hheight = "80vh"
  let wwidth = "70vw"
  const quillRef = useRef<any>(null)

  const [CreateFaqItemMutation, { isLoading, isError }] = useMutation(CreateFaqItem)

  async function post() {
    try {
      const mutation = await CreateFaqItemMutation({
        data: {
          subject: subject,
          content: content as string,
          orderSubject: orderValue as number,
        },
      })
      await mutation
      router.push(`/faq/faqListAdmin`)
    } catch (error) {
      console.log(error)
    }
  }

  function postCheck() {
    if (content.length === 8 || value === 0) {
      alert("Le champs est vide || la position du faq ne peut pas être 0")
    } else {
      post()
    }
  }
  function handleInputSubject(e) {
    let inputValue = e.target.value
    setSubject(inputValue)
  }
  const handleOrderInput = (value) => setOrder(value as number)

  return (
    <Box>
      <Center>
        {" "}
        <FormLabel>Créer un élèment dans le FAQ</FormLabel>{" "}
      </Center>
      <Center>
        {" "}
        <FormLabel>Titre (ou sujet) de ce FAQ :</FormLabel>{" "}
      </Center>

      <Center>
        {" "}
        <Input
          value={subject}
          onChange={handleInputSubject}
          placeholder="Titre (ou sujet) de ce FAQ"
          size="sm"
        />
      </Center>
      <FormLabel>La position par rapport au autre suject :</FormLabel>

      <Center>
        <FormControl>
          <NumberInput
            value={value}
            onChange={handleOrderInput}
            step={1}
            defaultValue={OrderMax}
            min={1}
            max={OrderMax}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </Center>
      <Center mt="5vh">
        <Editor
          quillRef={quillRef}
          hheight={hheight}
          wwidth={wwidth}
          value={content}
          setValue={setContent}
        />
      </Center>

      <HStack p="3vh" mt="5vh" mr="2vw" spacing={4}>
        <Button colorScheme="yellow" onClick={postCheck} isLoading={isLoading}>
          {"Créer"}
        </Button>
        <Link href={`/faq/faqListAdmin`}>
          <Button colorScheme="yellow" isLoading={isLoading} variant="link">
            Retour{" "}
          </Button>
        </Link>
      </HStack>
    </Box>
  )
}

export default FaqCreateForm
