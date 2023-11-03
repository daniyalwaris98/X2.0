import React, { useState, useRef, useEffect } from "react";
import "./mymapp.css";
import { SpinLoading } from "../../../AllStyling/All.styled.js";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";

import * as L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
import mark from "./assets/loc.svg";
import axios, { baseUrl } from "../../../../utils/axios";

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

  return (
    <SpinLoading spinning={loading}>
      <div style={{ borderRadius: "8px" }}>
        <div style={{ width: "100%", height: "220px" }}>
          <MapContainer
            minZoom={1.5}
            maxZoom={18}
            center={[60.505, 100.09]}
            zoom={0}
            ref={mapRef}
            style={{ borderRadius: "8px" }}
          >
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}" />
            {mapData.map((item, index) => (
              <div key={index}>
                <Marker position={[`${item.latitude}`, `${item.longitude}`]}>
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
    </SpinLoading>
  );
};

export default index;
