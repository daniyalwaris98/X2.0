import React from "react";

import NcsNavigation from "../NcmNavigation";
import { Outlet } from "react-router-dom";
import { NetworkMapIcon } from "../../svg";

const Atom = () => {
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div>
        <div style={{ paddingBottom: "2px" }}>
          <h2
            style={{
              float: "left",
              marginLeft: "20px",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            <span
              className="icon"
              style={{ marginRight: "10px", color: "rgba(0,0,0,.85);" }}
            >
              <NetworkMapIcon />
            </span>
            Network Configuration Manager
          </h2>
        </div>
      </div>
      <br />

      <br />

      <div
        style={{
          borderBottom: "1px solid rgba(175, 175, 175, 0.2)",
          marginTop: "10px",
        }}
      ></div>

      <div
        style={{
          marginTop: "5px",
          marginBottom: "-5px",
        }}
      >
        <NcsNavigation />
      </div>
      <div
        style={{
          borderBottom: "1px solid rgba(175, 175, 175, 0.2)",

          marginBottom: "10px",
        }}
      ></div>
      <Outlet />
    </div>
  );
};

export default Atom;
