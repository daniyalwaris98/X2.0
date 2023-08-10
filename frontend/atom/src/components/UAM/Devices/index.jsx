import React, { useState, useEffect } from "react";
import { Table } from "antd";
import BarChart from "./BarChart";
import critical from "./assets/critical.svg";
import undefined from "./assets/undefined.svg";
import up from "./assets/up.svg";
import warning from "./assets/warning.svg";
import { Row, Col, notification } from "antd";
import myexport from "./assets/export.svg";
import Modal from "./AddDevicesModal.jsx";
import EditModal from "./EditDeviceModal.jsx";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import axios, { baseUrl } from "../../../utils/axios";

import { EditOutlined } from "@ant-design/icons";

import {
  TableStyling,
  OnBoardStyledButton,
  StyledExportButton,
  StyledSubmitButton,
  AddStyledButton,
  MainTableMainDiv,
  MainTableMainP,
  MainTableModal,
  MainTableColP,
  DSO,
  SpinLoading,
  ProgressStyled,
  PopConfirmStyled,
} from "../../AllStyling/All.styled.js";

import { columnSearch } from "../../../utils";
import { ResponseModel } from "../../ReusableComponents/ResponseModel/ResponseModel";

let excelData = [];
let columnFilters = {};

const index = () => {
  let [dataSource, setDataSource] = useState(excelData);

  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  let [dismantleLoading, setDismantleLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const [totalDeviceCount, setTotalDeviceCount] = useState("");
  const [mainModalVisible, setMainModalVisible] = useState(false);
  const [myDeviceStatus, setMyDevicesStatus] = useState([]);

  useEffect(() => {
    serviceCalls();
  }, []);

  const serviceCalls = async () => {
    setLoading(true);

    try {
      const res = await axios.get(baseUrl + "/getAllDevices");
      excelData = res.data;
      setDataSource(excelData);
      setRowCount(excelData.length);
      setLoading(false);

      console.log("table response =====>", res);
    } catch (err) {
      setLoading(false);
    }
  };

  const confirm = async (e) => {
    e.stopPropagation();
    setDismantleLoading(true);

    if (selectedRowKeys.length > 0) {
      await axios
        .post(baseUrl + "/dismantleOnBoardedDevice", selectedRowKeys)
        .then((response) => {
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllDevices")
              .then((response) => {
                setDataSource(response.data);

                setRowCount(excelData.length);
                setDismantleLoading(false);
              })
              .catch((error) => {
                setDismantleLoading(false);
              })
          );
          return Promise.all(promises);
        })
        .catch((err) => {
          openSweetAlert("Something Went Wrong!", "error");
          setDismantleLoading(false);
        });
      setDismantleLoading(false);
    } else {
      setDismantleLoading(false);
      openSweetAlert("No device is selected.!", "error");
    }
  };

  useEffect(() => {
    const deviceStatus = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/deviceStatus");

        setMyDevicesStatus(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    deviceStatus();
  }, [dismantleLoading, isEditModalVisible, dataSource]);

  useEffect(() => {
    const TotalDevicesCount = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/totalDevicesInDeviceDashboard");
        setTotalDeviceCount(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    TotalDevicesCount();
  }, []);

  const [allSiteData, setAllSiteData] = useState("");
  const [allRackData, setAllRackData] = useState("");
  const [allDeviceData, setAllDeviceData] = useState("");
  const [myAllBoardData, setAllBoardData] = useState("");
  const [myAllSubBoardData, setAllSubBoardData] = useState("");
  const [myAllSFPData, setAllSFPData] = useState("");
  const [myAllLicenseData, setAllLicenseData] = useState("");

  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
  }, []);

  const showSiteData = async (ipAddress) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getSiteDetailByIpAddress?ipaddress=${ipAddress}`
      );
      setAllSiteData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };
  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  const showRackData = async (ipAddress) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getRackDetailByIpAddress?ipaddress=${ipAddress}`
      );

      setAllRackData(res.data);

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const showDeviceData = async (ipAddress) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getDeviceDetailsByIpAddress?ipaddress=${ipAddress}`
      );
      setAllDeviceData(res.data);

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const showBoardData = async (ipAddress) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getBoardDetailsByIpAddress?ipaddress=${ipAddress}`
      );
      setAllBoardData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const showSubBoardData = async (ipAddress) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getSubBoardDetailsByIpAddress?ipaddress=${ipAddress}`
      );
      setAllSubBoardData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const showSFPData = async (ipAddress) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getSfpsDetailsByIpAddress?ipaddress=${ipAddress}`
      );
      setAllSFPData(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const showLicenseData = async (ipAddress) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getLicenseDetailsByIpAddress?ipaddress=${ipAddress}`
      );

      setAllLicenseData(res.data);

      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const showMainModal = (ipAddress) => {
    setMainModalVisible(true);
    showSiteData(ipAddress);
    showRackData(ipAddress);
    showDeviceData(ipAddress);
    showBoardData(ipAddress);
    showSubBoardData(ipAddress);
    showSFPData(ipAddress);
    showLicenseData(ipAddress);
  };

  const handleMainOk = () => {
    setMainModalVisible(false);
  };

  const handleMainCancel = () => {
    setMainModalVisible(false);
  };

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: !configData?.uam.pages.devices.read_only,
    }),
  };

  const deleteDevice = async () => {
    if (selectedRowKeys.length > 0) {
      await axios
        .post(`${baseUrl}/deleteDevice`, selectedRowKeys)
        .then((res) => {
          if (res.status == 200) {
            ResponseModel(
              `
              Devices Not Deleted : ${res.data.error}
              Devices Deleted : ${res.data.success}
            `,
              "success",
              res.data.error_list
            );
            serviceCalls();
            onSelectChange("");
          }
        })
        .catch((err) => {
          console.log("delete Error", err);
        });
    }
  };

  const exportSeed = async () => {
    jsonToExcel(excelData);
  };

  const jsonToExcel = (atomData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "devices");
      XLSX.writeFile(wb, "devices.xlsx");
      openNotification();
    } else {
      openSweetAlert("No Data Found!", "danger");
    }
  };

  const openNotification = () => {
    notification.open({
      message: "File Exported Successfully",
    });
  };

  const showModal = () => {
    setEditRecord(null);
    setAddRecord(null);
    setIsModalVisible(true);
  };

  const edit = (record) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
  };

  const SecColumns = [
    {
      title: "",
      key: "edit",
      width: "0.5%",

      render: (text, record) => (
        <>
          {!configData?.uam.pages.devices.read_only ? (
            <>
              <a disabled>
                <EditOutlined style={{ paddingRight: "50px" }} />
              </a>
            </>
          ) : (
            <a
              onClick={() => {
                edit(record);
              }}
            >
              <EditOutlined
                style={{ paddingRight: "50px", color: "#66A111" }}
              />
            </a>
          )}
        </>
      ),
    },
    {
      title: "device_name",
      dataIndex: "device_name",
      key: "device_name",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "15px" }}
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
      title: "ip_address",
      dataIndex: "ip_address",
      key: "ip_address",

      render: (text, record) => {
        return (
          <p
            style={{
              color: "#66B127",
              textDecoration: "underline",
              fontWeight: "400",
              textAlign: "left",
              cursor: "pointer",
              marginLeft: "12px",
              paddingTop: "15px",
            }}
            onClick={() => showMainModal(text)}
          >
            {text}
          </p>
        );
      },
      ...getColumnSearchProps(
        "ip_address",
        "Ip Address",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "site_name",
      dataIndex: "site_name",
      key: "site_name",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "site_name",
        "Site Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "rack_name",
      dataIndex: "rack_name",
      key: "rack_name",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "rack_name",
        "Rack Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "software_version",
      dataIndex: "software_version",
      key: "software_version",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "software_version",
        "Software Version",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "manufacturer",
      dataIndex: "manufacturer",
      key: "manufacturer",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "manufacturer",
        "Manufacturer",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "function",
      dataIndex: "function",
      key: "function",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
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
      title: "serial_number",
      dataIndex: "serial_number",
      key: "serial_number",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "serial_number",
        "Serial Number",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "pn_code",
      dataIndex: "pn_code",
      key: "pn_code",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "pn_code",
        "PN Code",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
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
      title: "ru",
      dataIndex: "ru",
      key: "ru",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "ru",
        "RU",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "department",
      dataIndex: "department",
      key: "department",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "department",
        "Department",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "section",
      dataIndex: "section",
      key: "section",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "section",
        "Section",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Hardware Version",
      dataIndex: "hardware_version",
      key: "hardware_version",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "hardware_version",
        "Hardware Version",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "virtual",
      dataIndex: "virtual",
      key: "virtual",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "virtual",
        "Virtual",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "hw_eos_date",
      dataIndex: "hw_eos_date",
      key: "hw_eos_date",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "hw_eos_date",
        "HW EOS Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "hw_eol_date",
      dataIndex: "hw_eol_date",
      key: "hw_eol_date",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "hw_eol_date",
        "HW EOL Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "sw_eos_date",
      dataIndex: "sw_eos_date",
      key: "sw_eos_date",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "sw_eos_date",
        "SW EOS Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "sw_eol_date",
      dataIndex: "sw_eol_date",
      key: "sw_eol_date",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "sw_eol_dt",
        "SW EOL Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "creation_date",

      dataIndex: "creation_date",
      key: "creation_date",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "creation_date",
        "Creation Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "modification_date",

      dataIndex: "modification_date",
      key: "modification_date",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "modification_date",
        "Modification Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "authentication",
      dataIndex: "authentication",
      key: "authentication",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "authentication",
        "Authentication",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "manufacturer_date",
      dataIndex: "manufacturer_date",
      key: "manufacturer_date",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "manufacturer_date",
        "Manufacturer Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "source",
      dataIndex: "source",
      key: "source",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "source",
        "Source",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "stack",
      dataIndex: "stack",
      key: "stack",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "stack",
        "Stack",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "contract_number",
      dataIndex: "contract_number",
      key: "contract_number",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "contract_number",
        "Contract Number",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "contract_expiry",
      dataIndex: "contract_expiry",
      key: "contract_expiry",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "contract_expiry",
        "Contract Expiry",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];
  const [tableName, setTableName] = useState("Sites");

  const showTable = (myDataTable) => {
    if (myDataTable === "Sites") {
      setTableName(myDataTable);
    } else if (myDataTable === "Racks") {
      setTableName("Racks");
    } else if (myDataTable === "Devices") {
      setTableName("Devices");
    } else if (myDataTable === "Module") {
      setTableName("Module");
    } else if (myDataTable === "Stack Switches") {
      setTableName("Stack Switches");
    } else if (myDataTable === "SFPS") {
      setTableName("SFPS");
    } else if (myDataTable === "Licensce") {
      setTableName("Licensce");
    }
  };

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

  return (
    <SpinLoading spinning={dismantleLoading} style={{ marginTop: "180px" }}>
      <div
        style={{
          backgroundColor: "#f1f5f5",
          height: "100%",
        }}
      >
        <Row
          style={{
            padding: "10px",
            marginTop: "5px",
            marginRight: "15px",
            marginLeft: "15px",
          }}
        >
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                color: "#000",
                borderTopLeftRadius: "3px",
                paddingLeft: "6px",
                alignItems: "center",
                float: "left",
                marginLeft: "-6px",
                marginTop: "2px",
                fontWeight: "bold",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                justifyContent: "space-between",
                marginRight: "15px",
                marginLeft: "10px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #3D9E47",

                  borderTopLeftRadius: "6px",
                  paddingLeft: "8px",
                  alignItems: "center",
                  float: "left",
                  marginLeft: "-6px",
                  paddingTop: "7px",
                  marginTop: "2px",
                  fontWeight: "bold",
                }}
              >
                Device Status Overview
              </h3>

              <h4
                style={{
                  color: "#000",

                  paddingLeft: "6px",
                  alignItems: "center",
                  color: "#878787",
                  marginRight: "10px",
                  marginTop: "2px",
                  paddingTop: "6px",
                  fontWeight: "bold",
                  float: "right",
                }}
              >
                {totalDeviceCount && totalDeviceCount.name} :{" "}
                <b>{totalDeviceCount && totalDeviceCount.value}</b>
              </h4>

              <br />
              <br />
              <Row>
                {myDeviceStatus &&
                  myDeviceStatus.map((item, index) => {
                    return (
                      <Col xs={{ span: 12 }} md={{ span: 12 }} lg={{ span: 6 }}>
                        <SpinLoading spinning={loading}>
                          <div
                            style={{
                              display: "flex",
                              margin: "0 auto",
                              marginTop: "65px",
                              marginBottom: "50px",
                            }}
                          >
                            <div key={index} style={{ paddingRight: "20px" }}>
                              <ProgressStyled
                                style={{
                                  textAlign: "center",
                                  padding: "10px",
                                  paddingRight: 25,
                                  display: "block",
                                }}
                                strokeColor={
                                  (index === 0 ? "#66B127" : null) ||
                                  (index === 1 ? "#db5" : null) ||
                                  (index === 2 ? "#DC3938" : null) ||
                                  (index === 3 ? "#878787" : null)
                                }
                                type="dashboard"
                                percent={item.value}
                                success={{ percent: 0 }}
                              />
                              <DSO
                                bg={index === 0}
                                color={index === 0}
                                bgone={index === 1}
                                colorone={index === 1}
                                bgtwo={index === 2}
                                colortwo={index === 2}
                                style={{
                                  marginRight: "5px",
                                  textAlign: "center",
                                  margin: "15px",
                                  borderRadius: "15px",
                                  padding: "5px",
                                  fontSize: "10px",
                                  fontWeight: "600",
                                }}
                              >
                                <img src={imgFun(item.name)} alt="" /> &nbsp;
                                &nbsp;
                                {item.name}
                              </DSO>
                            </div>
                          </div>
                        </SpinLoading>
                      </Col>
                    );
                  })}
              </Row>
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                color: "#000",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                borderTopLeftRadius: "3px",
                alignItems: "center",
                marginLeft: "-6px",
                height: "365px",
                fontWeight: "bold",
                justifyContent: "space-between",
                marginRight: "15px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #6C6B75",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "8px",
                  alignItems: "center",
                  paddingTop: "6px",

                  marginTop: "2px",
                  marginBottom: "5px",
                  fontWeight: "bold",
                }}
              >
                Top 10 Functions
              </h3>

              <SpinLoading spinning={loading}>
                <BarChart />
              </SpinLoading>
            </div>
          </Col>
        </Row>
        <div style={{ padding: "15px" }}>
          <div style={{ float: "left" }}>
            {dismantleLoading !== true ? (
              <>
                <PopConfirmStyled
                  style={{ width: "250px" }}
                  title="Are you sure, You want to Dismantle...?"
                  placement="rightTop"
                  okType="ghost"
                  onConfirm={confirm}
                  type="success"
                  okText="Yes"
                  cancelText="No"
                >
                  <OnBoardStyledButton
                    style={{
                      fontSize: "14px",
                      float: "left",
                      marginBottom: "5px",
                      marginLeft: "17px",
                    }}
                    disabled={!configData?.uam.pages.devices.read_only}
                  >
                    Dismantle
                  </OnBoardStyledButton>
                </PopConfirmStyled>
              </>
            ) : null}

            <AddStyledButton onClick={showModal} style={{ display: "none" }}>
              + Add Device
            </AddStyledButton>

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                marginTop: "3px",
              }}
            >
              {selectedRowKeys.length > 0 && (
                <button
                  style={{
                    padding: " 5px 10px",
                    background: "red",
                    color: "white",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => deleteDevice()}
                >
                  Delete
                </button>
              )}

              <h3
                style={{
                  marginLeft: "10px",
                  marginRight: "20px",
                }}
              >
                Row :<b style={{ color: "#3D9E47" }}> {rowCount}</b>
              </h3>
              <h3
                style={{
                  marginLeft: "10px",
                  marginRight: "20px",
                }}
              >
                Col :<b style={{ color: "#3D9E47" }}> 34</b>
              </h3>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              float: "right",
              marginRight: "15px",
            }}
          >
            <StyledExportButton
              onClick={exportSeed}
              style={{
                paddingTop: "4px",
              }}
            >
              <img src={myexport} alt="" width="18px" height="18px" />
              &nbsp; Export
            </StyledExportButton>
          </div>
          <br />
          <MainTableModal
            width={"75%"}
            open={mainModalVisible}
            closable={false}
            footer={false}
            onOk={handleMainOk}
            onCancel={handleMainCancel}
            style={{ padding: "0px !important" }}
          >
            <div
              style={{
                padding: "15px",
                backgroundColor: "rgba(251, 251, 251, 0.75)",
              }}
            >
              <div>
                <div style={{ float: "left" }}>
                  <h2>Device Details</h2>
                </div>
                <div style={{ float: "right" }}>
                  <StyledSubmitButton
                    style={{
                      float: "right",
                      width: "60px",
                      marginTop: "10px",
                      background:
                        "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                      border: "0px",
                    }}
                    color={"green"}
                    type="submit"
                    onClick={handleMainOk}
                    value="OK"
                  />
                </div>
              </div>
              <br />
              <br />
              <div
                style={{
                  backgroundColor: "#FFFFF6",
                  borderRadius: "8px",
                  padding: "5px",
                }}
              >
                {/* <br /> */}
                <MainTableMainDiv>
                  <MainTableMainP
                    active={"Sites" === tableName}
                    onClick={() => showTable("Sites")}
                  >
                    Sites
                  </MainTableMainP>
                  <MainTableMainP
                    active={"Racks" === tableName}
                    onClick={() => showTable("Racks")}
                  >
                    Racks
                  </MainTableMainP>
                  <MainTableMainP
                    active={"Devices" === tableName}
                    onClick={() => showTable("Devices")}
                  >
                    Devices
                  </MainTableMainP>
                  <MainTableMainP
                    active={"Module" === tableName}
                    onClick={() => showTable("Module")}
                  >
                    Module
                  </MainTableMainP>

                  <MainTableMainP
                    onClick={() => showTable("SFPS")}
                    active={"SFPS" === tableName}
                  >
                    SFPS
                  </MainTableMainP>
                  <MainTableMainP
                    onClick={() => showTable("Licensce")}
                    active={"Licensce" === tableName}
                  >
                    License
                  </MainTableMainP>
                </MainTableMainDiv>
                {tableName === "Sites" ? (
                  <>
                    <SpinLoading spinning={loading}>
                      <div style={{ overflowY: "scroll", height: "450px" }}>
                        <Row
                          style={{
                            paddingTop: "15px",
                            backgroundColor: "#F1FFE1",
                          }}
                        >
                          <Col span={6}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Site Name
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={5}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allSiteData.site_name}
                            </MainTableColP>
                          </Col>
                          <Col span={6}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Region
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={5}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allSiteData.region}
                            </MainTableColP>
                          </Col>
                        </Row>
                        <Row
                          style={{
                            paddingTop: "15px",
                            backgroundColor: "#FFFFFF",
                          }}
                        >
                          <Col span={6}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Latitude
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={5}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allSiteData.latitude}
                            </MainTableColP>
                          </Col>
                          <Col span={6}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Longitude
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={5}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allSiteData.longitude}
                            </MainTableColP>
                          </Col>
                        </Row>
                        <Row
                          style={{
                            paddingTop: "15px",
                            backgroundColor: "#F1FFE1",
                          }}
                        >
                          <Col span={6}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              City
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={5}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allSiteData.city}
                            </MainTableColP>
                          </Col>
                          <Col span={6}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Status
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={5}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allSiteData.status}
                            </MainTableColP>
                          </Col>
                        </Row>
                      </div>
                    </SpinLoading>
                  </>
                ) : null}
                {tableName === "Racks" ? (
                  <SpinLoading spinning={loading}>
                    <div style={{ overflowY: "scroll", height: "450px" }}>
                      {allRackData.map((item, index) => {
                        return (
                          <>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Rack Name
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {item.rack_name}
                                </MainTableColP>
                              </Col>

                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Width
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {item.width}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#FFF",
                              }}
                            >
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Site Name
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {item.site_name}
                                </MainTableColP>
                              </Col>

                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Rack Modal
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {item.rack_model}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Status
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {item.status}
                                </MainTableColP>
                              </Col>
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Height
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {item.height}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#FFF",
                              }}
                            >
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Serial Number
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {item.serial_number}
                                </MainTableColP>
                              </Col>
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  RU
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {item.ru}
                                </MainTableColP>
                              </Col>
                            </Row>

                            <hr />
                          </>
                        );
                      })}
                    </div>
                  </SpinLoading>
                ) : null}
                {tableName === "Devices" ? (
                  <SpinLoading spinning={loading}>
                    <div style={{ overflowY: "scroll", height: "450px" }}>
                      <Row
                        style={{
                          paddingTop: "15px",
                          backgroundColor: "#F1FFE1",
                        }}
                      >
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Device Name
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.device_name}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Status
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.status}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            HW EOS Date
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.hw_eos_date}
                          </MainTableColP>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          paddingTop: "15px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            PN Code
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.pn_code}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Site Name
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.site_name}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            RU
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.ru}
                          </MainTableColP>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          paddingTop: "15px",
                          backgroundColor: "#F1FFE1",
                        }}
                      >
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            HW EOL Date
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.hw_eol_date}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            department
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.department}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            SW EOS Date
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.sw_eos_date}
                          </MainTableColP>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          paddingTop: "15px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Contract Expiry
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.contract_expiry}
                          </MainTableColP>
                        </Col>

                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Section
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.section}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            SW EOL Date
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.sw_eol_date}
                          </MainTableColP>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          paddingTop: "15px",
                          backgroundColor: "#F1FFE1",
                        }}
                      >
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Manufacturer Date
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.manufacturer_date}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Sodtware Version
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.software_version}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Rack Name
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.rack_name}
                          </MainTableColP>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          paddingTop: "15px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Virtual
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.virtual}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Hardware Version
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.hardware_version}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Patch Version
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.patch_version}
                          </MainTableColP>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          paddingTop: "15px",
                          backgroundColor: "#F1FFE1",
                        }}
                      >
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Function
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.function}
                          </MainTableColP>
                        </Col>

                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Stack
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.stack}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Modification Date
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.modification_date}
                          </MainTableColP>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          paddingTop: "15px",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Source
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.source}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Manufacturer
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.manufacturer}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Serial Number
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.serial_number}
                          </MainTableColP>
                        </Col>
                      </Row>
                      <Row
                        style={{
                          paddingTop: "15px",
                          backgroundColor: "#F1FFE1",
                        }}
                      >
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Creation Date
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.creation_date}
                          </MainTableColP>
                        </Col>
                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Ip Address
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.ip_address}
                          </MainTableColP>
                        </Col>

                        <Col span={4}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            Authentication
                          </MainTableColP>
                        </Col>
                        <Col span={1}>:</Col>
                        <Col span={3}>
                          <MainTableColP style={{ paddingLeft: "40px" }}>
                            {allDeviceData.authentication}
                          </MainTableColP>
                        </Col>
                      </Row>
                    </div>
                  </SpinLoading>
                ) : null}
                {tableName === "Module" ? (
                  <SpinLoading spinning={loading}>
                    <div style={{ overflowY: "scroll", height: "450px" }}>
                      {myAllBoardData.map((allBoardData, index) => {
                        return (
                          <>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Module Name
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.board_name}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Serial Number
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.serial_number}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  EOL Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.eol_date}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#fff",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Device Name
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.device_name}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Manufacturer date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.manufacturer_date}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  RFS Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.rfs_date}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  EOS Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.eos_date}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Creation date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.creation_date}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  PN Code
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.pn_code}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#fff",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Device Slot Id
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.device_slot_id}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Modification Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.modification_date}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Hardware Version
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.hardware_version}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Software Version
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.software_version}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Status
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allBoardData.status}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#fff",
                              }}
                            ></Row>
                            <hr />
                          </>
                        );
                      })}
                    </div>
                  </SpinLoading>
                ) : null}
                {tableName === "Stack Switches" ? (
                  <SpinLoading spinning={loading}>
                    <div style={{ overflowY: "scroll", height: "450px" }}>
                      {myAllSubBoardData.map((allSubBoardData, index) => {
                        return (
                          <>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  SubBoard Name
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.subboard_name}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  SubSlot Number
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.subslot_number}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Status
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.status}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#fff",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Device Name
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.device_name}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Software Version
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.software_version}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Eos Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.eos_date}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  SubBoard Type
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.subboard_type}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Hardware Version
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.hardware_version}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  EOL Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.eol_date}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#fff",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  subrack Id
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.subrack_id}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Slot Number
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.slot_number}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  RFS Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.rfs_date}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Serial Number
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.serial_number}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Creation Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.creation_date}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Modification Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.modification_date}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#fff",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  PN Code
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSubBoardData.pn_code}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <hr />;
                          </>
                        );
                      })}
                    </div>
                  </SpinLoading>
                ) : null}
                {tableName === "SFPS" ? (
                  <SpinLoading spinning={loading}>
                    <div style={{ overflowY: "scroll", height: "450px" }}>
                      {myAllSFPData.map((allSFPData, index) => {
                        return (
                          <>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  SFP Id
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSFPData.sfp_id}
                                </MainTableColP>
                              </Col>

                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Creation Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSFPData.creation_date}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#fff",
                              }}
                            >
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Device Name
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSFPData.device_name}
                                </MainTableColP>
                              </Col>
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Modification Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSFPData.modification_date}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Media Type
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSFPData.media_type}
                                </MainTableColP>
                              </Col>

                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Status
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSFPData.status}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#fff",
                              }}
                            >
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Port Name
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSFPData.port_name}
                                </MainTableColP>
                              </Col>

                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  EOS Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSFPData.eos_date}
                                </MainTableColP>
                              </Col>
                            </Row>

                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Port Type
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSFPData.port_type}
                                </MainTableColP>
                              </Col>

                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  EOL Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSFPData.eol_date}
                                </MainTableColP>
                              </Col>
                            </Row>

                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Serial Number
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSFPData.serial_number}
                                </MainTableColP>
                              </Col>
                              <Col span={6}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Mode
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={5}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allSFPData.mode}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <hr />
                          </>
                        );
                      })}
                    </div>
                  </SpinLoading>
                ) : null}
                {tableName === "Licensce" ? (
                  <SpinLoading spinning={loading}>
                    <div style={{ overflowY: "scroll", height: "450px" }}>
                      {myAllLicenseData.map((allLicenseData, index) => {
                        return (
                          <>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Activation Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.activation_date}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Expiry Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.expiry_date}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Status
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.status}
                                </MainTableColP>
                              </Col>
                            </Row>

                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#fff",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Licensce Name
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.license_name}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Grace Period
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.grace_period}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Capacity
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.capacity}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Licensce Description
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.license_description}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Serial Number
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.serial_number}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Usage
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.usage}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#fff",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Device Name
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.ne_name}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Creation Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.creation_date}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  PN Code
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.pn_code}
                                </MainTableColP>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                paddingTop: "15px",
                                backgroundColor: "#F1FFE1",
                              }}
                            >
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  RFS Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.rfs_date}
                                </MainTableColP>
                              </Col>
                              <Col span={4}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  Modification Date
                                </MainTableColP>
                              </Col>
                              <Col span={1}>:</Col>
                              <Col span={3}>
                                <MainTableColP style={{ paddingLeft: "40px" }}>
                                  {allLicenseData.modification_date}
                                </MainTableColP>
                              </Col>
                            </Row>

                            <hr />
                          </>
                        );
                      })}
                    </div>
                  </SpinLoading>
                ) : null}
              </div>
            </div>
          </MainTableModal>
        </div>

        {isModalVisible && (
          <Modal
            style={{ padding: "40px", marginTop: "-30px" }}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            dataSource={dataSource}
            setDataSource={setDataSource}
            excelData={excelData}
            setRowCount={setRowCount}
            addRecord={addRecord}
            centered={true}
          />
        )}
        {isEditModalVisible && (
          <EditModal
            style={{ padding: "0px" }}
            isEditModalVisible={isEditModalVisible}
            setIsEditModalVisible={setIsEditModalVisible}
            dataSource={dataSource}
            setDataSource={setDataSource}
            excelData={excelData}
            setRowCount={setRowCount}
            editRecord={editRecord}
            centered={true}
          />
        )}
        <SpinLoading spinning={loading} tip="Loading...">
          <div style={{ padding: "25px" }}>
            <TableStyling
              rowSelection={rowSelection}
              scroll={{ x: 8500 }}
              rowKey="site_name"
              columns={SecColumns}
              dataSource={dataSource}
              style={{ width: "100%", padding: "2%" }}
            />
          </div>
        </SpinLoading>
      </div>
    </SpinLoading>
  );
};

export default index;
