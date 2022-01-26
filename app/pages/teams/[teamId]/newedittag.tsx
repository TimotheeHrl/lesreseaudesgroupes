import React, { useEffect, useMemo, useState, FC } from "react"
import {
  Button,
  Container,
  ButtonProps,
  Flex,
  Heading,
  Input,
  InputProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Stack,
  Tag,
  TagCloseButton,
  TagProps,
  Text,
  FormControl,
  FormLabel,
  Box,
  Center,
} from "@chakra-ui/react"
import updataTagTeam from "app/teams/mutations/createTags"
import getTags from "app/teams/queries/getags"
import { useMutation, useRouter, useQuery, useParam, Link, BlitzPage } from "blitz"
import getTeamTags from "app/teams/queries/getTeamTags"
import Layout from "app/core/layouts/Layout"

/**
 * Renders an added tagg
 */
type TeamFormProps = {
  initialValues: any
  isLoading: boolean
  isError: boolean
}
interface TagTagProps extends TagProps {
  // Tag to render in tag
  value: string

  // Removes @value
  pop: () => void
}

//let TTag = [] as string[]

const TagTag: React.FC<TagTagProps> = ({ value, pop, ...style }: TagTagProps) => (
  <Tag minWidth="max-content" fontWeight="bold" backgroundColor="yellow.500" {...style}>
    {value}
    <TagCloseButton onClick={pop} />
  </Tag>
)

/**
 * Clickable menu item to add a tagg
 */

interface TagOptionProps extends ButtonProps {
  // Tag to render in option
  value: string

  // Adds @value
  push: () => void
}

const TagOption: React.FC<TagOptionProps> = ({ value, push, ...style }: TagOptionProps) => (
  <Button
    variant="ghost"
    isFullWidth
    width="100%"
    borderRadius={0}
    fontWeight="normal"
    textTransform="none"
    justifyContent="flex-start"
    onClick={push}
    {...style}
  >
    {value}
  </Button>
)

/**
 * Input for adding TTag
 */

interface TagInputProps extends InputProps {
  // Adds a tagg
  push: (value: string) => void

  // Removes tagg at index, or the last added tagg
  pop: (index?: number) => void
}
let TagValues = [] as string[]

const TagInput: React.FC<TagInputProps> = ({ push, pop, ...style }: TagInputProps) => {
  const [tags] = useQuery(
    getTags,
    { where: { isPublic: true }, orderBy: { id: "asc" }, skip: 0, take: 200 },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )
  let TTag = tags.tags
  const memoizedTags = useMemo(() => computeTags(TTag), [TTag])
  function computeTags(TTag) {
    const TagIds = [] as string[]

    for (let i = 0; i < TTag.length; i++) {
      const tagId = TTag[i]?.id as string
      TagIds.push(tagId)
    }
    return TagIds
  }
  const [input, setInput] = useState<string>("")
  const [options, setOptions] = useState<string[]>([])
  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    if (TagValues.length < 5) {
      setInput(value)
    }
  }
  const handleInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = ({ key }) => {
    if (TagValues.length < 5) {
      if (key === "Enter" && input.length > 19) {
        alert("Les mots clefs compris entre 2 et 25 caractères")
      }
      if (key === "Enter" && input.length > 0 && input.length < 20) {
        // Add currently entered tagg
        let value = input.toLocaleLowerCase()
        if (options.length > 0) {
          // Input has one or matches in tagg database, use the first
          ;([value] as string[]) === options
        } else {
          // Input is new, add it to our tagg database
          memoizedTags.push(value)
        }
        push(value)
        setInput("")
      } else if (key === "Backspace" && input.length === 0) {
        // Remove last added tagg
        pop()
      }
    }
  }

  useMemo(() => {
    if (input.length === 0) {
      // Input has been cleared, reset the tagg search
      setOptions([])
    } else {
      // Search for TTag starting with input
      // TODO: improve UX w/ fuzzy search?
      setOptions(
        memoizedTags.filter((tagg) => tagg.toLowerCase().includes(input.toLocaleLowerCase()))
      )
    }
  }, [input])

  return (
    <Popover isOpen={options.length > 0} autoFocus={false} placement="bottom-start" isLazy>
      <PopoverTrigger>
        <Input
          flex={1}
          minWidth="200px"
          paddingX={1}
          border="none"
          placeholder="Vos mots clefs"
          marginInlineStart={0}
          _focus={{}}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          {...style}
        />
      </PopoverTrigger>
      {/*
       * TODO: Tag menu UX can be improved by
       * enabling navigation using arrow keys.
       */}
      <PopoverContent _focus={{}}>
        <PopoverBody paddingX={0} maxHeight="300px" overflowY="scroll">
          {options.map((option) => (
            <TagOption
              key={option}
              value={option}
              push={() => {
                push(option)
                setInput("")
              }}
            />
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

/**
 * Parent tag input component
 */

interface TagTagInputProps {
  // List of added TTag
  values: string[]

  // Invoked to update tagg values
  onChange: React.Dispatch<React.SetStateAction<string[]>>
}

const TagTagInput: React.FC<TagTagInputProps> = ({ values, onChange }: TagTagInputProps) => {
  const push = (value: string): void => {
    onChange([...values, value.replace(/[^a-zA-Zéàèê' ']/gm, "").toLocaleLowerCase()])
  }

  const pop = (index?: number): void => {
    if (index !== undefined) {
      // Remove tagg at index
      onChange(values.filter((_, i) => i !== index))
    } else {
      // Remove last added tagg
      onChange(values.filter((_, i) => i !== values.length - 1))
    }
  }

  return (
    <Flex
      flexDirection="row"
      border="2px solid"
      padding={2}
      borderRadius={8}
      flexWrap="wrap"
      transition="all 0.2s"
      _focusWithin={{
        borderColor: "red.500",
        boxShadow: "md",
      }}
    >
      {/*
       * TODO: Using index as key is ok right now because this list's
       * order is uneditable, but in the future we probably want to
       * generate unique tag ID's for better reliability.
       */}
      {values.map((value, index) => (
        <TagTag key={index} value={value} pop={() => pop(index)} height="2rem" margin={1} />
      ))}
      <TagInput push={push} pop={pop} height="2rem" marginY={1} />
    </Flex>
  )
}

/**
 * Root app
 */

const newedittag: BlitzPage = () => {
  let existingTeamTags = [] as string[]
  const [values, setValues] = useState<string[]>(existingTeamTags)
  const teamId = useParam("teamId", "string")
  console.log(values)
  const [team] = useQuery(
    getTeamTags,
    { where: { id: teamId } },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  TagValues = values

  team?.teamTags.map((teamTag) => existingTeamTags.push(teamTag.id))
  const router = useRouter()
  const [createTagMutation, { isLoading, isError }] = useMutation(updataTagTeam)

  async function aller(event) {
    event.preventDefault()
    try {
      const team = await createTagMutation({
        where: { id: teamId },
        data: {
          tags: {
            connectOrCreate: values?.map((t) => ({
              where: { id: t },
              create: { id: t.toLowerCase() },
            })),
          },
        },
      })

      router.push(`/teams/${team.id}/newinvite`)
    } catch (error) {
      return { error: error.toString() }
    }
  }

  return (
    <Box>
      <FormControl id="tags" isDisabled={isLoading}>
        <Center>
          {" "}
          <FormLabel mt="5vh" fontSize="3vh">
            Ajouter des mots Clefs
          </FormLabel>{" "}
        </Center>
        <Center>
          {" "}
          <Heading mt="2vh" color="grey" fontSize="md" isTruncated>
            5 mots clefs maximum
          </Heading>
        </Center>
        <Center>
          <Heading mt="2vh" color="grey" fontSize="md" isTruncated>
            Vous pouvez choisir parmit les mots existants ou en créé vous même
          </Heading>
        </Center>
        <Center>
          <Heading mt="2vh" color="grey" fontSize="md" isTruncated>
            Pour créer un mot clef, taper votre mot clef et appuyer sur 'entrer'
          </Heading>
        </Center>
        <Container mt="5vh" w={{ base: "90vw", md: "70vw", lg: "50vw", xl: "50vw" }}>
          <TagTagInput values={values} onChange={setValues} />
        </Container>
      </FormControl>
      <Center mt="5vh">
        <Box display="flex">
          <Button mr="6vw" onClick={aller} colorScheme="blue" isLoading={isLoading}>
            {"Enregistrer et suivant"}
          </Button>
          <Link href={`/teams/${teamId}/neweditcorpus`}>
            <Button isLoading={isLoading}>précédent </Button>
          </Link>
        </Box>
      </Center>
    </Box>
  )
}

newedittag.getLayout = (page) => <Layout title={"ajouter des tags"}>{page}</Layout>

export default newedittag
