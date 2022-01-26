import { useMutation, useQuery, useParam, Router, useRouter } from "blitz"
import React, { FC, useState } from "react"
import { FormLabel, Switch, Stack, Center, Heading, Text, Button } from "@chakra-ui/react"
import getUserPerso from "app/users/queries/getUserPerso"
import updateNotificationsMut from "app/users/mutations/updateNotificationsMut"

const UpdateNotification: FC = () => {
  const userId = useParam("userId", "string")

  const [userQuery] = useQuery(getUserPerso, {
    where: {
      id: userId,
    },
  })
  const notifStatus = userQuery?.getNotifications as boolean
  let boolNotif = true
  function onChangeToTrue() {
    boolNotif = true
    handleNotifications()
  }
  function onChangeToFalse() {
    boolNotif = false
    handleNotifications()
  }
  const [updateNotificationsMutation] = useMutation(updateNotificationsMut)
  async function handleNotifications() {
    try {
      await updateNotificationsMutation({
        where: { id: userId },
        data: {
          getNotifications: boolNotif as boolean,
        },
      })
    } catch (error) {
      console.log(error)
    }
    document.location.reload()
  }

  function SwitchSelect() {
    if (notifStatus === false) {
      return (
        <Button marginBottom="3vh" colorScheme="green" size="md" onClick={() => onChangeToTrue()}>
          Recevoir des notification
        </Button>
      )
    } else {
      return (
        <>
          <Button
            marginBottom="3vh"
            colorScheme="yellow"
            size="md"
            onClick={() => onChangeToFalse()}
          >
            Ne plus recevoir de notifications
          </Button>
        </>
      )
    }
  }

  return (
    <>
      <Center>{SwitchSelect()}</Center>
    </>
  )
}
export default UpdateNotification
