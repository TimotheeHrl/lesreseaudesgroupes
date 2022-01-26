import {
  AppProps,
  ErrorBoundary,
  ErrorComponent,
  AuthenticationError,
  AuthorizationError,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
} from "blitz"
import LoginPage from "app/auth/pages/login"
import { Suspense } from "react"
import { ChakraProvider, Spinner, Center } from "@chakra-ui/react"
import "app/styles/index.css"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import * as dayjs from "dayjs"
import "dayjs/locale/fr" // import locale
dayjs.locale("fr") // use locale globally

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <Suspense
      fallback={
        <Center h="100vh">
          <Spinner />
        </Center>
      }
    >
      <ChakraProvider>
        <ErrorBoundary
          FallbackComponent={RootErrorFallback}
          onReset={useQueryErrorResetBoundary().reset}
        >
          {getLayout(<Component {...pageProps} />)}
        </ErrorBoundary>
      </ChakraProvider>
    </Suspense>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <LoginPage />
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Désolé, vous n'avez pas les permissions requise pour acceder à cette page"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}
