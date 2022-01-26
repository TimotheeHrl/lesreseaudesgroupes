import "mapbox-gl/dist/mapbox-gl.css"
import React, { useState, useRef, useMemo } from "react"
import { useQuery, Link } from "blitz"
import { Image, Box, Grid, GridItem, Avatar } from "@chakra-ui/react"
import getTeams from "app/publicMap/queries/getAllPublicTeams"
import ReactMapGL, { Marker, Popup, ViewState, NavigationControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import getagsPublic from "app/teams/queries/getagsPublic"
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from "@material-ui/core/TextField"
import { Text, Center } from "@chakra-ui/react"
import { useDebounce } from "use-debounce"
import { useMediaQuery } from "react-responsive"
import { useLocalState } from "app/publicMap/components/utils/uselocalState"
type BoundsArray = [[number, number], [number, number]]
export interface TeamsQuery_Teams {
  id: string
  name: string
  description: string
  teamLatitude: number
  teamLongitude: number
  image: string
  typeOrg: string
}
interface IOptions {
  value: string
  label: string
}
export interface TeamsQuery {
  Iteams: TeamsQuery_Teams[]
}
export interface IsTagsTeamPublic {
  public: boolean
}
export interface Tag {
  createdAt: Date
  updatedAt: Date
  id: string
  isPublic: boolean
  teams: IsTagsTeamPublic[]
  catSpecific: string
}

const parseBounds = (boundsString: string) => {
  const bounds = JSON.parse(boundsString) as BoundsArray
  return {
    sw: {
      latitude: bounds[0][1],
      longitude: bounds[0][0],
    },
    ne: {
      latitude: bounds[1][1],
      longitude: bounds[1][0],
    },
  }
}

function TeamsPublic() {
  const [teams] = useQuery(
    getTeams,
    { where: { public: true }, include: { tags: true } },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1200px)" })
  const [tags] = useQuery(
    getagsPublic,
    { where: { isPublic: true }, orderBy: { id: "asc" }, skip: 0, take: 400 },
    {
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  )

  const [value, setValue] = useState<string | null>("")
  const [inputValue, setInputValue] = useState<string>("")

  const [selected, setSelected] = useState<TeamsQuery_Teams | null>(null)
  let mapState = {
    latitude: 45.555,
    longitude: 0.666,
    zoom: 5,
  }
  if (isTabletOrMobile === true) {
    mapState = {
      latitude: 45.555,
      longitude: 0.666,
      zoom: 4,
    }
  }
  const mapRef = useRef<ReactMapGL | null>(null)
  const [viewport, setViewport] = useState<ViewState>({
    latitude: mapState.latitude,
    longitude: mapState.longitude,
    zoom: mapState.zoom,
  })

  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [dataBounds, setDataBounds] = useLocalState<string>("bounds", "[[0,0],[0,0]]")
  const [debouncedDataBounds] = useDebounce(dataBounds, 200)

  let ResetView = {
    latitude: mapState.latitude,
    longitude: mapState.longitude,
    zoom: mapState.zoom,
  } as ViewState

  const LonLatFilter = useMemo(() => filtersTeams(debouncedDataBounds), [dataBounds, viewport.zoom])
  function filtersTeams(debouncedDataBounds) {
    const boundsNordEstLat = parseBounds(debouncedDataBounds).ne.latitude
    const boundsNordEstLon = parseBounds(debouncedDataBounds).ne.longitude
    const boundsSudWestLat = parseBounds(debouncedDataBounds).sw.latitude
    const boundsSudWestLon = parseBounds(debouncedDataBounds).sw.longitude
    let latFilter = teams.teams.filter(
      (team) => team.teamLatitude > boundsSudWestLat && team.teamLatitude < boundsNordEstLat
    )
    let LonLat = latFilter.filter(
      (team) => team.teamLongitude > boundsSudWestLon && team.teamLongitude < boundsNordEstLon
    )
    return LonLat
  }
  const memoizedTags = useMemo(() => computeTags(tags), [tags])
  function computeTags(tags) {
    const tagsName = [] as string[]

    for (let i = 0; i < tags.tags.length; i++) {
      const tagid = tags.tags[i]?.id as string

      const isLinkWithPublicTeam = tags.tags[i]?.teams as IsTagsTeamPublic[]
      for (let y = 0; y < isLinkWithPublicTeam.length; y++) {
        if (tags.tags[i]?.teams[y]?.public === true) {
          tagsName.push(tagid)

          break
        }
      }
    }
    return tagsName as string[]
  }
  const memoizedsearcheValue = useMemo(() => computeExpensiveValue(inputValue), [inputValue])
  function computeExpensiveValue(inputValue) {
    let researchedTeamsUnique: TeamsQuery_Teams[] = []

    let researchedTeams: TeamsQuery_Teams[] = []

    for (let i = 0; i < teams.teams.length; i++) {
      let TeamTags = teams.teams[i]?.tags as Tag[]
      let teamRound = teams.teams[i] as TeamsQuery_Teams
      for (let z = 0; z < TeamTags.length; z++) {
        let TeamTag = TeamTags[z]?.id as string
        if (TeamTag === value || TeamTag.includes(inputValue)) {
          researchedTeams.push(teamRound)
        }
      }
    }

    researchedTeams.forEach((value) => {
      if (!researchedTeamsUnique.some((x) => x.id === value.id)) {
        researchedTeamsUnique.push(value)
      }
    })
    return researchedTeamsUnique
  }
  return (
    <>
      <Box>
        <Box
          width={{ base: "80vw", md: "50vw", lg: "40vw", xl: "30vw" }}
          marginTop={{ base: "5vh", md: "5vh", lg: "3vw", xl: "2vw" }}
          marginBottom={{ base: "1vh", md: "1vh", lg: "2vw", xl: "0vw" }}
          marginLeft={{ base: "8vw", md: "8vw", lg: "10vw", xl: "0vw" }}
          marginRight={{ base: "8vw", md: "8vw", lg: "0vw", xl: "0vw" }}
        >
          {" "}
          <Autocomplete
            id="tags"
            value={value}
            onChange={(event, value) => {
              setValue(value)
              setViewport(ResetView)
            }}
            inputValue={inputValue}
            onInputChange={(event, inputValue) => {
              setInputValue(inputValue)
              setViewport(ResetView)
            }}
            options={memoizedTags}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField {...params} label="Rechercher des groupes" variant="outlined" />
            )}
          />
        </Box>
        <Center>
          {isTabletOrMobile === false ? (
            <Box display={{ md: "flex" }} mt="2vh">
              <Box flexShrink={0}>
                <Box marginTop="1vh" marginLeft={{ md: "8vw", lg: "10vw", xl: "0vw" }}>
                  <ReactMapGL
                    {...viewport}
                    width="65vw"
                    height="70vh"
                    mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
                    onViewportChange={(nextViewport) => setViewport(nextViewport)}
                    ref={(instance) => (mapRef.current = instance)}
                    minZoom={4}
                    maxZoom={15}
                    mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                    onLoad={() => {
                      if (mapRef.current) {
                        const bounds = mapRef.current.getMap().getBounds()
                        setDataBounds(JSON.stringify(bounds.toArray()))
                      }
                    }}
                    onInteractionStateChange={(extra) => {
                      if (!extra.isDragging && mapRef.current) {
                        const bounds = mapRef.current.getMap().getBounds()
                        setDataBounds(JSON.stringify(bounds.toArray()))
                      }
                    }}
                  >
                    {" "}
                    <Box width="28px" marginTop="2%" marginLeft="2%">
                      <NavigationControl showCompass={false} showZoom={true} />
                    </Box>
                    <div>
                      {inputValue.length > 0
                        ? memoizedsearcheValue.map((team) => (
                            <Marker
                              key={team.id}
                              latitude={team.teamLatitude}
                              longitude={team.teamLongitude}
                              offsetLeft={-15}
                              offsetTop={-15}
                              className={highlightedId === team.id ? "marker-active" : ""}
                            >
                              <button
                                style={{ width: "30px", height: "30px" }}
                                type="button"
                                onClick={() => setSelected(team)}
                              >
                                {highlightedId === team.id ? (
                                  <Avatar name="team location" src={team.image} />
                                ) : (
                                  <>
                                    {team.typeOrg === "Antenne territoriale" ? (
                                      <Avatar
                                        src={"/leaf.png"}
                                        name="antenne location"
                                        alt="antenne location"
                                      />
                                    ) : (
                                      <Image src={"/planetIcon.svg"} alt="team location" />
                                    )}
                                  </>
                                )}
                              </button>
                            </Marker>
                          ))
                        : teams.teams.map((team) => (
                            <Marker
                              key={team.id}
                              latitude={team.teamLatitude}
                              longitude={team.teamLongitude}
                              offsetLeft={-15}
                              offsetTop={-15}
                              className={highlightedId === team.id ? "marker-active" : ""}
                            >
                              <button
                                style={{ width: "30px", height: "30px" }}
                                type="button"
                                onClick={() => setSelected(team)}
                              >
                                {highlightedId === team.id ? (
                                  <Avatar name="team location" src={team.image} />
                                ) : (
                                  <>
                                    {team.typeOrg === "Antenne territoriale" ? (
                                      <Avatar
                                        src={"/leaf.png"}
                                        name="antenne location"
                                        alt="antenne location"
                                      />
                                    ) : (
                                      <Image src={"/planetIcon.svg"} alt="team location" />
                                    )}
                                  </>
                                )}
                              </button>
                            </Marker>
                          ))}

                      {selected && (
                        <Popup
                          key={selected.id}
                          latitude={selected.teamLatitude}
                          longitude={selected.teamLongitude}
                          onClose={() => setSelected(null)}
                          closeOnClick={false}
                        >
                          <Link href={`/collectifs/${selected.id}`}>
                            <Image
                              src={selected.image}
                              height="auto"
                              width="10vw"
                              alt="Logo"
                              fallbackSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cumulus_clouds_in_Russia._img_067.jpg/1925px-Cumulus_clouds_in_Russia._img_067.jpg"
                            />
                          </Link>
                          <div>
                            <Link href={`/collectifs/${selected.id}`}>
                              <a>{selected.name}</a>
                            </Link>
                          </div>
                        </Popup>
                      )}
                    </div>
                  </ReactMapGL>
                </Box>
              </Box>
              <Box
                marginLeft={{ lg: "1vw" }}
                width={{ base: "100vw", md: "25vw", lg: "25vw" }}
                height={{ base: "40vw", md: "70vh", lg: "70vh" }}
                marginTop="1vh"
                overflowY={"auto"}
                border="1px"
                rounded="10px"
                borderColor="gray.600"
                padding="1vh"
              >
                <Box>
                  {inputValue.length > 0
                    ? memoizedsearcheValue.map((team) => (
                        <Box key={team.id}>
                          <Link key={team.id} href={`/collectifs/${team.id}`}>
                            <div
                              onMouseEnter={() => setHighlightedId(team.id)}
                              onMouseLeave={() => setHighlightedId(null)}
                            >
                              <div>
                                <Center>
                                  {team.name.length > 30 ? (
                                    <Text margin="2vh" fontSize="xl" as="b">
                                      {" "}
                                      {`${team.name.slice(0, 30)}...`}
                                    </Text>
                                  ) : (
                                    <Text margin="2vh" fontSize="xl" as="b">
                                      {" "}
                                      {team.name}
                                    </Text>
                                  )}
                                </Center>
                                <Center>
                                  <Image
                                    padding={"2vh"}
                                    src={team.image}
                                    fallbackSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cumulus_clouds_in_Russia._img_067.jpg/1925px-Cumulus_clouds_in_Russia._img_067.jpg"
                                    alt={team.name}
                                    width={340}
                                  />
                                </Center>
                              </div>
                              <Center>
                                {team.description.length > 100 ? (
                                  <Text margin="2vh" fontSize="lg" as="i">
                                    {" "}
                                    {`${team.description.slice(0, 100)}...`}
                                  </Text>
                                ) : (
                                  <Text margin="2vh" fontSize="lg" as="i">
                                    {" "}
                                    {team.description}
                                  </Text>
                                )}
                              </Center>
                            </div>
                          </Link>
                          <Grid templateColumns="repeat(1, 1fr)">
                            <GridItem margin="2vh" colSpan={1} h="1px" bg="gray.600" />
                          </Grid>
                        </Box>
                      ))
                    : LonLatFilter.map((team) => (
                        <Box key={team.id}>
                          <Link key={team.id} href={`/collectifs/${team.id}`}>
                            <div
                              onMouseEnter={() => setHighlightedId(team.id)}
                              onMouseLeave={() => setHighlightedId(null)}
                            >
                              <div>
                                <Center>
                                  {team.name.length > 30 ? (
                                    <Text margin="2vh" fontSize="xl" as="b">
                                      {" "}
                                      {`${team.name.slice(0, 30)}...`}
                                    </Text>
                                  ) : (
                                    <Text margin="2vh" fontSize="xl" as="b">
                                      {" "}
                                      {team.name}
                                    </Text>
                                  )}
                                </Center>
                                <Center>
                                  <Image
                                    padding={"2vh"}
                                    src={team.image}
                                    fallbackSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cumulus_clouds_in_Russia._img_067.jpg/1925px-Cumulus_clouds_in_Russia._img_067.jpg"
                                    alt={team.name}
                                    width={340}
                                  />
                                </Center>
                              </div>
                              <Center>
                                {team.description.length > 100 ? (
                                  <Text margin="2vh" fontSize="lg" as="i">
                                    {" "}
                                    {`${team.description.slice(0, 100)}...`}
                                  </Text>
                                ) : (
                                  <Text margin="2vh" fontSize="lg" as="i">
                                    {" "}
                                    {team.description}
                                  </Text>
                                )}
                              </Center>
                            </div>
                          </Link>
                          <Grid templateColumns="repeat(1, 1fr)">
                            <GridItem margin="2vh" colSpan={1} h="1px" bg="gray.600" />
                          </Grid>
                        </Box>
                      ))}
                </Box>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box>
                <Center>
                  <ReactMapGL
                    {...viewport}
                    width="90vw"
                    height="40vh"
                    mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
                    onViewportChange={(nextViewport) => setViewport(nextViewport)}
                    ref={(instance) => (mapRef.current = instance)}
                    minZoom={5}
                    maxZoom={15}
                    mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
                    onLoad={() => {
                      if (mapRef.current) {
                        const bounds = mapRef.current.getMap().getBounds()
                        setDataBounds(JSON.stringify(bounds.toArray()))
                      }
                    }}
                    onInteractionStateChange={(extra) => {
                      if (!extra.isDragging && mapRef.current) {
                        const bounds = mapRef.current.getMap().getBounds()
                        setDataBounds(JSON.stringify(bounds.toArray()))
                      }
                    }}
                  >
                    {" "}
                    <Box width="28px" marginTop="2%" marginLeft="2%">
                      <NavigationControl showCompass={false} showZoom={true} />
                    </Box>
                    <div>
                      {inputValue.length > 0
                        ? memoizedsearcheValue.map((team) => (
                            <Marker
                              key={team.id}
                              latitude={team.teamLatitude}
                              longitude={team.teamLongitude}
                              offsetLeft={-15}
                              offsetTop={-15}
                              className={highlightedId === team.id ? "marker-active" : ""}
                            >
                              <button
                                style={{ width: "30px", height: "30px" }}
                                type="button"
                                onClick={() => setSelected(team)}
                              >
                                {highlightedId === team.id ? (
                                  <Avatar name="team location" src={team.image} />
                                ) : (
                                  <>
                                    {team.typeOrg === "Antenne territoriale" ? (
                                      <Avatar
                                        src={"/leaf.png"}
                                        name="antenne location"
                                        alt="antenne location"
                                      />
                                    ) : (
                                      <Image src={"/planetIcon.svg"} alt="team location" />
                                    )}
                                  </>
                                )}
                              </button>
                            </Marker>
                          ))
                        : teams.teams.map((team) => (
                            <Marker
                              key={team.id}
                              latitude={team.teamLatitude}
                              longitude={team.teamLongitude}
                              offsetLeft={-15}
                              offsetTop={-15}
                              className={highlightedId === team.id ? "marker-active" : ""}
                            >
                              <button
                                style={{ width: "30px", height: "30px" }}
                                type="button"
                                onClick={() => setSelected(team)}
                              >
                                {highlightedId === team.id ? (
                                  <Avatar name="team location" src={team.image} />
                                ) : (
                                  <>
                                    {team.typeOrg === "Antenne territoriale" ? (
                                      <Avatar
                                        src={"/leaf.png"}
                                        name="antenne location"
                                        alt="antenne location"
                                      />
                                    ) : (
                                      <Image src={"/planetIcon.svg"} alt="team location" />
                                    )}
                                  </>
                                )}
                              </button>
                            </Marker>
                          ))}

                      {selected && (
                        <Popup
                          key={selected.id}
                          latitude={selected.teamLatitude}
                          longitude={selected.teamLongitude}
                          onClose={() => setSelected(null)}
                          closeOnClick={false}
                        >
                          <Link href={`/collectifs/${selected.id}`}>
                            <Image
                              src={selected.image}
                              height="auto"
                              width="10vw"
                              alt="Logo"
                              fallbackSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cumulus_clouds_in_Russia._img_067.jpg/1925px-Cumulus_clouds_in_Russia._img_067.jpg"
                            />
                          </Link>
                          <div>
                            <Link href={`/collectifs/${selected.id}`}>
                              <a>{selected.name}</a>
                            </Link>
                          </div>
                        </Popup>
                      )}
                    </div>
                  </ReactMapGL>
                </Center>
              </Box>
              <Box
                mt={{ base: "1vh", md: "1vh" }}
                width={{ base: "100vw", md: "100vw" }}
                height={{ base: "37vh", md: "37vh" }}
                overflowY={"auto"}
              >
                <Box>
                  {inputValue.length > 0
                    ? memoizedsearcheValue.map((team) => (
                        <Box key={team.id}>
                          <Link key={team.id} href={`/collectifs/${team.id}`}>
                            <div
                              onMouseEnter={() => setHighlightedId(team.id)}
                              onMouseLeave={() => setHighlightedId(null)}
                            >
                              <div>
                                <Center>
                                  {team.name.length > 30 ? (
                                    <Text margin="1vh" fontSize="lg" as="b">
                                      {" "}
                                      {`${team.name.slice(0, 30)}...`}
                                    </Text>
                                  ) : (
                                    <Text margin="1vh" fontSize="lg" as="b">
                                      {" "}
                                      {team.name}
                                    </Text>
                                  )}
                                </Center>
                                <Center>
                                  <Image
                                    padding={"2vh"}
                                    src={team.image}
                                    fallbackSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cumulus_clouds_in_Russia._img_067.jpg/1925px-Cumulus_clouds_in_Russia._img_067.jpg"
                                    alt={team.name}
                                    width={200}
                                  />
                                </Center>
                              </div>
                              <Center>
                                {team.description.length > 100 ? (
                                  <Text margin="1vh" fontSize="lg" as="i">
                                    {" "}
                                    {`${team.description.slice(0, 100)}...`}
                                  </Text>
                                ) : (
                                  <Text margin="1vh" fontSize="lg" as="i">
                                    {" "}
                                    {team.description}
                                  </Text>
                                )}
                              </Center>
                            </div>
                          </Link>
                          <Grid templateColumns="repeat(1, 1fr)">
                            <GridItem margin="2vh" colSpan={1} h="1px" bg="gray.600" />
                          </Grid>
                        </Box>
                      ))
                    : LonLatFilter.map((team) => (
                        <Box key={team.id}>
                          <Link href={`/collectifs/${team.id}`}>
                            <div
                              onMouseEnter={() => setHighlightedId(team.id)}
                              onMouseLeave={() => setHighlightedId(null)}
                            >
                              <div>
                                <Center>
                                  {team.name.length > 30 ? (
                                    <Text margin="1vh" fontSize="lg" as="b">
                                      {" "}
                                      {`${team.name.slice(0, 30)}...`}
                                    </Text>
                                  ) : (
                                    <Text margin="1vh" fontSize="lg" as="b">
                                      {" "}
                                      {team.name}
                                    </Text>
                                  )}
                                </Center>
                                <Center>
                                  <Image
                                    padding={"2vh"}
                                    src={team.image}
                                    fallbackSrc="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Cumulus_clouds_in_Russia._img_067.jpg/1925px-Cumulus_clouds_in_Russia._img_067.jpg"
                                    alt={team.name}
                                    width={200}
                                  />
                                </Center>
                              </div>
                              <Center>
                                {team.description.length > 100 ? (
                                  <Text margin="1vh" fontSize="lg" as="i">
                                    {" "}
                                    {`${team.description.slice(0, 100)}...`}
                                  </Text>
                                ) : (
                                  <Text margin="1vh" fontSize="lg" as="i">
                                    {" "}
                                    {team.description}
                                  </Text>
                                )}
                              </Center>
                            </div>
                          </Link>
                          <Grid templateColumns="repeat(1, 1fr)">
                            <GridItem margin="1vh" colSpan={1} h="1px" bg="gray.600" />
                          </Grid>
                        </Box>
                      ))}
                </Box>
              </Box>
            </Box>
          )}
        </Center>
      </Box>
    </>
  )
}

export default TeamsPublic
