import Select from "react-select"
import { useMutation, useQuery } from "blitz"
import { Text, Box, Flex, Button, Center } from "@chakra-ui/react"
import * as React from "react"
import getAllTags from "app/admin/queries/getAllTags"
import { useMemo } from "react"
import DisableTag from "app/admin/mutations/DisableTag"
interface IOptions {
  value: String
  label: String
}
export interface IsTagsTeamPublic {
  public: boolean
}

const CreateTagComp = () => {
  const [DisableTagMutation] = useMutation(DisableTag)
  const [SelectedTagToUnable, setSelectedTagToUnable] = React.useState<IOptions>({
    value: "choisir un mot clef" as string,
    label: "choisir un mot clef",
  })
  const [SelectedTag, setSelectedTag] = React.useState<IOptions>({
    value: "choisir un mot clef" as string,
    label: "choisir un mot clef",
  })
  const [tags] = useQuery(
    getAllTags,
    { orderBy: { id: "asc" }, skip: 0, take: 200 },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )
  async function disableTagConfirm() {
    if (window.confirm("êtes vous sûre de vouloir désactivé ce mot clef ?")) {
      await DisableTagMutation({ where: { id: SelectedTag.value as string } })
      document.location.reload()
    }
  }

  const memoizedTags = useMemo(() => computeTags(tags), [tags])
  function computeTags(tags) {
    const Publictags = [] as IOptions[]
    for (let i = 0; i < tags.tags.length; i++) {
      const element = { value: tags.tags[i]?.id as string, label: tags.tags[i]?.id } as IOptions

      const isLinkWithPublicTeam = tags.tags[i]?.teams as IsTagsTeamPublic[]
      for (let y = 0; y < isLinkWithPublicTeam.length; y++) {
        if (tags.tags[i]?.teams[y]?.public === true && tags.tags[i]?.isPublic === true) {
          Publictags.push(element)
          break
        }
      }
    }
    return Publictags
  }
  function DisableTagOnChange(inputValue: IOptions) {
    setSelectedTag(inputValue as IOptions)
  }
  return (
    <div>
      <Center>
        <Text marginBottom={"3vh"} as="b" fontSize="3vh">
          Désactiver un mot clef ?
        </Text>
      </Center>

      <Flex>
        <Box width="50vw" marginRight="2vw">
          <Select options={memoizedTags as IOptions[]} onChange={DisableTagOnChange} />
        </Box>
        <Button marginLeft="2vw" onClick={disableTagConfirm}>
          Supprimer
        </Button>
      </Flex>
    </div>
  )
}

export default CreateTagComp
