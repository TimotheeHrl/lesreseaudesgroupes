import { Center, Box, Spinner, VStack } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import UpdatePictureTeamForm from "app/teams/components/EditPictureTeamForm"
import { BlitzPage } from "blitz"
import React, { Suspense } from "react"

const EditTeamPicturePage: BlitzPage = () => {
  return (
    <Box>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <UpdatePictureTeamForm />
      </Suspense>
    </Box>
  )
}

EditTeamPicturePage.getLayout = (page) => <Layout title={"change l'image"}>{page}</Layout>

export default EditTeamPicturePage
