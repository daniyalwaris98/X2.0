import React from "react";
import AutoDiscoveryNavbar from "../AutoDiscoveryNavbar";
import atomicon from "./assets/atomicon.svg";
import { Outlet } from "react-router-dom";
import { DivStratch } from "./main.styled.js";

const Atom = () => {
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div>
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
              <img src={atomicon} alt="" /> &nbsp; Auto Discovery
            </h2>
          </div>
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
        <AutoDiscoveryNavbar />
      </div>
      <DivStratch
        style={{
          margin: "0 auto",
          borderBottom: "1px solid rgba(175, 175, 175, 0.2)",
          marginBottom: "10px",
        }}
      ></DivStratch>
      <Outlet />
    </div>
  );
};

export default Atom;
