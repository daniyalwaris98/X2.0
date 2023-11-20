import React, { useState } from "react";
import { DivStratch } from "./main.styled.js";
import dcm from "./assets/dcm.svg";

import { Routes, Route, Outlet } from "react-router-dom";
import DCCM_Navigation from "../DCCMNavigation";
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

let excelData = [];
let columnFilters = {};

const index = () => {
  return (
    <div style={{ backgroundColor: "#FFFFFF", textAlign: "center" }}>
      <div style={{ backgroundColor: "#FFFFFF", textAlign: "center" }}>
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
                {/* <img src={uamG} alt="" /> &nbsp;  */}
                <img src={dcm} alt="" /> Data Centre Capacity Management
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
          <DCCM_Navigation />
        </div>
        <DivStratch
          style={{
            margin: "0 auto",
            borderBottom: "1px solid rgba(175, 175, 175, 0.2)",
            // width: "820px",
            marginBottom: "10px",
          }}
        ></DivStratch>
        <Outlet />
      </div>
      {/* <Sites /> */}
    </div>
  );
};

export default index;
