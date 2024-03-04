import React, { useState, useEffect } from "react";

import { columnSearch } from "../../utils";

import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Outlet } from "react-router-dom";
import Monitoring_Navigation from "../Monitoring_Navigation";

import { MonitoringIcon } from "../../svg";

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
                style={{ marginRight: "10px", fill: "#66B127" }}
              >
                <MonitoringIcon />
              </span>
              Monitoring
            </h2>
          </div>
        </div>
        <br />

        <br />
        <div style={{ marginTop: "-18px" }}></div>
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
          <Monitoring_Navigation />
        </div>
        <div
          style={{
            margin: "0 auto",
            borderBottom: "1px solid rgba(175, 175, 175, 0.2)",
            width: "750px",
            marginBottom: "10px",
          }}
        ></div>
        <Outlet />
      </div>
      {/* <Sites /> */}
    </div>
  );
};

export default index;
