import React, { useState, useRef, useMemo, useEffect } from "react";
// import './App.css';
// import 'leaflet/dist/leaflet.css';

import axios, { baseUrl } from "../../../../utils/axios";
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";

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
        const res = await axios.get(baseUrl + "/phyLeaflet");
        console.log("phyLeaflet", res.data);
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
    <div style={{ borderRadius: "8px",margin:"10px" }}>
      <div style={{ width: "100%", height: "100%", marginBottom: "5px" }}>
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
            // url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png"
          />
          {/* <Marker position={[40.505, -100.09]}>
            {/* <Popup>I am a pop-up!</Popup> */}
          {/* <Tooltip>I am a pop-up</Tooltip> */}
          {/* </Marker> */}
          {mapData.map((item, index) => (
            <div key={index}>
              <Marker
                // position={[67, -100]}
                position={[`${item.latitude}`, `${item.longitude}`]}
              >
                <Tooltip>
                  {item.site_name}
                  <br />
                  {item.city}
                </Tooltip>
              </Marker>
            </div>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default index;
