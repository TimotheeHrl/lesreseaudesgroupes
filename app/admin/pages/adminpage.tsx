import { Center, Text, Button, Container, Spinner, Box } from "@chakra-ui/react"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Link } from "blitz"
import React, { Suspense } from "react"
import teamsToValid from "app/admin/components/PublishDemands"
import AddAdmin from "app/admin/components/AddAdmin"
import BannUser from "app/admin/components/BannUser"
import UnpublishComponent from "app/admin/components/UnpublishComponent"
import SignalsToAdmin from "app/admin/components/SignalsToAdmin"
import CreateTagComp from "app/admin/components/createTag"
import AdminList from "app/admin/components/AdminList"
import ApostListPublic from "app/admin/components/ApostList"
import DeletePublicChat from "app/admin/components/DeletePublicChat"
import FaqList from "app/faq/components/FaqList"
const AdminPage: BlitzPage = () => {
  return (
    <Container maxW="2xl" centerContent p={8}>
      <Suspense
        fallback={
          <Center h="100vh">
            <Spinner />
          </Center>
        }
      >
        <Box>
          <AdminList />
          <Box marginBottom={"3vh"}>
            <AddAdmin />
          </Box>
          <Box marginBottom={"3vh"}>{CreateTagComp()}</Box>
          <Center>
            <Text marginBottom={"3vh"} as="b" fontSize="3vh">
              signalements des utilisateurs :
            </Text>
          </Center>
          <Box marginBottom={"3vh"}>
            <SignalsToAdmin />
          </Box>
          <Box marginBottom={"3vh"}>{teamsToValid()}</Box>

          <Box marginBottom={"3vh"}>
            <BannUser />
          </Box>

          <Box marginBottom={"3vh"}>
            <DeletePublicChat />
          </Box>
          <Box marginBottom={"3vh"}>
            <UnpublishComponent />
          </Box>

          <Center>
            <Link href={"/frontpage"}>
              <Button mt="2vh" p="2vh" mb="3vh" size="xl" colorScheme="blue" marginBottom={"3vh"}>
                Modifier la page principage
              </Button>
            </Link>
          </Center>
          <Center>
            <Link href={"/apostList"}>
              <Button p="2vh" mb="3vh" colorScheme="blue" marginBottom={"3vh"}>
                Publications
              </Button>
            </Link>
          </Center>
          <Center>
            <Link href={"/faq/faqListAdmin"}>
              <Button p="2vh" mb="3vh" colorScheme="blue" marginBottom={"3vh"}>
                Modifier le FAQ
              </Button>
            </Link>
          </Center>
        </Box>
      </Suspense>
    </Container>
  )
}

AdminPage.getLayout = (page) => <Layout title={"admin"}>{page}</Layout>
export default AdminPage
