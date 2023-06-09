import { Row, Col, Progress, Table } from "antd";
import React, { useState, useEffect } from "react";
import TopComponent from "./Header";
import VendorChart from "./charts/VendorCharts";
import SubnetSummary from "./charts/SubnetSummary";
import axios, { baseUrl } from "../../utils/axios";
import InterfacTable from "./Tables/InterfaceTable.jsx";
import GeoMap from "./charts/GeoMap";
import { TableStyling } from "../AllStyling/All.styled.js";
import VendorDiscovery from "./charts/VendorDiscovery";
import TCPOpenPorts from "./charts/TCP";
import RackDetails from "../UAM/Racks/RackDetails";

const index = () => {
  const [myDeviceStatus, setMyDevicesStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [memoryFunc, setMemoryFunc] = useState([]);
  const [tableData, setTableData] = useState("");
  const [tableLoading, setTableLoading] = useState(false);

  const [rackData, setRackData] = useState([]);

  useEffect(() => {
    const serviceCalls = async () => {
      setTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/topTenSubnetsPercentage");
        console.log("res Subnet MAin ========>", res);

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
    const serviceCalls = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/getAllRacks");
        console.log("rees", res);
        // excelData = res.data;
        setRackData(res.data);
        setRowCount(res.data.length);
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
            // paddingTop: "10px",
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
            // paddingTop: "10px",
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
            // marginTop: "-10px",
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

  // const column = [
  //   {
  //     title: "Subnet",
  //     dataIndex: "subnet",
  //     key: "subnet",
  //     render: (text, record) => (
  //       <p
  //         style={{
  //           // color: "#66B127",
  //           // textDecoration: "underline",
  //           // fontWeight: "400",
  //           // // textAlign: "center",
  //           // paddingLeft: "20px",
  //           // // color: "blue",
  //           // cursor: "pointer",

  //           height: "18px",
  //           fontWeight: "500",
  //           fontSize: "13px",
  //           paddingTop: "5px",
  //           paddingLeft: "12px",
  //         }}
  //       >
  //         {text}
  //       </p>
  //     ),
  //   },
  //   {
  //     title: "IP % Space Used",
  //     dataIndex: "space_usage",
  //     key: "space_usage",

  //     render: (text, record) => (
  //       <Progress
  //         style={{
  //           paddingRight: "10px",
  //           paddingLeft: "10px",
  //           paddingRight: "75px",
  //         }}
  //         strokeColor="#66B127"
  //         // percent="97"
  //         percent={text}
  //         size="small"
  //         status="active"
  //       />
  //     ),
  //   },
  // ];

  const column = [
    {
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",
      render: (text, record) => (
        <p
          onClick={() => {
            navigate("/ipam/subnet/ip-details", {
              state: {
                subnet: text,
              },
            });
          }}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            fontWeight: "400",
            // textAlign: "center",
            paddingLeft: "12px",
            // color: "blue",
            cursor: "pointer",
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
      render: (text) => (
        <div
          onClick={() => {
            console.log(text);
          }}
          style={{
            // textAlign: "center",
            // marginLeft: "20px",
            marginTop: "-10px",
            paddingRight: "75px",
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
  ];

  return (
    <>
      <TopComponent />
      <div style={{ marginLeft: "33px", marginRight: "33px" }}>
        <Row style={{ marginTop: "10px" }}>
          <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 8 }} style={{}}>
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
                paddingBottom: "5px",
                paddingRight: "10px",
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
                Top Vendor For Discovery
              </h3>
              {/* <div style={{ padding: "8px" }}>
                <p style={{ marginBottom: "0px",color:"#6ab127",fontWeight:"600" }}>Production</p> &nbsp;
                <Progress
                  percent={myDeviceStatus.production}
                  status="active"
                  strokeColor={"#6ab127"}
                />
              </div>
              <div style={{ padding: "8px" }}>
                <p style={{ marginBottom: "0px",color:"#db5",fontWeight:"600" }}>Dismantled</p> &nbsp;
                <Progress
                  percent={myDeviceStatus.dismantled}
                  status="active"
                  strokeColor={"#db5"}
                />
              </div>
              <div style={{ padding: "8px" }}>
                <p style={{ marginBottom: "0px",color:"#DC3938",fontWeight:"600" }}>Maintenance</p> &nbsp;
                <Progress
                  percent={myDeviceStatus.maintenance}
                  status="active"
                  strokeColor={"#DC3938"}
                />
              </div>
              <div style={{ padding: "8px" }}>
                <p style={{ marginBottom: "0px",color:"#878787",fontWeight:"600" }}>Undefined</p> &nbsp;
                <Progress
                  percent={myDeviceStatus.undefined}
                //   percent={60}
                  status="active"
                  strokeColor={"#878787"}
                />
              </div> */}
              <VendorDiscovery />
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
                TCP Open Ports
              </h3>

              <div
                style={{
                  marginTop: "10px",
                  width: "100%",
                }}
              >
                <TCPOpenPorts />
              </div>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "10px" }}>
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
                Top Subnets by % IP Address Used
              </h3>

              <TableStyling
                style={{ marginBottom: "10px" }}
                pagination={{ pageSize: 10 }}
                columns={column}
                dataSource={tableData}
              />
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

              <h3
                style={{
                  color: "#000",
                  //   borderLeft: "5px solid #6C6B75",
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
        <Row style={{ marginTop: "10px" }}>
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
                marginRight: "10px",
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
                Devices per Global
              </h3>

              <GeoMap />

              {/* Devices By Memory Utilization
              </h3>

              <TableStyling
                dataSource={memoryFunc}
                columns={memoryColumns}
                pagination={{ pageSize: 5 }}
              /> */}
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
                Rack Details
              </h3>

              <div style={{ padding: "15px", margin: "0 auto" }}>
                <RackDetails dataSource={rackData} />
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default index;
