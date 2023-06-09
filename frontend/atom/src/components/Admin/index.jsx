import React, { useState } from "react";
import admin from "./assets/admin.svg";
import { Outlet } from "react-router-dom";
import AdminNavigatiom from "../AdminNavigation/Navigation";

const index = () => {
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
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
            <img src={admin} alt="" />
            &nbsp;&nbsp; Admin
          </h2>
        </div>
        <br />
        <br />
        <div
          style={{
            borderBottom: "1px solid rgba(175, 175, 175, 0.2)",
          }}
        ></div>
        <div
          style={{
            marginTop: "5px",
            marginBottom: "-5px",
          }}
        >
          <AdminNavigatiom />
        </div>
        <div
          style={{
            borderBottom: "1px solid rgba(175, 175, 175, 0.2)",

            marginBottom: "10px",
          }}
        ></div>
        <br />
      </div>
      <Outlet />
    </div>
  );
};

export default index;
