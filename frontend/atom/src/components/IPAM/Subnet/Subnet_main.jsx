import React, { useState, useEffect, useRef } from "react";
// import { Button, Row, Col, Input } from "antd";
import Swal from "sweetalert2";
import addatom from "../assets/addatom.svg";
import adddevice from "../assets/adddevice.svg";
import addnew from "../assets/addnew.svg";
import Scanned from "../assets/Scanned.svg";
import Scanner from "../assets/scanner.svg";
import trash from "../assets/trash.svg";
import empty from "../assets/empty.svg";
import axios, { baseUrl } from "../../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import EditModal from "./EditSubnet";
import ButtonCell from "./ScanButton.jsx";

import {
  Modal,
  Radio,
  Row,
  Col,
  Checkbox,
  Table,
  notification,
  Spin,
  Progress,
  Button,
  Input,
  Dropdown,
  Menu,
  message,
  Space,
  Tooltip,
} from "antd";

import * as XLSX from "xlsx";
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
  DownOutlined,
  SmileOutlined,
  AlipayOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  TableStyling,
  StyledExportButton,
  SpinLoading,
  MainTableModal,
  MainTableMainP,
  MainTableMainDiv,
  StyledSubmitButton,
  MainTableDropDown,
  MainTableColP,
  StyledselectIpam,
  StyledImportFileInput,
  InputWrapper,
  StyledInputForm,
  DeleteButton,
  ReScanButton,
  ColRowNumberStyle,
  MainDivStyle,
  AddButtonStyle,
} from "../../AllStyling/All.styled.js";

import exportExcel from "../../Atom/assets/export.svg";

import { columnSearch } from "../../../utils";
// import { Row, Col, Checkbox, Table, notification, Spin, Progress } from "antd";
let excelData = [];
let columnFilters = {};
let deviceExcelData = [];
let DeviceColumnFilters = {};

let popupExcelData = [];
let popupColumnFilters = {};

const index = () => {
  const navigate = useNavigate();
  // const [toggle, setToggle] = useState(true);
  let [dataSource, setDataSource] = useState(excelData);
  let [popupDataSource, setPopupDataSource] = useState(popupExcelData);
  let [SubnetDataSource, setSubnetDataSource] = useState([]);
  let [dataSourceOfDevice, setDataSourceOfDevice] = useState(deviceExcelData);

  const [value, setValue] = useState(1);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [popupLoading, setPopupLoading] = useState(false);
  const [allPopupData, setAllPopupData] = useState("");
  const [statusLoading, setStatusLoading] = useState(true);
  const [pending, setPending] = useState(false);

  const [mainModalVisible, setMainModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ipamDeviceLoading, setIpamDeviceLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [popupSearchText, setPopupSearchText] = useState(null);
  const [popupSearchedColumn, setPopupSearchedColumn] = useState(null);

  const [mainTableloading, setMainTableLoading] = useState(false);
  const [rescanLoading, setRescanLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [mainLoading, setMainLoading] = useState(false);
  const [deviceSelectedRowKeys, setDeviceSelectedRowKeys] = useState([]);
  const [deviceSearchText, setDeviceSearchText] = useState(null);
  const [deviceSearchedColumn, setDeviceSearchedColumn] = useState(null);
  let [exportLoading, setExportLoading] = useState(false);

  const [subnet, setSubnet] = useState("");
  const [subnetMask, setSubnetMask] = useState("");
  const [subnetName, setSubnetName] = useState("");
  const [location, setLocation] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [popupRowCount, setPopupRowCount] = useState(0);
  const [deviceowCount, setDeviceRowCount] = useState(0);
  let [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const onValueChange = (e) => {
    setValue(e.target.value);
  };
  const [configData, setConfigData] = useState(null);

  const [portScan, setPortScan] = useState("");
  const [dns_Scan, setDnsScan] = useState("");
  const [scanData, setScanData] = useState([]);

  // const onChangeDNS = (checkedValues) => {
  //   console.log("checked = ", checkedValues.target.value);
  //   setDnsScan(checkedValues);
  // };
  const onChangeScan = (checkedValues) => {
    setScanData(checkedValues);
  };
  const onClick = ({ key }) => {
    // message.info(`Click on item ${key}`);
  };
  const menu = (
    <Menu
      onClick={onClick}
      items={[
        {
          label: (
            <Checkbox.Group
              style={{
                width: "100%",
              }}
              onChange={onChangeScan}
            >
              <Checkbox value="Port Scan" style={{ padding: "10px" }}>
                Port Scan
              </Checkbox>
              <br />
              <Checkbox value="DNS Scan" style={{ padding: "10px" }}>
                DNS Scan
              </Checkbox>
            </Checkbox.Group>
          ),
          key: "1",
        },
      ]}
    />
  );
  const [singleSubnet, setSingleSubnet] = useState([]);
  // const [singleSubnet, setSingleSubnet] = useState("");

  const handleClick = async () => {
    // message.info("Click on left button.");

    const ScanData = {
      options: scanData,
      subnets: selectedRowKeys,
    };

    // setSingleSubnet(selectedSubnetAddress);
    try {
      await axios.post(baseUrl + "/scanSubnets", ScanData);
      // openSweetAlert(`File Imported Successfully`, "success");
    } catch (err) {
      // setLoading(false);

      console.log(err);
    }
  };
  // useEffect(() => {
  //   console.log(singleSubnet);
  // }, [singleSubnet]);

  const handleButtonClick = async () =>
    // e
    // selectedSubnetAddress
    {
      // e.preventDefault();
      setPending(true);
      // message.info("Click on left button.");
      // console.log(typeof singleSubnet, singleSubnet);
      setStatusLoading(true);
      const ScanData = {
        options: scanData,
        subnets: selectedRowKeys,
      };

      // console.log(typeof singleSubnet, singleSubnet);
      // console.log("ScanDataScanDataScanDataScanDataScanData", singleSubnet);
      // singleSubnet.push(selectedSubnetAddress);
      // setSingleSubnet(selectedSubnetAddress);

      // singleSubnet.push(selectedSubnetAddress);
      // setSingleSubnet(singleSubnet);
      setSingleSubnet(selectedRowKeys);

      // try {
      //   await axios.post(baseUrl + "/scanSubnets", ScanData);
      //   setStatusLoading(false);

      //   // openSweetAlert(`File Imported Successfully`, "success");
      // } catch (err) {
      //   // setLoading(false);
      //   setStatusLoading(false);

      //   console.log(err);
      // }

      try {
        //console.log(device);
        await axios
          .post(baseUrl + "/scanSubnets", ScanData)
          .then((response) => {
            // setMainModalVisible(false);
            // openSweetAlert(`Device Added Successfully`, "success");
            // setStatusLoading(false);
            // setPending(false);
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllSubnets")
                .then((response) => {
                  setMainModalVisible(false);
                  var data = response.data;
                  var i;
                  for (i = 0; i < data.length; i++) {
                    // data[i].name
                    if (data[i].status === "scanning") {
                      setStatusLoading(true);
                    } else {
                      setStatusLoading(false);
                    }
                  }

                  // setSingleSubnet("");
                  console.log(response.data);
                  setDataSource(response.data);
                  excelData = response.data;
                  setRowCount(response.data.length);
                  excelData = response.data;

                  setPending(false);
                })
                .catch((error) => {
                  console.log(error);
                  setPending(false);

                  //  openSweetAlert("Something Went Wrong!", "error");
                })
            );
            return Promise.all(promises);
          })
          .catch((error) => {
            setPending(false);

            console.log("in add seed device catch ==> " + error);
            // openSweetAlert("Something Went Wrong!", "error");
          });
      } catch (err) {
        setPending(false);

        console.log(err);
      }
    };
  useEffect(() => {
    let user = localStorage.getItem("user");
    let userData = JSON.parse(user);

    const test = userData.monetx_configuration;

    let t = eval(test);
    let config = JSON.parse(t);
    setConfigData(config);
    // let config = localStorage.getItem("monetx_configuration");
    // setConfigData(JSON.parse(config));
    // console.log(JSON.parse(config));
  }, []);
  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );
  let deviceGetColumnSearchProps = columnSearch(
    deviceSearchText,
    setDeviceSearchText,
    deviceSearchedColumn,
    setDeviceSearchedColumn
  );
  let popupGetColumnSearchProps = columnSearch(
    popupSearchText,
    setPopupSearchText,
    popupSearchedColumn,
    setPopupSearchedColumn
  );
  const handleMainOk = () => {
    setMainModalVisible(false);
  };

  const handleMainCancel = () => {
    setMainModalVisible(false);
  };
  const handleOkAllPopup = () => {
    setIsModalOpen(false);
  };

  const handleCancelAllPopup = () => {
    setIsModalOpen(false);
  };
  const showAllDetails = (ipAddress) => {
    setIsModalOpen(true);
    handleAllDataPopup(ipAddress);
  };
  const handleAllDataPopup = async (ipAddress) => {
    try {
      setPopupLoading(true);
      const res = await axios.get(
        `${baseUrl}/getSubnetByIpAddress?ipaddress=${ipAddress}`
      );
      // console.log("ipAddress data", res.data);
      popupExcelData = res.data;
      setPopupDataSource(popupExcelData);
      setPopupRowCount(popupExcelData.length);
      // setPopupDataSource(res.data);

      setPopupLoading(false);
    } catch (err) {
      setPopupLoading(false);
      console.log(err);
    }
  };
  const popup = (record) => {
    setEditRecord(record);
    // setAddRecord(record);
    setIsEditModalVisible(true);
  };

  const popupColumns = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          //   onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            // textDecoration: "underline",
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
            // cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...popupGetColumnSearchProps(
        "ip_address",
        "IP Address",
        setPopupRowCount,
        setPopupDataSource,
        popupExcelData,
        popupColumnFilters
      ),
      ellipsis: true,
    },
    // {
    //   title: "Subnet Address",
    //   dataIndex: "subnet_address",
    //   key: "subnet_address",
    //   render: (text, record) => (
    //     <p
    //       //   onClick={ServernameClicked}
    //       style={{
    //         // color: "#66B127",
    //         // textDecoration: "underline",
    //         textAlign: "center",
    //         paddingTop: "10px",
    //         paddingTop: "10px",
    //         // cursor: "pointer",
    //       }}
    //     >
    //       {text}
    //     </p>
    //   ),

    //   ...popupGetColumnSearchProps(
    //     "subnet",
    //     "Subnet Address",
    //     setPopupRowCount,
    //     setPopupDataSource,
    //     popupExcelData,
    //     popupColumnFilters
    //   ),
    //   ellipsis: true,
    // },
    {
      title: "MAC Address",
      dataIndex: "mac_address",
      key: "mac_address",
      render: (text, record) => (
        <p
          //   onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            // textDecoration: "underline",
            textAlign: "center",
            paddingTop: "10px",
            // paddingTop: "10px",
            // cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...popupGetColumnSearchProps(
        "mac_address",
        "MAC Address",
        setPopupRowCount,
        setPopupDataSource,
        popupExcelData,
        popupColumnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <p
          // onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            // textDecoration: "underline",
            textAlign: "center",
            // paddingTop: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...popupGetColumnSearchProps(
        "status",
        "Status",
        setPopupRowCount,
        setPopupDataSource,
        popupExcelData,
        popupColumnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Last Used",
      dataIndex: "last_used",
      key: "last_used",
      render: (text, record) => (
        <p
          // onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            // textDecoration: "underline",
            textAlign: "center",
            // paddingTop: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...popupGetColumnSearchProps(
        "last_used",
        "Last Used",
        setPopupRowCount,
        setPopupDataSource,
        popupExcelData,
        popupColumnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Asset Tag",
      dataIndex: "asset_tag",
      key: "asset_tag",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...popupGetColumnSearchProps(
        "asset_tag",
        "Asset Tag",
        setPopupRowCount,
        setPopupDataSource,
        popupExcelData,
        popupColumnFilters
      ),
      ellipsis: true,
    },
    // {
    //   title: "Usage",
    //   dataIndex: "usage",
    //   key: "size",
    //   render: (text) => (
    //     <div
    //       style={{
    //         // textAlign: "center",
    //         // marginLeft: "20px",
    //         marginTop: "-10px",
    //         paddingRight: "55px",
    //         paddingleft: "45px",
    //       }}
    //     >
    //       <Progress
    //         strokeColor="#66B127"
    //         percent={text}
    //         size="small"
    //         status="active"
    //       />
    //     </div>
    //   ),

    //   ...getColumnSearchProps(
    //     "usage",
    //     "Usage",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    {
      title: "Configuration Switch",
      dataIndex: "configuration_switch",
      key: "configuration_switch",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...popupGetColumnSearchProps(
        "configuration_switch",
        "Configuration Switch",
        setPopupRowCount,
        setPopupDataSource,
        popupExcelData,
        popupColumnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Configuration Interface",
      dataIndex: "configuration_interface",
      key: "configuration_interface",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...popupGetColumnSearchProps(
        "configuration_interface",
        "Configuration Interface",
        setPopupRowCount,
        setPopupDataSource,
        popupExcelData,
        popupColumnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Open Ports",
      dataIndex: "open_ports",
      key: "open_ports",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      // {/* text === "empty" ? (
      //   <>
      //     <img src={empty} alt="" /> &nbsp;{" "}
      //     <span style={{ textAlign: "center" }}>{text}</span>
      //   </>
      // ) : null}
      // {text === "Scanned" ? (
      //   <>
      //     <img src={Scanned} alt="" /> &nbsp;{" "}
      //     <span style={{ textAlign: "center" }}>{text}</span>
      //   </>
      // ) : null} */}

      ...popupGetColumnSearchProps(
        "open_ports",
        "Open Ports",
        setPopupRowCount,
        setPopupDataSource,
        popupExcelData,
        popupColumnFilters
      ),
      ellipsis: true,
    },

    {
      title: "IP => DNS",
      dataIndex: "ip_to_dns",
      key: "ip_to_dns",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...popupGetColumnSearchProps(
        "ip_to_dns",
        "IP => DNS",
        setPopupRowCount,
        setPopupDataSource,
        popupExcelData,
        popupColumnFilters
      ),
      ellipsis: true,
    },
    {
      title: "DNS => IP",
      dataIndex: "dns_to_ip",
      key: "dns_to_ip",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...popupGetColumnSearchProps(
        "dns_to_ip",
        "DNS => IP",
        setPopupRowCount,
        setPopupDataSource,
        popupExcelData,
        popupColumnFilters
      ),
      ellipsis: true,
    },
  ];
  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllSubnets");
        var data = res.data;
        var loopData = "";
        var i;
        for (i = 0; i < data.length; i++) {
          // data[i].name
          if (data[i].status === "scanning") {
            setStatusLoading(true);
          } else {
            setStatusLoading(false);
          }
        }

        excelData = res.data;
        setDataSource(excelData);
        setRowCount(excelData.length);
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
      // setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getSubnetsFromDevice");

        deviceExcelData = res.data;
        w(deviceExcelData);
        // setRowCount(excelData.length);
        // setMainTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
      }
    };
    serviceCalls();
  }, []);

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
  const [importFromExcel, setImportFromExcel] = useState("");
  const postSeed = async () => {
    // setLoading(true);
    // inputRef.current.addEventListener("input", importExcel);
    try {
      await axios.post(baseUrl + "/addSubnetInSubnet", importFromExcel);
      openSweetAlert(`File Imported Successfully`, "success");
    } catch (err) {
      // setLoading(false);

      console.log(err);
    }
  };
  const handleSubnetAddress = async () => {
    // setLoading(true);
    console.log(deviceSelectedRowKeys);
    // inputRef.current.addEventListener("input", importExcel);
    try {
      const res = await axios.post(
        baseUrl + "/addSubnetFromDevice",
        deviceSelectedRowKeys
      );
      console.log(res);
      setMainModalVisible(false);
      navigate("/ipam/subnet/discovered-subnet");
    } catch (err) {
      // setLoading(false);

      console.log(err);
    }
  };
  const deleteRow = async () => {
    // if (selectedRowKeys.length > 0) {
    if (selectedRowKeys.length > 0) {
      try {
        //console.log(device);
        await axios
          .post(baseUrl + "/deleteSubnet ", selectedRowKeys)
          .then((response) => {
            openSweetAlert(`Subnet Deleted Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllSubnets")
                .then((response) => {
                  var data = response.data;
                  // var i;
                  // for (i = 0; i < data.length; i++) {
                  //   // data[i].name
                  //   if (data[i].status === "scanning") {
                  //     setStatusLoading(true);
                  //   } else {
                  //     setStatusLoading(false);
                  //   }
                  // }
                  excelData = response.data;
                  setDataSource(response.data);
                  setRowCount(response.data.length);

                  setSelectedRowKeys([]);
                  // excelData = response.data;
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);

                  //  openSweetAlert("Something Went Wrong!", "error");
                })
            );
            return Promise.all(promises);
          })
          .catch((error) => {
            setLoading(false);

            // openSweetAlert("Something Went Wrong!", "error");
          });
      } catch (err) {
        setLoading(false);

        console.log(err);
      }
    } else {
      openSweetAlert(`No Device Selected`, "error");
    }
  };
  const importExcel = (e) => {
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
      // const heads = headers.map((head) => ({ title: head, field: head }));
      fileData.splice(0, 1);
      let data = convertToJson(headers, fileData);
      // console.log(excelData);
      setImportFromExcel(data);
      // postSeed(data);
      // setRowCount(data.length);
      // setDataSource(data);
    };
  };
  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };
  // useEffect(() => {
  //   inputRef.current.addEventListener("input", importExcel);
  // }, [inputValue]);
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

    const formData = [
      {
        subnet_address: subnet,
        subnet_mask: subnetMask,
        subnet_name: subnetName,
        location,
      },
    ];

    // setLoading(true);
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/addSubnetInSubnet ", formData)
        .then((response) => {
          // setMainModalVisible(false);
          setSubnet("");
          setSubnetName("");
          setSubnetMask("");
          setLocation("");
          // openSweetAlert(`Device Added Successfully`, "success");
          setLoading(false);
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllSubnets")
              .then((response) => {
                setMainModalVisible(false);
                var data = response.data;
                var i;
                for (i = 0; i < data.length; i++) {
                  // data[i].name
                  if (data[i].status === "scanning") {
                    setStatusLoading(true);
                  } else {
                    setStatusLoading(false);
                  }
                }

                setDataSource(response.data);
                excelData = response.data;
                setRowCount(response.data.length);
                excelData = response.data;

                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
                setLoading(false);

                //  openSweetAlert("Something Went Wrong!", "error");
              })
          );
          return Promise.all(promises);
        })
        .catch((error) => {
          setLoading(false);

          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
  };
  const showMainModal = (ipAddress) => {
    setMainModalVisible(true);
    // showSiteData(ipAddress);
    // showRackData(ipAddress);
    // showDeviceData(ipAddress);
    // showBoardData(ipAddress);
    // showSubBoardData(ipAddress);
    // showSFPData(ipAddress);
    // showLicenseData(ipAddress);
  };

  const [tableName, setTableName] = useState("Add Subnet");
  const showTable = (myDataTable) => {
    if (myDataTable === "Add Subnet") {
      setTableName(myDataTable);
    } else if (myDataTable === "Add From Device") {
      setTableName("Add From Device");
    }
  };

  const onDeviceSelectChange = (deviceSelectedRowKeys) => {
    setDeviceSelectedRowKeys(deviceSelectedRowKeys);
  };

  const DeviceRowSelection = {
    deviceSelectedRowKeys,
    onChange: onDeviceSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: configData?.ipam.pages.subnet.read_only,
    }),
  };

  const SubnetColumns = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
  ];

  const showSubnetData = async (subnet) => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${baseUrl}/getIpAddressesBySubnet?subnet_address=${subnet}`
      );

      setSubnetDataSource(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const handleSubnet = async (subnet_address) => {
    // await axios.post(baseUrl + "/getIpAddressesBySubnet ", subnet_address);
  };

  const showModal = (subnetAddress) => {
    setIsModalOpen(true);
    showSubnetData(subnetAddress);
  };

  const edit = (record) => {
    setEditRecord(record);
    // setAddRecord(record);
    setIsEditModalVisible(true);
  };

  const columns = [
    {
      title: "",
      key: "edit",
      width: "2%",

      render: (text, record) => (
        <>
          {configData?.ipam.pages.subnet.read_only ? (
            <>
              <a
                disabled
                // onClick={() => {
                //   edit(record);
                // }}
              >
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
      title: "Subnet Address",
      dataIndex: "subnet_address",
      key: "subnet_address",
      render: (text, record) => (
        <p
          // onClick={() => showModal(text)}
          // onClick={() => showAllDetails(text)}
          onClick={() => {
            navigate("/ipam/subnet/ip-details", {
              state: {
                subnet: text,
              },
            });
          }}
          // onClick={SubnetClick(text)}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            // textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
            paddingLeft: "15px",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "subnet_address",
        "Subnet Address",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Subnet Name",
      dataIndex: "subnet_name",
      key: "subnet_name",
      render: (text, record) => (
        <p
          //   onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            // textDecoration: "underline",
            // textAlign: "center",
            paddingTop: "10px",
            paddingLeft: "15px",
            // paddingTop: "10px",
            // cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "subnet_name",
        "Subnet Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Subnet Mask",
      dataIndex: "subnet_mask",
      key: "subnet_mask",
      render: (text, record) => (
        <p
          //   onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            // textDecoration: "underline",
            // textAlign: "center",
            // paddingTop: "10px",
            paddingTop: "10px",
            paddingLeft: "15px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "subnet_mask",
        "Subnet Mask",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (text, record) => (
        <p
          style={{
            // textAlign: "center",
            paddingTop: "10px",
            paddingLeft: "15px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "size",
        "Size",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "scan_date",
      key: "scan_date",
      render: (text, record) => (
        <p
          style={{
            // textAlign: "center",
            paddingTop: "10px",
            paddingLeft: "15px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "scan_date",
        "Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Usage",
      dataIndex: "usage",
      key: "usage",
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

      ...getColumnSearchProps(
        "usage",
        "Usage",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (text, record) => (
        <p
          style={{
            // textAlign: "center",
            paddingTop: "10px",
            paddingLeft: "15px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "location",
        "Location",
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
          {text === "waiting" ? (
            <>
              <img src={empty} alt="" /> &nbsp;{" "}
              <span
                style={{
                  paddingLeft: "15px",
                  // textAlign: "center"
                }}
              >
                {text}
              </span>
            </>
          ) : null}

          {text === "Scanning" ? (
            <>
              <img src={empty} alt="" /> &nbsp;{" "}
              <span
                style={{
                  paddingLeft: "15px",
                  // textAlign: "center"
                }}
              >
                {text}
              </span>
            </>
          ) : null}
          {text === "Scanned" ? (
            <>
              <img src={Scanned} alt="" /> &nbsp;{" "}
              <span
                style={{
                  paddingLeft: "15px",
                  // textAlign: "center"
                }}
              >
                {text}
              </span>
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
      title: "Discover From",
      dataIndex: "discover_from",
      key: "discover_from",
      render: (text, record) => (
        <p
          style={{
            paddingLeft: "15px",
            // textAlign: "center",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "discover_from",
        "Discover From",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Scan date",
      dataIndex: "scan_date",
      key: "scan_date",
      render: (text, record) => (
        <p
          style={{
            paddingLeft: "15px",
            // textAlign: "center",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "scan_date",
        "Scan Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => {
        return (
          <ButtonCell
            disabled={configData?.ipam.pages.subnet.read_only}
            singleSubnet={singleSubnet}
            setSingleSubnet={setSingleSubnet}
            value={record.subnet_address}
            setScanData={setScanData}
            scanData={scanData}
            setDataSource={setDataSource}
            setRowCount={setRowCount}
            excelData={excelData}
            // setToggle={setToggle}
          />
        );
      },
    },
    // {
    //   title: "Active",
    //   dataIndex: "active",
    //   key: "active",
    //   render: (text, record) => (
    //     // <SpinLoading spinning={rescanLoading}>
    //     <ReScanButton onClick={() => handleReScan(record)}>Scan</ReScanButton>
    //     // </SpinLoading>
    //   ),

    //   ...getColumnSearchProps(
    //     "active",
    //     "Active",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
  ];

  let seedTemp = [
    {
      subnet_address: "000.000.000.000",
      subnet_name: "abc",
      subnet_mask: "mnbv",
      location: "UAE",
    },
  ];
  const exportSeed = async () => {
    setExportLoading(true);
    if (excelData.length > 0) {
      jsonToExcel(dataSource);
      openNotification();
    } else {
      openSweetAlert("No Data Found!", "info");
    }
    setExportLoading(false);
  };
  const openNotification = () => {
    notification.open({
      message: "File Exported Successfully",
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };
  const exportTemplate = async () => {
    jsonToExcel(seedTemp);
    openNotification();
  };

  const jsonToExcel = (atomData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "subnet");
      XLSX.writeFile(wb, "subnet.xlsx");

      // setExportLoading(false);
    }
  };
  const handleReScan = async (record) => {
    setRescanLoading(true);
    // const res = await axios.get(baseUrl + "/getAllSubnets");
    // console.log("res Subnet MAin", res);
    // excelData = res.data;
    // setDataSource(excelData);
    // setRowCount(excelData.length);
    // setRescanLoading(false);

    // if (selectedRowKeys.length > 0) {
    const scanData = [
      {
        subnet_address: record.subnet_address,
        subnet_name: record.subnet_name,
        subnet_mask: record.subnet_mask,
        location: record.location,
      },
    ];
    try {
      //console.log(device);

      await axios
        .post(baseUrl + "/addSubnetInSubnet ", scanData)
        .then((response) => {
          // openSweetAlert(`Subnet Deleted Successfully`, "success");
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllSubnets")
              .then((response) => {
                var data = response.data;
                var i;
                for (i = 0; i < data.length; i++) {
                  // data[i].name
                  if (data[i].status === "scanning") {
                    setStatusLoading(true);
                  } else {
                    setStatusLoading(false);
                  }
                }
                excelData = response.data;
                setDataSource(response.data);
                setRowCount(response.data.length);
                // excelData = response.data;
                setRescanLoading(false);
              })
              .catch((error) => {
                console.log(error);
                setRescanLoading(false);

                //  openSweetAlert("Something Went Wrong!", "error");
              })
          );
          return Promise.all(promises);
        })
        .catch((error) => {
          setRescanLoading(false);

          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      setRescanLoading(false);

      console.log(err);
    }
    // } else {
    //   openSweetAlert(`No Device Selected`, "error");
    // }
  };
  const subnetColumns = [
    {
      title: "IP Address",
      dataIndex: "subnet_address",
      key: "subnet_address",
      render: (text, record) => (
        <p
          //   onClick={ServernameClicked}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            // textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...deviceGetColumnSearchProps(
        "subnet_address",
        "IP Address",
        setDeviceRowCount,
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
          //   onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            // textDecoration: "underline",
            // textAlign: "center",
            paddingTop: "10px",
            // paddingTop: "10px",
            // cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...deviceGetColumnSearchProps(
        "device_name",
        "Device Name",
        setDeviceRowCount,
        setDataSourceOfDevice,
        deviceExcelData,
        DeviceColumnFilters
      ),
      ellipsis: true,
    },
  ];
  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };
  var SubnetClicked = "";
  const rowSelection = {
    columnWidth: 80,
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: (record) => ({
      // disabled: !configData?.uam.pages.sites.read_only,
      // disabled: record.subnet_address === singleSubnet.includes(record.subnet_address),
      disabled:
        configData?.ipam.pages.subnet.read_only ||
        singleSubnet?.includes(record.subnet_address),

      //   const rowIndex = data.findIndex((item) => item.key === record.key);
      // return {
      //   disabled: rowIndex < 4 //disable the first 4 rows only
      // };
      // }
    }),

    // getCheckboxProps: (record) => {
    //   let rowIndex = dataSource.findIndex((item) => item.key === record.key);
    //   return {
    //     disabled: rowIndex === singleSubnet, //disable the first 4 rows only
    //   };
    // },
  };

  return (
    <MainDivStyle>
      <div
        style={{
          float: "right",
          marginRight: "27px",
        }}
      >
        {configData?.ipam.pages.subnet.read_only ? (
          <AddButtonStyle
            disabled
            style={{
              backgroundColor: "#66b127",
              border: "1px solid #66b127",
              color: "#fff",
              cursor: "no-drop",
            }}
          >
            + Add Subnet
          </AddButtonStyle>
        ) : (
          <AddButtonStyle onClick={showMainModal}>+ Add Subnet</AddButtonStyle>
        )}
      </div>
      <br />
      <MainTableModal
        width={"75%"}
        // title="Basic Modal"
        open={mainModalVisible}
        // closable={false}
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
              <h2>Add Subnet</h2>
            </div>
            <div style={{ float: "right" }}>
              {/* <StyledSubmitButton
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
              /> */}
            </div>
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
                active={"Add Subnet" === tableName}
                onClick={() => showTable("Add Subnet")}
              >
                <img src={addnew} alt="" width="25px" height="25px" /> Add
                Subnet
              </MainTableMainP>
              &nbsp;&nbsp;
              <MainTableMainP
                active={"Add From Device" === tableName}
                onClick={() => showTable("Add From Device")}
              >
                <img src={addatom} alt="" width="25px" height="25px" /> Add From
                Device
              </MainTableMainP>{" "}
              &nbsp;&nbsp;
            </MainTableMainDiv>
            {tableName === "Add Subnet" ? (
              <>
                <SpinLoading spinning={loading}>
                  <div
                    style={{
                      //   overflowY: "scroll",
                      height: "350px",
                      paddingTop: "40px",
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
                      <form
                        style={{ textAlign: "center" }}
                        onSubmit={handleFormSubmit}
                      >
                        <Row
                          style={
                            {
                              //   textAlign: "center",
                              // marginRight: "100px",
                              // marginLeft: "120px",
                            }
                          }
                        >
                          <Col span={12}>
                            <>
                              <label
                                style={{ float: "left", marginLeft: "40px" }}
                              >
                                Subnet
                              </label>
                              &nbsp;
                              <span style={{ color: "red", float: "left" }}>
                                *
                              </span>
                              <br />
                              <StyledInputForm
                                style={{
                                  width: "80%",
                                  height: "2rem",
                                  border: "0.3px solid rgba(0,0,0,0.2)",
                                  paddingLeft: "8px",
                                }}
                                required
                                placeholder="Subnet"
                                value={subnet}
                                onChange={(e) =>
                                  setSubnet(
                                    e.target.value.replace(
                                      /[!^=&\\\#;,+()$~%'":*?<>{}@_\-]/g,
                                      ""
                                    )
                                  )
                                }
                              />
                            </>
                          </Col>
                          <Col span={12}>
                            <div style={{ marginLeft: "10px" }}>
                              <label
                                style={{ float: "left", marginLeft: "40px" }}
                              >
                                Subnet Mask
                              </label>
                              &nbsp;
                              <span style={{ color: "red", float: "left" }}>
                                *
                              </span>
                              <br />
                              <StyledInputForm
                                style={{
                                  width: "80%",
                                  height: "2rem",
                                  border: "0.3px solid rgba(0,0,0,0.2)",
                                  paddingLeft: "8px",
                                }}
                                required
                                placeholder="Subnet Mask"
                                value={subnetMask}
                                onChange={(e) => setSubnetMask(e.target.value)}
                              />
                            </div>
                          </Col>
                        </Row>
                        <Row
                          style={{
                            textAlign: "center",
                            marginTop: "25px",
                            // marginRight: "100px",
                            // marginLeft: "100px",
                          }}
                        >
                          <Col span={12}>
                            {/* <div style={{ marginLeft: "10px" }}> */}
                            <label
                              style={{ float: "left", marginLeft: "40px" }}
                            >
                              Subnet Name
                            </label>
                            &nbsp;
                            {/* <span style={{ color: "red", float: "left" }}>
                              *
                            </span> */}
                            <br />
                            <StyledInputForm
                              style={{
                                width: "80%",
                                height: "2rem",
                                border: "0.3px solid rgba(0,0,0,0.2)",
                                paddingLeft: "8px",
                              }}
                              // required
                              placeholder="Subnet Name"
                              value={subnetName}
                              onChange={(e) =>
                                setSubnetName(
                                  e.target.value.replace(
                                    /[!^=&\/\\#;,+()$~%'":*?<>{}]/g,
                                    ""
                                  )
                                )
                              }
                            />
                            {/* </div> */}
                          </Col>
                          <Col span={12}>
                            <div style={{ marginLeft: "10px" }}>
                              <label
                                style={{ float: "left", marginLeft: "40px" }}
                              >
                                Location
                              </label>
                              &nbsp;
                              {/* <span style={{ color: "red", float: "left" }}>
                                *
                              </span> */}
                              <br />
                              <StyledInputForm
                                style={{
                                  width: "80%",
                                  height: "2rem",
                                  border: "0.3px solid rgba(0,0,0,0.2)",
                                  paddingLeft: "8px",
                                }}
                                // required
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                              />
                            </div>
                          </Col>
                        </Row>

                        <br />
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
                                Add
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </form>
                    ) : null}
                    {value === 2 ? (
                      <>
                        <div
                          style={{
                            //   textAlign: "center",
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
                                //   disabled={!configData?.atom.pages.atom.read_only}
                                // style={{
                                //   marginTop: "25px",
                                //   float: "center",
                                //   //   marginRight: "20px",
                                //   //   marginLeft: "5px",
                                //   // borderBottom: "2px solid #3D9F46",
                                // }}
                                type="file"
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                // value={inputValue}
                                onChange={(e) => importExcel(e)}
                                // ref={inputRef}
                                // prefix={<ImportOutlined />}
                                style={{
                                  zIndex: 999,
                                  color: "black",
                                  textAlign: "center",
                                  float: "center",
                                  // marginRight: "39%",
                                  borderRadius: "3px",
                                  marginLeft: "30%",
                                  marginTop: "25px",
                                  cursor: "pointer",
                                  // backgroundColor: "#059142",
                                  // border: "0px",
                                }}
                              />
                              <br />

                              {/* <button
                                style={{
                                  marginTop: "27px",
                                  paddingLeft: "10px",
                                  paddingRight: "10px",
                                  paddingTop: "3px",
                                  paddingBottom: "3px",
                                }}
                              >
                                import
                              </button> */}
                            </div>
                          </div>
                          <div
                            style={{ textAlign: "center", marginTop: "25px" }}
                          >
                            <button
                              onClick={exportTemplate}
                              style={{
                                // display: "none",
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
                            {importFromExcel === "" ? (
                              <button
                                disabled
                                // onClick={(e) => postSeed(e)}
                                style={{
                                  // display: "none",
                                  fontWeight: "600",
                                  paddingRight: "15px",
                                  paddingLeft: "15px",
                                  paddingTop: "5px",
                                  paddingBottom: "5px",
                                  cursor: "no-drop",
                                  backgroundColor: "#66B127",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "10px",
                                  width: "120px",
                                }}
                              >
                                Import
                              </button>
                            ) : (
                              <button
                                onClick={(e) => postSeed(e)}
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
                            )}
                          </div>
                        </div>
                      </>
                    ) : null}
                  </div>
                </SpinLoading>
              </>
            ) : null}
            {tableName === "Add From Device" ? (
              <SpinLoading spinning={ipamDeviceLoading}>
                <div
                  style={{
                    //   overflowY: "scroll",
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
                      // scroll={{ x: 2000 }}
                      pagination={{ pageSize: 4 }}
                      rowKey="subnet_address"
                      columns={subnetColumns}
                      dataSource={dataSourceOfDevice}
                      // pagination={false}
                      // style={{ width: "100%" }}
                    />
                    <button
                      onClick={handleSubnetAddress}
                      style={{
                        position: "relative",
                        left: "-1px",
                        // backgroundColor: "#446655",
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
          {selectedRowKeys.length === 0 ? (
            <DeleteButton onClick={deleteRow} style={{ display: "none" }}>
              <img src={trash} width="18px" height="18px" alt="" />
              &nbsp;Delete
            </DeleteButton>
          ) : (
            <DeleteButton onClick={deleteRow}>
              <img src={trash} width="18px" height="18px" alt="" />
              &nbsp;Delete
            </DeleteButton>
          )}
          &nbsp;
          <SpinLoading spinning={pending}>
            <Dropdown.Button
              onClick={handleButtonClick}
              disabled={configData?.ipam.pages.subnet.read_only}
              style={{ background: "#66b127 !important" }}
              menu={menu}
              icon={<DownOutlined style={{ fontSize: "14px" }} />}
            >
              <img src={Scanner} width="18px" height="18px" alt="" /> &nbsp;
              Scan
            </Dropdown.Button>
          </SpinLoading>
          &nbsp;
          {/* <SpinLoading spinning={rescanLoading}> */}
          <ReScanButton style={{ display: "none" }} onClick={handleReScan}>
            Scan
          </ReScanButton>
          &nbsp;
          {/* </SpinLoading> */}
          &nbsp;
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
        {/* <Modal
          width="60%"
          title="IP Details"
          open={isModalOpen}
          open={isModalOpen}
          footer={false}
          onOk={handleOkAllPopup}
          onCancel={handleCancelAllPopup}
          style={{ marginTop: "-50px" }}
        >
          <div
            style={{
              overflowY: "scroll",
              textAlign: "center",
              height: "450px",
            }}
          >
            <TableStyling
              // rowSelection={rowSelection}
              scroll={{ x: 2500 }}
              // rowKey="ip_address"
              columns={popupColumns}
              dataSource={popupDataSource}
              // pagination={false}
              style={{ width: "100%" }}
            />
          </div>
        </Modal> */}
        <SpinLoading spinning={mainTableloading} tip="Loading...">
          <TableStyling
            rowSelection={rowSelection}
            scroll={{ x: 2000 }}
            pagination={{ pageSize: 10 }}
            rowKey="subnet_address"
            columns={columns}
            dataSource={dataSource}
            // pagination={false}
            // style={{ width: "100%" }}
          />
        </SpinLoading>
      </div>
      {/* <button onClick={showModal}>Raza</button>
      <MainTableModal
        style={{ zIndex: 9999 }}
        title="Subnet Detail"
        open={isModalOpen}
        footer={false}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TableStyling
          columns={SubnetColumns}
          dataSource={SubnetDataSource}
          // pagination={false}
          // style={{ width: "100%" }}
        />
      </MainTableModal> */}
    </MainDivStyle>
  );
};

export default index;
