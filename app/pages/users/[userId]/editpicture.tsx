import { Center, Box, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import UpdatePictureUserForm from "app/users/components/EditPictureUserForm"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const EditUserPicturePage: BlitzPage = () => {
  return (
    <Box>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <VStack spacing={8} w="100%" align="left">
          <UpdatePictureUserForm />
        </VStack>
      </Suspense>
    </Box>
  )
}

EditUserPicturePage.getLayout = (page) => <Layout title={"changer l'image"}>{page}</Layout>

export default EditUserPicturePage
