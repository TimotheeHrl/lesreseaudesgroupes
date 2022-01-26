import Cropper from "react-avatar-editor"
import { useState, createRef, useEffect } from "react"
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
  Flex,
} from "@chakra-ui/react"
import { Button } from "@material-ui/core"
import { useParam, getAntiCSRFToken, useMutation } from "blitz"
import crypto from "crypto"
import UserModale from "app/utils/UserModale"
import updatePictureUser from "app/users/mutations/updatePictureUser"
import imageCompression from "browser-image-compression"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"
import createImage from "app/users/mutations/createImage"
const bucketName = process.env.BUCKETNAME as string

interface IUser {
  id: string
  role: string
  userDescription: string
  lien: string
  email: string
  avatar: string
  name: string
  createdAt: Date
}

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
}
const Upload = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const user = useCurrentUser()
  let User = user?.user as IUser
  const antiCSRFToken = getAntiCSRFToken()
  const [updatePictureUserMutation] = useMutation(updatePictureUser)
  const [createImageMutation] = useMutation(createImage)

  const [modaleUser, setModaleUser] = useState<IUser | any>({
    userDescription: "string",
    lien: "string",
    name: "string",
    id: "string",
    avatar: "string",
    createdAt: new Date("1995-12-17T03:24:00"),
    role: "string",
  })
  const [preview, setPreview] = useState<null | any>(null)
  const [newImage, setNewImage] = useState<null | File>(null)
  const [cropperActive, setCropperActive] = useState<Boolean>(false)

  const [image, setImage] = useState<string | File>("/chargement.png")
  const userId = useParam("userId", "string") as string

  const [width, setWidth] = useState(400)
  const [height, setHeight] = useState(400)
  const [modalPreviewOpen, setModalPreviewOpen] = useState(false)
  const [newPicturePath, setNewPicturePath] = useState<string | null>(null)

  const [scale, setScale] = useState(1)
  const cropper = createRef() as any

  async function handleImageUpload(event) {
    const imageFile = event.target.files[0] as File
    const compressedFile = (imageFile) => {
      return new Promise(async (resolve) => {
        resolve(await imageCompression(imageFile, options))
      })
    }
    compressedFile(imageFile).then((data) => {
      setImage(URL.createObjectURL(data as File))
      setPreview(null)
      setCropperActive(true)
    })
  }

  const getImagePreview = () => {
    let Canvas = cropper.current.getImageScaledToCanvas() as any
    let ImageFromTranform = Canvas.toDataURL()
    setModalPreviewOpen(true)
    setPreview(ImageFromTranform)

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

      setNewImage(fileOfBlob as File)
    })
  }
  function closePreview() {
    setModalPreviewOpen(false)
  }

  const uploadImage = async () => {
    try {
      let filenameString = newImage?.name as string
      const filename = encodeURIComponent(filenameString)

      const formData = new FormData()
      formData.append("userimage", newImage as File)

      const upload = await fetch(`/api/editorupload`, {
        credentials: "include",
        headers: {
          "anti-csrf": antiCSRFToken,
          Accept: "image/*",
        },
        method: "POST",
        body: formData,
      })
      let imageUrl = `https://storage.googleapis.com/${bucketName}/${filename}` as string
      if (upload.ok) {
        setNewPicturePath(imageUrl)
        setModalPreviewOpen(false)
        await createImageMutation({
          data: {
            asset_id: filenameString,
            url: imageUrl,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        })
        await updatePictureUserMutation({
          where: { id: userId },
          data: { avatar: imageUrl },
        })
      }
    } catch (error) {
      console.log(error)
      alert("Merci de télécharger un fichier moins lourd en format jpeg ou png")
    }
  }
  return (
    <div>
      <UserModale modaleUser={modaleUser} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
      <Modal size="xl" isOpen={modalPreviewOpen} onClose={closePreview}>
        <ModalContent>
          <ModalHeader>Confirmer le changement ?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {" "}
            {preview && (
              <>
                <Center mt="3vh">
                  <Avatar src={preview as string} name={user?.user?.name} size="xl" />
                </Center>

                <Center mt="3vh">
                  <Image src={preview as string} />
                </Center>
              </>
            )}
            <Center>
              <Button
                style={{
                  marginTop: "2vh",
                  backgroundColor: "lightBlue",
                  color: "black",
                  borderColor: "white",
                  borderRadius: "3px",
                }}
                onClick={uploadImage}
              >
                Confirmer
              </Button>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
      {typeof newPicturePath === "string" ? (
        <>
          <Center mt="4vh">
            <Link
              onClick={() => [
                setModaleUser({
                  userDescription: User.userDescription as string,
                  lien: User?.lien as string,
                  name: User?.name as string,
                  id: User?.id as string,
                  avatar: newPicturePath as string,
                  createdAt: User?.createdAt as Date,
                  role: User?.role as string,
                }),
                onOpen(),
              ]}
            >
              <Flex>
                <Text as="b" size="lg" mt="4vh" mr="2vw">
                  Photo actuelle
                </Text>
                <Avatar ml="2vw" name={user?.user?.name} src={newPicturePath} size="xl" />{" "}
              </Flex>
            </Link>
          </Center>
        </>
      ) : (
        <>
          <Center mt="4vh">
            <Link
              onClick={() => [
                setModaleUser({
                  userDescription: User.userDescription as string,
                  lien: User?.lien as string,
                  name: User?.name as string,
                  id: User?.id as string,
                  avatar: User?.avatar as string,
                  createdAt: User?.createdAt as Date,
                  role: User?.role as string,
                }),
                onOpen(),
              ]}
            >
              <Flex>
                <Text as="b" size="lg" mt="4vh" mr="2vw">
                  Photo actuelle
                </Text>
                <Avatar ml="2vw" name={user?.user?.name} src={user?.user?.avatar} size="xl" />{" "}
              </Flex>
            </Link>
          </Center>
        </>
      )}

      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          pointerEvents: "none",
        }}
      >
        {cropperActive === true && (
          <>
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
          </>
        )}
      </div>
      {cropperActive === true && (
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
      )}
      <Center mt="2vh">
        <Input
          border="2px"
          w="50vw"
          borderColor="bisque"
          colorScheme="blue"
          onChange={handleImageUpload}
          type="file"
          accept="image/png, image/jpeg"
        />
      </Center>
      {cropperActive === true && (
        <>
          <Center>
            <Box ml="2vw" style={{ pointerEvents: "all" }}>
              <Button
                style={{
                  marginTop: "2vh",
                  backgroundColor: "lightBlue",
                  color: "black",
                  borderColor: "white",
                  borderRadius: "3px",
                }}
                onClick={getImagePreview}
              >
                Voir le rendue et confirmer
              </Button>
            </Box>
          </Center>
          <Center>
            <Text color="tomato" mt="2vh" as={"i"}>
              Avant de cliquer sur "suivant", merci de confirmer le rendue
            </Text>
          </Center>
        </>
      )}
    </div>
  )
}
export default Upload
