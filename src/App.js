import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup, ScaleControl } from "react-map-gl";
import * as skatpark from "./data/skateboard_parks.json";
import * as parkData from "./data/chicago_parks.json";

export default function App() {
  const [viewport, setViewport] = useState({
    // latitude: 45.4211,
    // longitude: -75.6903,
    latitude: 41.8781,
    longitude: -87.6298,
    width: "100vw",
    height: "100vh",
    zoom: 10
  });
  const [selectedPark, setSelectedPark] = useState(null);

  // .........if you want to trigger close popup on ESC button click.........
  // useEffect(() => {
  //   const listener = e => {
  //     if (e.key === "Escape") {
  //       setSelectedPark(null);
  //     }
  //   };
  //   window.addEventListener("keydown", listener);
  //   return () => {
  //     window.removeEventListener("keydown", listener);
  //   };
  // }, []);
  return (
    <div>
      <ReactMapGL
      {...viewport}
      // mapboxApiAccessToken={process.env.mapboxkey}
      mapboxApiAccessToken='pk.eyJ1IjoiZ2htYWxpayIsImEiOiJja3RsZTR2dm8xdXQ1Mndqb2pwdnk4anVoIn0.93RqXDlpMdCDbyDpNQJBuw'
      // mapStyle="mapbox://styles/mapbox/dark-v10"
      mapStyle="mapbox://styles/mapbox/navigation-night-v1"
      // mapStyle="mapbox://styles/ghmalik/ckx284rz33x3l15nskwwb6j8y"
      onViewportChange={viewport => {
        setViewport(viewport);
      }}
      >
        <ScaleControl maxWidth={100} unit="metric"  />
        <Marker 
        latitude={41.8781} 
        longitude={-87.63} 
        offsetTop={(-viewport.zoom * 5)/2}>
          <div style={{ cursor: 'pointer' }} onClick={() => alert(`I'm Marker`)}>
            <img src="chicago.png" 
            width={viewport.zoom * 5}
            height={viewport.zoom * 5}
            />
          </div>
        </Marker>


        {parkData.features.map(park => (
          <Marker
            key={park.geometry.coordinates[1]}
            latitude={park.geometry.coordinates[1]}
            longitude={park.geometry.coordinates[0]}
          >
           {/* <div>parkicon</div> */}
           <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                setSelectedPark(park);
              }}
            >
              {/* <img src="/skateboarding.svg" alt="Skate Park Icon" /> */}
              <img src="/parkimg.jpg" alt="Skate Park Icon" />
            </button>
          </Marker>
        ))}
        {selectedPark ? (
          <Popup
            latitude={selectedPark.geometry.coordinates[1]}
            longitude={selectedPark.geometry.coordinates[0]}
            onClose={() => {
              setSelectedPark(null);
            }}
          >
            <div>
            <img src="park.jpg" 
            width="400"
            height="250"
            />
              <h2>{selectedPark.properties.title}</h2>
              <p>{selectedPark.properties.description}</p>
            </div>
          </Popup>
        ) : null}
        {/* {skatpark.features.map(park => (
          <Marker
            key={park.properties.PARK_ID}
            latitude={park.geometry.coordinates[1]}
            longitude={park.geometry.coordinates[0]}
          >
           <div>parkicon</div>
           <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                setSelectedPark(park);
              }}
            >
              <img src="/skateboarding.svg" alt="Skate Park Icon" /> 
              <img src="/skaticon.png" alt="Skate Park Icon" />
            </button>
          </Marker>
        ))}
        {selectedPark ? (
          <Popup
            latitude={selectedPark.geometry.coordinates[1]}
            longitude={selectedPark.geometry.coordinates[0]}
            onClose={() => {
              setSelectedPark(null);
            }}
          >
            <div>
              <h2>{selectedPark.properties.NAME}</h2>
              <p>{selectedPark.properties.DESCRIPTIO}</p>
            </div>
          </Popup>
        ) : null} */}
      </ReactMapGL>
    </div>
  );
}

