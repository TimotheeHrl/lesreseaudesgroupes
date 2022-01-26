import Cropper from "react-avatar-editor"
import { useState, createRef } from "react"
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
import { useParam, getAntiCSRFToken, useMutation, useQuery } from "blitz"
import crypto from "crypto"
import updateTeamPicture from "app/teams/mutations/updateTeamPicture"
import imageCompression from "browser-image-compression"
import createImage from "app/users/mutations/createImage"
import getTeam from "app/teams/queries/getTeam"
const bucketName = process.env.BUCKETNAME as string

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
}
const Upload = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const teamId = useParam("teamId", "string")
  const [team] = useQuery(
    getTeam,
    {
      where: { id: teamId },
    },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
      refetchOnMount: false,
    }
  )
  const antiCSRFToken = getAntiCSRFToken()
  const [updateTeamPictureMutation] = useMutation(updateTeamPicture)
  const [createImageMutation] = useMutation(createImage)

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
      let filenameString = crypto.randomBytes(20).toString("hex")

      let fileOfBlob = new File([data as Blob], `${filenameString}.png`)

      setNewImage(fileOfBlob as File)
    })
  }
  function closePreview() {
    setModalPreviewOpen(false)
  }

  const uploadImage = async () => {
    setModalPreviewOpen(false)
    try {
      let filenameString = newImage?.name as string
      const filename = encodeURIComponent(filenameString)

      const formData = new FormData()
      formData.append("teamimage", newImage as File)

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
        await createImageMutation({
          data: {
            asset_id: filename,
            url: imageUrl,
            user: {
              connect: {
                id: userId,
              },
            },
          },
        })
        await updateTeamPictureMutation({
          where: { id: teamId },
          data: { image: imageUrl },
        })
      }
    } catch (error) {
      console.log(error)
      alert("Merci de télécharger un fichier moins lourd en format jpeg ou png")
    }
  }
  return (
    <div>
      <Modal size="full" isOpen={modalPreviewOpen} onClose={closePreview}>
        <ModalContent>
          <ModalHeader>Confirmer le changement ?</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {" "}
            {preview && (
              <>
                <Box>
                  <Image
                    width="100vw"
                    src={preview}
                    alt={team.name}
                    fallbackSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cumulus_clouds_in_Russia._img_067.jpg/1925px-Cumulus_clouds_in_Russia._img_067.jpg"
                  />
                  <Center>
                    {team.name.length > 15 ? (
                      <Text
                        position="absolute"
                        top="15vh"
                        color="white"
                        textAlign="center"
                        fontSize={{ base: "3vh", md: "7vh", lg: "7vh", xl: "9vh" }}
                        textShadow="#000 0px 0px 3px"
                      >
                        {team.name}
                      </Text>
                    ) : (
                      <Text
                        position="absolute"
                        top="15vh"
                        color="white"
                        fontSize={{ base: "6vh", md: "7vh", lg: "7vh", xl: "18vh" }}
                        textShadow="#000 0px 0px 3px"
                      >
                        {team.name}
                      </Text>
                    )}
                  </Center>
                </Box>
              </>
            )}
            <>
              <Center>
                <Button mt="3vh" colorScheme="blue" onClick={uploadImage}>
                  Confirmer
                </Button>
              </Center>
            </>
          </ModalBody>
        </ModalContent>
      </Modal>
      {typeof newPicturePath === "string" ? (
        <>
          <Box>
            <Image
              width="100vw"
              src={newPicturePath}
              alt={team.name}
              fallbackSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cumulus_clouds_in_Russia._img_067.jpg/1925px-Cumulus_clouds_in_Russia._img_067.jpg"
            />
            <Center>
              <>
                {team.name.length > 15 && (
                  <Text
                    position="absolute"
                    top="25vh"
                    color="white"
                    textAlign="center"
                    fontSize={{ base: "3vh", md: "7vh", lg: "7vh", xl: "9vh" }}
                    textShadow="#000 0px 0px 3px"
                  >
                    {team.name}
                  </Text>
                )}
              </>
            </Center>
          </Box>
        </>
      ) : (
        <>
          <Box>
            {team.image !==
              "https://upload.wikimedia.org/wikipedia/commons/7/70/Solid_white.svg?uselang=fr" && (
              <>
                <Image
                  width="100vw"
                  src={team.image}
                  alt={team.name}
                  fallbackSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cumulus_clouds_in_Russia._img_067.jpg/1925px-Cumulus_clouds_in_Russia._img_067.jpg"
                />
                <Center>
                  {team.name.length > 15 ? (
                    <Text
                      position="absolute"
                      top="25vh"
                      color="white"
                      textAlign="center"
                      fontSize={{ base: "3vh", md: "7vh", lg: "7vh", xl: "9vh" }}
                      textShadow="#000 0px 0px 3px"
                    >
                      {team.name}
                    </Text>
                  ) : (
                    <Text
                      position="absolute"
                      top="25vh"
                      color="white"
                      fontSize={{ base: "6vh", md: "7vh", lg: "7vh", xl: "18vh" }}
                      textShadow="#000 0px 0px 3px"
                    >
                      {team.name}
                    </Text>
                  )}
                </Center>
              </>
            )}
          </Box>
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
