/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from "next"
import multer from "multer"
import initMiddleware from "./initMiddleware"

const { Storage } = require("@google-cloud/storage")
const bucketName = process.env.BUCKETNAME as string

const upload = multer()

const multerAny = initMiddleware(upload.any())

type NextApiRequestWithFormData = NextApiRequest & {
  files: any[]
}

type BlobCorrected = Blob & {
  buffer: Buffer
  originalname: string
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async (req: NextApiRequestWithFormData, res: NextApiResponse) => {
  await multerAny(req, res)

  if (!req.files?.length || req.files.length > 1) {
    res.statusCode = 400
    res.end()
    return
  }

  const uploadedFile: BlobCorrected = req.files[0]

  const storage = new Storage({
    projectId: bucketName,
    credentials: {
      client_email: process.env.GPTACCONT,
      private_key: process.env.KEY,
    },
  })
  if (uploadedFile.size < 1100000) {
    const bucket = storage.bucket(bucketName)

    const blob = bucket.file(uploadedFile.originalname)

    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: false,
      public: false,
    })
    blobStream.on("error", (err) => {
      console.log(err)
    })
    blobStream.on("finish", () => {
      const url = "https://storage.googleapis.com/" + bucket.name + blob.name
      res.status(200).send(url)
    })

    blobStream.end(uploadedFile.buffer)
  }
}
