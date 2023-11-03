import React from "react";
import AtomNavigation from "../AtomNavigation";
import atomicon from "./assets/atomvariant.svg";
import { Outlet } from "react-router-dom";

import { DivStratch } from "./Dashboard.styled.js";

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
              <img
                src={atomicon}
                alt=""
                style={{ width: "24px", height: "24px" }}
              />
              &nbsp; Atom
            </h2>
          </div>
        </div>
      </div>
      <br />

      <br />

      <div
        style={{
          borderBottom: "1px solid #eaeaea",
          marginTop: "2px",
        }}
      ></div>

      <div
        style={{
          marginTop: "5px",
          marginBottom: "-3px",
        }}
      >
        <AtomNavigation />
      </div>
      <DivStratch
        style={{
          margin: "0 auto",
          borderBottom: "1px solid #ccc",
          marginBottom: "10px",
        }}
      ></DivStratch>
      <Outlet />
    </div>
  );
};

export default Atom;
