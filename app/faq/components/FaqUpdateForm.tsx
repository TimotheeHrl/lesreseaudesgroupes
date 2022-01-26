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

import { useMutation, useRouter, usePaginatedQuery, useParam, useQuery } from "blitz"

import UpdateFaqItem from "app/faq/mutations/UpdateFaqItem"
import getFaqAll from "app/faq/queries/getFaqAll"
import getFaqItem from "app/faq/queries/getFaqItem"
import DeleteFaqItem from "app/faq/mutations/DeleteFaqItem"

import React, { useRef, useState, useMemo } from "react"

import Editor from "app/utils/textEditor/editor"
const { convert } = require("html-to-text")

const FaqUpdateForm = () => {
  const router = useRouter()
  const faqId = useParam("faqId", "string") as string
  const [faqItem] = useQuery(
    getFaqItem,
    {
      where: { id: faqId },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  let faqSubject = faqItem?.subject as string
  let faqContent = faqItem?.content as string
  let faqOrder = faqItem?.orderSubject as number
  const [subject, setSubject] = useState<string>(faqSubject)
  const [value, setOrder] = useState<number | string>(faqOrder)
  const [content, setContent] = useState<string>(faqContent)
  const html = content

  let hheight = "80vh"
  let wwidth = "70vw"
  const quillRef = useRef<any>(null)
  const [DeleteFaqItemMutation] = useMutation(DeleteFaqItem)

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
  let OrderMax = faqLenght as number

  let Value = value
  const type = typeof Value
  let orderValue = 0 as number
  if (type === "string") {
    orderValue = parseInt(Value as string) as number
  } else {
    orderValue = Value as number
  }

  const [UpdateFaqItemMutation, { isLoading, isError }] = useMutation(UpdateFaqItem)

  async function post() {
    try {
      const mutation = await UpdateFaqItemMutation({
        where: { id: faqId },
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
      alert("Le champs est vide | la position du faq ne peut pas être 0")
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
            defaultValue={faqOrder}
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

      <Center>
        <HStack p="3vh" mt="5vh" mr="2vw" spacing={4}>
          <Button colorScheme="yellow" onClick={postCheck} isLoading={isLoading}>
            {"Modifier"}
          </Button>
          <Link href={`/faq/faqListAdmin`}>
            <Button colorScheme="yellow" isLoading={isLoading} variant="link">
              Retour{" "}
            </Button>
          </Link>{" "}
          <Button
            onClick={async () => {
              if (window.confirm("êtes vous sûre de vouloir supprimer cet item faq ?")) {
                await DeleteFaqItemMutation({ where: { id: faqId } })
                router.push(`/faq/faqListAdmin`)
              }
            }}
          >
            supprimer
          </Button>{" "}
        </HStack>
      </Center>
    </Box>
  )
}

export default FaqUpdateForm
