import { DivStratch } from "./main.styled.js";
import Network_Navigation from "./Sub_Navigation";

import React, { useState, useEffect } from "react";
import axios, { baseUrl } from "../../../utils/axios";
import active from "../assets/active.svg";
import inactive from "../assets/inactive.svg";
import { useNavigate } from "react-router-dom";
import { Table } from "antd";
import {
  TableStyling,
  SpinLoading,
  ColRowNumberStyle,
} from "../../AllStyling/All.styled";
import { columnSearch } from "../../../utils";

let excelData = [];
let columnFilters = {};

const index_Main = () => {
  const navigate = useNavigate();
  let [dataSource, setDataSource] = useState(excelData);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [mainTableloading, setMainTableLoading] = useState(false);
  const [mainLoading, setMainLoading] = useState(false);

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );

  console.log("dataSource ========>", dataSource);

  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllDevicesInNetwork");
        setDataSource(res.data);
        setRowCount(excelData.length);
        setMainTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const columns = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          onClick={async () => {
            setMainLoading(true);
            const res = await axios.post(
              baseUrl + "/getMonitoringDevicesCards ",
              { ip_address: text }
            );

            console.log("getMonitoringDevicesCards", res);

            navigate("/monitoringsummary/main", {
              state: {
                ip_address: text,
                res: res.data,
              },
            });
            setMainLoading(false);
          }}
          style={{
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            color: "#66B127",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "ip_address",
        "IP Address",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Device Name",
      dataIndex: "device_name",
      key: "device_name",
      render: (text, record) => (
        <p
          style={{
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "device_name",
        "Device Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <div>
          {text === "Up" ? (
            <>
              <img src={active} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}

          {text === "Down" ? (
            <>
              <img src={inactive} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}
        </div>
      ),

      ...getColumnSearchProps(
        "status",
        "Status",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Device Type",
      dataIndex: "device_type",
      key: "device_type",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "device_type",
        "Device Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Function",
      dataIndex: "function",
      key: "function",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "function",
        "Function",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "vendor",
        "Vendor",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Interfaces",
      dataIndex: "interfaces",
      key: "interfaces",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "interfaces",
        "Interfaces",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Discovered Time",
      dataIndex: "discovered_time",
      key: "discovered_time",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "discovered_time",
        "Discovered Time",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Device Description",
      dataIndex: "device_description",
      key: "device_description",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "device_description",
        "Device Description",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  return (
    <div>
      <SpinLoading spinning={mainLoading}>
        <div style={{ backgroundColor: "#FFFFFF", textAlign: "center" }}>
          <div
            style={{
              marginTop: "5px",
            }}
          ></div>

          <h3
            style={{
              float: "left",
              marginLeft: "20px",
              fontWeight: "bold",
              marginTop: "5px",
              display: "inline",
            }}
          >
            <span style={{ color: "rgba(0,0,0,0.5" }}>Network </span> / All
            Devices / Devices
          </h3>
        </div>
        <br />
        <div style={{ marginRight: "12px", marginLeft: "12px" }}>
          <div style={{ marginRight: "15px", marginLeft: "15px" }}>
            <br />

            <div style={{ display: "flex", marginTop: "5px" }}>
              <h4>Rows :</h4>&nbsp;
              <ColRowNumberStyle>{rowCount}</ColRowNumberStyle>
              &nbsp;&nbsp;
              <h4>Cols :</h4>&nbsp;
              <ColRowNumberStyle>9</ColRowNumberStyle>
            </div>
            <SpinLoading spinning={mainTableloading}>
              <div style={{ padding: "25px" }}>
                <TableStyling
                  scroll={{ x: 2000 }}
                  columns={columns}
                  dataSource={dataSource}
                />
              </div>
            </SpinLoading>
          </div>
        </div>
      </SpinLoading>
    </div>
  );
};

export default index_Main;
