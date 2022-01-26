import verifyEmailMutation from "app/auth/mutations/verify-email"
import Layout from "app/core/layouts/Layout"
import { BlitzPage, Router, useMutation, useParam, useRouterQuery } from "blitz"
import { useEffect, useState } from "react"
import { Spinner } from "@chakra-ui/react"
const VerifyMail: BlitzPage = () => {
  const code = useParam("code", "string")

  const [verifyEmail] = useMutation(verifyEmailMutation)

  const [error, setError] = useState(false)

  useEffect(() => {
    if (!code) {
      return
    }

    Router.prefetch("/collectifs")

    verifyEmail({ code }).then((success) => {
      if (success) {
        Router.replace("/collectifs")
      } else {
        setError(true)
      }
    })
  }, [code, setError, verifyEmail])

  return (
    <div className="flex justify-center items-center mt-8">{error ? "Oups!" : <Spinner />}</div>
  )
}

VerifyMail.getLayout = (page) => <Layout title="Vérification...">{page}</Layout>

export default VerifyMail
