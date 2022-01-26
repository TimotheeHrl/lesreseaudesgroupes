import { useEffect } from "react"

import { Center } from "@chakra-ui/react"
import React, { FC, useState, useRef, FormEvent, useContext, createContext } from "react"

import "mapbox-gl/dist/mapbox-gl.css"
import ReactMapGL, { Marker, ViewState, NavigationControl } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import { useLocalState } from "app/publicMap/components/utils/uselocalState"

interface Ilat {
  setlat: any
  setlon: any
}

function MapInput(props: Ilat) {
  let { setlat, setlon } = props
  const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,1,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`

  const SIZE = 50
  const [viewport, setViewport] = useState<ViewState>({
    latitude: 46.555,
    longitude: 1.866,
    zoom: 5,
  })

  let latitude = viewport.latitude
  let longitude = viewport.longitude
  const str_Lat = latitude.toString()
  const LatTrim = parseFloat(str_Lat.slice(0, 10))
  const str_Lon = longitude.toString()
  const LonTrim = parseFloat(str_Lon.slice(0, 10))
  useEffect(() => {
    setlat(LatTrim)
    setlon(LonTrim)
  })
  return (
    <Center>
      <ReactMapGL
        {...viewport}
        width="80vw"
        height="50vh"
        mapboxApiAccessToken={process.env.MAPBOX_API_TOKEN}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        minZoom={5}
        maxZoom={19}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v11"
        onViewStateChange={() => [setlat(latitude), setlon(longitude)]}
      >
        <div>
          <div style={{ width: "30px", marginTop: "2%", marginLeft: "2%" }}>
            <NavigationControl showCompass={false} showZoom={true} />
          </div>
          <Marker latitude={viewport.latitude} longitude={viewport.longitude}>
            <svg
              height={SIZE}
              viewBox="0 0 24 24"
              style={{
                cursor: "pointer",
                fill: "#d00",
                stroke: "#000",
                transform: `translate(${-SIZE / 2}px,${-SIZE}px)`,
              }}
            >
              <path d={ICON} />
            </svg>
          </Marker>
        </div>
      </ReactMapGL>
    </Center>
  )
}

export default MapInput
