import React, { useState } from "react";

import { columnSearch } from "../../utils";

import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Routes, Route, Outlet } from "react-router-dom";
import MonitoringSummaryInterfaceNavigation from "../MonitoringSummaryInterfacesNavigation";
import {
  TableStyling,
  StyledImportFileInput,
  StyledButton,
  OnBoardStyledButton,
  AddAtomStyledButton,
  StyledExportButton,
  StyledInput,
  Styledselect,
  InputWrapper,
  StyledSubmitButton,
  StyledModalButton,
  ColStyling,
  AddStyledButton,
  TableStyle,
} from "../AllStyling/All.styled.js";

// import {
//   AddAtomStyledButton,
//   StyledExportButton,
//   TableStyling,
// } from './UAM.styled.js';

// import StyledExportButton from "../../../ReuseStyle/ExportExcelButton/button.styled.js"

import { AntDesignOutlined } from "@ant-design/icons";
import MainFile from "./index_Main.jsx";
let excelData = [];
let columnFilters = {};

const index = () => {
  return (
    <div style={{ backgroundColor: "#FFFFFF", textAlign: "center" }}>
      {/* <div style={{ backgroundColor: "#FFFFFF", textAlign: "center" }}>
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
                Interface Summary
              </h2>
            </div>
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
          <MonitoringSummaryInterfaceNavigation />
        </div>
        <div
          style={{
            margin: "0 auto",
            borderBottom: "1px solid rgba(175, 175, 175, 0.2)",
            width: "550px",
            marginBottom: "10px",
          }}
        ></div>
        <Outlet />
      </div> */}
      {/* <Sites /> */}
      <MainFile />
    </div>
  );
};

export default index;
