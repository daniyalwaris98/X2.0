import { DivStratch } from "../main.styled.js";

import Navigation from "./Sub_Navigation";

import React, { useState, useEffect } from "react";
import axios, { baseUrl } from "../../../../utils/axios";

import { Link, useNavigate } from "react-router-dom";
import active from "../../assets/active.svg";
import inactive from "../../assets/inactive.svg";
import {
  Row,
  Col,
  Checkbox,
  Table,
  notification,
  Spin,
  Progress,
  Button,
  Input,
} from "antd";
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
  DownOutlined,
  SmileOutlined,
  AlipayOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

import {
  TableStyling,
  StyledExportButton,
  SpinLoading,
  MainTableModal,
  MainTableMainP,
  MainTableMainDiv,
  StyledSubmitButton,
  MainTableDropDown,
  MainTableColP,
  StyledselectIpam,
  InputWrapper,
  ColRowNumberStyle,
  LinkStyled,
} from "../../../AllStyling/All.styled";
import { columnSearch } from "../../../../utils";
let excelData = [];
let columnFilters = {};
const index_Main = () => {
  let [dataSource, setDataSource] = useState(excelData);
  const [mainModalVisible, setMainModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ipamDeviceLoading, setIpamDeviceLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [ip_address, setIpAddress] = useState("");
  const [device_type, setDeviceType] = useState("");
  const [password_group, setPassword_group] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [mainTableloading, setMainTableLoading] = useState(false);
  const [configData, setConfigData] = useState(null);
  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
    console.log(JSON.parse(config));
  }, []);
  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );
  const rowSelection = {
    selectedRowKeys,

    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: !configData?.uam.pages.sites.read_only,
    }),
  };
  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllInterfacesInFirewalls");
        excelData = res.data;
        setDataSource(excelData);
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
    // {
    //   title: "",
    //   key: "edit",
    //   width: "2%",

    //   render: (text, record) => (
    //     <>
    //       {!configData?.uam.pages.sites.read_only ? (
    //         <>
    //           <a
    //             disabled
    //             // onClick={() => {
    //             //   edit(record);
    //             // }}
    //           >
    //             <EditOutlined
    //               style={{ paddingRight: "50px", color: "#66A111" }}
    //             />
    //           </a>
    //         </>
    //       ) : (
    //         <a
    //           onClick={() => {
    //             edit(record);
    //           }}
    //         >
    //           <EditOutlined
    //             style={{ paddingRight: "50px", color: "#66A111" }}
    //           />
    //         </a>
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "Device name",
      dataIndex: "device_name",
      key: "device_name",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "device_name",
        "Device name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
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
      title: "Interface Name",
      dataIndex: "interface_name",
      key: "interface_name",
      render: (text, record) => (
        <p
          onClick={async () => {
            setMainLoading(true);
            const res = await axios.post(baseUrl + "/getinterfaceband ", {
              ip_address: record.ip_address,
              interface_name: text,
            });

            console.log("getinterfaceband", res);
            navigate("/monitoringinterfacesummary/main", {
              state: {
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
        "interface_name",
        "Interface Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Interface Status",
      dataIndex: "interface_status",
      key: "interface_status",
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
        "interface_status",
        "Interface Status",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Upload Speed",
      dataIndex: "upload_speed",
      key: "upload_speed",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text} Mbps
        </p>
      ),

      ...getColumnSearchProps(
        "upload_speed",
        "Upload Speed",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Download Speed",
      dataIndex: "download_speed",
      key: "download_speed",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text} Mbps
        </p>
      ),

      ...getColumnSearchProps(
        "download_speed",
        "Download Speed",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Interface Description",
      dataIndex: "interface_description",
      key: "interface_description",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "interface_description",
        "Interface Description",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    // {
    //   title: "Usage",
    //   dataIndex: "usage",
    //   key: "size",
    //   render: (text) => (
    //     <div
    //       style={{
    //         // textAlign: "center",
    //         // marginLeft: "20px",
    //         marginTop: "-10px",
    //         paddingRight: "55px",
    //         paddingleft: "45px",
    //       }}
    //     >
    //       <Progress
    //         strokeColor="#66B127"
    //         percent={text}
    //         size="small"
    //         status="active"
    //       />
    //     </div>
    //   ),

    //   ...getColumnSearchProps(
    //     "usage",
    //     "Usage",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },

    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (text, record) => (
    //     <p
    //       style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
    //     >
    //       {text}
    //     </p>
    //   ),
    //   // text === "Down" ? (
    //   //   <>
    //   //     <img src={empty} alt="" /> &nbsp;{" "}
    //   //     <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
    //   //   </>
    //   // ) : (
    //   //   <>
    //   //     <img src={Scanned} alt="" /> &nbsp;{" "}
    //   //     <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
    //   //   </>
    //   // ),

    //   ...getColumnSearchProps(
    //     "status",
    //     "Status",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },

    // {
    //   title: "Last Used",
    //   dataIndex: "last_used",
    //   key: "last_used",
    //   render: (text, record) => (
    //     <p
    //       style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
    //     >
    //       {text}
    //     </p>
    //   ),

    //   ...getColumnSearchProps(
    //     "last_used",
    //     "Last Used",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
  ];

  return (
    <div>
      <div style={{ backgroundColor: "#FFFFFF", textAlign: "center" }}>
        <div
          style={{
            // borderBottom: "1px solid rgba(175, 175, 175, 0.2)",

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
          <span style={{ color: "rgba(0,0,0,0.5" }}>Network </span>/ Firewall /
          Interfaces
        </h3>

        {/* <div
          style={{
            marginTop: "5px",
            marginBottom: "-5px",
          }}
        >
          <Navigation />
        </div>
        <DivStratch
          style={{
            margin: "0 auto",
            borderBottom: "1px solid rgba(175, 175, 175, 0.2)",
            
            marginBottom: "10px",
          }}
        ></DivStratch> */}
      </div>
      <br />
      <div style={{ marginRight: "12px", marginLeft: "12px" }}>
        <div style={{ marginRight: "15px", marginLeft: "15px" }}>
          {/* <div style={{ float: "left" }}>
            <p
              style={{
                // marginLeft: "10px",
                fontWeight: "600",
                fontSize: "16px",
                color: "rgba(0,0,0,0.5)",
              }}
            >
              <LinkStyled
                style={{ color: "rgba(0,0,0,0.5)" }}
                to="/ipam/subnet/main"
              >
                Subnet
              </LinkStyled>{" "}
              /<span style={{ color: "#000" }}> IP History</span>
            </p>
          </div> */}
          <br />
          {/* <br />
          <br /> */}

          <div style={{ display: "flex", marginTop: "5px" }}>
            <h4>Rows :</h4>&nbsp;
            <ColRowNumberStyle>{rowCount}</ColRowNumberStyle>
            &nbsp;&nbsp;
            <h4>Cols :</h4>&nbsp;
            <ColRowNumberStyle>7</ColRowNumberStyle>
          </div>
          <SpinLoading spinning={mainTableloading}>
            <div style={{ padding: "25px" }}>
              <TableStyling
                // rowSelection={rowSelection}
                scroll={{ x: 2000 }}
                // pagination={{ pageSize: 10 }}
                // rowKey="site_name"
                columns={columns}
                dataSource={dataSource}
                // pagination={false}
                // style={{ width: "100%" }}
              />
            </div>
          </SpinLoading>
        </div>
      </div>
    </div>
  );
};

export default index_Main;
