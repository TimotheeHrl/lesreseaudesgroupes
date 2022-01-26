import crypto from "crypto"
import { getAntiCSRFToken } from "blitz"

async function uploadImageCallBack(file: File): Promise<{ data: { link: string } }> {
  let bucketName = process.env.BUCKETNAME as string
  console.log(bucketName)
  const antiCSRFToken = getAntiCSRFToken()

  let filenameString = file.name
  const filename = encodeURIComponent(filenameString)

  const formData = new FormData()
  formData.append("editorimage", file as File)

  const upload = await fetch(`/api/editorupload`, {
    credentials: "include",
    headers: {
      "anti-csrf": antiCSRFToken,
      Accept: "image/*",
    },
    method: "POST",
    body: formData,
  })

  if (upload.ok) {
    console.log("Uploaded successfully!")
  } else {
    console.error("Upload failed.")
  }

  const urlImage = await upload.url

  let json = { data: { link: `${urlImage}${filename}` } }
  console.log(json)
  return json
}

export default uploadImageCallBack
