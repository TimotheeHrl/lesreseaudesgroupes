// server.ts
// server.ts
import blitz from "blitz/custom-server"
import { BlitzApiHandler } from "blitz"
import * as http from "http"
import * as socketio from "socket.io"
import express, { Express, Request, Response } from "express"
import "./app/crons"
interface Message {
  sentFrom: {
    userDescription: string
    lien: string
    name: string
    id: string
    avatar: string
    createdAt: Date
    role: string
  }

  sentIn: {
    private: boolean
  }
  sentAt: Date
  content: string
  htmlContent: string
  sentInId: string
}
var cors = require("cors")

const { PORT = "3000" } = process.env
const dev = process.env.NODE_ENV !== "production"
const blitzApp = blitz({ dev })
const blitzHandler: BlitzApiHandler = blitzApp.getRequestHandler()

blitzApp.prepare().then(async () => {
  const app: Express = express()
  const server: http.Server = http.createServer(app)
  const io: socketio.Server = new socketio.Server()
  io.attach(server)

  app.set("proxy", 1)
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  )
  const sockets: socketio.Socket[] = []

  io.on("connection", (socket: socketio.Socket) => {
    console.log("connection", socket.handshake.query)
    sockets.push(socket)

    const { sentInId } = socket.handshake.query
    if (sentInId) socket.join(`chats_${sentInId}`)
    console.log(sentInId)
    socket.emit("status", "Hello from Socket.io")

    // conversation handling
    socket.on("new-message", (data: Message) => {
      console.log("new-message", data)
      const roomName = `chats_${data.sentInId}`
      io.to(roomName).emit("new-remote-message", data)
    })

    socket.on("disconnect", () => {
      console.log("client disconnected")
      socket.disconnect()
    })
  })

  app.all("*", (req: any, res: any) => blitzHandler(req, res))

  server.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`)
  })
})
