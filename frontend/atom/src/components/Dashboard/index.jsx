import React, { useEffect, useContext, useState } from "react";
import GraphLine from "./GraphLine";
import ThirdLine from "./ThirdLine";
import TopCard from "./TopCard";
import Login from "../Login";
import { UserContext } from "../Context/UserContext";
import { Row, Col, Progress } from "antd";
import axios, { baseUrl } from "../../utils/axios";
import critical from "./assets/critical.svg";
// import messagee from "./assets/message.svg";
import undefined from "./assets/undefined.svg";
import up from "./assets/up.svg";
import warning from "./assets/warning.svg";
import GeoMap from "./NewDashboardLayout/Map";
import InterfacTable from "./InterfaceTable";
import {
  SpinLoading,
  ProgressStyled,
  DSO,
  TableStyling,
} from "../AllStyling/All.styled.js";
import SubnetSummary from "./NewDashboardLayout/Charts/PieChart";
import VendorChart from "./NewDashboardLayout/Charts/BarChart";
const Index = () => {
  const Data = localStorage.getItem("user");
  const UserData = useContext(UserContext);
  const imgFun = (myimg) => {
    if (myimg === "Production") {
      return up;
    } else if (myimg === "Dismantled") {
      return warning;
    } else if (myimg === "Maintenance") {
      return critical;
    } else {
      return undefined;
    }
  };

  // useEffect(() => {
  //   console.log(UserData);
  // }, []);

  const [memoryFunc, setMemoryFunc] = useState([]);

  const [myDeviceStatus, setMyDevicesStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState("");
  const [tableLoading, setTableLoading] = useState(false);
  const [unusedSfps, setUnusedSfps] = useState([]);
  const [unusedSfpsLoading, setUnusedSfpsLoading] = useState(false);

  useEffect(() => {
    const serviceCalls = async () => {
      setTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/topTenSubnetsPercentage");
        console.log("res Subnet MAin", res);

        // deviceExcelData = res.data;
        setTableData(res.data);
        // setRowCount(excelData.length);
        setTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setTableLoading(false);
      }
    };
    serviceCalls();
  }, []);
  useEffect(() => {
    const memoryFunc = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/getMemoryDashboard");
        setMemoryFunc(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    memoryFunc();
  }, []);
  useEffect(() => {
    const deviceStatus = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/deviceStatus");
        console.log("deviceStatus", res.data);
        setMyDevicesStatus(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    deviceStatus();
  }, []);
  useEffect(() => {
    const deviceStatus = async () => {
      setUnusedSfpsLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getUnusedSfps");
        console.log("deviceStatus", res.data);
        setUnusedSfps(res.data);
        setUnusedSfpsLoading(false);
      } catch (err) {
        console.log(err.response);
        setUnusedSfpsLoading(false);
      }
    };
    deviceStatus();
  }, []);
  const column = [
    {
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",
      render: (text, record) => (
        <p
          style={{
            // color: "#66B127",
            // textDecoration: "underline",
            // fontWeight: "400",
            // // textAlign: "center",
            // paddingLeft: "20px",
            // // color: "blue",
            // cursor: "pointer",

            height: "18px",
            fontWeight: "500",
            fontSize: "13px",
            paddingTop: "5px",
            paddingLeft: "12px",
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "IP % Space Used",
      dataIndex: "space_usage",
      key: "space_usage",

      render: (text, record) => (
        <Progress
          style={{
            paddingRight: "10px",
            paddingLeft: "10px",
            paddingRight: "75px",
          }}
          strokeColor="#66B127"
          // percent="97"
          percent={text}
          size="small"
          status="active"
        />
      ),
    },
  ];
  const components = {
    header: {
      // Customize header row color
      style: { background: "#fff" },
    },
  };
  const UnusedSfpscolumn = [
    {
      title: "Ip Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          style={{
            color: "#66B127",
            textDecoration: "underline",
            fontWeight: "500",
            fontSize: "13px",
            // textAlign: "center",
            paddingLeft: "20px",
            height: "18px",
            paddingTop: "5px",
            // color: "blue",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Device Name",
      dataIndex: "device_name",
      key: "device_name",
      render: (text, record) => (
        <p
          style={{
            // color: "#66B127",
            // textDecoration: "underline",
            // fontWeight: "400",
            // textAlign: "center",
            height: "18px",
            paddingTop: "5px",
            paddingLeft: "12px",
            fontWeight: "500",
            fontSize: "13px",

            // color: "blue",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Unused Sfps",
      dataIndex: "unused_sfps",
      key: "unused_sfps",
      render: (text, record) => (
        <p
          style={{
            // color: "#66B127",
            // textDecoration: "underline",
            // fontWeight: "400",
            // textAlign: "center",
            height: "18px",
            fontWeight: "500",
            fontSize: "13px",
            paddingTop: "5px",
            paddingLeft: "12px",
            // color: "blue",
            // cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),
    },
  ];
  const memoryColumns = [
    {
      title: "Ip Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          onClick={async () => {
            // setMainLoading(true);
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
            // setMainLoading(false);
          }}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            textAlign: "left",
            paddingTop: "10px",
            paddingLeft: "10px",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Device Name",
      dataIndex: "device_name",
      key: "device_name",
      render: (text, record) => (
        <p
          style={{
            textAlign: "left",
            paddingLeft: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),
    },

    {
      title: "Memory Utilization",
      dataIndex: "memory",
      key: "memory",
      render: (text) => (
        <div
          onClick={() => {
            console.log(text);
          }}
          style={{
            // textAlign: "center",
            // marginLeft: "20px",
            marginTop: "-10px",
            paddingRight: "25px",
            paddingLeft: "15px",
          }}
        >
          {text <= 60 ? (
            <Progress
              strokeColor="#66B127"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}
          {text > 60 && text <= 80 ? (
            <Progress
              strokeColor="#F57A40"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}

          {text > 80 && text <= 100 ? (
            <Progress
              strokeColor="#CC050C"
              percent={text}
              size="small"
              status="active"
            />
          ) : null}
        </div>
      ),
    },
    {
      title: "Function",
      dataIndex: "function",
      key: "function",
    },
  ];
  return (
    <>
      <div
        style={{
          backgroundColor: "#fff",
          padding: "15px",
        }}
      >
        {/* <TopCard /> */}

        <Row
          style={{
            marginLeft: "12px",
            marginTop: "12px",
            marginBottom: "15px",
            // marginRight: "2px"
          }}
        >
          <Col
            xs={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 8 }}
            style={
              {
                // marginBottom: "10px",
              }
            }
          >
            <div
              style={{
                // display: "flex",
                // height: "100%",
                // paddingTop: '15px',
                marginRight: "15px",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                // borderRadius: "12px",
                // backgroundColor: "#fcfcfc",

                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #3D9E47",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  // marginLeft: '-6px',
                  paddingTop: "15px",
                  fontWeight: "bold",
                }}
              >
                Count Per Vendors
              </h3>

              <div
                style={{
                  marginTop: "10px",
                  // position: "relative",
                  width: "100%",
                  height: "100%",

                  // minHeight: 900,
                }}
              >
                <VendorChart />
              </div>
            </div>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 8 }}
            style={{
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                // display: "flex",
                // height: "300px",
                // paddingTop: '15px',
                marginRight: "15px",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",

                // borderRadius: "12px",
                // backgroundColor: "#fcfcfc",
                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #3D9E47",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  // marginLeft: '-6px',
                  paddingTop: "15px",
                  fontWeight: "bold",
                }}
              >
                Hardware Health Overview
              </h3>
              <Row>
                {myDeviceStatus.map((item, index) => (
                  <Col
                    xs={{ span: 12 }}
                    md={{ span: 12 }}
                    lg={{ span: 12 }}
                    // xl={{ span: 2 }}
                  >
                    <SpinLoading spinning={loading}>
                      <div
                        style={{
                          height: "181px",
                        }}
                      >
                        <div
                          style={{
                            display: "grid",
                            placeItems: "center",
                            cursor: "default",
                            // display: "flex",
                            marginTop: "15px",
                            marginBottom: "20px",
                            width: "120px",

                            // height:"160px",
                            // textAlign: "center",
                            // justifyContent: "space-evenly",
                            marginLeft: "10%",
                            paddingBottom: "14px",
                            // borderRadius: "12px",
                            //   backgroundColor: "#fcfcfc",
                          }}
                        >
                          <div
                            key={index}
                            style={{
                              paddingRight: "20px",
                            }}
                          >
                            <ProgressStyled
                              style={{
                                textAlign: "center",
                                margin: "0 auto",
                                padding: "10px",
                                paddingRight: 25,
                                display: "block",
                                cursor: "default",
                              }}
                              // {...(index === 1 ? (strokeColor = "#000") : null)}
                              // style={{ border: index === selectedIndex ? '2px solid #00adb5' : 'none'}}
                              strokeColor={
                                (index === 0 ? "#66B127" : null) ||
                                (index === 1 ? "#db5" : null) ||
                                (index === 2 ? "#DC3938" : null) ||
                                (index === 3 ? "#878787" : null)
                              }
                              type="dashboard"
                              percent={item.value}
                              format={(percent) => `${percent}%`}
                            />

                            <DSO
                              bg={index === 0}
                              color={index === 0}
                              bgone={index === 1}
                              colorone={index === 1}
                              bgtwo={index === 2}
                              colortwo={index === 2}
                              style={{
                                // backgroundColor: index === 1 ? "#db5" : null,
                                marginRight: "30px",
                                textAlign: "center",
                                margin: "15px",
                                marginTop: "-8px",
                                // backgroundColor: "rgba(175, 255, 207, 0.2)",
                                borderRadius: "15px",
                                padding: "5px",
                                fontSize: "10px",
                                fontWeight: "600",
                                cursor: "default",
                                width: "150px",
                              }}
                              // color={getColor(item.name).color}
                              // backgroundColor={getColor(item.name).backgroundColor}

                              // Dismantled={"Dismantled" === item.name}
                              // Maintenance={"Maintenance" === item.name}
                              // Undefined={"Undefined" === item.name}
                            >
                              <img src={imgFun(item.name)} alt="" /> &nbsp;
                              &nbsp;
                              {item.name}
                            </DSO>
                          </div>
                        </div>
                      </div>
                    </SpinLoading>
                  </Col>
                ))}
              </Row>
            </div>
            {/* <div
              style={{
                // display: "flex",
                height: "100%",
                // paddingTop: '15px',
                marginRight: "10px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "3px solid #3D9E47",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "10px",
                  alignItems: "center",
                  // marginLeft: '-6px',
                  paddingTop: "4px",
                  fontWeight: "bold",
                }}
              >
                Hardware Health Overview
              </h3>

              <div
                style={{
                  marginTop: "10px",
                  // position: "relative",
                  width: "100%",
                  // height: "900px",

                  // minHeight: 900,
                }}
              >
                <VendorChart />
              </div>
            </div> */}
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 8 }}
            style={{
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                // display: "flex",
                // height: "100%",
                // paddingTop: '15px',
                marginRight: "10px",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",

                // borderRadius: "12px",
                // backgroundColor: "#fcfcfc",
                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #3D9E47",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  // marginLeft: '-6px',
                  paddingTop: "15px",
                  fontWeight: "bold",
                }}
              >
                Subnet Summary
              </h3>

              <div
                style={{
                  marginTop: "10px",
                  // position: "relative",
                  width: "100%",
                  // height: "900px",
                  // marginBottom: "10px",

                  // minHeight: 900,
                }}
              >
                <SubnetSummary />
              </div>
            </div>
          </Col>
        </Row>

        <Row style={{ marginLeft: "12px", margin: "8px", marginTop: "-10px" }}>
          {/* <Col
            xs={{ span: 24 }}
            md={{ span: 15 }}
            lg={{ span: 15 }}
            style={{
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                // display: "flex",
                height: "100%",
                // paddingTop: '15px',
                marginRight: "10px",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                // borderRadius: "12px",
                // backgroundColor: "#fcfcfc",
                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #3D9E47",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  // marginLeft: '-6px',
                  paddingTop: "15px",
                  fontWeight: "bold",
                }}
              >
                Devices with most unused SFPs
              </h3>

              <TableStyling
                // rowSelection={DeviceRowSelection}
                // scroll={{ x: 2000 }}
                pagination={{ pageSize: 5 }}
                // rowKey="subnet_address"
                columns={UnusedSfpscolumn}
                dataSource={unusedSfps}
                // pagination={false}
                components={components}
                // style={{ width: "100%" }}
              />
            </div>
          </Col> */}

          <Col
            xs={{ span: 24 }}
            md={{ span: 15 }}
            lg={{ span: 15 }}
            style={{
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                // display: "flex",
                height: "100%",
                // paddingTop: '15px',
                // marginRight: "10px",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                // borderRadius: "12px",
                // backgroundColor: "#fcfcfc",
                marginRight: "10px",

                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #3D9E47",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  // marginLeft: '-6px',
                  paddingTop: "8px",
                  fontWeight: "bold",
                }}
              >
                Top Devices by CPU Utilization
              </h3>
              <InterfacTable />
              {/* <iframe
                src="http://192.168.10.242:3000/d-solo/JcPJmJGVk/top-five-interfaces?orgId=1&from=1662615269136&to=1662636869136&panelId=2%22"
                width="100%"
                height="350px"
                frameborder="0"
              ></iframe> */}
            </div>
          </Col>

          <Col
            xs={{ span: 24 }}
            md={{ span: 9 }}
            lg={{ span: 9 }}
            style={{
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                // display: "flex",
                height: "100%",
                // paddingTop: '15px',
                // marginRight: "10px",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                // borderRadius: "12px",
                // backgroundColor: "#fcfcfc",

                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #3D9E47",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  // marginLeft: '-6px',
                  paddingTop: "15px",
                  fontWeight: "bold",
                }}
              >
                Top 5 Subnets by % IP Address Used
              </h3>

              <TableStyling
                style={{ marginBottom: "10px" }}
                // rowSelection={DeviceRowSelection}
                // scroll={{ x: 2000 }}
                pagination={{ pageSize: 5 }}
                // rowKey="subnet_address"
                columns={column}
                dataSource={tableData}
                // pagination={false}
                // style={{ width: "100%" }}
              />
            </div>
          </Col>
        </Row>
        {/* <Row style={{ marginLeft: "12px", margin: "8px", marginTop: "-10px" }}>
          <Col
            xs={{ span: 24 }}
            md={{ span: 15 }}
            lg={{ span: 15 }}
            style={{
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                // display: "flex",
                height: "100%",
                // paddingTop: '15px',
                marginRight: "10px",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                // borderRadius: "12px",
                // backgroundColor: "#fcfcfc",
                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #3D9E47",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  // marginLeft: '-6px',
                  paddingTop: "15px",
                  fontWeight: "bold",
                }}
              >
                Devices with most unused SFPs
              </h3>

              <TableStyling
                // rowSelection={DeviceRowSelection}
                // scroll={{ x: 2000 }}
                pagination={{ pageSize: 5 }}
                // rowKey="subnet_address"
                columns={UnusedSfpscolumn}
                dataSource={unusedSfps}
                // pagination={false}
                components={components}
                // style={{ width: "100%" }}
              />
            </div>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 9 }}
            lg={{ span: 9 }}
            style={{
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                // display: "flex",
                height: "100%",
                // paddingTop: '15px',
                // marginRight: "10px",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                // borderRadius: "12px",
                // backgroundColor: "#fcfcfc",

                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #3D9E47",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  // marginLeft: '-6px',
                  paddingTop: "15px",
                  fontWeight: "bold",
                }}
              >
                Top 5 Subnets by % IP Address Used
              </h3>

              <TableStyling
                style={{ marginBottom: "10px" }}
                // rowSelection={DeviceRowSelection}
                // scroll={{ x: 2000 }}
                pagination={{ pageSize: 5 }}
                // rowKey="subnet_address"
                columns={column}
                dataSource={tableData}
                // pagination={false}
                // style={{ width: "100%" }}
              />
            </div>
          </Col>
        </Row> */}

        <Row style={{ marginLeft: "12px", margin: "8px" }}>
          <Col
            xs={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            style={{
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                // display: "flex",
                height: "100%",
                // paddingTop: '15px',
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                // borderRadius: "12px",
                // backgroundColor: "#fcfcfc",

                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #3D9E47",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  // marginLeft: '-6px',
                  paddingTop: "8px",
                  fontWeight: "bold",
                }}
              >
                Devices per Global
              </h3>

              <GeoMap />
            </div>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            style={{
              marginBottom: "10px",
            }}
          >
            <div
              style={{
                // display: "flex",
                height: "100%",
                // paddingTop: '15px',
                marginLeft: "10px",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                // borderRadius: "12px",
                // backgroundColor: "#fcfcfc",
                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                borderRadius: "8px",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #6C6B75",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  // marginLeft: '-6px',
                  paddingTop: "8px",
                  fontWeight: "bold",
                  textAlign: "left",
                }}
              >
                Devices By Memory Utilization
              </h3>

              <TableStyling
                dataSource={memoryFunc}
                columns={memoryColumns}
                pagination={{ pageSize: 5 }}
              />
            </div>
          </Col>
        </Row>
      </div>
      <div
        style={{ backgroundColor: "#f1f1f1", padding: "15px", display: "none" }}
      >
        {/* <TopCard /> */}
        <GraphLine />
        <ThirdLine />
      </div>
    </>
  );
};

export default Index;
