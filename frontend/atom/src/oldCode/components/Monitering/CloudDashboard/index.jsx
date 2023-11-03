import React, { useState, useEffect } from "react";
import { Col, Divider, Row } from "antd";
import inputicon from "./assets/input.svg";
import outputicon from "./assets/output.svg";
import inputbyte from "./assets/inputbyte.svg";
import outputbyte from "./assets/outputbyte.svg";
import CpuUtilization from "./echarts/Gauge/CpuUtilization";
import MemoryUtilization from "./echarts/Gauge/MemoryUtilization";
import NetworkSpeed from "./LineChartEC2/NetworkSpeed";
import CPUUtilize from "./LineChartEC2/CpuUtilization";

import { useLocation } from "react-router-dom";
import axios, { baseUrl } from "../../../utils/axios";
import { Id } from "react-flags-select";
import { SpinLoading } from "../../AllStyling/All.styled";

const index = () => {
  const data = useLocation();
  console.log(data.state);

  const [id, setID] = useState(data.state.instance_id);
  const [allData, setAllData] = useState("");
  const [mainLoading, setMainLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const loadAllData = async () => {
        const res = await axios.post(baseUrl + "/getEC2MonitoringData", {
          instance_id: id,
        });

        console.log("getMonitoringDevicesCards", res);
        setAllData(res.data);
      };
      loadAllData();
    }, 600000); // 3 minutes in milliseconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadAllData = async () => {
      setMainLoading(true);
      const res = await axios.post(baseUrl + "/getEC2MonitoringData", {
        instance_id: id,
      });

      console.log("getMonitoringDevicesCards", res);
      setAllData(res.data);

      setMainLoading(false);
    };
    loadAllData();
  }, []);
  return (
    <>
      <SpinLoading spinning={mainLoading}>
        <div
          style={{ margin: "15px", marginLeft: "15px", marginRight: "15px" }}
        >
          <div
            style={{
              borderRadius: "12px",
              backgroundColor: "#fcfcfc",
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
            }}
          >
            <h3
              style={{
                borderLeft: "5px solid #66b127",
                borderTopLeftRadius: "6px",
                paddingLeft: "13px",
                alignItems: "center",
                textAlign: "left",
                paddingTop: "8px",
                fontWeight: "bold",
              }}
            >
              EC2 Summary
            </h3>
            <div style={{ display: "flex", padding: "10px" }}>
              <div
                style={{
                  padding: "10px",
                  paddingLeft: "20px",
                  height: "70px",
                  borderRight: "0.5px solid rgba(0,0,0,0.1)",
                }}
              >
                <h5>Instance name :</h5>
                <p style={{ color: "#66b127" }}>{allData.instance_name}</p>
                <Divider type="vertical" />
              </div>
              <div
                style={{
                  padding: "10px",
                  paddingLeft: "20px",
                  height: "70px",
                  borderRight: "0.5px solid rgba(0,0,0,0.1)",
                }}
              >
                <h5>Instance ID :</h5>
                <p style={{ color: "#66b127" }}>{allData.instance_id}</p>
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
                <h5>Region ID :</h5>
                <p style={{ color: "#66b127" }}>{allData.region_id}</p>
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
                <h5>Account Label :</h5>
                <p style={{ color: "#66b127" }}>{allData.account_label}</p>
                <Divider type="vertical" />
              </div>
              <div
                style={{
                  padding: "10px",
                  paddingLeft: "20px",
                  height: "70px",
                  borderRight: "0.5px solid rgba(0,0,0,0.1)",
                }}
              >
                <h5>Time:</h5>
                <p style={{ color: "#66b127" }}>{allData.timestamp}</p>
                <Divider type="vertical" />
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "10px",
              borderRadius: "12px",
              backgroundColor: "#fcfcfc",
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
            }}
          >
            <Row style={{ padding: "15px" }}>
              <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 4 }}>
                <div style={{ textAlign: "center" }}>
                  <div>
                    <img src={inputbyte} alt="" />
                    <p style={{ marginTop: "8px" }}>Disk Input Bytes</p>
                    <h2
                      style={{
                        marginTop: "-15px",
                        fontSize: "22px",
                        fontWeight: 600,
                      }}
                    >
                      {(Math.round(allData.disk_in_bytes * 100) / 100).toFixed(
                        2
                      )}{" "}
                      <sub>Kb/s</sub>
                    </h2>
                  </div>
                  <div>
                    <img src={inputicon} alt="" />
                    <p style={{ marginTop: "8px" }}>Disk Input Operation</p>
                    <h2
                      style={{
                        marginTop: "-15px",
                        fontSize: "22px",
                        fontWeight: 600,
                      }}
                    >
                      {allData.disk_in_ops}
                    </h2>
                  </div>
                </div>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 4 }}>
                <div style={{ textAlign: "center" }}>
                  <div>
                    <img src={outputbyte} alt="" />
                    <p style={{ marginTop: "8px" }}>Disk Output Bytes</p>
                    <h2
                      style={{
                        marginTop: "-15px",
                        fontSize: "22px",
                        fontWeight: 600,
                      }}
                    >
                      {(Math.round(allData.disk_out_bytes * 100) / 100).toFixed(
                        2
                      )}{" "}
                      <sub>Kb/s</sub>
                    </h2>
                  </div>
                  <div>
                    <img src={outputicon} alt="" />
                    <p style={{ marginTop: "8px" }}>Disk Input Operation</p>
                    <h2
                      style={{
                        marginTop: "-15px",
                        fontSize: "22px",
                        fontWeight: 600,
                      }}
                    >
                      {allData.disk_out_ops}
                    </h2>
                  </div>
                </div>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
                <div style={{ display: "grid", placeItems: "center" }}>
                  <CpuUtilization
                    cpu_utilizationValue={allData.cpu_utilization}
                  />
                  <p style={{ display: "block", marginTop: "-105px" }}>
                    CPU Utilization
                  </p>
                </div>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
                <div style={{ display: "grid", placeItems: "center" }}>
                  <MemoryUtilization
                    memoryUtilizationValue={allData.memory_utilization}
                  />
                  <p style={{ display: "block", marginTop: "-105px" }}>
                    Memory Utilization
                  </p>
                </div>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 4 }}>
                <div style={{ textAlign: "center" }}>
                  <div>
                    <img src={inputicon} alt="" />
                    <p style={{ marginTop: "8px" }}>Network Input</p>
                    <h2
                      style={{
                        marginTop: "-15px",
                        fontSize: "22px",
                        fontWeight: 600,
                      }}
                    >
                      {(Math.round(allData.network_in * 100) / 100).toFixed(2)}{" "}
                      <sub>Kb/s</sub>
                    </h2>
                  </div>
                  <div>
                    <img src={outputicon} alt="" />
                    <p style={{ marginTop: "8px" }}>Network Output</p>
                    <h4
                      style={{
                        marginTop: "-15px",
                        fontSize: "22px",
                        fontWeight: 600,
                      }}
                    >
                      {(Math.round(allData.network_out * 100) / 100).toFixed(2)}
                      <sub>Kb/s</sub>
                    </h4>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </SpinLoading>
      <Row style={{ padding: "15px" }}>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
          <div
            style={{
              marginTop: "10px",
              borderRadius: "12px",
              backgroundColor: "#fcfcfc",
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
              marginRight: "15px",
            }}
          >
            <h3
              style={{
                borderLeft: "5px solid #66b127",
                borderTopLeftRadius: "6px",
                paddingLeft: "13px",
                alignItems: "center",
                textAlign: "left",
                paddingTop: "8px",
                fontWeight: "bold",
              }}
            >
              CPU Utilization
            </h3>
            <CPUUtilize instanceId={id} />
          </div>
        </Col>
        <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
          <div
            style={{
              marginTop: "10px",
              borderRadius: "12px",
              backgroundColor: "#fcfcfc",
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
            }}
          >
            <h3
              style={{
                borderLeft: "5px solid #66b127",
                borderTopLeftRadius: "6px",
                paddingLeft: "13px",
                alignItems: "center",
                textAlign: "left",
                paddingTop: "8px",
                fontWeight: "bold",
              }}
            >
              Network Speed
            </h3>
            <NetworkSpeed instanceId={id} />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default index;
