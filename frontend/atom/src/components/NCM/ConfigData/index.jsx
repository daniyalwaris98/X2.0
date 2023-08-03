import React, { useState, useEffect, useRef } from "react";
import { Col, Row, Table, notification, Radio, Progress } from "antd";
import { useLocation } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import { columnSearch } from "../../../utils";
import axios, { baseUrl } from "../../../utils/axios";
import rcs from "../assets/rcs.svg";
import trash from "../assets/trash.svg";
import { useNavigate } from "react-router-dom";
import EditModal from "./EditNcm.jsx";
import JSZip from "jszip";
import active from "../assets/active.svg";
import inactive from "../assets/inactive.svg";

import {
  DeleteButton,
  MainTableModal,
  MainTableMainP,
  MainTableMainDiv,
  TableStyling,
  StyledInputForm,
  StyledselectIpam,
  SpinLoading,
  AddButtonStyle,
  BackupButton,
  DownloadButton,
} from "../../AllStyling/All.styled.js";

import { devices, functions, vendors } from "../../../data/globalData";
import Container from "../../ReusableComponents/Container/Container";
import { ConfigDataStyle } from "./ConfigData.style";
import VerticalBarChart from "../../ReusableComponents/Carts/VerticalBarChart/VerticalBarChart";

let excelData = [];
let columnFilters = {};
let deviceExcelData = [];
let DeviceColumnFilters = {};

const indexMain = () => {
  const navigate = useNavigate();
  let [dataSource, setDataSource] = useState(excelData);
  const [downLoadLoading, setDownLoadLoading] = useState(false);
  const [importBtnLoading, setImportBtnLoading] = useState(true);
  const [rowCount, setRowCount] = useState(0);
  let [dataSourceOfDevice, setDataSourceOfDevice] = useState(deviceExcelData);
  let [dataSourceOfDeviceLoading, setDataSourceOfDeviceLoading] =
    useState(false);
  const [deviceName, setDeviceName] = useState("");

  const [ipAddress, setIpAddress] = useState("");
  const [activeState, setActiveState] = useState("Active");
  const [deviceType, setDeviceType] = useState("Juniper");
  const [deviceTypeOther, setDeviceTypeOther] = useState("");

  const [myFunction, setFunction] = useState("Router");

  const [vendor, setVendor] = useState("Cisco");
  const [vendorOther, setVendorOther] = useState("");

  const [value, setValue] = useState(1);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  const [deviceSelectedRowKeys, setDeviceSelectedRowKeys] = useState([]);
  const [deviceSearchText, setDeviceSearchText] = useState(null);
  const [deviceSearchedColumn, setDeviceSearchedColumn] = useState(null);
  const [mainModalVisible, setMainModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mainTableloadingData, setmainTableloadingData] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [severityData, setSeverityData] = useState([]);

  const location = useLocation(); // for future use to filter out table
  // console.log("location=========>", location.state);

  const ncmVendors = vendors.filter((vendor) => vendor.module.includes("ncm"));
  const ncmFunctions = functions.filter((ncmFunction) =>
    ncmFunction.module.includes("ncm")
  );

  useEffect(() => {
    getSeverityData();
  }, []);

  const getSeverityData = async () => {
    await axios
      .get(baseUrl + "/ncmBackupSummeryDashboard")
      .then((res) => {
        res.data[0].color = "#DC3938";
        res.data[1].color = "#2D9CDB";
        res.data[2].color = "#4BE58C";

        setSeverityData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const onValueChange = (e) => {
    setValue(e.target.value);
  };
  const inputRef = useRef(null);

  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);

  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  const showMainModal = () => {
    setMainModalVisible(true);
  };

  const edit = (record) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
  };

  let deviceGetColumnSearchProps = columnSearch(
    deviceSearchText,
    setDeviceSearchText,
    deviceSearchedColumn,
    setDeviceSearchedColumn
  );

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setMainModalVisible(false);

    let formData;
    formData = {
      ip_address: ipAddress,
      device_type: deviceType,
      device_name: deviceName,
      vendor,
      status: activeState,
      function: myFunction,
      password_group,
    };

    try {
      await axios
        .post(baseUrl + "/addNcmDevice ", formData)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
          } else {
            setIpAddress("");
            setDeviceName("");
            openSweetAlert(`Device Added Successfully`, "success");
            setLoading(false);
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllNcmDevices")
                .then((response) => {
                  setMainModalVisible(false);

                  setDataSource(response.data);
                  excelData = response.data;
                  setRowCount(response.data.length);
                  excelData = response.data;
                })
                .catch((error) => {
                  console.log(error);
                })
            );
            return Promise.all(promises);
          }
        })
        .catch(() => {});
    } catch (err) {
      console.log(err);
    }
  };

  const openNotification = () => {
    notification.open({
      message: "File Exported Successfully",
    });
  };

  let seedTemp = [
    {
      ip_address: "100.100.100.100",
      device_name: "ouyt",
      function: "abkcf",
      vendor: "dfcg",
      device_type: "asddxvcert",
      password_group: "asssjndfg",
      status: "Active",
    },
  ];

  const exportTemplate = () => {
    templeteExportFile(seedTemp);
  };

  const templeteExportFile = (atomData) => {
    let wb = XLSX.utils.book_new();
    let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
    XLSX.utils.book_append_sheet(wb, binaryAtomData, "ncm");
    XLSX.writeFile(wb, "ncm.xlsx");
    openNotification();
  };

  useEffect(() => {
    const serviceCalls = async () => {
      setDataSourceOfDeviceLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAtomInNcm");
        deviceExcelData = res.data;
        setDataSourceOfDevice(deviceExcelData);
        setDataSourceOfDeviceLoading(false);
      } catch (err) {
        console.log(err.response);
        setDataSourceOfDeviceLoading(false);
      }
    };
    serviceCalls();
  }, [rowCount]);

  const atomColumns = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          style={{
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...deviceGetColumnSearchProps(
        "ip_address",
        "IP Address",

        setDataSourceOfDevice,
        deviceExcelData,
        DeviceColumnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Device Type",
      dataIndex: "device_type",
      key: "device_type",
      render: (text, record) => (
        <p
          style={{
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...deviceGetColumnSearchProps(
        "device_type",
        "Device Type",

        setDataSourceOfDevice,
        deviceExcelData,
        DeviceColumnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Password Group",
      dataIndex: "password_group",
      key: "password_group",
      render: (text, record) => (
        <p
          style={{
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...deviceGetColumnSearchProps(
        "password_group",
        "Password Group",

        setDataSourceOfDevice,
        deviceExcelData,
        DeviceColumnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Device Name",
      dataIndex: "device_name",
      key: "device_name",
      render: (text, record) => (
        <p
          style={{
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...deviceGetColumnSearchProps(
        "device_name",
        "Device Name",

        setDataSourceOfDevice,
        deviceExcelData,
        DeviceColumnFilters
      ),
      ellipsis: true,
    },
  ];

  const onDeviceSelectChange = (deviceSelectedRowKeys) => {
    setDeviceSelectedRowKeys(deviceSelectedRowKeys);
  };

  const DeviceRowSelection = {
    deviceSelectedRowKeys,
    onChange: onDeviceSelectChange,
    selection: Table.SELECTION_ALL,
  };

  const handleMainOk = () => {
    setMainModalVisible(false);
  };

  const handleMainCancel = () => {
    setMainModalVisible(false);
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const postSeed = async (importFromExcel) => {
    await axios
      .post(baseUrl + "/addNcmDevices", importFromExcel)
      .then((response) => {
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");
          inputRef.current.value = "";

          setLoading(false);
        } else {
          setMainModalVisible(false);
          openSweetAlert("Device Added Successfully", "success");
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllNcmDevices")
              .then((response) => {
                excelData = response?.data;
                setDataSource(response?.data);
                setRowCount(response?.data?.length);
                inputRef.current.value = "";

                setLoading(false);
              })
              .catch((error) => {
                console.log(error);

                setLoading(false);
              })
          );
          setLoading(false);
          return Promise.all(promises);
        }
      })
      .catch((err) => {
        openSweetAlert("Something Went Wrong!", "error");
        setLoading(false);
      });
  };

  useEffect(() => {
    const serviceCalls = async () => {
      setmainTableloadingData(true);

      try {
        const res = await axios.get(baseUrl + "/getAllNcmDevices");
        excelData = res.data;
        setDataSource(excelData);
        setRowCount(excelData.length);
        setmainTableloadingData(false);
      } catch (err) {
        console.log(err.response);
        setmainTableloadingData(false);
      }
    };
    serviceCalls();
  }, []);

  const rowSelection = {
    columnWidth: 140,

    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,

    getCheckboxProps: (record) => ({
      disabled: record.status === "InActive",
      status: record.status,
    }),
  };

  const deleteRow = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        await axios
          .post(baseUrl + "/deleteNcmDevice", selectedRowKeys)
          .then((response) => {
            openSweetAlert(`Device Deleted Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllNcmDevices")
                .then((response) => {
                  console.log(response.data);
                  excelData = response.data;
                  setDataSource(response.data);
                  setRowCount(response.data.length);
                  setSelectedRowKeys([]);

                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);
                })
            );
            return Promise.all(promises);
          })
          .catch((error) => {
            setLoading(false);

            console.log("in add seed device catch ==> " + error);
          });
      } catch (err) {
        setLoading(false);

        console.log(err);
      }
    } else {
      openSweetAlert(`No Device Selected`, "error");
    }
  };

  const [backupLoading, setBackupLoading] = useState(false);

  const backedUp = async () => {
    try {
      setBackupLoading(true);
      await axios
        .post(baseUrl + "/bulkBackupConfigurations", selectedRowKeys)
        .then((response) => {
          if (response?.response?.status == 500) {
            setBackupLoading(false);
            openSweetAlert(response?.response?.data, "error");
          } else {
            setBackupLoading(false);

            openSweetAlert(response.data, "success");
          }
        })
        .catch((error) => {
          setBackupLoading(false);

          console.log("in add seed device catch ==> " + error);
        });
    } catch (err) {
      setBackupLoading(false);

      console.log(err);
    }
  };

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );

  const columns = [
    {
      title: "",
      key: "edit",
      width: "2%",

      render: (text, record) => (
        <a
          onClick={() => {
            edit(record);
          }}
        >
          <EditOutlined style={{ paddingRight: "50px", color: "#66A111" }} />
        </a>
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
            paddingTop: "10px",
            paddingLeft: "10px",
          }}
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
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) =>
        record.status === "InActive" ? (
          <p
            style={{
              color: "#66B127",
              textDecoration: "underline",
              textAlign: "center",
              paddingTop: "10px",
              paddingTop: "10px",
              cursor: "no-drop",
            }}
          >
            {text}
          </p>
        ) : (
          <p
            onClick={async () => {
              const res = await axios.post(
                baseUrl + "/getAllConfigurationDates",
                { ip_address: record.ip_address }
              );

              navigate("/ncmconfig-management/main", {
                state: {
                  ip_address: text,
                  res: res.data,
                },
              });
            }}
            style={{
              color: "#66B127",
              textDecoration: "underline",
              textAlign: "center",
              paddingTop: "10px",
              paddingTop: "10px",
              cursor: "pointer",
            }}
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
      title: "RCS",
      dataIndex: "rcs",
      key: "rcs",
      render: (text, record) =>
        record.status === "InActive" ? (
          <p
            style={{
              textAlign: "center",
              paddingTop: "10px",
              paddingTop: "10px",
              cursor: "no-drop",
            }}
          >
            <img src={rcs} alt="" />
          </p>
        ) : (
          <p
            style={{
              textAlign: "center",
              paddingTop: "10px",
              paddingTop: "10px",
              cursor: "pointer",
            }}
          >
            <img
              src={rcs}
              alt=""
              onClick={async () => {
                const datam = {
                  ip_address: record.ip_address,
                  vendor: record.vendor,
                  device_name: record.device_name,
                  function: record.function,
                };

                navigate("/ncmsummary/main", {
                  state: {
                    res: datam,
                  },
                });
              }}
            />
          </p>
        ),

      ...getColumnSearchProps(
        "rcs",
        "RCS",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Device Type",
      dataIndex: "device_type",
      key: "device_type",
      render: (text, record) => (
        <p
          style={{
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "device_type",
        "Device Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <div>
          {text === "Active" ? (
            <>
              <img src={active} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}

          {text === "InActive" ? (
            <>
              <img src={inactive} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}
        </div>
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
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
      render: (text, record) => (
        <p
          style={{
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "vendor",
        "Vendor",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Function",
      dataIndex: "function",
      key: "function",
      render: (text, record) => (
        <p
          style={{
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
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
      title: "Creation Date",
      dataIndex: "creation_date",
      key: "creation_date",
      render: (text, record) => (
        <p
          style={{
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
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
      title: "Modification Date",
      dataIndex: "modification_date",
      key: "modification_date",
      render: (text, record) => (
        <p
          style={{
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
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
      title: "Password Group",
      dataIndex: "password_group",
      key: "password_group",
      render: (text, record) => (
        <p
          style={{
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "password_group",
        "Password Group",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  const convertToJson = (headers, fileData) => {
    let rows = [];
    fileData.forEach((row) => {
      const rowData = {};
      row.forEach((element, index) => {
        rowData[headers[index]] = element;
      });
      rows.push(rowData);
    });
    rows = rows.filter((value) => JSON.stringify(value) !== "{}");
    return rows;
  };

  const importExcel = (e) => {
    setImportBtnLoading(false);

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const bstr = e.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const workSheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[workSheetName];
      const fileData = XLSX.utils.sheet_to_json(workSheet, {
        header: 1,
        raw: false,
      });
      const headers = fileData[0];
      fileData.splice(0, 1);
      let data = convertToJson(headers, fileData);
      postSeed(data);
      setImportBtnLoading(true);
    };
  };

  const handleSubnetAddress = async () => {
    if (deviceSelectedRowKeys.length > 0) {
      try {
        await axios
          .post(baseUrl + "/addNcmFromAtom ", deviceSelectedRowKeys)
          .then((response) => {
            openSweetAlert(`Device Added Successfully`, "success");

            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllNcmDevices")
                .then((response) => {
                  console.log(response.data);
                  excelData = response.data;
                  setDataSource(response.data);
                  setRowCount(response.data.length);

                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);
                })
            );
            return Promise.all(promises);
          })
          .catch((error) => {
            setLoading(false);
          });
      } catch (err) {
        setLoading(false);

        console.log(err);
      }
    } else {
      openSweetAlert(`No Device Selected`, "error");
    }
  };

  const [tableName, setTableName] = useState("Add Device");

  const showTable = (myDataTable) => {
    if (myDataTable === "Add Device") {
      setTableName(myDataTable);
    } else if (myDataTable === "Add From Atom") {
      setTableName("Add From Atom");
    } else if (myDataTable === "Auto Discovery") {
      setTableName("Auto Discovery");
    }
  };

  const handleDownloadBulkConfig = async () => {
    setDownLoadLoading(true);

    try {
      setDownLoadLoading(true);
      const res = await axios.post(
        baseUrl + "/downloadBulkConfiguration",
        selectedRowKeys
      );

      if (res?.response?.status == 500) {
        openSweetAlert(res?.response?.data, "error");
        setDownLoadLoading(false);
      } else {
        var zip = new JSZip();
        for (let i = 0; i < res?.data.length; i++) {
          zip.file(`${res.data[i].name}.cfg`, `${res.data[i].value}`);
        }
        zip.generateAsync({ type: "blob" }).then(function (blob) {
          saveAs(blob, "configurations.zip");
        });

        setDownLoadLoading(false);
      }
    } catch (err) {
      setDownLoadLoading(false);
    }
  };

  let [password_group, setPassword_group] = useState("");
  const [passwordArray, setPasswordArray] = useState([]);

  useEffect(() => {
    const getPasswordGroupDropdown = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getPasswordGroupDropdown");

        setPasswordArray(res.data);
        setPassword_group(res.data[0]);

        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    getPasswordGroupDropdown();
  }, []);

  const netWorkConfigData =
    dataSource &&
    dataSource.map((data) => ({
      ...data,
      function: data.function.toLowerCase(),
    }));

  const ncmDeviceType = devices.filter((device) =>
    device.module.includes("ncm")
  );

  return (
    <ConfigDataStyle>
      <div style={{ marginBottom: "15px" }}>
        <article className="graphs-wrapper">
          <Container className="sort-by-soverity" title="Sort By Severity">
            {severityData.map((data, index) => {
              const customFormatter = (percent) => percent;
              return (
                <article className="stages" key={index}>
                  <Progress
                    type="dashboard"
                    percent={data.value}
                    format={customFormatter}
                    strokeColor={data.color}
                  />
                  <h3 className="heading" style={{ color: data.color }}>
                    {data.name}
                  </h3>
                </article>
              );
            })}
          </Container>
          <Container className="device-type" title="Device Type">
            <VerticalBarChart />
          </Container>
        </article>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "50px",
          }}
        >
          <div style={{ marginTop: "7px", float: "left", display: "flex" }}>
            {selectedRowKeys.length > 0 ? (
              <div style={{ display: "flex" }}>
                <SpinLoading spinning={backupLoading}>
                  <BackupButton onClick={backedUp}>Backup</BackupButton>
                </SpinLoading>
                &nbsp;&nbsp;
                <SpinLoading spinning={downLoadLoading}>
                  <DownloadButton
                    onClick={handleDownloadBulkConfig}
                    style={{
                      cursor: "pointer",
                    }}
                  >
                    Export
                  </DownloadButton>
                </SpinLoading>
                &nbsp;&nbsp;
                <DeleteButton onClick={deleteRow}>
                  <img src={trash} width="18px" height="18px" alt="" />
                  &nbsp;Delete
                </DeleteButton>
              </div>
            ) : null}
            <h4
              style={{
                marginLeft: "10px",
                float: "right",
                marginRight: "20px",
              }}
            >
              Col : <b style={{ color: "#66B127" }}>10</b>
            </h4>
            <h4
              style={{
                marginLeft: "10px",
                float: "right",
                marginRight: "20px",
              }}
            >
              Row : <b style={{ color: "#66B127" }}>{rowCount}</b>
            </h4>
          </div>
          <div style={{ float: "right" }}>
            <AddButtonStyle onClick={showMainModal}>
              + Add Device
            </AddButtonStyle>
          </div>
        </div>

        <article className="table-wrapper">
          <SpinLoading spinning={mainTableloadingData}>
            <TableStyling
              rowSelection={rowSelection}
              scroll={{ x: 2000 }}
              pagination={{ pageSize: 10 }}
              rowKey="ip_address"
              columns={columns}
              dataSource={netWorkConfigData}
            />
          </SpinLoading>
        </article>
      </div>
      <MainTableModal
        width={"75%"}
        open={mainModalVisible}
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
              <h2>Add Device</h2>
            </div>
            <div style={{ float: "right" }}></div>
          </div>
          <br />
          <br />
          <div
            style={{
              backgroundColor: "#FBFBFBBF",
              borderRadius: "8px",
              padding: "5px",
            }}
          >
            {/* <br /> */}
            <MainTableMainDiv>
              <MainTableMainP
                active={"Add Device" === tableName}
                onClick={() => showTable("Add Device")}
              >
                Device
              </MainTableMainP>
              &nbsp;&nbsp;
              <MainTableMainP
                active={"Add From Atom" === tableName}
                onClick={() => showTable("Add From Atom")}
              >
                Atom
              </MainTableMainP>
              &nbsp;&nbsp;
            </MainTableMainDiv>
            {tableName === "Add Device" ? (
              <>
                <SpinLoading spinning={loading}>
                  <div
                    style={{
                      //   overflowY: "scroll",
                      height: "430px",
                      paddingTop: "20px",
                      backgroundColor: "rgba(251, 251, 251, 0.75)",
                    }}
                  >
                    <div style={{ textAlign: "center", marginBottom: "25px" }}>
                      <Radio.Group onChange={onValueChange} value={value}>
                        <Radio value={1}>Add Manually</Radio>
                        <Radio value={2}>Import From Excel</Radio>
                      </Radio.Group>
                    </div>
                    {value === 1 ? (
                      <div>
                        <div
                          style={{
                            marginLeft: "100px",
                            marginRight: "100px",
                          }}
                        >
                          <form onSubmit={handleFormSubmit}>
                            <Row>
                              <Col span={11}>
                                <>
                                  <label
                                    style={{
                                      float: "left",
                                    }}
                                  >
                                    IP Address
                                  </label>
                                  &nbsp;
                                  <span style={{ color: "red" }}>*</span>
                                  <br />
                                  <StyledInputForm
                                    style={{
                                      width: "100%",
                                      height: "2rem",
                                      border: "0.3px solid rgba(0,0,0,0.2)",
                                      paddingLeft: "8px",
                                    }}
                                    required
                                    placeholder="IP Address"
                                    value={ipAddress}
                                    onChange={(e) =>
                                      setIpAddress(e.target.value)
                                    }
                                  />
                                </>
                              </Col>
                              <Col span={2}></Col>
                              <Col span={11}>
                                <div>
                                  <label style={{ float: "left" }}>
                                    Device Type
                                  </label>
                                  &nbsp;
                                  <span style={{ color: "red", float: "left" }}>
                                    *
                                  </span>
                                  &nbsp;&nbsp;
                                  {deviceType === "Other" ? (
                                    <StyledInputForm
                                      style={{
                                        marginTop: "3px",
                                        width: "100%",
                                        height: "2rem",
                                        border: "0.3px solid rgba(0,0,0,0.2)",
                                        paddingLeft: "8px",
                                      }}
                                      required
                                      value={deviceTypeOther}
                                      onChange={(e) =>
                                        setDeviceTypeOther(e.target.value)
                                      }
                                    />
                                  ) : (
                                    <div className="select_t">
                                      <StyledselectIpam
                                        style={{
                                          width: "100%",
                                          height: "2rem",
                                          border: "1px solid #cfcfcf",
                                          borderRadius: "3px",
                                          marginTop: "-1px",
                                        }}
                                        required
                                        onChange={(e) =>
                                          setDeviceType(e.target.value)
                                        }
                                      >
                                        {ncmDeviceType.map((device, index) => (
                                          <option
                                            key={index}
                                            value={device.name}
                                          >
                                            {device.name}
                                          </option>
                                        ))}
                                      </StyledselectIpam>
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <Row
                              style={{
                                textAlign: "center",
                                marginTop: "25px",
                              }}
                            >
                              <Col span={11}>
                                <div>
                                  <label style={{ float: "left" }}>
                                    Device Name
                                  </label>
                                  <span style={{ color: "red", float: "left" }}>
                                    *
                                  </span>
                                  &nbsp;&nbsp;
                                  <StyledInputForm
                                    style={{
                                      width: "100%",
                                      height: "2rem",
                                      border: "0.3px solid rgba(0,0,0,0.2)",
                                      paddingLeft: "8px",
                                    }}
                                    required
                                    placeholder="Device Name"
                                    value={deviceName}
                                    onChange={(e) =>
                                      setDeviceName(e.target.value)
                                    }
                                  />
                                </div>
                              </Col>
                              <Col span={2}></Col>
                              <Col span={11}>
                                <div>
                                  <label style={{ float: "left" }}>
                                    Password Group
                                  </label>
                                  &nbsp;
                                  <span style={{ color: "red", float: "left" }}>
                                    *
                                  </span>
                                  {vendor === "Other" ? (
                                    <StyledInputForm
                                      style={{
                                        marginTop: "3px",
                                        width: "100%",
                                        height: "2rem",
                                        border: "0.3px solid rgba(0,0,0,0.2)",
                                        paddingLeft: "8px",
                                      }}
                                      required
                                      value={vendorOther}
                                      onChange={(e) =>
                                        setVendorOther(e.target.value)
                                      }
                                    />
                                  ) : (
                                    <div className="select_t">
                                      <StyledselectIpam
                                        style={{
                                          width: "100%",
                                          height: "2rem",
                                          border: "1px solid #cfcfcf",
                                          borderRadius: "3px",
                                          marginTop: "-1px",
                                        }}
                                        required
                                        value={password_group}
                                        onChange={(e) => {
                                          setPassword_group(e.target.value);
                                        }}
                                      >
                                        {passwordArray &&
                                          passwordArray.map((item, index) => {
                                            return (
                                              <option key={index}>
                                                {item}
                                              </option>
                                            );
                                          })}
                                      </StyledselectIpam>
                                    </div>
                                  )}
                                </div>
                              </Col>
                            </Row>
                            <br />
                            <Row>
                              <Col span={11}>
                                <div>
                                  <label style={{ float: "left" }}>
                                    Vendor
                                  </label>
                                  &nbsp;
                                  <div className="select_t">
                                    <StyledselectIpam
                                      style={{
                                        width: "100%",
                                        height: "2rem",
                                        border: "1px solid #cfcfcf",
                                        borderRadius: "3px",
                                      }}
                                      onChange={(e) =>
                                        setVendor(e.target.value)
                                      }
                                    >
                                      <option>Select Vendor</option>
                                      {ncmVendors.map((vendor, index) => {
                                        return (
                                          <option
                                            value={vendor.name}
                                            key={index}
                                          >
                                            {vendor.name}
                                          </option>
                                        );
                                      })}
                                    </StyledselectIpam>
                                  </div>
                                </div>
                              </Col>
                              <Col span={2}></Col>
                              <Col span={11}>
                                <label style={{ float: "left" }}>
                                  Function
                                </label>
                                &nbsp;
                                <span style={{ color: "red", float: "left" }}>
                                  *
                                </span>
                                &nbsp;&nbsp;
                                <div className="select_t">
                                  <StyledselectIpam
                                    style={{
                                      width: "100%",
                                      height: "2rem",
                                      border: "1px solid #cfcfcf",
                                      borderRadius: "3px",
                                    }}
                                    required
                                    onChange={(e) =>
                                      setFunction(e.target.value)
                                    }
                                  >
                                    <option value="">Select Funtion</option>
                                    {ncmFunctions.map((ncmFunction, index) => {
                                      return (
                                        <option
                                          value={ncmFunction.name}
                                          key={index}
                                        >
                                          {ncmFunction.name}
                                        </option>
                                      );
                                    })}
                                  </StyledselectIpam>
                                </div>
                              </Col>
                            </Row>

                            <br />
                            <Row>
                              <Col span={11}>
                                <div>
                                  <label style={{ float: "left" }}>
                                    Status
                                  </label>
                                  <span style={{ color: "red", float: "left" }}>
                                    *
                                  </span>
                                  &nbsp;&nbsp;
                                  <div className="select_t">
                                    <StyledselectIpam
                                      style={{
                                        width: "100%",

                                        height: "2rem",
                                        border: "1px solid #cfcfcf",
                                        borderRadius: "3px",
                                      }}
                                      required
                                      onChange={(e) =>
                                        setActiveState(e.target.value)
                                      }
                                    >
                                      <option value="Active">Active</option>
                                      <option value="InActive">InActive</option>
                                    </StyledselectIpam>
                                  </div>
                                </div>
                              </Col>
                            </Row>

                            <br />
                            <Row>
                              <Col span={24}>
                                <div style={{ textAlign: "center" }}>
                                  <button
                                    type="submit"
                                    style={{
                                      backgroundColor: "#66B127",
                                      color: "white",
                                      height: "35px",
                                      border: "none",
                                      width: "120px",
                                      cursor: "Pointer",
                                    }}
                                  >
                                    + Add Device
                                  </button>
                                </div>
                              </Col>
                            </Row>
                          </form>
                        </div>
                      </div>
                    ) : null}
                    {value === 2 ? (
                      <>
                        <div
                          style={{
                            marginRight: "100px",
                            marginLeft: "100px",
                          }}
                        >
                          <h3>Import</h3>
                          <div
                            style={{
                              height: "85px",
                              width: "100%",
                              backgroundColor: "#fff",
                              border: "1px dashed #6AB344",
                              borderRadius: "10px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                float: "center",
                                textAlign: "center",
                              }}
                            >
                              <input
                                type="file"
                                onChange={(e) => importExcel(e)}
                                ref={inputRef}
                                style={{
                                  zIndex: 999,
                                  color: "black",
                                  textAlign: "center",
                                  float: "center",
                                  borderRadius: "3px",
                                  marginLeft: "30%",
                                  marginTop: "25px",
                                  cursor: "pointer",
                                }}
                              />
                              <br />
                            </div>
                          </div>
                          <div
                            style={{ textAlign: "center", marginTop: "25px" }}
                          >
                            <button
                              onClick={exportTemplate}
                              style={{
                                fontWeight: "600",
                                paddingRight: "15px",
                                paddingLeft: "15px",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                                cursor: "pointer",
                                backgroundColor: "#86a8bb",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                width: "180px",
                              }}
                            >
                              Export Template
                            </button>{" "}
                            &nbsp;&nbsp;
                            <button
                              onClick={(e) => postSeed(e)}
                              disabled={importBtnLoading}
                              style={{
                                // display: "none",
                                fontWeight: "600",
                                paddingRight: "15px",
                                paddingLeft: "15px",
                                paddingTop: "5px",
                                paddingBottom: "5px",
                                cursor: "pointer",
                                backgroundColor: "#66B127",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                width: "120px",
                              }}
                            >
                              Import
                            </button>
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </SpinLoading>
              </>
            ) : null}
            {tableName === "Add From Atom" ? (
              <SpinLoading spinning={dataSourceOfDeviceLoading}>
                <div
                  style={{
                    height: "440px",
                    paddingTop: "80px",
                    textAlign: "center",
                    backgroundColor: "rgba(251, 251, 251, 0.75)",
                  }}
                >
                  <div
                    style={{
                      marginRight: "10px",
                      marginLeft: "10px",
                      marginTop: "-60px",
                    }}
                  >
                    <TableStyling
                      rowSelection={DeviceRowSelection}
                      pagination={{ pageSize: 4 }}
                      rowKey="ip_address"
                      columns={atomColumns}
                      dataSource={dataSourceOfDevice}
                    />
                    <button
                      onClick={handleSubnetAddress}
                      style={{
                        position: "relative",
                        left: "-1px",
                        marginTop: "16px",
                        fontWeight: "600",
                        paddingRight: "15px",
                        paddingLeft: "15px",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                        cursor: "pointer",
                        backgroundColor: "#66B127",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        width: "120px",
                      }}
                    >
                      + Add
                    </button>
                  </div>
                </div>
              </SpinLoading>
            ) : null}
          </div>
        </div>
      </MainTableModal>
      <br />

      {isEditModalVisible && (
        <EditModal
          Modal
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
    </ConfigDataStyle>
  );
};

export default indexMain;
