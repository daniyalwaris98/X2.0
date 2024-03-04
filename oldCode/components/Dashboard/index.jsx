import React, { useEffect, useState } from "react";
import GraphLine from "./GraphLine";
import ThirdLine from "./ThirdLine";
import { Row, Col, Progress } from "antd";
import axios, { baseUrl } from "../../utils/axios";
import critical from "./assets/critical.svg";
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

  const [memoryFunc, setMemoryFunc] = useState([]);

  const [myDeviceStatus, setMyDevicesStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState("");

  useEffect(() => {
    const serviceCalls = async () => {
      try {
        const res = await axios.get(baseUrl + "/topTenSubnetsPercentage");
        setTableData(res.data);
      } catch (err) {
        console.log(err.response);
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
        setMyDevicesStatus(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
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
        <Row
          style={{
            marginLeft: "12px",
            marginTop: "12px",
            marginBottom: "15px",
          }}
        >
          <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 8 }}>
            <div
              style={{
                marginRight: "15px",
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
                  paddingTop: "15px",
                  fontWeight: "bold",
                }}
              >
                Count Per Vendors
              </h3>

              <div
                style={{
                  marginTop: "10px",
                  width: "100%",
                  height: "100%",
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
                marginRight: "15px",
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
                  paddingTop: "15px",
                  fontWeight: "bold",
                }}
              >
                Hardware Health Overview
              </h3>
              <Row>
                {myDeviceStatus &&
                  myDeviceStatus.map((item, index) => (
                    <Col xs={{ span: 12 }} md={{ span: 12 }} lg={{ span: 12 }}>
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
                              marginTop: "15px",
                              marginBottom: "20px",
                              width: "120px",
                              marginLeft: "10%",
                              paddingBottom: "14px",
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
                                  marginRight: "30px",
                                  textAlign: "center",
                                  margin: "15px",
                                  marginTop: "-8px",
                                  borderRadius: "15px",
                                  padding: "5px",
                                  fontSize: "10px",
                                  fontWeight: "600",
                                  cursor: "default",
                                  width: "150px",
                                }}
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
                  paddingTop: "15px",
                  fontWeight: "bold",
                }}
              >
                Subnet Summary
              </h3>

              <div
                style={{
                  marginTop: "10px",
                  width: "100%",
                }}
              >
                <SubnetSummary />
              </div>
            </div>
          </Col>
        </Row>

        <Row style={{ marginLeft: "12px", margin: "8px", marginTop: "-10px" }}>
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
                height: "100%",
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
                  paddingTop: "8px",
                  fontWeight: "bold",
                }}
              >
                Top Devices by CPU Utilization
              </h3>
              <InterfacTable />
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
                height: "100%",
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
                  paddingTop: "15px",
                  fontWeight: "bold",
                }}
              >
                Top 5 Subnets by % IP Address Used
              </h3>

              <TableStyling
                style={{ marginBottom: "10px" }}
                pagination={{ pageSize: 5 }}
                columns={column}
                dataSource={tableData}
              />
            </div>
          </Col>
        </Row>

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
                height: "100%",
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
                height: "100%",
                marginLeft: "10px",
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
        <GraphLine />
        <ThirdLine />
      </div>
    </>
  );
};

export default Index;
