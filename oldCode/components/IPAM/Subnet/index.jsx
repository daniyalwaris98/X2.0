import React, { useState } from "react";

import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Routes, Route, Outlet } from "react-router-dom";

import { AntDesignOutlined } from "@ant-design/icons";

let excelData = [];
let columnFilters = {};

const index = () => {
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div style={{ backgroundColor: "#FFFFFF" }}>
        <div>
          <div>
            {/* <div style={{ paddingBottom: "2px" }}>
              <h2
                style={{
                  float: "left",
                  marginLeft: "20px",
                  fontWeight: "bold",
                  marginTop: "5px",
                }}
              >
                IP Address Management
              </h2>
            </div> */}
          </div>
        </div>

        <br />
        {/* <img src={uamG} alt="" /> &nbsp;  */}

        {/* <br /> */}

        {/* <div
          style={{
            // borderBottom: "1px solid rgba(175, 175, 175, 0.2)",

            marginTop: "40px",
          }}
        ></div>

        <div
          style={{
            marginRight: "15px",
            marginLeft: "15px",
            marginTop: "5px",
            marginBottom: "-5px",
          }}
        >
          {/* <Subnet_Navigation /> */}
        {/* </div>
        <div
          style={{
            borderBottom: "1px solid rgba(175, 175, 175, 0.2)",

            marginBottom: "10px",
          }}
        ></div> */}
        <Outlet />
      </div>
      {/* <Sites /> */}
    </div>
  );
};

export default index;
