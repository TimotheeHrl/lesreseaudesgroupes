import cron from "node-cron"
// import { addresses } from "./core/constants"
// import { updateUsers } from "./users/mutations/updateUsers"
import recallEvent from "app/tevents/mutations/recallEvent"
const hello = "hello"
// Every fetch events of tomorow and send a recall mail to users
cron.schedule("0 7 * * *", () => {
  recallEvent(hello)
})
