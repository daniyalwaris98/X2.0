import React, { useState, useEffect } from "react";
import { Col, Row, Modal } from "antd";
import * as XLSX from "xlsx";
import ReactSpeedometer from "react-d3-speedometer";
import axios, { baseUrl } from "../../utils/axios";
import { useLocation, useNavigate } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { DoubleLeftOutlined } from "@ant-design/icons";
import bulb from "./assets/bulb.svg";
import up from "./assets/down.svg";
import down from "./assets/up.svg";
import exportExcel from "./assets/exp.svg";

import "../../App.css";
import {
  TableStyling,
  SummaryDevices,
  MainTitle,
  SpinLoading,
  ColRowNumberStyle,
  StyledExportButton,
} from "../AllStyling/All.styled.js";
import summary from "./assets/summary.svg";
import inter from "./assets/interface.svg";
import { columnSearch } from "../../utils";
import Swal from "sweetalert2";

let excelData = [];
let excelDataInterface = [];
let columnFilters = {};
const index_Main = () => {
  const navigate = useNavigate();
  const data = useLocation();

  const [ipAddress, setIpAddress] = useState(data?.state?.ip_address);
  const [isModalOpen, setIsModalOpen] = useState(false);

  let [dataSource, setDataSource] = useState(excelDataInterface);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [ipAddressData, setIpAddressData] = useState([]);
  const [rowCountInterface, setRowCountInterface] = useState(0);
  const [mainTableloading, setMainTableLoading] = useState(false);

  const [availability, setAvailability] = useState(
    data?.state?.res?.availability
  );

  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );

  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        excelDataInterface = data?.state?.res?.interfaces;
        setDataSource(excelDataInterface);
        setRowCountInterface(excelDataInterface.length);
        setMainTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
      }
    };
    serviceCalls();
  }, []);

  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);
      const res = await axios.post(baseUrl + "/getIPAlerts", {
        ip_address: ipAddress,
      });
      excelData = res.data;
      setIpAddressData(excelData);
      setMainTableLoading(false);
    };
    serviceCalls();
  }, []);

  const handleClearAlerts = async () => {
    if (ipAddressData.length == 0) {
      openSweetAlert("No Alerts Found", "error");
    } else {
      try {
        await axios
          .post(baseUrl + "/deleteMonitoringAlerts", { ip_address: ipAddress })
          .then((response) => {
            if (response?.response?.status == 500) {
              openSweetAlert(response?.response?.data, "error");
            } else {
              openSweetAlert(response?.data, "success");
              setIpAddressData([]);
            }
          })
          .catch((error) => {
            console.log("in add seed device catch ==> " + error);
            openSweetAlert("Something Went Wrong!", "error");
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const columns = [
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
    },
    {
      title: "Interface Name",
      dataIndex: "interface_name",
      key: "interface_name",
      render: (text, record) => (
        <p
          onClick={async () => {
            const res = await axios.post(baseUrl + "/getinterfaceband ", {
              interface_name: text,
              // ip_address: ipAddress,
              ip_address: record.ip_address,
            });

            console.log("getinterfaceband", res);
            navigate("/monitoringinterfacesummary/main", {
              state: {
                ip_address: record.ip_address,
                res: res.data,
              },
            });
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
    },
    {
      title: "Interface Status",
      dataIndex: "interface_status",
      key: "interface_status",
      render: (text, record) => (
        <div>
          {text === "Up" ? (
            <>
              <img src={up} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}

          {text === "Down" ? (
            <>
              <img src={down} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}
        </div>
      ),
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
    },
  ];

  const [responseData, setResponseData] = useState(data?.state?.res?.cards);

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

  const IpAddressTablecolumns = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          style={{
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "ip_address",
        "IP Address",
        setIpAddressData,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
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
        "description",
        "Description",
        setIpAddressData,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Alert Type",
      dataIndex: "alert_type",
      key: "alert_type",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "alert_type",
        "Alert Type",
        setIpAddressData,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "date",
        "Date",
        setIpAddressData,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div style={{ textAlign: "center" }}>
          <img
            src={bulb}
            alt=""
            style={{ cursor: "pointer" }}
            onClick={() => handleDescription(record.description)}
          />
        </div>
      ),

      ellipsis: true,
    },
  ];

  const [descData, setDescData] = useState("");
  const handleDescription = async (description) => {
    setIsModalOpen(true);
    try {
      const res = await axios.post(baseUrl + "/possibleReasonForAlerts", {
        description: description,
      });
      if (res.status == 500) {
        openSweetAlert(res?.response?.data, "error");
      } else {
        setDescData(res?.data);
      }
    } catch (err) {
      console.log(err.response);
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const jsonToExcel = (alerts) => {
    let wb = XLSX.utils.book_new();
    let binaryAlerts = XLSX.utils.json_to_sheet(alerts);
    XLSX.utils.book_append_sheet(wb, binaryAlerts, "Alerts");
    XLSX.writeFile(wb, "Alerts.xlsx");
  };

  const exportSeed = async () => {
    if (ipAddressData.length > 0) {
      jsonToExcel(ipAddressData);
      openNotification();
    } else {
      openSweetAlert("No Data Found!", "info");
    }
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
          display: "flex",
          justifyContent: "center",
          borderRadius: "5px",
        }}
      >
        <SummaryDevices
          active={"Summary" === tableName}
          onClick={() => showTable("Summary")}
        >
          <div style={{ display: "flex" }}>
            <img
              src={summary}
              width="25px"
              height="25px"
              alt=""
              style={{ marginLeft: "10px", marginTop: "8px" }}
            />
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
        <SummaryDevices
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
        </SummaryDevices>
      </div>
      <br />
      <div
        style={{
          textAlign: "left",
          fontSize: "22px",
          fontWeight: 800,
          marginBottom: "8px",
        }}
      >
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <DoubleLeftOutlined style={{ color: "#0f0" }} /> Back to Previous Page
        </span>
      </div>

      <div>
        {tableName === "Summary" ? (
          <>
            <div className="site-card-wrapper">
              <Row
                style={{
                  textAlign: "center",
                  boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                  marginRight: "1px",
                  marginLeft: "1px",
                  marginBottom: "8px",
                  border: "0.3px solid rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  padding: "15px",
                }}
              >
                {responseData.map((item, key) => (
                  <Col xs={{ span: 24 }} md={{ span: 3 }} lg={{ span: 3 }}>
                    <div
                      bordered={true}
                      style={{
                        borderRight:
                          key !== 7
                            ? "0.3px solid rgba(0,0,0,0.2)"
                            : "0px solid rgba(0,0,0,0.2)",

                        borderBottom:
                          key !== 8
                            ? "0.3px solid rgba(0,0,0,0.2)"
                            : "0px solid rgba(0,0,0,0.2)",
                        padding: "8px",
                      }}
                    >
                      {item.name === "Device Description" ? (
                        <h4
                          style={{
                            color: "#000000",
                            whiteSpace: "nowrap",
                            width: "80px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            textAlign: "left",
                          }}
                          data-tip={item.name}
                        >
                          {item.name}
                        </h4>
                      ) : (
                        <h4
                          style={{
                            color: "#000000",
                            fontWeight: 600,
                            textAlign: "left",
                          }}
                        >
                          {item.name}
                        </h4>
                      )}
                      {item.name === "Device Description" ||
                      item.name === "Device Name" ? (
                        <h4
                          style={{
                            whiteSpace: "nowrap",
                            width: "80px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            textAlign: "left",
                            color: "#66B127",
                          }}
                          data-tip={item.value}
                        >
                          {item.value}
                        </h4>
                      ) : (
                        <h4
                          style={{
                            wordWrap: "break-word",
                            color: "#66B127",
                            textAlign: "left",
                          }}
                        >
                          {item.value}
                        </h4>
                      )}
                      <div style={{ width: "200px" }}>
                        <ReactTooltip type="dark" className="tooltipDis" />
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            <Row
              style={{
                width: "100%",
                textAlign: "center",
                marginRight: "1px",
                marginLeft: "1px",
                border: "0.3px solid rgba(0,0,0,0.2)",
                borderRadius: "8px",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                boxSizing: "border-box",
              }}
            >
              <Col xs={{ span: 24 }} md={{ span: 5 }} lg={{ span: 5 }}>
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    padding: "10px",
                  }}
                >
                  <div style={{ width: "100%", height: "180px" }}>
                    <ReactSpeedometer
                      width={250}
                      maxValue={100}
                      minValue={0}
                      value={availability}
                      currentValueText="${value} %"
                      needleColor="#8e8f8f"
                      startColor="#66B127"
                      endColor="#66B127"
                    />
                  </div>

                  <h3>Availability</h3>
                </div>
              </Col>
              &nbsp;
              <Col xs={{ span: 24 }} md={{ span: 5 }} lg={{ span: 5 }}>
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    padding: "10px",
                  }}
                >
                  <div style={{ width: "100%", height: "180px" }}>
                    <ReactSpeedometer
                      width={250}
                      maxValue={100}
                      minValue={0}
                      value={packet_loss}
                      currentValueText="${value} %"
                      needleColor="#8e8f8f"
                      startColor="#66B127"
                      endColor="#66B127"
                    />
                  </div>

                  <h3>Packet Loss</h3>
                </div>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 3 }} lg={{ span: 3 }}>
                <div
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",

                    padding: "15px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "25px",
                      marginTop: "40px",
                      fontWeight: 600,
                    }}
                  >
                    {responseTime} ms
                  </h4>

                  <h2 style={{ display: "block", color: "rgba(0,0,0,0.4)" }}>
                    Response Time
                  </h2>
                </div>
              </Col>
              &nbsp;
              <Col xs={{ span: 24 }} md={{ span: 5 }} lg={{ span: 5 }}>
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    padding: "10px",
                  }}
                >
                  <div style={{ width: "100%", height: "180px" }}>
                    <ReactSpeedometer
                      width={250}
                      maxValue={100}
                      minValue={0}
                      value={cpu_utilization}
                      currentValueText="${value} %"
                      needleColor="#8e8f8f"
                      startColor="#66B127"
                      endColor="#66B127"
                    />
                  </div>

                  <h3>CPU Utilization</h3>
                </div>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 5 }} lg={{ span: 5 }}>
                <div
                  style={{
                    display: "grid",
                    placeItems: "center",
                    padding: "10px",
                  }}
                >
                  <div style={{ width: "100%", height: "180px" }}>
                    <ReactSpeedometer
                      width={250}
                      maxValue={100}
                      minValue={0}
                      value={memory_utilization}
                      currentValueText="${value} %"
                      needleColor="#8e8f8f"
                      startColor="#66B127"
                      endColor="#66B127"
                    />
                  </div>

                  <h3>Memory Utilization</h3>
                </div>
              </Col>
            </Row>
            <br />
            <br />
            <br />
            <br />
            <div style={{ float: "right" }}>
              <StyledExportButton
                onClick={exportSeed}
                style={{
                  marginRight: "12px",
                }}
              >
                <img
                  src={exportExcel}
                  alt=""
                  width="15px"
                  height="15px"
                  style={{ marginBottom: "3px" }}
                />
                &nbsp;&nbsp; Export
              </StyledExportButton>
              <button
                onClick={handleClearAlerts}
                style={{
                  backgroundColor: "#FBA4895C",
                  padding: "0px 20px",
                  border: "none",
                  borderRadius: "8px",
                  color: "#B64026",
                  fontWeight: "600",
                  height: "38px",
                  cursor: "pointer",
                }}
              >
                Clear Alerts
              </button>
            </div>
            <br />
            <br />
            <br />

            <div style={{ marginTop: "10px" }}>
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
                    borderLeft: "5px solid #6C6B75",
                    borderTopLeftRadius: "6px",
                    paddingLeft: "13px",
                    textAlign: "left",
                    paddingTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Recent Alert
                </h3>
                <TableStyling
                  columns={IpAddressTablecolumns}
                  dataSource={ipAddressData}
                />
              </div>
            </div>
          </>
        ) : null}
        {tableName === "Interface" ? (
          <>
            <br />
            <div style={{ marginRight: "12px", marginLeft: "12px" }}>
              <div style={{ marginRight: "15px", marginLeft: "15px" }}>
                <br />

                <div
                  style={{ display: "flex", marginTop: "5px", float: "left" }}
                >
                  <h4>Rows :</h4>&nbsp;
                  <ColRowNumberStyle>{rowCountInterface}</ColRowNumberStyle>
                  &nbsp;&nbsp;
                  <h4>Cols :</h4>&nbsp;
                  <ColRowNumberStyle>7</ColRowNumberStyle>
                </div>

                <SpinLoading spinning={mainTableloading}>
                  <TableStyling
                    scroll={{ x: 2000 }}
                    columns={columns}
                    dataSource={dataSource}
                  />
                </SpinLoading>
              </div>
            </div>
          </>
        ) : null}
      </div>

      <br />

      <Modal
        title="Possible Reasons For Alert"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <p style={{ whiteSpace: "pre-wrap" }}>
          <h1></h1>
          {descData}
        </p>
      </Modal>
    </div>
  );
};

export default index_Main;
