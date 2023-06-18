import React, { useState, useEffect } from "react";
// import { Card, Col, Row } from "antd";
import ReactSpeedometer from "react-d3-speedometer";
import axios, { baseUrl } from "../../utils/axios";
import { useLocation } from "react-router-dom";
import StackedBarChart from "./MainChart/StackedBarChart";
import ReactTooltip from "react-tooltip";
import "../../App.css";
import graph from "./assets/graph.svg";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Row, Col, Dropdown, Menu } from "antd";
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
  DownOutlined,
  SmileOutlined,
  AlipayOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import Hamza from "./hamza.jsx";
import {
  SummaryDevices,
  MainTitle,
  InterfaceTableStyling,
} from "../AllStyling/All.styled";

const index_Main = () => {
  const interfaceData = useLocation();
  console.log(interfaceData.state);
  //  console.log(interfaceData.state);
  const [mainTableLoading, setMainTableLoading] = useState("");

  // const [upload, setUpload] = useState(interfaceData?.state?.res?.Upload);
  // const [download, setDownload] = useState(interfaceData?.state?.res?.Download);
  const [allData, setAll] = useState(interfaceData?.state?.res?.All);
  const [tableData, setTableData] = useState(interfaceData?.state?.res?.table);

  console.log(allData);
  console.log(tableData);
  let [zoom, setZoom] = useState({
    left: "dataMin",
    right: "dataMax",
  });

  // const [ipAddress, setIpAddress] = useState(data.state.ip_address);

  // const [responseData, setResponseData] = useState(data.state.res.cards);

  // const [availability, setAvailability] = useState(data.state.res.availability);
  // const [packet_loss, setPacket_loss] = useState(data.state.res.packet_loss);
  // const [cpu_utilization, setCpu_utilization] = useState(
  //   data.state.res.cpu_utilization
  // );
  // const [memory_utilization, setMemory_utilization] = useState(
  //   data.state.res.memory_utilization
  // );
  // const [responseTime, setResponseTime] = useState(
  //   data.state.res.response_time
  // );

  // console.log(ipAddress, responseData);
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

  const [tableName, setTableName] = useState("Interface Graph");
  const showTable = (myDataTable) => {
    if (myDataTable === "Interface Graph") {
      setTableName("Interface Graph");
    }
  };
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  const columns = [
    {
      title: "Bandwidth",
      dataIndex: "bandwidth",
      key: "bandwidth",
    },
    {
      title: "Min",
      dataIndex: "min",
      key: "min",
    },
    {
      title: "Max",
      dataIndex: "max",
      key: "max",
    },
    {
      title: "Avg",
      dataIndex: "avg",
      key: "avg",
    },
  ];

  // const data = [
  //   {
  //     name: "Page A",
  //     uv: 4000,
  //     pv: 2400,
  //     amt: 2400,
  //   },
  //   {
  //     name: "Page B",
  //     uv: 3000,
  //     pv: 1398,
  //     amt: 2210,
  //   },
  //   {
  //     name: "Page C",
  //     uv: 2000,
  //     pv: 9800,
  //     amt: 2290,
  //   },
  //   {
  //     name: "Page D",
  //     uv: 2780,
  //     pv: 3908,
  //     amt: 2000,
  //   },
  //   {
  //     name: "Page E",
  //     uv: 1890,
  //     pv: 4800,
  //     amt: 2181,
  //   },
  //   {
  //     name: "Page F",
  //     uv: 2390,
  //     pv: 3800,
  //     amt: 2500,
  //   },
  //   {
  //     name: "Page G",
  //     uv: 3490,
  //     pv: 4300,
  //     amt: 2100,
  //   },
  // ];
  const customJsonToExcel = async (customData) => {
    const res = await axios.post(baseUrl + "/exportIpDetails", {
      date: customData,
    });
    if (res.data.length > 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(res.data);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "ip_details");
      XLSX.writeFile(wb, "ip_details.xlsx");
      // openNotification();
      // setExportLoading(false);
    } else {
      message.info("No Data Found");
    }
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <ul onClick={() => customJsonToExcel("1hour")}>
          <span style={{ color: "#66b127" }}>
            <li style={{ color: "#66b127" }}>1 Hour</li>
          </span>
        </ul>
      </Menu.Item>
      <Menu.Item>
        <ul onClick={() => customJsonToExcel("1day")}>
          <span style={{ color: "#66b127" }}>
            <li style={{ color: "#66b127" }}>1 Day</li>
          </span>
        </ul>
      </Menu.Item>
      <Menu.Item>
        <ul onClick={() => customJsonToExcel("1week")}>
          <span style={{ color: "#66b127" }}>
            <li style={{ color: "#66b127" }}>1 Week</li>
          </span>
        </ul>
      </Menu.Item>
      <Menu.Item>
        <ul onClick={() => customJsonToExcel("1month")}>
          <span style={{ color: "#66b127" }}>
            <li style={{ color: "#66b127" }}>1 Month</li>
          </span>
        </ul>
      </Menu.Item>
      <Menu.Item>
        <ul onClick={() => customJsonToExcel("1year")}>
          <span style={{ color: "#66b127" }}>
            <li style={{ color: "#66b127" }}>1 Year</li>
          </span>
        </ul>
      </Menu.Item>
      {/* <Menu.Item>
        <ul>
          <span style={{ color: "#66b127" }}>
            <li style={{ color: "#66b127" }}>Export</li>
          </span>
        </ul>
      </Menu.Item> */}
    </Menu>
  );
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
        }}
      >
        <SummaryDevices
          active={"Interface Graph" === tableName}
          onClick={() => showTable("Interface Graph")}
          // style={{
          //   borderBottom: "2px solid ",
          // }}
        >
          <div
            style={{
              display: "flex",
            }}
          >
            <img src={graph} alt="" style={{ marginLeft: "10px" }} />
            <MainTitle
              active={"Interface Graph" === tableName}
              style={{
                paddingLeft: "20px",
                paddingTop: "10px",
              }}
            >
              Interfaces Graph
            </MainTitle>
          </div>
        </SummaryDevices>
      </div>
      <br />
      {tableName === "Interface Graph" ? (
        <>
          {/* <Row
            style={{
              marginTop: "5px",
              marginRight: "15px",
              marginLeft: "15px",
            }}
          >
            <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }}>
              <div
                style={{
                  marginRight: "5px",
                  height: "100%",
                  marginRight: "10px",
                  borderRadius: "12px",
                  backgroundColor: "#fcfcfc",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",

                  marginBottom: "45px",
                }}
              >
                <h3
                  style={{
                    color: "#000",
                    borderLeft: "5px solid #3D9E47",
                    borderTopLeftRadius: "6px",
                    paddingLeft: "13px",
                    alignItems: "center",
                    paddingTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  RX Bytes
                </h3>
                <div style={{ padding: "5px" }}>
                  <ResponsiveContainer width="100%" height={310}>
                    <AreaChart
                      width={500}
                      height={400}
                      data={download}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#66B127A6"
                        fill="#66B127A6"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }}>
              <div
                style={{
                  marginRight: "5px",
                  height: "100%",
                  marginRight: "10px",
                  borderRadius: "12px",
                  backgroundColor: "#fcfcfc",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",

                  marginBottom: "45px",
                }}
              >
                <h3
                  style={{
                    color: "#000",
                    borderLeft: "5px solid #3D9E47",
                    borderTopLeftRadius: "6px",
                    paddingLeft: "13px",
                    alignItems: "center",
                    paddingTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  TX Bytes
                </h3>
                <div style={{ padding: "5px" }}>
                  <ResponsiveContainer width="100%" height={310}>
                    <AreaChart
                      width={500}
                      height={400}
                      data={upload}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#6BCFCA99"
                        fill="#6BCFCA99"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 8 }} lg={{ span: 8 }}>
              <div
                style={{
                  marginRight: "5px",
                  height: "100%",
                  marginRight: "10px",
                  borderRadius: "12px",
                  backgroundColor: "#fcfcfc",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",

                  marginBottom: "45px",
                }}
              >
                <h3
                  style={{
                    color: "#000",
                    borderLeft: "5px solid #3D9E47",
                    borderTopLeftRadius: "6px",
                    paddingLeft: "13px",
                    alignItems: "center",
                    paddingTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Total Bytes
                </h3>
                <div style={{ padding: "5px" }}>
                <ResponsiveContainer width="100%" height={335}>
            <LineChart
             width={500}
             height={400}
              data={allData}
              margin={{
                top: 30,
                right: 5,
                left: 20,
                bottom: 0,
              }}
            >
             
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="upload"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                activeDot={{ r: 8 }}
                dataKey="download"
                stroke="#82ca9d"
              />
            </LineChart>
          </ResponsiveContainer>
                </div>
              </div>
            </Col>
          </Row> */}
          <div style={{ float: "right", marginBottom: "10px" }}>
            <Dropdown menu={menu}>
              <button
                className="ant-dropdown-link"
                style={{
                  border: "1px solid #6AB344",
                  borderRadius: "5px",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: "8px 15px",
                  background:
                    "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                }}
              >
                Export <DownOutlined />
              </button>
            </Dropdown>
          </div>
          <br />
          {allData.length > 0 ? (
            <ResponsiveContainer width="100%" height={450}>
              <AreaChart
                width={500}
                height={450}
                data={allData}
                // onMouseDown={(e) => setZoom({ ...zoom, left: e.activeLabel })}
                // onMouseUp={(e) => setZoom({ ...zoom, right: e.activeLabel })}
                margin={{
                  top: 10,
                  right: 30,
                  left: 0,
                  bottom: 0,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={"date"} />
                <YAxis />
                <Tooltip />

                <Area
                  type="monotone"
                  dataKey="download"
                  stroke="#66B127"
                  fill="rgba(0,135,0,0.5)"
                  // activeDot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="upload"
                  stroke="#6BCFCA"
                  fill="rgba(0,135,135,0.5)"
                  // activeDot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#FFAF0E"
                  fill="rgba(186,135,0,0.5)"
                  // activeDot={{ r: 4 }}
                />

                {/* <Legend /> */}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ display: "grid", placeItems: "center" }}>
              <br />
              <h2>No data Found</h2>
            </div>
          )}
          <br />
          <div style={{ display: "grid", placeItems: "center" }}>
            <div style={{ width: "650px" }}>
              <InterfaceTableStyling
                pagination={false}
                dataSource={tableData}
                columns={columns}
              />
            </div>
          </div>
          <br />
        </>
      ) : null}

      {/* <Hamza /> */}
    </div>
  );
};

export default index_Main;
