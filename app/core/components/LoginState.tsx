import { Router, useMutation, useQuery } from "blitz"
import logoutMutation from "app/auth/mutations/logout"
import { useCurrentUser } from "../hooks/useCurrentUser"

interface LoginStateProps {
  children: (info: {
    onClick: () => void
    isLoggedIn: boolean
    email?: string
    UserId?: string
  }) => JSX.Element
}

export function LoginState(props: LoginStateProps) {
  //const [currentUser, { isLoading }] = useQuery(getCurrentUser, null, { suspense: false })
  const currentUser = useCurrentUser()
  const [logout] = useMutation(logoutMutation)

  if (!currentUser) {
    return props.children({
      onClick: async () => {
        Router.push("/login")
      },
      isLoggedIn: false,
      email: undefined,
      UserId: undefined,
    })
  } else {
    return props.children({
      onClick: async () => {
        await logout()
        Router.push("/")
      },
      isLoggedIn: true,
      UserId: currentUser.user?.id as string,
    })
  }
}
