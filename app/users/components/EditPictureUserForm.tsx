import { useParam, Router, useRouter } from "blitz"
import { Button, Center } from "@chakra-ui/react"
import Upload from "app/users/components/uploadImage"
const UpdatePictureUserForm = () => {
  const router = useRouter()
  const userId = useParam("userId", "string") as string
  return (
    <>
      <Upload />
      <Center>
        <Button size="lg" colorScheme="blue" onClick={() => Router.push(`/users/${userId}`)}>
          Retour
        </Button>
      </Center>
    </>
  )
}
export default UpdatePictureUserForm
