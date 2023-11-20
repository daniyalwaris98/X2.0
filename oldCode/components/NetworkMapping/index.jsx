import React from "react";
import network_map from "./assets/network_map.svg";
const index = () => {
  return (
    <div>
      <div style={{ backgroundColor: "#FFFFFF", height: "100%" }}>
        <div style={{ padding: "2px" }}>
          <h2
            style={{
              float: "left",
              marginLeft: "20px",
              fontWeight: "bold",
              marginTop: "2px",
            }}
          >
            <img src={network_map} alt="" /> Network Mapping
          </h2>
        </div>
      </div>
    </div>
  );
};

export default index;
