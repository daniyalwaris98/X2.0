import React, { useState, useRef, useMemo, useEffect } from "react";
// import './App.css';
// import 'leaflet/dist/leaflet.css';
import axios, { baseUrl } from "../../../../utils/axios";

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import { SpinLoading } from "../../../AllStyling/All.styled";

import * as L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
import mark from "./assets/loc.svg";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: mark,
  iconUrl: mark,
  iconAnchor: null,
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: [35, 35],
});

const index = () => {
  const [loading, setLoading] = useState(false);
  const [mapData, setMapData] = useState([]);
  useEffect(() => {
    const phyLeaflet = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/rackLeaflet");
        console.log("RackLeaflet", res.data);
        setMapData(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    phyLeaflet();
  }, []);

  const mapRef = useRef();

  const markerRef = useRef();

  const eventHandlers = useMemo(
    () => ({
      mouseover() {
        if (markerRef) markerRef.current.openPopup();
      },
      mouseout() {
        if (markerRef) markerRef.current.closePopup();
      },
    }),
    []
  );

  return (
    <SpinLoading spinning={loading}>
      <div style={{ borderRadius: "8px" }}>
        <div style={{ width: "100%", height: "100%" }}>
          <MapContainer
            minZoom={1.5}
            maxZoom={18}
            center={[60.505, 100.09]}
            zoom={0}
            ref={mapRef}
            style={{ borderRadius: "8px" }}
          >
            <TileLayer
              // attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            />
            {mapData.map((item, index) => (
              <div key={index}>
                <Marker
                  // position={[67, -100]}
                  position={[`${item.latitude}`, `${item.longitude}`]}
                >
                  <Tooltip>{item.site_name}</Tooltip>
                </Marker>
              </div>
            ))}

            {/* <Marker
            position={[30.3753, 69.3451]}
            eventHandlers={{
              mouseover: (event) => event.target.openPopup("hello"),
            }}
          >
         
            <Tooltip>Pakistan</Tooltip>
          </Marker> */}
            {/* <Marker
            position={[31.5204, 74.3587]}
            eventHandlers={{
              mouseover: (event) => event.target.openPopup("hello"),
            }}
          >
       
            <Tooltip>Pakistan</Tooltip>
          </Marker> */}
            {/* <Marker
            position={[33.6141, 73.0516]}
            eventHandlers={{
              mouseover: (event) => event.target.openPopup("hello"),
            }}
          >
        
            <Tooltip>Pakistan</Tooltip>
          </Marker> */}
          </MapContainer>
        </div>
      </div>
    </SpinLoading>
  );
};

export default index;
