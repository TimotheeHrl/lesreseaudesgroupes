import dynamic from "next/dynamic"
import { getAntiCSRFToken } from "blitz"
// Quill dependency
const ReactQuill = typeof window === "object" ? require("react-quill") : () => false
import "react-quill/dist/quill.snow.css"
import crypto from "crypto"
import { useMemo } from "react"
const bucketName = process.env.BUCKETNAME as string

import {
  Text,
  Input,
  Center,
  Avatar,
  Link,
  useDisclosure,
  Box,
  Modal,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Button,
} from "@chakra-ui/react"
import { useState, createRef, useEffect } from "react"

import { EditorTypes } from "./Editor.types"
import imageCompression from "browser-image-compression"
import Cropper from "react-avatar-editor"

const EditorChat: React.FC<EditorTypes> = ({ setValue, value, wwidth, hheight, quillRef }) => {
  const [cropperActive, setCropperActive] = useState(false)
  const [scale, setScale] = useState(1)
  const cropper = createRef() as any
  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(400)
  const [image, setImage] = useState<string | File>("/chargement.png")

  const [stringedFile, setStringedFile] = useState("")
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  }
  const input = document.createElement("input") as any

  input.setAttribute("type", "file")
  input.setAttribute("accept", "image/*")
  async function imageHandler() {
    input.click()
    input.onchange = async () => {
      const file = await input.files
      if (file.name !== "/chargement.png") {
        fileToUrl(file[0])
        setCropperActive(true)
      }
    }
  }

  const modules = {
    toolbar: {
      container: [
        ["bold", "italic", "underline", "strike"],
        ["video", "image"],
        [{ color: [] }], // dropdown with defaults from theme
      ],
      handlers: {
        image: imageHandler,
      },
    },
  }

  function closePreview() {
    setCropperActive(false)
  }
  const formats = ["bold", "italic", "underline", "strike", "video", "image", "color"]
  const antiCSRFToken = getAntiCSRFToken()
  function interIneditor(urlImage) {
    if (urlImage !== "") {
      const range = quillRef.current?.getEditor().getSelection()?.index

      if (range !== undefined && range !== null) {
        let quill = quillRef.current?.getEditor()
        quill?.setSelection(range, 1)

        quill?.clipboard.dangerouslyPasteHTML(range, `<img src=${urlImage}  />`)
      }
    }
  }
  const UploadToServer = async (file) => {
    try {
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
        let imageUrl = `https://storage.googleapis.com/${bucketName}/${filename}` as string
        interIneditor(imageUrl)
        setCropperActive(false)
      } else {
        console.error("Upload failed.")
      }
    } catch (error) {
      console.log(error)
      alert("Merci de télécharger un fichier moins lourd en format jpeg ou png")
    } finally {
      setStringedFile("")
    }
  }
  const transformCanvasToFileBeforeUpload = () => {
    let Canvas = cropper.current.getImageScaledToCanvas() as any

    const getCanvasToBlob = () => {
      return import(/* webpackChunkName: "canvas_to_blob" */ "blueimp-canvas-to-blob")
    }
    const canvasToBlob = (Canvas) => {
      return new Promise(async (resolve, reject) => {
        await getCanvasToBlob()

        Canvas.toBlob(
          (blob) => {
            resolve(blob)
          },
          "image/png",
          1.0
        )
      })
    }
    canvasToBlob(Canvas).then((data) => {
      // resolve()
      let filenameString = crypto.randomBytes(20).toString("hex")

      let fileOfBlob = new File([data as Blob], `${filenameString}.png`)
      UploadToServer(fileOfBlob)
    })
  }
  const fileToUrl = (file: File) => {
    const compressedFile = (file) => {
      return new Promise(async (resolve) => {
        resolve(await imageCompression(file, options))
      })
    }
    compressedFile(file).then((data) => {
      let file = data as File
      setImage(URL.createObjectURL(file as File))
    })
  }

  useEffect(() => {
    quillRef.current?.getEditor().root.setAttribute("spellcheck", "false")
  }, [])

  return (
    <div>
      <ReactQuill
        onChange={setValue}
        style={{ height: hheight, width: wwidth }}
        ref={quillRef}
        theme="snow"
        value={value}
        modules={modules}
        formats={formats}
        placeholder={"Description approfondie..."}
      />

      {cropperActive === true && (
        <div>
          <Modal size="full" isOpen={cropperActive} onClose={closePreview}>
            <ModalContent>
              <ModalHeader>Ajuster votre image</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <div
                  style={{
                    pointerEvents: "none",
                  }}
                >
                  <Center mt="2vw">
                    <Text mr="2vw" color="black">
                      Largeur
                    </Text>
                    <Box ml="2vw" style={{ pointerEvents: "all" }}>
                      <input
                        type="range"
                        min="400"
                        max="1000"
                        step="any"
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value))}
                      />
                    </Box>
                  </Center>
                  <Center>
                    <Text mr="2vw" color="black">
                      Hauteur
                    </Text>
                    <Box ml="2vw" style={{ pointerEvents: "all" }}>
                      <input
                        type="range"
                        min="400"
                        max="1000"
                        step="any"
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                      />
                    </Box>
                  </Center>
                  <Center>
                    <Text color="black">Zoom</Text>
                    <Box ml="5vw" style={{ pointerEvents: "all" }}>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="any"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                      />
                    </Box>
                  </Center>
                </div>

                <Center mt="2vh">
                  <div style={{ position: "relative", width: width, height: height }}>
                    <Cropper
                      ref={cropper}
                      image={image}
                      scale={scale}
                      width={width}
                      height={height}
                      border={1}
                      crossOrigin={"anonymous"}
                    />
                  </div>
                </Center>

                <Center>
                  <Button mt="2vh" colorScheme={"blue"} onClick={transformCanvasToFileBeforeUpload}>
                    Confirmer
                  </Button>
                </Center>
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      )}
    </div>
  )
}
export default EditorChat
