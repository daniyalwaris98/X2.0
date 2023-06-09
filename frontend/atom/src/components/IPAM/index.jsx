import React from "react";
import { DivStratch } from "./ipam.styled.js";
import { Outlet } from "react-router-dom";
import IPAM_Navigation from "../IPAM_Navigation";
import { IpamIcon } from "../../svg";

const index = () => {
  return (
    <div style={{ backgroundColor: "#FFFFFF", textAlign: "center" }}>
      <div style={{ backgroundColor: "#FFFFFF", textAlign: "center" }}>
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
                style={{
                  marginRight: "10px",
                  fontSize: "15px",
                  fill: "#66B127",
                }}
              >
                <IpamIcon />
              </span>
              IP Address Management
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
          <IPAM_Navigation />
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
    </div>
  );
};

export default index;
