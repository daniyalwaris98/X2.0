import React, { useState, useEffect } from "react";
import { Card, Col, Row, Table, Divider, Input, Button } from "antd";
import ReactSpeedometer from "react-d3-speedometer";
import axios, { baseUrl } from "../../utils/axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { DoubleLeftOutlined } from "@ant-design/icons";
import rcs from "./assets/rcs.svg";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../App.css";
import {
  MainTableFailedDevices,
  MainTableFailedDevicesTitle,
  TableStyling,
  SummaryDevices,
  MainTitle,
  SpinLoading,
  ColRowNumberStyle,
  StyleCmdInput,
} from "../AllStyling/All.styled.js";
// import summary from "./assets/summary.svg";
// import inter from "./assets/interface.svg";
import { columnSearch } from "../../utils";

let excelData = [];
let columnFilters = {};
const index_Main = () => {
  const navigate = useNavigate();
  const data = useLocation();
  console.log(data);
  const [loading, setLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState(data?.state?.res?.ip_address);
  const [vendor, setvendor] = useState(data?.state?.res?.vendor);
  const [device_name, setdevice_name] = useState(data?.state?.res?.device_name);
  const [myFunction, setMyFunction] = useState(data?.state?.res?.function);
  // const [configuration, setconfiguration] = useState(
  //   data?.state?.res?.function
  // );
  const [cmdOutputData, setCmdOutputData] = useState("");

  let [dataSource, setDataSource] = useState(excelData);
  const [mainModalVisible, setMainModalVisible] = useState(false);

  const [ipamDeviceLoading, setIpamDeviceLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [searchContext, setsearchContext] = useState("");
  const [ipAddressData, setIpAddressData] = useState(data?.state?.res?.alerts);

  // const [device_type, setDeviceType] = useState("");
  // const [password_group, setPassword_group] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [mainTableloading, setMainTableLoading] = useState(false);
  const [configData, setConfigData] = useState(null);

  var listData = [
    {
      hour: 1,
      status: "down",
    },
    {
      hour: 2,
      status: "up",
    },
    {
      hour: 3,
      status: "up",
    },
    {
      hour: 4,
      status: "down",
    },
    {
      hour: 5,
      status: "NA",
    },

    {
      hour: 6,
      status: "up",
    },
    {
      hour: 7,
      status: "up",
    },
    {
      hour: 8,
      status: "down",
    },
    {
      hour: 9,
      status: "up",
    },
    {
      hour: 10,
      status: "up",
    },
    {
      hour: 11,
      status: "up",
    },
    {
      hour: 12,
      status: "up",
    },
    {
      hour: 13,
      status: "up",
    },
    {
      hour: 14,
      status: "down",
    },
    {
      hour: 15,
      status: "up",
    },
    {
      hour: 16,
      status: "up",
    },
    {
      hour: 17,
      status: "up",
    },
    {
      hour: 18,
      status: "up",
    },
    {
      hour: 19,
      status: "down",
    },
    {
      hour: 20,
      status: "down",
    },
    {
      hour: 21,
      status: "up",
    },
    {
      hour: 22,
      status: "down",
    },
    {
      hour: 23,
      status: "up",
    },
    {
      hour: 24,
      status: "down",
    },
    // 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    // 22, 23, 24,
  ];
  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };
  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
    console.log(JSON.parse(config));
  }, []);
  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  //   let getColumnSearchProps = columnSearch(
  //     searchText,
  //     setSearchText,
  //     searchedColumn,
  //     setSearchedColumn
  //   );
  const rowSelection = {
    selectedRowKeys,

    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: !configData?.uam.pages.sites.read_only,
    }),
  };

  const [responseData, setResponseData] = useState(data?.state?.res?.cards);

  const [availability, setAvailability] = useState(
    data?.state?.res?.availability
  );
  const [packet_loss, setPacket_loss] = useState(data?.state?.res?.packet_loss);
  const [cpu_utilization, setCpu_utilization] = useState(
    data?.state?.res?.cpu_utilization
  );
  const [memory_utilization, setMemory_utilization] = useState(
    data?.state?.res?.memory_utilization
  );
  const [responseTime, setResponseTime] = useState(
    data?.state?.res?.response_time
  );
  const [interfaceData, setInterfaceData] = useState(
    data?.state?.res?.interfaces
  );

  console.log(ipAddress, responseData);
  //   useEffect(() => {
  //     const serviceCalls = async () => {
  //       setMainTableLoading(true);

  //       try {
  //         const res = await axios.get(baseUrl + "/getMonitoringDevicesCards");
  //         console.log("getMonitoringDevicesCards", res);
  //       } catch (err) {
  //         console.log(err.response);
  //         setMainTableLoading(false);
  //       }
  //     };
  //     serviceCalls();
  //   }, []);

  const handleCommand = async (e) => {
    // e.preventDefault();
    const Data = {
      ip_address: ipAddress,
      cmd: searchContext,
    };

    setLoading(true);

    await axios
      .post(baseUrl + "/sendCommand", Data)
      .then((response) => {
        // console.log(response.status);
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");

          setLoading(false);
        } else {
          // openSweetAlert(response?.response?.data, "success");

          setCmdOutputData(response.data);

          setLoading(false);
        }
      })
      .catch((err) => {
        // openSweetAlert(response?.data, "error");
        console.log("error ==> " + err);
        setLoading(false);
      });
  };

  const [tableName, setTableName] = useState("Summary");
  const showTable = (myDataTable) => {
    if (myDataTable === "Summary") {
      setTableName("Summary");
    } else if (myDataTable === "Interface") {
      setTableName("Interface");
    } else if (myDataTable === "IPAM") {
      setTableName("IPAM");
    } else if (myDataTable === "Monitoring") {
      setTableName("Monitoring");
    } else if (myDataTable === "DCM") {
      setTableName("DCM");
    }
  };
  return (
    <div style={{ marginRight: "15px", marginLeft: "15px" }}>
      <br />
      <div
        style={{
          width: "100%",
          // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
          display: "flex",
          justifyContent: "center",
          borderRadius: "5px",
          // marginLeft: "15px",
        }}
      >
        <SummaryDevices
          active={"Summary" === tableName}
          onClick={() => showTable("Summary")}
          // style={{
          //   borderBottom: "2px solid ",
          // }}
        >
          <div style={{ display: "flex" }}>
            {/* <img
              src={summary}
              width="25px"
              height="25px"
              alt=""
              style={{ marginLeft: "10px", marginTop: "8px" }}
            /> */}
            <MainTitle
              active={"Summary" === tableName}
              style={{
                paddingLeft: "20px",
                paddingTop: "10px",
              }}
            >
              Summary
            </MainTitle>
          </div>
        </SummaryDevices>
        {/* <SummaryDevices
          active={"Interface" === tableName}
          onClick={() => showTable("Interface")}
          
        >
          <div style={{ display: "flex" }}>
            <img
              src={inter}
              width="25px"
              height="25px"
              alt=""
              style={{ marginLeft: "10px", marginTop: "8px" }}
            />
            <MainTitle
              active={"Interface" === tableName}
              style={{
                paddingLeft: "20px",
                paddingTop: "10px",
              }}
            >
              Interface
            </MainTitle>
          </div>
        </SummaryDevices> */}
      </div>

      <div>
        {tableName === "Summary" ? (
          <>
            <div
              style={{
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
              }}
            >
              <h3
                style={{
                  // color: "#66b127",
                  borderLeft: "5px solid #66b127",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  textAlign: "left",
                  // marginLeft: '-6px',
                  paddingTop: "8px",
                  fontWeight: "bold",
                }}
              >
                Remote Command Send
              </h3>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    width: "200px",
                    height: "70px",
                    borderRight: "0.5px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <h5>IP Address:</h5>
                  <p style={{ color: "#66b127" }}>{ipAddress}</p>
                  <Divider type="vertical" />
                </div>
                <div
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    width: "200px",
                    height: "70px",
                    borderRight: "0.5px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <h5>Device Name:</h5>
                  <p style={{ color: "#66b127" }}>{device_name}</p>
                  <Divider type="vertical" />
                </div>
                <div
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    width: "200px",
                    height: "70px",
                    borderRight: "0.5px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <h5>Vendor:</h5>
                  <p style={{ color: "#66b127" }}>{vendor}</p>
                  <Divider type="vertical" />
                </div>
                <div
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    width: "200px",
                    height: "70px",
                    borderRight: "0.5px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <h5>Function:</h5>
                  <p style={{ color: "#66b127" }}>{myFunction}</p>
                  <Divider type="vertical" />
                </div>
                {/* <div
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    width: "200px",
                    height: "70px",
                    borderRight: "0.5px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <h5>Password Group:</h5>
                  <p style={{ color: "#66b127" }}>{password_group}</p>
                  <Divider type="vertical" />
                </div> */}
              </div>
            </div>
            <div
              style={{
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                height: "110px",
                // display: "grid",
                // placeItems: "center",
                width: "100%",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  marginRight: "5%",
                  marginLeft: "5%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "40px",
                }}
              >
                <img src={rcs} alt="" width="25px" height="25px" />
                <StyleCmdInput
                  type="text"
                  style={{
                    width: "70%",
                    marginLeft: "15px",
                    marginRight: "15px",
                  }}
                  value={searchContext}
                  onChange={(e) => setsearchContext(e.target.value)}
                  placeholder="Search"
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      handleCommand();
                      console.log("asdlk");
                    }
                  }}
                />
                <SpinLoading spinning={loading}>
                  <button
                    onClick={handleCommand}
                    style={{
                      color: "white",
                      cursor: "pointer",
                      borderRadius: "8px",
                      border: "none",
                      width: "80px",
                      height: "35px",
                      background:
                        "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                    }}
                  >
                    Send
                  </button>
                </SpinLoading>
              </div>
            </div>

            <h4 style={{ padding: "10px", marginTop: "8px" }}>Output:</h4>
            <SpinLoading spinning={loading}>
              <pre style={{ padding: "10px" }}>{cmdOutputData}</pre>
            </SpinLoading>
          </>
        ) : null}
        {/* {tableName === "Interface" ? (
        <>
        raza</>
        ) : null} */}
      </div>

      <br />

      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          width: "100%",
          flexDirection: "row",
          backgroundColor: "#000",
          height: "20px",
        }}
      >
        {listData.map((item, index) => (
          <>
            {item.status === "down" ? (
              <div
                style={{
                  width: "4%",
                  height: "100%",
                  background: "#db6c6c",
                  flex: 1,
                }}
              >
                {" "}
                <div
                  style={{
                    width: "1.5%",
                    height: "100%",
                    background: "#fff",
                    flex: 1,
                  }}
                ></div>
              </div>
            ) : null}

            {item.status === "up" ? (
              <div
                style={{
                  width: "4%",
                  height: "100%",
                  background: "#6627",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: "1.5%",
                    height: "100%",
                    background: "#f127",
                    flex: 1,
                  }}
                ></div>
              </div>
            ) : null}

            {item.status !== "up" && item.status !== "down" ? (
              <div
                style={{
                  width: "4%",
                  height: "100%",
                  background: "#7c7c7ced",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: "1.5%",
                    height: "100%",
                    background: "#7c7c7ced",
                    flex: 1,
                  }}
                ></div>
              </div>
            ) : null}
          </>
        ))}
      </div> */}
    </div>
  );
};

export default index_Main;
