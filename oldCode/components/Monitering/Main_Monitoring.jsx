import React, { useState, useEffect } from "react";
import soon from "./assets/soon.png";
import { Row, Col, Table, Progress } from "antd";
import RadicalChart from "./Dashboard/Charts/RedicalChart";
import { TableStyling } from "../AllStyling/All.styled";
import red from "./assets/red.svg";
import green from "./assets/green.svg";
import HeatMap from "./Dashboard/Charts/HeatMap";
import Status from "./Dashboard/Status";
import axios, { baseUrl } from "../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import RadicalchartAntd from "./Dashboard/Charts/RadialChartAntd";
import ApacheChart from "./Dashboard/Charts/ApacheChart";
import NetworkGraph from "./networkChart";

const Main_Monitoring = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [bandwidthUtilization, setBandwidthUtilization] = useState([]);
  const [memoryFunc, setMemoryFunc] = useState([]);
  const [cpuFunc, setCpuFunc] = useState([]);
  const [infrastructureSnapshot, setInfrastructureSnapshot] = useState([]);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/getTopInterfaces");
        setBandwidthUtilization(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
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
    const cpuFunc = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/getCpuDashboard");
        setCpuFunc(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    cpuFunc();
  }, []);
  useEffect(() => {
    const infrastructureSnapshotFunc = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/getSnapshot");
        setInfrastructureSnapshot(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    infrastructureSnapshotFunc();
  }, []);

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

  const bandwidthUtilizationColumns = [
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
      title: "Interface Name",
      dataIndex: "interface_name",
      key: "interface_name",
      render: (text, record) => (
        <p
          onClick={async () => {
            // setMainLoading(true);
            const res = await axios.post(baseUrl + "/getinterfaceband ", {
              ip_address: record.ip_address,
              interface_name: text,
            });

            console.log("getinterfaceband", res);
            navigate("/monitoringinterfacesummary/main", {
              state: {
                ip_address: record.ip_address,
                res: res.data,
              },
            });
            // setMainLoading(false);
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
    },
    {
      title: "Receive",
      dataIndex: "download_speed",
      key: "download_speed",
      render: (text, record) => (
        <p
          style={{
            textAlign: "left",

            paddingTop: "10px",
          }}
        >
          {text} Mbps
        </p>
      ),
    },
    {
      title: "Transmit",
      dataIndex: "upload_speed",
      key: "upload_speed",
      render: (text, record) => (
        <p
          style={{
            textAlign: "left",

            paddingTop: "10px",
          }}
        >
          {text} Mbps
        </p>
      ),
    },
  ];

  const cpuColumns = [
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
      title: "CPU Utilization",
      dataIndex: "cpu",
      key: "cpu",
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

  const infrastructureSnapshotColumns = [
    {
      title: "",
      dataIndex: "active",
      key: "active",
      render: (text, record) => (
        <>
          {record.alarms === 0 ? (
            <img src={green} alt="" />
          ) : (
            <img src={red} alt="" />
          )}
        </>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Alarms",
      dataIndex: "alarms",
      key: "alarms",
    },
    {
      title: "Devices",
      dataIndex: "devices",
      key: "devices",
    },
  ];

  return (
    <div style={{ marginRight: "12px", marginLeft: "12px" }}>
      <div style={{ marginRight: "15px", marginLeft: "15px" }}>
        {/* <div 
    //   style={{
    //     // margin: "auto",
    //     width: "100%",
    //     // height: "100vh",
    //     // display: "flex",
    //     // justifyContent: "center",

    //     MarginTop: "10px",
    //     MarginBottom: "10px",
    //   }}
    // >
    */}
        {/* <img
        src={soon}
        width="50%"
        height="70%"
        style={{ margin: "auto" }}
        alt=""
      /> */}

        {/* <iframe
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-pointer-lock"
        src="http://192.168.10.242:3000/d/monetxgr/present?orgId=1&var-Database=monitoring&var-Devices=192.168.0.2%20I&kiosk"
        width="100%"
        height="1000px"
      ></iframe> */}
        <Row
          style={{
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
          }}
        >
          <Col xs={{ span: 24 }} md={{ span: 7 }} lg={{ span: 7 }}>
            <div
              style={{
                marginRight: "5px",

                height: "100%",
                marginRight: "10px",

                backgroundColor: "#fcfcfc",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",

                marginBottom: "45px",
              }}
            >
              <h2
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
                Infrastructure HeatMap
              </h2>

              {/* <RadicalChart
                style={{
                  display: "grid",
                  placeItems: "center",
                  textAlign: "center",
                  width: "100%",
                }}
              /> */}
              {/* <RadicalchartAntd /> */}

              <ApacheChart />
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 17 }} lg={{ span: 17 }}>
            <div
              style={{
                marginRight: "5px",

                height: "100%",
                marginRight: "10px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
                // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",

                marginBottom: "45px",
              }}
            >
              {/* <h3
                style={{
                  color: "#000",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  paddingTop: "8px",
                  fontWeight: "bold",
                  textAlign: "left",
                }}
              >
                Heatmap
              </h3> */}
              <br />
              <div
                style={{
                  overflowY: "auto",
                  height: "350px",
                }}
              >
                {/* <Status /> */}
                <NetworkGraph />
              </div>
            </div>
          </Col>
        </Row>
        <br />

        <Row>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                marginRight: "5px",

                // height: "100%",
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
                Devices By CPU Utilization
              </h3>

              <TableStyling
                dataSource={cpuFunc}
                columns={cpuColumns}
                pagination={{ pageSize: 5 }}
              />
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                marginRight: "5px",

                // height: "100%",
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

        <Row>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                marginRight: "5px",

                // height: "100%",
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
                Interfaces By Bandwidth Utilization
              </h3>

              <TableStyling
                dataSource={bandwidthUtilization}
                columns={bandwidthUtilizationColumns}
                pagination={{ pageSize: 5 }}
              />
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                marginRight: "5px",

                // height: "100%",
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
                Infrastructure Snapshot
              </h3>

              <TableStyling
                dataSource={infrastructureSnapshot}
                columns={infrastructureSnapshotColumns}
                pagination={{ pageSize: 5 }}
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Main_Monitoring;
