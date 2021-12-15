import React, { useRef, useEffect, useState } from "react";

import mapboxgl from "mapbox-gl";


// import classes from "./Map.module.css";
import "mapbox-gl/dist/mapbox-gl.css";

import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

function Map() {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiY2hhZGJ1aWUiLCJhIjoiY2tnbHNhNThsMDJnbjMxbXQ2bWZwaTF3ciJ9.eCt9f-eO-b8T0l4srggP1A";

  const mapContainer = useRef(null);

  const [lng, setLng] = useState(-95.9);
  const [lat, setLat] = useState(38.35);
  const [zoom, setZoom] = useState(4.5);

  const [buttonTerm, setbuttonTerm] = useState("");


  useEffect(() => {
    // Initialize map when component mounts

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
      attributionControl: true,
    });

    // disable map zoom when using scroll
    // map.scrollZoom.disable();

    map.on("load", function () {
      // Add an image to use as a custom marker
      map.loadImage(
        // https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png
        "https://chadzilla2080.github.io/mapdata/red-marker.png",
        function (error, image) {
          if (error) throw error;
          map.addImage("custom-marker", image);

          // Add a GeoJSON source with multiple points
          map.addSource("points", {
            type: "geojson",
            data: "https://chadzilla2080.github.io/mapdata/AutoBody.geojson",
            buffer: 0,
          });

          // Add Auto Body Parts Layer
          map.addLayer({
            id: "Auto Body",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              "icon-allow-overlap": true,
              "text-allow-overlap": false,
              visibility: "visible",

              // get the title name from the source's "title" property
              "text-field": ["get", "partname"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });

       

          // Add All Brakes GeoJSON source with multiple points
          map.addSource("brakespoints", {
            type: "geojson",
            data: "https://chadzilla2080.github.io/mapdata/Brakes.geojson",
            buffer: 0,
          });

          // Add All Brakes Auto Part Layer
          map.addLayer({
            id: "Brakes",
            type: "symbol",
            source: "brakespoints",
            layout: {
              "icon-image": "custom-marker",
              "icon-allow-overlap": true,
              "text-allow-overlap": false,
              visibility: "visible",

              // get the title name from the source's "title" property
              "text-field": ["get", "partname"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });
           // Add a Engines GeoJSON source with multiple points
           map.addSource("enginepoints", {
            type: "geojson",
            data: "https://chadzilla2080.github.io/mapdata/Engine.geojson",
            buffer: 0,
          });

          // Add All Engines Pump Auto Part Layer
          map.addLayer({
            id: "Engines",
            type: "symbol",
            source: "enginepoints",
            layout: {
              "icon-image": "custom-marker",
              "icon-allow-overlap": true,
              "text-allow-overlap": false,
              visibility: "visible",

              // get the title name from the source's "title" property
              "text-field": ["get", "partname"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });


          // End Of Data Source and Map Layers
        }
      );
    });

    // Filtering Tabs For The Map
    var toggleableLayerIds = [
      "Auto Body",
      "Brakes",
      "Engines",

    ];

    // set up the corresponding toggle button for each layer
    for (var i = 0; i < toggleableLayerIds.length; i++) {
      var id = toggleableLayerIds[i];

      var link = document.createElement("a");
      link.href = "#";
      link.className = "active";
      link.textContent = id;

      link.onclick = function (e) {
        var clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        var visibility = map.getLayoutProperty(clickedLayer, "visibility");

        // toggle layer visibility by changing the layout object's visibility property
        if (visibility === "visible") {
          map.setLayoutProperty(clickedLayer, "visibility", "none");
          this.className = "";
        } else {
          this.className = "active";
          map.setLayoutProperty(clickedLayer, "visibility", "visible");
        }
      };

      var layers = document.getElementById("menu");
      layers.appendChild(link);
      <>
        <input
          type="text"
          placeholder="what auto part filters do you need..."
          onChange={(event) => {
            setbuttonTerm(event.target.value);
          }}
        />
        <br />
        {toggleableLayerIds
          .filter((val) => {
            if (buttonTerm === "") {
              return val;
            } else if (
              val.partname.toLowerCase().includes(buttonTerm.toLowerCase())
            ) {
              return val;
            }
          })
          .slice(0, 15)
          .map((val, key) => {
            return (
              <div>
                <a href="">{val}</a>
                <br />
              </div>
            );
          })}
        <br />
      </>;
    }

    // When a click event occurs on a feature in the places layer, open a popup at the
    // location of the feature, with description HTML from its properties.
    map.on("click", "Auto Body", (e) => {
      map.getCanvas().style.cursor = "pointer";

    //   // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const partmake = e.features[0].properties.partmake;
      const partmodel = e.features[0].properties.partmodel;
      const partname = e.features[0].properties.partname;
      const partprice = e.features[0].properties.partprice;
      const partnum = e.features[0].properties.partnum;
      const phonea = e.features[0].properties.phonea;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup
        .setLngLat(coordinates)
        .setHTML(
          "<h3>" +
            partmake +
            " " +
            partmodel +
            " " +
            partname +
            "</h3>" +
            "<p>" +
            "Price: " +
            partprice +
            "</p>" +
            "<p>" +
            "Part #: " +
            partnum +
            "</p>" +
            "<p>" +
            "Phone #: " +
            phonea +
            "</p>"
        )
        .addTo(map);
    });

    
    // Brakes Markers
    map.on("mouseenter", "Brakes", (e) => {
      map.getCanvas().style.cursor = "pointer";

      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const partmake = e.features[0].properties.partmake;
      const partmodel = e.features[0].properties.partmodel;
      const partname = e.features[0].properties.partname;
      const partprice = e.features[0].properties.partprice;
      const partnum = e.features[0].properties.partnum;
      const phonea = e.features[0].properties.phonea;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup
        .setLngLat(coordinates)
        .setHTML(
          "<h3>" +
            partmake +
            " " +
            partmodel +
            " " +
            partname +
            "</h3>" +
            "<p>" +
            "Price: " +
            partprice +
            "</p>" +
            "<p>" +
            "Part #: " +
            partnum +
            "</p>" +
            "<p>" +
            "Phone #: " +
            phonea +
            "</p>"
        )
        .addTo(map);
    });
    // Engines Markers
    map.on("mouseenter", "Engines", (e) => {
      map.getCanvas().style.cursor = "pointer";

      // Copy coordinates array.
      const coordinates = e.features[0].geometry.coordinates.slice();
      const partmake = e.features[0].properties.partmake;
      const partmodel = e.features[0].properties.partmodel;
      const partname = e.features[0].properties.partname;
      const partprice = e.features[0].properties.partprice;
      const partnum = e.features[0].properties.partnum;
      const phonea = e.features[0].properties.phonea;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup
        .setLngLat(coordinates)
        .setHTML(
          "<h3>" +
            partmake +
            " " +
            partmodel +
            " " +
            partname +
            "</h3>" +
            "<p>" +
            "Price: " +
            partprice +
            "</p>" +
            "<p>" +
            "Part #: " +
            partnum +
            "</p>" +
            "<p>" +
            "Phone #: " +
            phonea +
            "</p>"
        )
        .addTo(map);
    });



    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
      closeButton: true,
      closeOnClick: true,
    });

    // map.on("mouseenter", "points", () => {
    //   map.getCanvas().style.cursor = "pointer";
    //   popup.add();
    // });

    // map.on("mouseleave", "points", () => {
    //   map.getCanvas().style.cursor = "";
    //   popup.remove();
    // });



    // map.addControl(
    //   new mapboxgl.GeolocateControl({
    //     positionOptions: {
    //       enableHighAccuracy: true,
    //     },
    //     trackUserLocation: true,
    //   })
    // );

    // Add the control to the map.
    // map.addControl(
    //   new MapboxGeocoder({
    //     accessToken: mapboxgl.accessToken,
    //     mapboxgl: mapboxgl,
    //   })
    // );

    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl(), "top-left");

    // map.addControl(new mapboxgl.FullscreenControl(), "top-left");

    // Clean up on unmount
    return () => map.remove();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      {/* <div className={classes.mapcontainer}>
        <div className={classes.map} ref={mapContainer} />
      </div> */}
      <div ref={mapContainer} className="map-container" />
      <nav id="menu"></nav>
      
    </div>
  );
}

export default Map;
