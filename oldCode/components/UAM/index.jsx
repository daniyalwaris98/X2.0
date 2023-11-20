import React from "react";
import uamG from "./assets/uamG.svg";

import { DivStratch } from "./UAM.styled.js";
import { Outlet } from "react-router-dom";

import UamNavigation from "../UamNavigation";

const index = () => {
  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div style={{ backgroundColor: "#fff" }}>
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
                  src={uamG}
                  alt=""
                  style={{ width: "24px", height: "24px" }}
                />{" "}
                &nbsp; Unified Asset Management
              </h2>
            </div>
          </div>
        </div>
        <br />

        <br />

        <div
          style={{
            borderBottom: "1px solid #eaeaea",

            marginTop: "1px",
          }}
        ></div>

        <div
          style={{
            marginTop: "5px",
            marginBottom: "-5px",
          }}
        >
          <UamNavigation />
        </div>
        <DivStratch
          style={{
            margin: "0 auto",
            borderBottom: "1px solid #ccc",
            marginBottom: "10px",
          }}
        ></DivStratch>
        <br />
        <Outlet />
      </div>
    </div>
  );
};

export default index;
