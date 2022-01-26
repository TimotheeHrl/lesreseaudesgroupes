import "date-fns"
import { FormLabel, Center } from "@chakra-ui/react"
import fr from "date-fns/locale/fr"
registerLocale("fr", fr)
import React from "react"
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {
  Text,
  Box,
  Flex,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Button,
} from "@chakra-ui/react"
import { useState } from "react"
import { transformDocument } from "@prisma/client/runtime"
interface IDate {
  setStartDate: any
  startDate: Date
  setEndDate: any
  EndDate: Date
  setCorrectStart: any
  correctStart: Date
}
const DateTime = (props: IDate) => {
  const { startDate, setStartDate, setEndDate, EndDate, correctStart, setCorrectStart } = props
  const [isClicked, setisClicked] = useState<boolean>(false)
  const [isClickedTwo, setisClickedTwo] = useState<boolean>(false)
  const [haveEndDate, setHaveEndDate] = useState<boolean>(false)

  const [minuts, setMinuts] = useState<number>(0)
  const [hour, setHour] = useState<number>(0)
  const handleHours = (value) => setHour(value)
  const handleMinuts = (value) => setMinuts(value)
  console
  const handleClickTwo = () => {
    setisClickedTwo(true)
  }

  function handleClick() {
    setisClicked(true)
  }
  function handleEndDate() {
    //const Sdate = startDate.getDate()
    const STime = correctStart.getTime()
    const plusHours = hour * 60 * 60 * 1000
    const plusminut = minuts * 60 * 1000
    const plusTime = plusHours + plusminut
    const EndsAt = new Date(STime + plusTime)
    setEndDate(EndsAt)
    setHaveEndDate(true)
  }
  function handleStat(date) {
    setStartDate(date)
    const startD = date.getTime()
    const newStartDate = new Date(startD) //- 60 * 60 * 1000
    setCorrectStart(newStartDate)
  }
  return (
    <>
      <Center>
        <FormLabel marginTop={"1vh"}>Date et heure du début:</FormLabel>
        <div className="border-gray-300 placeholder-gray-500 appearance-none rounded-none relative block w-full px-3 py-2 border text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5">
          <DatePicker
            selected={startDate}
            onChange={(date) => [handleStat(date), handleClick()]}
            showTimeSelect
            placeholderText="Début de l'événement une date"
            className="red"
            locale="fr"
            minDate={new Date()}
            dateFormat="MMMM d, yyyy h:mm aa"
          />
        </div>
      </Center>
      <>
        {isClicked === true && (
          <>
            <Center>
              <FormLabel marginTop={"1vh"}>Durée:</FormLabel>
              <div className="border-gray-300 placeholder-gray-500 appearance-none rounded-none relative block w-full px-3 py-2 border text-gray-900 rounded-b-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 focus:z-10 sm:text-sm sm:leading-5">
                <Flex>
                  <Box>
                    <Text as="b">Heures</Text>
                    <Box onClick={handleClickTwo}>
                      <NumberInput
                        onChange={handleHours}
                        value={hour}
                        step={1}
                        defaultValue={0}
                        min={0}
                        max={48}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Box>
                  </Box>

                  <Box>
                    <Text as="b">Minute</Text>
                    <Box onClick={handleClickTwo}>
                      <NumberInput
                        value={minuts}
                        onChange={handleMinuts}
                        step={15}
                        defaultValue={0}
                        min={0}
                        max={60}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </Box>
                  </Box>
                </Flex>
              </div>
            </Center>
            {isClickedTwo === true && (
              <Center>
                <Button onClick={handleEndDate}>Confirmer</Button>
              </Center>
            )}
            {haveEndDate === true && (
              <>
                <Center>Début le {correctStart.toLocaleString("fr", { timeZone: "CET" })}</Center>
                <Center>fin le {EndDate.toLocaleString("fr", { timeZone: "CET" })}</Center>
              </>
            )}
          </>
        )}
      </>
    </>
  )
}
export default DateTime
