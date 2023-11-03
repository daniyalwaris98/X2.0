import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FunctionBarChartMain from "./Charts/BarChart/FunctionBarChart.jsx";
import BarChartMain from "./Charts/BarChart";
import Swal from "sweetalert2";
import addatom from "../assets/addatom.svg";
import addnew from "../assets/addnew.svg";
import active from "../assets/active.svg";
import inactive from "../assets/inactive.svg";
import activeS from "../assets/inactiveS.svg";
import inactiveS from "../assets/activeS.svg";
import na from "../assets/na.svg";
import trash from "../assets/trash.svg";
import axios, { baseUrl } from "../../../utils/axios";
import { useNavigate } from "react-router-dom";
import EditModal from "./EditSubnet";
import "./style.css";
import exportExcel from "../assets/exp.svg";
import {
  Modal,
  Radio,
  Row,
  Col,
  Table,
  notification,
  Button,
  Input,
} from "antd";

import * as XLSX from "xlsx";
import { EditOutlined } from "@ant-design/icons";
import {
  TableStyling,
  SpinLoading,
  MainTableModal,
  MainTableMainP,
  MainTableMainDiv,
  StyledselectIpam,
  InputWrapper,
  StyledInputForm,
  DeleteButton,
  ReScanButton,
  ColRowNumberStyle,
  MainDivStyle,
  AddButtonStyle,
  StyledExportButton,
} from "../../AllStyling/All.styled.js";

import { columnSearch } from "../../../utils";
import { getColumnSearchProps } from "./Filter.jsx";
import { devices, functions, vendors } from "../../../data/globalData.js";
let excelData = [];
let columnFilters = {};
let deviceExcelData = [];
let DeviceColumnFilters = {};

let autoDiscoveryExcelData = [];
let autoDiscoveryColumnFilters = {};

let functionVal = "";
let venderVal = "";

const index = () => {
  const navigate = useNavigate();
  const [addLoading, setAddLoading] = useState(false);
  let [dataSource, setDataSource] = useState(excelData);
  let [dataSourceOfDevice, setDataSourceOfDevice] = useState(deviceExcelData);
  const [importBtnLoading, setImportBtnLoading] = useState(true);

  let [autoDiscovery, setAutoDiscovery] = useState(autoDiscoveryExcelData);
  const [value, setValue] = useState(1);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  const [mainModalVisible, setMainModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ipamDeviceLoading, setIpamDeviceLoading] = useState(true);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [autoDiscoverysearchText, setautoDiscoverySearchText] = useState(null);
  const [autoDiscoverysearchedColumn, setautoDiscoverySearchedColumn] =
    useState(null);

  const [mainTableloading, setMainTableLoading] = useState(false);
  const [v1v2isModalOpen, setv1v2IsModalOpen] = useState(false);
  const [v3isModalOpen, setv3IsModalOpen] = useState(false);
  const [credentialIsModalOpen, setCredentialIsModalOpen] = useState(false);
  const [wmiIsModalOpen, setwmiIsModalOpen] = useState(false);

  const [ipAddress, setIpAddress] = useState("");
  const [activeState, setActiveState] = useState("Active");
  const [deviceType, setDeviceType] = useState("Juniper");
  const [deviceTypeOther, setDeviceTypeOther] = useState("");

  const [myFunction, setFunction] = useState("Router");
  const [myFunctionOther, setFunctionOther] = useState("");
  const [vendor, setVendor] = useState("Cisco");
  const [vendorOther, setVendorOther] = useState("");
  const [profileName, setProfileName] = useState("");
  const [description, setDescription] = useState("");
  const [community, setCommunity] = useState("");
  const [port, setPort] = useState("");

  const [profileNamev3, setProfileNamev3] = useState("");
  const [descriptionv3, setDescriptionv3] = useState("");
  const [portv3, setPortv3] = useState("");
  const [usernamev3, setUsernamev3] = useState("");
  const [authorizationProtocolv3, setaAuthorizationProtocolv3] =
    useState("MD5");
  const [authorizationPasswordv3, setaAuthorizationPasswordv3] = useState("");
  const [encryptionProtocolv3, setEncryptionProtocolv3] = useState("DES");

  const [encryptionPasswordv3, setEncryptionPasswordv3] = useState("");

  const [usernamewmi, setUsernamewmi] = useState("");
  const [passwordwmi, setPasswordwmi] = useState("");
  const [profileNamewmi, setProfileNamewmi] = useState("");
  const [handlebarClick, setHandlebarClick] = useState("");
  const [vendorValue, setVendorValue] = useState("");

  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  const showModalCredential = () => {
    setCredentialIsModalOpen(true);
  };

  const handleOkCredential = () => {
    setCredentialIsModalOpen(false);
  };

  const handleCancelCredential = () => {
    setCredentialIsModalOpen(false);
  };

  const showModalv1v2 = () => {
    setv1v2IsModalOpen(true);
  };

  const handleCancelv1v2 = () => {
    setv1v2IsModalOpen(false);
  };

  const showModalv3 = () => {
    setv3IsModalOpen(true);
  };

  const handleCancelv3 = () => {
    setv3IsModalOpen(false);
  };

  const showModalwmi = () => {
    setwmiIsModalOpen(true);
  };

  const handleCancelwmi = () => {
    setwmiIsModalOpen(false);
  };

  const [deviceSelectedRowKeys, setDeviceSelectedRowKeys] = useState([]);
  const [deviceSearchText, setDeviceSearchText] = useState(null);
  const [deviceSearchedColumn, setDeviceSearchedColumn] = useState(null);

  const [cred_group, setCred_group] = useState("");
  const [deviceName, setDeviceName] = useState("");
  const [importLoading, setImportLoading] = useState(false);

  const [rowCount, setRowCount] = useState(0);
  const [deviceRowCount, setDeviceRowCount] = useState(0); // don't remove it is used for filtering device

  let tableReload = false;

  const onValueChange = (e) => {
    setValue(e.target.value);
  };

  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllMonitoringDevices");
        excelData = res.data;
        setIpamDeviceLoading(false);
        setDataSource(excelData);
        setRowCount(excelData.length);

        setMainTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
        setIpamDeviceLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const funcVal = (data) => {
    functionVal = data;
  };

  const vendorVal = (data) => {
    venderVal = data;
  };

  useEffect(() => {
    const filterFunction = () => {
      if (functionVal !== "" || venderVal !== "") {
        let filteredSuggestions;

        if (functionVal !== "") {
          tableReload = true;
          filteredSuggestions = excelData.filter(
            (d) =>
              JSON.stringify(d["function"])
                .replace(" ", " ")
                .toLowerCase()
                .indexOf(functionVal.toLowerCase()) > -1
          );
          delete columnFilters["vendor"];
          columnFilters["function"] = functionVal;
          setVendorValue("");
          functionVal = "";
          venderVal = "";
        }
        if (venderVal !== "") {
          tableReload = true;
          filteredSuggestions = excelData.filter(
            (d) =>
              JSON.stringify(d["vendor"])
                .replace(" ", " ")
                .toLowerCase()
                .indexOf(venderVal.toLowerCase()) > -1
          );
          delete columnFilters["function"];
          columnFilters["vendor"] = venderVal;
          setHandlebarClick("");
          functionVal = "";
          venderVal = "";
        }

        setRowCount(filteredSuggestions.length);
        setDataSource(filteredSuggestions);
      }
    };
    filterFunction();
  }, [handlebarClick, vendorValue]);

  useEffect(() => {
    let user = localStorage.getItem("user");
    let userData = JSON.parse(user);

    const test = userData.monetx_configuration;

    let t = eval(test);
    let config = JSON.parse(t);
    setConfigData(config);
  }, []);

  let getColumnSearchPropsAutoDiscovery = columnSearch(
    autoDiscoverysearchText,
    setautoDiscoverySearchText,
    autoDiscoverysearchedColumn,
    setautoDiscoverySearchedColumn
  );

  let deviceGetColumnSearchProps = columnSearch(
    deviceSearchText,
    setDeviceSearchText,
    deviceSearchedColumn,
    setDeviceSearchedColumn
  );

  const handleMainOk = () => {
    setMainModalVisible(false);
  };

  const handleMainCancel = () => {
    setMainModalVisible(false);
  };

  useEffect(() => {
    const serviceCalls = async () => {
      try {
        const res = await axios.get(baseUrl + "/getAtomInMonitoring");
        deviceExcelData = res.data;
        setDataSourceOfDevice(deviceExcelData);
        setDeviceRowCount(deviceExcelData.length());
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
      }
    };
    serviceCalls();
  }, [rowCount]);

  useEffect(() => {
    const serviceCalls = async () => {
      try {
        const res = await axios.get(baseUrl + "/getSubnetsFromDevice");
        autoDiscoveryExcelData = res.data;
        setAutoDiscovery(autoDiscoveryExcelData);
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const [cred, setcred] = useState([]);

  useEffect(() => {
    const getPasswordGroupDropdown = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getDevCredentials");
        setcred(res.data);
        setCred_group(res.data[0]);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    getPasswordGroupDropdown();
  }, []);

  const [importFromExcel, setImportFromExcel] = useState("");

  const postSeed = async () => {
    setImportLoading(true);

    await axios
      .post(baseUrl + "/addMonitoringDevices", importFromExcel)
      .then((response) => {
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");
          setImportLoading(false);
        } else {
          setMainModalVisible(false);
          openSweetAlert("Device Added Successfully", "success");
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllMonitoringDevices")
              .then((response) => {
                excelData = response?.data;
                setRowCount(response?.data?.length);
                setDataSource(response?.data);
                setImportLoading(false);
              })
              .catch((error) => {
                console.log(error);
                setImportLoading(false);
              })
          );
          setImportLoading(false);
          return Promise.all(promises);
        }
      })
      .catch((err) => {
        openSweetAlert("Something Went Wrong!", "error");
        setImportLoading(false);
      });
  };

  const onDeviceSelectChange = (deviceSelectedRowKeys) => {
    setDeviceSelectedRowKeys(deviceSelectedRowKeys);
  };

  const DeviceRowSelection = {
    deviceSelectedRowKeys,
    onChange: onDeviceSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: configData?.monitering.pages.device.read_only,
    }),
  };

  const handleSubnetAddress = async () => {
    if (deviceSelectedRowKeys.length > 0) {
      try {
        await axios
          .post(baseUrl + "/addAtomInMonitoring ", deviceSelectedRowKeys)
          .then((response) => {
            if (response?.response?.status == 500) {
              openSweetAlert(response?.response?.data, "error");
            } else {
              openSweetAlert(response?.data, "success");

              const promises = [];
              promises.push(
                axios
                  .get(baseUrl + "/getAllMonitoringDevices")
                  .then((response) => {
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
            }
          })
          .catch((error) => {
            setLoading(false);
          });
      } catch (err) {
        setLoading(false);
      }
    } else {
      openSweetAlert(`No Device Selected`, "error");
    }
  };

  const deleteRow = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        await axios
          .post(baseUrl + "/deleteDeviceInMonitoring ", selectedRowKeys)
          .then((response) => {
            openSweetAlert(`Device Deleted Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllMonitoringDevices")
                .then((response) => {
                  excelData = response.data;
                  setDataSource(response.data);
                  setRowCount(response.data.length);
                  setSelectedRowKeys([]);

                  setLoading(false);
                })
                .catch((error) => {
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
      }
    } else {
      openSweetAlert(`No Device Selected`, "error");
    }
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
      setImportFromExcel(data);
    };
  };

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setMainModalVisible(false);
    setAddLoading(true);
    let formData;
    if (deviceType === "Other") {
      formData = {
        ip_address: ipAddress,
        device_type: "Other",
        vendor,
        function: myFunction,
        active: activeState,
        device_name: deviceName,
        credentials: cred_group,
      };
    }
    if (deviceType === "Other" && vendor === "Other") {
      formData = {
        ip_address: ipAddress,
        device_type: "Other",
        vendor: vendorOther,
        function: myFunction,
        active: activeState,
        device_name: deviceName,
        credentials: cred_group,
      };
    }
    if (vendor === "Other") {
      formData = {
        ip_address: ipAddress,
        device_type: deviceType,
        vendor: vendorOther,
        function: myFunction,
        active: activeState,
        device_name: deviceName,
        credentials: cred_group,
      };
    }

    if (vendor !== "Other" && deviceType !== "Other") {
      formData = {
        ip_address: ipAddress,
        device_type: deviceType,
        vendor,
        function: myFunction,
        active: activeState,
        device_name: deviceName,
        credentials: cred_group,
      };
    }
    if (myFunction !== "Other") {
      formData = {
        ip_address: ipAddress,
        device_type: deviceType,
        vendor,
        function: myFunction,
        active: activeState,
        device_name: deviceName,
        credentials: cred_group,
      };
    }
    if (myFunction === "Other") {
      formData = {
        ip_address: ipAddress,
        device_type: deviceType,
        vendor,
        function: myFunctionOther,
        active: activeState,
        device_name: deviceName,
        credentials: cred_group,
      };
    }
    if (
      deviceType === "Other" &&
      vendor === "Other" &&
      myFunction === "Other"
    ) {
      formData = {
        ip_address: ipAddress,
        device_type: "Other",
        vendor: vendorOther,
        function: myFunctionOther,
        active: activeState,
        device_name: deviceName,
        credentials: cred_group,
      };
    }
    if (
      deviceType !== "Other" &&
      vendor === "Other" &&
      myFunction === "Other"
    ) {
      formData = {
        ip_address: ipAddress,
        device_type: deviceType,
        vendor: vendorOther,
        function: myFunctionOther,
        active: activeState,
        device_name: deviceName,
        credentials: cred_group,
      };
    }
    if (
      deviceType !== "Other" &&
      vendor !== "Other" &&
      myFunction === "Other"
    ) {
      formData = {
        ip_address: ipAddress,
        device_type: deviceType,
        vendor: vendor,
        function: myFunctionOther,
        active: activeState,
        device_name: deviceName,

        credentials: cred_group,
      };
    }
    if (
      deviceType !== "Other" &&
      vendor !== "Other" &&
      myFunction !== "Other"
    ) {
      formData = {
        ip_address: ipAddress,
        device_type: deviceType,
        vendor: vendor,
        function: myFunction,
        active: activeState,

        device_name: deviceName,

        credentials: cred_group,
      };
    }
    if (
      deviceType === "Other" &&
      vendor !== "Other" &&
      myFunction === "Other"
    ) {
      formData = {
        ip_address: ipAddress,
        device_type: "Other",
        vendor: vendorOther,
        function: myFunction,
        active: activeState,

        device_name: deviceName,

        credentials: cred_group,
      };
    }
    if (
      deviceType === "Other" &&
      vendor === "Other" &&
      myFunction !== "Other"
    ) {
      formData = {
        ip_address: ipAddress,
        device_type: "Other",
        vendor: vendorOther,
        function: myFunction,
        active: activeState,

        device_name: deviceName,

        credentials: cred_group,
      };
    }

    try {
      await axios
        .post(baseUrl + "/addMonitoringDevice ", formData)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            setAddLoading(false);
          } else {
            if (deviceType === "Other") {
              setDeviceType("Juniper");
              setDeviceTypeOther("");
            }
            if (vendor === "Other") {
              setVendor("Cisco");
              setVendorOther("");
            }
            if (myFunction === "Other") {
              setFunction("Router");
              setFunctionOther("");
            }

            setIpAddress("");
            setDeviceName("");
            openSweetAlert(`Device Added Successfully`, "success");
            setLoading(false);
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllMonitoringDevices")
                .then((response) => {
                  setMainModalVisible(false);
                  setDataSource(response.data);
                  excelData = response.data;
                  setRowCount(response.data.length);
                  excelData = response.data;

                  setAddLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setAddLoading(false);
                })
            );
            return Promise.all(promises);
          }
        })
        .catch((error) => {
          setAddLoading(false);

          console.log("in add seed device catch ==> " + error);
        });
    } catch (err) {
      setAddLoading(false);

      console.log(err);
    }
  };

  const showMainModal = () => {
    setMainModalVisible(true);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1v2Data = {
      profile_name: profileName,
      description,
      community,
      port,
      category: "v1/v2",
    };
    setv1v2IsModalOpen(false);

    try {
      await axios
        .post(baseUrl + "/addMonitoringCredentials ", v1v2Data)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data.Response, "error");
            setLoading(false);
          } else {
            openSweetAlert("v1v2Data Added Successfully", "success");
            setProfileName("");
            setDescription("");
            setCommunity("");
            setPort("");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getDevCredentials")
                .then((response) => {
                  setcred(response.data);
                  setCred_group(response.data[0]);
                })
                .catch((error) => {
                  console.log(error);
                })
            );
            setLoading(false);
            return Promise.all(promises);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitWmc = async (e) => {
    e.preventDefault();
    const wmiData = {
      username: usernamewmi,
      password: passwordwmi,
      profile_name: profileNamewmi,
      category: "wmi",
    };
    setwmiIsModalOpen(false);
    try {
      await axios
        .post(baseUrl + "/addMonitoringCredentials ", wmiData)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data.Response, "error");
            setLoading(false);
          } else {
            openSweetAlert("WMI Added Successfully", "success");
            setUsernamewmi("");
            setPasswordwmi("");

            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getDevCredentials")
                .then((response) => {
                  setcred(response.data);
                  setCred_group(response.data[0]);
                })
                .catch((error) => {
                  console.log(error);
                })
            );
            setLoading(false);
            return Promise.all(promises);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitv3 = async (e) => {
    e.preventDefault();
    const v3Data = {
      profile_name: profileNamev3,
      description: descriptionv3,
      port: portv3,
      username: usernamev3,
      authentication_password: authorizationPasswordv3,
      authentication_protocol: authorizationProtocolv3,
      encryption_password: encryptionPasswordv3,
      encryption_protocol: encryptionProtocolv3,
      category: "v3",
    };
    setv3IsModalOpen(false);
    try {
      await axios
        .post(baseUrl + "/addMonitoringCredentials ", v3Data)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data.Response, "error");
            setLoading(false);
          } else {
            openSweetAlert("v3 Added Successfully", "success");
            setProfileNamev3("");
            setDescriptionv3("");
            setPortv3("");
            setUsernamev3("");
            setaAuthorizationPasswordv3("");
            setEncryptionPasswordv3("");

            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getDevCredentials")
                .then((response) => {
                  setcred(response.data);
                  setCred_group(response.data[0]);
                })
                .catch((error) => {
                  console.log(error);
                })
            );
            setLoading(false);
            return Promise.all(promises);
          }
        });
    } catch (err) {
      console.log(err);
    }
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    columnWidth: 140,

    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: configData?.monitering.pages.device.read_only,
    }),
  };

  const edit = (record) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
  };

  const columns = [
    {
      title: "",
      key: "edit",
      width: "2%",

      render: (text, record) => (
        <>
          {configData?.monitering.pages.device.read_only ? (
            <>
              <a disabled>
                <EditOutlined
                  style={{ paddingRight: "50px", color: "#66A111" }}
                />
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
      render: (text, record) => (
        <p
          onClick={async () => {
            const res = await axios.post(
              baseUrl + "/getMonitoringDevicesCards ",
              { ip_address: text }
            );

            navigate("/monitoringsummary/main", {
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
      title: "Ping Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <div>
          {text === "Up" ? (
            <>
              <img src={active} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}

          {text === "Down" ? (
            <>
              <img src={inactive} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}
          {text === "NA" ? (
            <>
              <img src={na} alt="" /> &nbsp;
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}
        </div>
      ),

      ...getColumnSearchProps(
        "status",
        "Ping Status",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Monitoring Status",
      dataIndex: "active",
      key: "active",
      render: (text, record) => (
        <div>
          {text === "Active" ? (
            <>
              <img src={activeS} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}

          {text === "Inactive" ? (
            <>
              <img src={inactiveS} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}
        </div>
      ),

      ...getColumnSearchProps(
        "active",
        "Monitoring Status",
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
      title: "Device Type",
      dataIndex: "device_type",
      key: "device_type",
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
      title: "Source",
      dataIndex: "source",
      key: "source",
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
      title: "Credentials",
      dataIndex: "credentials",
      key: "credentials",
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
        "credentials",
        "Credentials",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  let seedTemp = [
    {
      ip_address: "",
      device_name: "",
      device_type: "",
      vendor: "",
      active: "",
      function: "",
      credentials: "",
    },
  ];

  const openNotification = () => {
    notification.open({
      message: "File Exported Successfully",
      onClick: () => {},
    });
  };

  const exportTemplate = () => {
    templeteExportFile(seedTemp);
  };

  const templeteExportFile = (atomData) => {
    let wb = XLSX.utils.book_new();
    let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
    XLSX.utils.book_append_sheet(wb, binaryAtomData, "monitoring_devices");
    XLSX.writeFile(wb, "monitoring_devices.xlsx");
    openNotification();
  };

  const handleReScan = async (record) => {
    const scanData = [
      {
        subnet_address: record.subnet_address,
        subnet_name: record.subnet_name,
        subnet_mask: record.subnet_mask,
        location: record.location,
      },
    ];
    try {
      await axios
        .post(baseUrl + "/addMonitoringDevice ", scanData)
        .then((response) => {
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllMonitoringDevices")
              .then((response) => {
                excelData = response.data;
                setDataSource(response.data);
                setRowCount(response.data.length);
              })
              .catch((error) => {
                console.log(error);
              })
          );
          return Promise.all(promises);
        })
        .catch((error) => {
          console.log("in add seed device catch ==> " + error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const atomColumns = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
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

      ...deviceGetColumnSearchProps(
        "ip_address",
        "IP Address",
        setDeviceRowCount,
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

      ...deviceGetColumnSearchProps(
        "device_type",
        "Device Type",
        setDeviceRowCount,
        setDataSourceOfDevice,
        deviceExcelData,
        DeviceColumnFilters
      ),
      ellipsis: true,
    },
  ];

  const autoDiscoveryColumns = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
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

      ...getColumnSearchPropsAutoDiscovery(
        "ip_address",
        "IP Address",
        setAutoDiscovery,
        autoDiscoveryExcelData,
        autoDiscoveryColumnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Ping Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <p
          style={{
            textAlign: "center",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchPropsAutoDiscovery(
        "status",
        "Ping Status",
        setAutoDiscovery,
        autoDiscoveryExcelData,
        autoDiscoveryColumnFilters
      ),
      ellipsis: true,
    },
  ];

  const monitoringDeviceType = devices.filter((device) =>
    device.module.includes("monitoring")
  );

  const monitoringVendors = vendors.filter((vendor) =>
    vendor.module.includes("monitoring")
  );

  const monitoringFunctions = functions.filter((montiFunction) =>
    montiFunction.module.includes("monitoring")
  );

  const jsonToExcel = (monitoringData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryMonitoringData = XLSX.utils.json_to_sheet(monitoringData);
      XLSX.utils.book_append_sheet(
        wb,
        binaryMonitoringData,
        "Monitoring_Devices"
      );
      XLSX.writeFile(wb, "Monitoring_Devices.xlsx");
    }
  };

  const exportSeed = async () => {
    if (excelData.length > 0) {
      jsonToExcel(dataSource);
      openNotification();
    } else {
      openSweetAlert("No Data Found!", "info");
    }
  };

  return (
    <SpinLoading spinning={addLoading} tip="Loading...">
      <MainDivStyle>
        <Row style={{ width: "100%" }}>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                marginRight: "5px",

                height: "100%",
                marginRight: "10px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #6C6B75",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "left",
                  textAlign: "left",
                  paddingTop: "8px",
                  fontWeight: "bold",
                }}
              >
                Vendors
              </h3>
              <BarChartMain
                rowCount={rowCount}
                setVendorValue={setVendorValue}
                vendorVal={vendorVal}
              />
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                marginRight: "5px",
                height: "100%",
                marginRight: "10px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                textAlign: "left",
                marginBottom: "5px",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #6C6B75",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "left",
                  paddingTop: "8px",
                  fontWeight: "bold",
                }}
              >
                Functions
              </h3>
              <FunctionBarChartMain
                rowCount={rowCount}
                setHandlebarClick={setHandlebarClick}
                funcVal={funcVal}
              />
            </div>
          </Col>
        </Row>
        <br />
        <div
          style={{
            float: "right",
            marginRight: "27px",
          }}
        >
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

          {configData?.monitering.pages.device.read_only ? (
            <AddButtonStyle
              disabled
              style={{
                backgroundColor: "#66b127",
                border: "1px solid #66b127",
                color: "#fff",
                cursor: "no-drop",
              }}
            >
              + Add Device
            </AddButtonStyle>
          ) : (
            <AddButtonStyle onClick={showMainModal}>
              + Add Device
            </AddButtonStyle>
          )}
        </div>
        <br />

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
              <MainTableMainDiv>
                <MainTableMainP
                  active={"Add Device" === tableName}
                  onClick={() => showTable("Add Device")}
                >
                  <img src={addnew} alt="" width="25px" height="25px" /> Add
                  Device
                </MainTableMainP>
                &nbsp;&nbsp;
                <MainTableMainP
                  active={"Add From Atom" === tableName}
                  onClick={() => showTable("Add From Atom")}
                >
                  <img src={addatom} alt="" width="25px" height="25px" /> Add
                  From Atom
                </MainTableMainP>
                &nbsp;&nbsp;
              </MainTableMainDiv>
              {tableName === "Add Device" ? (
                <>
                  <SpinLoading spinning={loading}>
                    <div
                      style={{
                        height: "430px",
                        paddingTop: "20px",
                        backgroundColor: "rgba(251, 251, 251, 0.75)",
                      }}
                    >
                      <div
                        style={{ textAlign: "center", marginBottom: "25px" }}
                      >
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
                                    <span
                                      style={{ color: "red", float: "left" }}
                                    >
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
                                          }}
                                          required
                                          onChange={(e) =>
                                            setDeviceType(e.target.value)
                                          }
                                        >
                                          <option value="">
                                            Select Device Type
                                          </option>
                                          {monitoringDeviceType.map(
                                            (device, index) => (
                                              <option
                                                key={index}
                                                value={device.name}
                                              >
                                                {device.name}
                                              </option>
                                            )
                                          )}
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
                                      Active
                                    </label>
                                    <span
                                      style={{ color: "red", float: "left" }}
                                    >
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
                                        <option value="Inactive">
                                          InActive
                                        </option>
                                      </StyledselectIpam>
                                    </div>
                                  </div>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={11}>
                                  <div>
                                    <label style={{ float: "left" }}>
                                      Vendor
                                    </label>
                                    &nbsp;
                                    <span
                                      style={{ color: "red", float: "left" }}
                                    >
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
                                          }}
                                          required
                                          onChange={(e) =>
                                            setVendor(e.target.value)
                                          }
                                        >
                                          <option>Select Vendors</option>
                                          {monitoringVendors.map(
                                            (vendor, index) => (
                                              <option
                                                key={index}
                                                value={vendor.name}
                                              >
                                                {vendor.name}
                                              </option>
                                            )
                                          )}
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
                                  <label style={{ float: "left" }}>
                                    Function
                                  </label>
                                  &nbsp;
                                  <span style={{ color: "red", float: "left" }}>
                                    *
                                  </span>
                                  &nbsp;&nbsp;
                                  {myFunction === "Other" ? (
                                    <StyledInputForm
                                      style={{
                                        marginTop: "3px",
                                        width: "100%",
                                        height: "2rem",
                                        border: "0.3px solid rgba(0,0,0,0.2)",
                                        paddingLeft: "8px",
                                      }}
                                      required
                                      value={myFunctionOther}
                                      onChange={(e) =>
                                        setFunctionOther(e.target.value)
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
                                        }}
                                        required
                                        onChange={(e) =>
                                          setFunction(e.target.value)
                                        }
                                      >
                                        <option value="">
                                          Select Function
                                        </option>
                                        {monitoringFunctions.map(
                                          (montiFunction, index) => {
                                            return (
                                              <option
                                                value={montiFunction.name}
                                                key={index}
                                              >
                                                {montiFunction.name}
                                              </option>
                                            );
                                          }
                                        )}
                                      </StyledselectIpam>
                                    </div>
                                  )}
                                </Col>
                                <Col span={2}></Col>
                                <Col span={11}>
                                  <div>
                                    <label style={{ float: "left" }}>
                                      Device Name
                                    </label>
                                    <span
                                      style={{ color: "red", float: "left" }}
                                    >
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
                              </Row>
                              <Row
                                style={{
                                  textAlign: "center",
                                  marginTop: "25px",
                                }}
                              >
                                <Col span={11}>
                                  <label style={{ float: "left" }}>
                                    Credentials
                                  </label>
                                  <span style={{ color: "red", float: "left" }}>
                                    *
                                  </span>
                                  &nbsp;&nbsp;
                                  <div className="select_t">
                                    <StyledselectIpam
                                      placeholder="Select Cre"
                                      style={{
                                        width: "100%",
                                        height: "2rem",
                                        border: "1px solid #cfcfcf",
                                        borderRadius: "3px",
                                      }}
                                      required
                                      value={cred_group}
                                      onChange={(e) => {
                                        setCred_group(e.target.value);
                                      }}
                                    >
                                      <option value="">
                                        Select Credentials
                                      </option>
                                      {cred?.map((item, index) => {
                                        return (
                                          <option key={index} value={item}>
                                            {item}
                                          </option>
                                        );
                                      })}
                                    </StyledselectIpam>

                                    <p
                                      onClick={showModalCredential}
                                      style={{
                                        float: "right",
                                        marginTop: "8px",
                                        color: "#6AB344",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                      }}
                                    >
                                      + Add credentials
                                    </p>
                                    <Modal
                                      title="Add credentials"
                                      open={credentialIsModalOpen}
                                      onOk={handleOkCredential}
                                      onCancel={handleCancelCredential}
                                      footer={false}
                                    >
                                      <Row>
                                        <Col span={11}>
                                          <button
                                            style={{
                                              width: "100%",
                                              height: "50px",
                                              cursor: "pointer",
                                            }}
                                            onClick={showModalv1v2}
                                            className="button-3"
                                            role="button"
                                          >
                                            V1/V2
                                          </button>

                                          <Modal
                                            open={v1v2isModalOpen}
                                            footer={false}
                                            closable={false}
                                          >
                                            <form
                                              onSubmit={handleSubmit}
                                              style={{
                                                textAlign: "center",
                                                padding: "15px",
                                                backgroundColor:
                                                  "rgba(238, 235, 235, 0.7)",
                                              }}
                                            >
                                              <Row
                                                style={{
                                                  alignContent: "center",
                                                }}
                                              >
                                                <Col span={24} style={{}}>
                                                  <p
                                                    style={{
                                                      fontSize: "22px",
                                                      float: "left",
                                                      display: "flex",
                                                    }}
                                                  >
                                                    Add V1/V2
                                                  </p>
                                                  <div
                                                    style={{
                                                      float: "right",
                                                      display: "flex",
                                                    }}
                                                  >
                                                    {profileName !== "" &&
                                                    community !== "" &&
                                                    description !== "" &&
                                                    port !== "" ? (
                                                      <button
                                                        onClick={handleSubmit}
                                                        style={{
                                                          float: "right",
                                                          width: "120px",
                                                          marginTop: "10px",
                                                          background:
                                                            "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                                                          border: "0px",
                                                          height: "30px",
                                                          borderRadius: "8px",
                                                        }}
                                                        type="submit"
                                                      >
                                                        Done
                                                      </button>
                                                    ) : (
                                                      <button
                                                        disabled={true}
                                                        style={{
                                                          float: "right",
                                                          width: "120px",
                                                          marginTop: "10px",
                                                          background:
                                                            "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                                                          border: "0px",
                                                          height: "30px",
                                                          borderRadius: "8px",
                                                          cursor: "no-drop",
                                                        }}
                                                      >
                                                        Done
                                                      </button>
                                                    )}

                                                    <StyledButton
                                                      style={{
                                                        float: "right",
                                                        marginTop: "10px",
                                                        width: "120px",
                                                        marginLeft: "10px",
                                                        marginRight: "10px",
                                                        height: "30px",
                                                        borderRadius: "8px",
                                                      }}
                                                      color={"#BBBABA"}
                                                      onClick={handleCancelv1v2}
                                                    >
                                                      Cancel
                                                    </StyledButton>
                                                  </div>
                                                </Col>
                                                <Col
                                                  span={10}
                                                  style={{ marginLeft: "6%" }}
                                                >
                                                  <InputWrapper>
                                                    Profile Name: &nbsp;&nbsp;
                                                    <StyledInput
                                                      value={profileName}
                                                      onChange={(e) =>
                                                        setProfileName(
                                                          e.target.value.replace(
                                                            /[^\w\s]/gi,
                                                            ""
                                                          )
                                                        )
                                                      }
                                                    />
                                                  </InputWrapper>
                                                  <InputWrapper>
                                                    Description: &nbsp;&nbsp;
                                                    <StyledInput
                                                      value={description}
                                                      onChange={(e) =>
                                                        setDescription(
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                  </InputWrapper>
                                                </Col>
                                                <Col
                                                  span={10}
                                                  style={{ marginLeft: "6%" }}
                                                >
                                                  <InputWrapper>
                                                    Community: &nbsp;&nbsp;
                                                    <StyledInput
                                                      value={community}
                                                      onChange={(e) =>
                                                        setCommunity(
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                  </InputWrapper>
                                                  <InputWrapper>
                                                    Port: &nbsp;&nbsp;
                                                    <StyledInput
                                                      value={port}
                                                      onChange={(e) =>
                                                        setPort(e.target.value)
                                                      }
                                                    />
                                                  </InputWrapper>
                                                </Col>
                                              </Row>
                                              &nbsp; &nbsp;
                                            </form>
                                          </Modal>
                                        </Col>
                                        <Col span={2}></Col>
                                        <Col span={11}>
                                          <button
                                            style={{
                                              width: "100%",
                                              height: "50px",
                                              cursor: "pointer",
                                            }}
                                            onClick={showModalv3}
                                            className="button-3"
                                            role="button"
                                          >
                                            V3
                                          </button>
                                          <Modal
                                            open={v3isModalOpen}
                                            closable={false}
                                            footer={false}
                                          >
                                            <form
                                              onSubmit={handleSubmitv3}
                                              style={{
                                                textAlign: "center",
                                                padding: "15px",
                                                backgroundColor:
                                                  "rgba(238, 235, 235, 0.7)",
                                              }}
                                            >
                                              <Row
                                                style={{
                                                  alignContent: "center",
                                                }}
                                              >
                                                <Col span={24} style={{}}>
                                                  <p
                                                    style={{
                                                      fontSize: "22px",
                                                      float: "left",
                                                      display: "flex",
                                                    }}
                                                  >
                                                    Add V3
                                                  </p>
                                                  <div
                                                    style={{
                                                      float: "right",
                                                      display: "flex",
                                                    }}
                                                  >
                                                    {profileNamev3 !== "" &&
                                                    descriptionv3 !== "" &&
                                                    usernamev3 !== "" &&
                                                    portv3 !== "" &&
                                                    authorizationPasswordv3 !==
                                                      "" &&
                                                    authorizationProtocolv3 !==
                                                      "" &&
                                                    encryptionPasswordv3 !==
                                                      "" &&
                                                    encryptionProtocolv3 !==
                                                      "" ? (
                                                      <button
                                                        onClick={handleSubmitv3}
                                                        style={{
                                                          float: "right",
                                                          width: "120px",
                                                          marginTop: "10px",
                                                          background:
                                                            "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                                                          border: "0px",
                                                          height: "30px",
                                                          borderRadius: "8px",
                                                        }}
                                                        type="submit"
                                                      >
                                                        Done
                                                      </button>
                                                    ) : (
                                                      <button
                                                        disabled={true}
                                                        style={{
                                                          float: "right",
                                                          width: "120px",
                                                          marginTop: "10px",
                                                          background:
                                                            "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                                                          border: "0px",
                                                          height: "30px",
                                                          borderRadius: "8px",
                                                          cursor: "no-drop",
                                                        }}
                                                      >
                                                        Done
                                                      </button>
                                                    )}
                                                    <StyledButton
                                                      style={{
                                                        float: "right",
                                                        marginTop: "10px",
                                                        width: "120px",
                                                        marginLeft: "10px",
                                                        marginRight: "10px",
                                                        height: "30px",
                                                        borderRadius: "8px",
                                                      }}
                                                      color={"#BBBABA"}
                                                      onClick={handleCancelv3}
                                                    >
                                                      Cancel
                                                    </StyledButton>
                                                  </div>
                                                </Col>
                                                <Col
                                                  span={10}
                                                  style={{ marginLeft: "6%" }}
                                                >
                                                  <InputWrapper>
                                                    Profile Name: &nbsp;&nbsp;
                                                    <StyledInput
                                                      value={profileNamev3}
                                                      onChange={(e) =>
                                                        setProfileNamev3(
                                                          e.target.value.replace(
                                                            /[^\w\s]/gi,
                                                            ""
                                                          )
                                                        )
                                                      }
                                                    />
                                                  </InputWrapper>
                                                  <InputWrapper>
                                                    Description: &nbsp;&nbsp;
                                                    <StyledInput
                                                      value={descriptionv3}
                                                      onChange={(e) =>
                                                        setDescriptionv3(
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                  </InputWrapper>
                                                </Col>
                                                <Col
                                                  span={10}
                                                  style={{ marginLeft: "6%" }}
                                                >
                                                  <InputWrapper>
                                                    Username: &nbsp;&nbsp;
                                                    <StyledInput
                                                      value={usernamev3}
                                                      onChange={(e) =>
                                                        setUsernamev3(
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                  </InputWrapper>
                                                  <InputWrapper>
                                                    Port: &nbsp;&nbsp;
                                                    <StyledInput
                                                      value={portv3}
                                                      onChange={(e) =>
                                                        setPortv3(
                                                          e.target.value
                                                        )
                                                      }
                                                      // required
                                                    />
                                                  </InputWrapper>
                                                </Col>
                                                <Col
                                                  span={10}
                                                  style={{ marginLeft: "6%" }}
                                                >
                                                  <InputWrapper>
                                                    Authorization Protocol:
                                                    {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                                                    &nbsp;&nbsp;
                                                    <div className="select_type">
                                                      <Styledselect
                                                        className="rectangle"
                                                        required
                                                        placeholder="select"
                                                        value={
                                                          authorizationProtocolv3
                                                        }
                                                        onChange={(e) =>
                                                          setaAuthorizationProtocolv3(
                                                            e.target.value
                                                          )
                                                        }
                                                      >
                                                        <option>MD5</option>
                                                        <option>SHA</option>
                                                        <option>SHA-256</option>
                                                        <option>SHA-512</option>
                                                      </Styledselect>
                                                    </div>
                                                  </InputWrapper>
                                                  <InputWrapper>
                                                    Authorization Password:
                                                    &nbsp;&nbsp;
                                                    <StyledInput
                                                      value={
                                                        authorizationPasswordv3
                                                      }
                                                      onChange={(e) =>
                                                        setaAuthorizationPasswordv3(
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                  </InputWrapper>
                                                </Col>
                                                <Col
                                                  span={10}
                                                  style={{ marginLeft: "6%" }}
                                                >
                                                  <InputWrapper>
                                                    Encryption Protocol:
                                                    &nbsp;&nbsp;
                                                    <div className="select_type">
                                                      <Styledselect
                                                        className="rectangle"
                                                        required
                                                        placeholder="select"
                                                        value={
                                                          encryptionProtocolv3
                                                        }
                                                        onChange={(e) =>
                                                          setEncryptionProtocolv3(
                                                            e.target.value
                                                          )
                                                        }
                                                      >
                                                        <option>DES</option>
                                                        <option>AES-128</option>
                                                        <option>AES-192</option>
                                                        <option>AES-256</option>
                                                      </Styledselect>
                                                    </div>
                                                  </InputWrapper>
                                                  <InputWrapper>
                                                    Encryption Password:
                                                    &nbsp;&nbsp;
                                                    <StyledInput
                                                      value={
                                                        encryptionPasswordv3
                                                      }
                                                      onChange={(e) =>
                                                        setEncryptionPasswordv3(
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                  </InputWrapper>
                                                </Col>
                                              </Row>
                                              &nbsp; &nbsp;
                                            </form>
                                          </Modal>
                                        </Col>
                                      </Row>
                                      <Row style={{ marginTop: "10px" }}>
                                        <Col span={11}>
                                          <button
                                            style={{
                                              width: "100%",
                                              height: "50px",
                                              cursor: "pointer",
                                            }}
                                            onClick={showModalwmi}
                                            className="button-3"
                                            role="button"
                                          >
                                            WMI
                                          </button>
                                          <Modal
                                            open={wmiIsModalOpen}
                                            footer={false}
                                            closable={false}
                                          >
                                            <form
                                              onSubmit={handleSubmitWmc}
                                              style={{
                                                textAlign: "center",
                                                padding: "15px",
                                                backgroundColor:
                                                  "rgba(238, 235, 235, 0.7)",
                                              }}
                                            >
                                              <Row
                                                style={{
                                                  alignContent: "center",
                                                }}
                                              >
                                                <Col span={24} style={{}}>
                                                  <p
                                                    style={{
                                                      fontSize: "22px",
                                                      float: "left",
                                                      display: "flex",
                                                    }}
                                                  >
                                                    Add WMI
                                                  </p>
                                                  <div
                                                    style={{
                                                      float: "right",
                                                      display: "flex",
                                                    }}
                                                  >
                                                    {usernamewmi !== "" &&
                                                    passwordwmi !== "" ? (
                                                      <button
                                                        onClick={
                                                          handleSubmitWmc
                                                        }
                                                        style={{
                                                          float: "right",
                                                          width: "120px",
                                                          marginTop: "10px",
                                                          background:
                                                            "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                                                          border: "0px",
                                                          height: "30px",
                                                          borderRadius: "8px",
                                                        }}
                                                        type="submit"
                                                      >
                                                        Done
                                                      </button>
                                                    ) : (
                                                      <button
                                                        disabled={true}
                                                        style={{
                                                          float: "right",
                                                          width: "120px",
                                                          marginTop: "10px",
                                                          background:
                                                            "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                                                          border: "0px",
                                                          height: "30px",
                                                          borderRadius: "8px",
                                                          cursor: "no-drop",
                                                        }}
                                                      >
                                                        Done
                                                      </button>
                                                    )}

                                                    <StyledButton
                                                      style={{
                                                        float: "right",
                                                        marginTop: "10px",
                                                        width: "120px",
                                                        marginLeft: "10px",
                                                        marginRight: "10px",
                                                        height: "30px",
                                                        borderRadius: "8px",
                                                      }}
                                                      color={"#BBBABA"}
                                                      onClick={handleCancelwmi}
                                                    >
                                                      Cancel
                                                    </StyledButton>
                                                  </div>
                                                </Col>
                                                <Col
                                                  span={10}
                                                  style={{ marginLeft: "6%" }}
                                                >
                                                  <InputWrapper>
                                                    Username: &nbsp;&nbsp;
                                                    <StyledInput
                                                      value={usernamewmi}
                                                      onChange={(e) =>
                                                        setUsernamewmi(
                                                          e.target.value.replace(
                                                            /[^\w\s]/gi,
                                                            ""
                                                          )
                                                        )
                                                      }
                                                    />
                                                  </InputWrapper>
                                                  <InputWrapper>
                                                    Password: &nbsp;&nbsp;
                                                    <StyledInput
                                                      value={passwordwmi}
                                                      onChange={(e) =>
                                                        setPasswordwmi(
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                  </InputWrapper>
                                                </Col>
                                                <Col span={1}></Col>
                                                <Col span={11}>
                                                  <InputWrapper>
                                                    Profile Name: &nbsp;&nbsp;
                                                    <StyledInput
                                                      value={profileNamewmi}
                                                      onChange={(e) =>
                                                        setProfileNamewmi(
                                                          e.target.value.replace(
                                                            /[^\w\s]/gi,
                                                            ""
                                                          )
                                                        )
                                                      }
                                                    />
                                                  </InputWrapper>
                                                </Col>
                                              </Row>
                                              &nbsp; &nbsp;
                                            </form>
                                          </Modal>
                                        </Col>
                                      </Row>
                                    </Modal>
                                  </div>
                                </Col>
                                <Col span={2}></Col>
                                <Col span={11}></Col>
                              </Row>

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
                                      Add
                                    </button>
                                  </div>
                                </Col>
                              </Row>
                            </form>
                          </div>
                        </div>
                      ) : null}
                      {value === 2 ? (
                        <SpinLoading spinning={importLoading} tip="Loading...">
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
                        </SpinLoading>
                      ) : null}
                    </div>
                  </SpinLoading>
                </>
              ) : null}
              {tableName === "Add From Atom" ? (
                <SpinLoading spinning={ipamDeviceLoading}>
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
                        marginRight: "100px",
                        marginLeft: "100px",
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
              {tableName === "Auto Discovery" ? (
                <SpinLoading spinning={ipamDeviceLoading}>
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
                        marginRight: "100px",
                        marginLeft: "100px",
                        marginTop: "-60px",
                      }}
                    >
                      <TableStyling
                        pagination={{ pageSize: 4 }}
                        rowKey="ip_address"
                        columns={autoDiscoveryColumns}
                        dataSource={autoDiscovery}
                      />
                      <button
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
                        Scan
                      </button>
                    </div>
                  </div>
                </SpinLoading>
              ) : null}
            </div>
          </div>
        </MainTableModal>

        <div>
          <div style={{ display: "flex", marginTop: "50px" }}>
            {selectedRowKeys.length > 0 ? (
              <DeleteButton onClick={deleteRow}>
                <img src={trash} width="18px" height="18px" alt="" />
                &nbsp;Delete
              </DeleteButton>
            ) : null}
            &nbsp;
            <ReScanButton style={{ display: "none" }} onClick={handleReScan}>
              Scan
            </ReScanButton>
            &nbsp; &nbsp;
            <div style={{ display: "flex", marginTop: "3px" }}>
              <h4>Rows :</h4>&nbsp;
              <ColRowNumberStyle> {rowCount}</ColRowNumberStyle>
              &nbsp;&nbsp;
              <h4>Cols :</h4>&nbsp;
              <ColRowNumberStyle> 9</ColRowNumberStyle>
            </div>
          </div>
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

          <SpinLoading spinning={mainTableloading}>
            {tableReload ? (
              <div style={{ padding: "25px" }}>
                <TableStyling
                  rowSelection={rowSelection}
                  scroll={{ x: 2000 }}
                  pagination={{ pageSize: 10 }}
                  rowKey="ip_address"
                  columns={columns}
                  dataSource={dataSource}
                />
              </div>
            ) : (
              <div style={{ padding: "25px" }}>
                <TableStyling
                  rowSelection={rowSelection}
                  scroll={{ x: 2000 }}
                  pagination={{ pageSize: 10 }}
                  rowKey="ip_address"
                  columns={columns}
                  dataSource={dataSource}
                />
              </div>
            )}
          </SpinLoading>
        </div>
      </MainDivStyle>
    </SpinLoading>
  );
};

const StyledInput = styled(Input)`
  height: 2.2rem;
  border-radius: 12px;
  border: none !important;
  box-shadow: none !important;
  overflow: hidden;
  &:focus {
    border: 1px solid #6ab344 !important;
  }
`;
const Styledselect = styled.select`
  height: 2.2rem;
  border-radius: 12px;
  width: 100%;
  padding-left: 7px;
  padding-right: 7px;
  outline: none;
  border: 0.1px solid #cfcfcf;

  .ant-select-selection:hover {
    background-color: transparent;
  }

  .ant-select-dropdown-menu-item-active:not(
      .ant-select-dropdown-menu-item-disabled
    ),
  .ant-select-dropdown-menu-item:hover:not(
      .ant-select-dropdown-menu-item-disabled
    ) {
    background-color: #e5f2ff;
  }
`;

const StyledButton = styled(Button)`
  font-size: 15px;

  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: ${(props) => props.color};
  border-color: ${(props) => props.color};
  color: white;
  border-radius: 5px;
  &:focus,
  &:hover {
    background-color: ${(props) => props.color};
    border-color: ${(props) => props.color};
    color: white;
    opacity: 0.8;
  }
`;

export default index;
