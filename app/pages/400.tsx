import { Head, ErrorComponent } from "blitz"

// ------------------------------------------------------
// This page is rendered if a route match is not found
// ------------------------------------------------------
export default function Page400() {
  const statusCode = 400
  const title = "Oups! Nous ne voulons pas de cette erreur"
  localStorage.clear()
  document.location.reload()

  return (
    <>
      <Head>
        <title>
          {statusCode}: {title}
        </title>
      </Head>
      <ErrorComponent statusCode={statusCode} title={title} />
    </>
  )
}
