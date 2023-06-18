import React, { useState, useEffect, useRef } from "react";
import uamG from "../assets/uamG.svg";
import UamNavigation from "../../UamNavigation";
import {
  Progress,
  Table,
  Dropdown,
  Menu,
  Space,
  message,
  Popconfirm,
} from "antd";
import BarChart from "./BarChart";
import critical from "./assets/critical.svg";
import messagee from "../assets/message.svg";
import undefined from "./assets/undefined.svg";
import up from "./assets/up.svg";
import warning from "./assets/warning.svg";
import { Row, Col, Modal, notification } from "antd";
import myexport from "./assets/export.svg";
import Modall from "./AddDevicesModal.jsx";
import EditModal from "./EditDeviceModal.jsx";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import axios, { baseUrl } from "../../../utils/axios";

import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
  DownOutlined,
  SmileOutlined,
  AlipayOutlined,
} from "@ant-design/icons";

import {
  TableStyling,
  StyledImportFileInput,
  StyledButton,
  OnBoardStyledButton,
  AddAtomStyledButton,
  StyledExportButton,
  StyledInput,
  Styledselect,
  InputWrapper,
  StyledSubmitButton,
  StyledModalButton,
  ColStyling,
  AddStyledButton,
  TableStyle,
  MainTableMainDiv,
  MainTableMainP,
  MainTableDropDown,
  MainTableModal,
  MainTableColP,
  DSO,
  SpinLoading,
  ProgressStyled,
  PopConfirmStyled,
} from "../../AllStyling/All.styled.js";

import { columnSearch } from "../../../utils";

let excelData = [];
let columnFilters = {};

const index = () => {
  let [dataSource, setDataSource] = useState(excelData);

  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  let [exportLoading, setExportLoading] = useState(false);
  let [dismantleLoading, setDismantleLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);

  const [totalDeviceCount, setTotalDeviceCount] = useState("");

  const [mainModalVisible, setMainModalVisible] = useState(false);

  const [myDeviceInformation, setMyDeviceInformation] = useState([]);

  const [myDeviceStatus, setMyDevicesStatus] = useState([]);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllDevices");

        excelData = res.data;
        setDataSource(excelData);
        setRowCount(excelData.length);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const getColor = (type) => {
    if (type === "Production") {
      return {
        color: "#6f7",
        backgroundColor: "#9f5",
      };
    }
  };

  const confirm = async (e) => {
    // message.success("Click on Yes");
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

  const cancel = (e) => {
    // message.error("Click on No");
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
    const deviceInformation = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/deviceInformation");

        setMyDeviceInformation(res.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    deviceInformation();
  }, []);

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

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: (
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.antgroup.com"
            >
              1st menu item
            </a>
          ),
        },
      ]}
    />
  );
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
      // console.log("ipAddress data", res.data);
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
      // console.log("setAllDeviceData", res.data);
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
      // console.log("setAllSFPData", res.data);
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

  const exportSeed = async () => {
    setExportLoading(true);
    jsonToExcel(excelData);
    setExportLoading(false);
    // console.log(first);
  };

  const jsonToExcel = (atomData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "devices");
      XLSX.writeFile(wb, "devices.xlsx");
      openNotification();
      // setExportLoading(false);
    } else {
      openSweetAlert("No Data Found!", "danger");
    }
  };

  const openNotification = () => {
    notification.open({
      message: "File Exported Successfully",
      onClick: () => {},
    });
  };

  const showModal = () => {
    setEditRecord(null);
    setAddRecord(null);
    setIsModalVisible(true);
  };

  const showEditModal = () => {
    setIsModalVisible(true);
  };

  const edit = (record) => {
    setEditRecord(record);

    // setAddRecord(record);
    setIsEditModalVisible(true);
  };

  const columns = [
    {
      title: "Device Name",
      dataIndex: "Device",
      key: "Device",
      render: (text) => (
        <a style={{ color: "#263238", paddingLeft: "12px", fontWeight: "400" }}>
          {text}
        </a>
      ),
    },
    {
      title: "",
      key: "edit",
      width: "2%",

      render: (text, record) => (
        <a>
          <EditOutlined
            style={{
              paddingRight: "10px",
              color: "#66B127",
            }}
            // onClick={() => {
            //   edit(record);
            // }}
          />
        </a>
      ),
    },
    {
      title: "IP Address",
      dataIndex: "IP Address",
      key: "IP Address",
      render: (text) => (
        <>
          <a
            onClick={() => showMainModal(text)}
            style={{
              color: "#66B127",
              textDecoration: "underline",
              fontWeight: "400",
            }}
          >
            {text}
          </a>
        </>
      ),
    },
    // {
    //   title: "Up Time ",
    //   dataIndex: "Up Time",
    //   key: "Up Time",
    //   render: (text) => (
    //     <a style={{ color: "#263238", fontWeight: "400" }}>{text}</a>
    //   ),
    // },
  ];

  // const data = [
  //   {
  //     key: "1",
  //     device_name: "John Brown",
  //     ip_address: "1.2.1.2",
  //     device_up_time: "12:35:33",
  //   },
  //   {
  //     key: "2",
  //     device_name: "Jim Green",
  //     ip_address: "1.2.1.2",
  //     device_up_time: "12:35:33",
  //   },
  //   {
  //     key: "1",
  //     device_name: "John Brown",
  //     ip_address: "1.2.1.2",
  //     device_up_time: "12:35:33",
  //   },
  //   {
  //     key: "1",
  //     device_name: "John Brown",
  //     ip_address: "1.2.1.2",
  //     device_up_time: "12:35:33",
  //   },
  //   {
  //     key: "1",
  //     device_name: "John Brown",
  //     ip_address: "1.2.1.2",
  //     device_up_time: "12:35:33",
  //   },
  // ];

  const SecColumns = [
    {
      title: "",
      key: "edit",
      width: "0.5%",

      render: (text, record) => (
        <>
          {!configData?.uam.pages.devices.read_only ? (
            <>
              <a
                disabled
                // onClick={() => {
                //   edit(record);
                // }}
              >
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
              // color: "blue",
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

    // {
    //   title: "patch_version",
    //   dataIndex: "patch_version",
    //   key: "patch_version",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "patch_version",
    //     "Patch Version",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },

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
    // {
    //   title: "criticality",
    //   dataIndex: "criticality",
    //   key: "criticality",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "criticality",
    //     "Criticality",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },

    // {
    //   title: "domain",
    //   dataIndex: "domain",
    //   key: "domain",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "domain",
    //     "Domain",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
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

    // {
    //   title: "rfs_date",
    //   dataIndex: "rfs_date",
    //   key: "rfs_date",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "rfs_date",
    //     "RFS Date",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
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

    // {
    //   title: "subrack_id_number",
    //   dataIndex: "subrack_id_number",
    //   key: "subrack_id_number",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "subrack_id_number",
    //     "Subrack Id Number",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
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
    // {
    //   title: "max_power",
    //   dataIndex: "max_power",
    //   key: "max_power",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "max_power",
    //     "Max Power",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    // {
    //   title: "site_type",
    //   dataIndex: "site_type",
    //   key: "site_type",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "site_type",
    //     "Site Type",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
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
    // {
    //   title: "UP Time",
    //   dataIndex: "uptime",
    //   key: "uptime",
    //   render: (text, record) => <p style={{ textAlign: "center",
    //             paddingTop:"15px",

    // }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "uptime",
    //     "UP Time",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
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
  // const background = "#000";
  // const style = (status) => {
  //   marginRight: "5px";
  //   textAlign: "center";
  //   margin: "15px";
  //   // backgroundColor: "rgba(175, 255, 207, 0.2)",
  //   borderRadius: "15px";
  //   padding: "5px";
  //   fontSize: "10px";
  //   fontWeight: "500";
  //   if (status === "Production") {
  //     return background;
  //   } else if (status === "Dismantled") {
  //     return warning;
  //   } else if (status === "Maintenance") {
  //     return critical;
  //   } else {
  //     return undefined;
  //   }
  // };

  return (
    <>
      <SpinLoading spinning={dismantleLoading} style={{ marginTop: "180px" }}>
        <div
          style={{
            backgroundColor: "#f1f5f5",
            height: "100%",
            // paddingBottom: "15px",
          }}
        >
          <Row
            style={{
              padding: "10px",
              marginTop: "5px",
              // paddingTop: "20px",
              marginRight: "15px",
              marginLeft: "15px",
            }}
          >
            <Col
              xs={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              // xl={{ span: 2 }}
            >
              <div
                style={{
                  color: "#000",
                  // borderLeft: "3px solid #3D9E47",
                  borderTopLeftRadius: "3px",
                  paddingLeft: "6px",
                  alignItems: "center",
                  float: "left",
                  marginLeft: "-6px",
                  marginTop: "2px",
                  fontWeight: "bold",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                  // display: "flex",
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
                  {totalDeviceCount.name} : <b>{totalDeviceCount.value}</b>
                </h4>

                <br />
                <br />
                <Row>
                  {myDeviceStatus.map((item, index) => (
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
                  ))}

                  {/* <Col
                  xs={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                  // xl={{ span: 2 }}
                >
                  <div
                    style={{
                      // display: "flex",
                      // justifyContent: "space-between",
                      marginRight: "10px",
                      //   backgroundColor: "#fcfcfc",
                    }}
                  >
                    <Progress
                      style={{
                        textAlign: "center",
                        padding: "15px",
                        display: "block",
                      }}
                      strokeColor={"#E2B200"}
                      type="dashboard"
                      percent={95}
                    />
                    <p
                      style={{
                        fontSize: "10px",
                        fontWeight: "500",
                        margin: "1px",
                        textAlign: "center",
                        margin: "15px",
                        backgroundColor: "rgba(248, 199, 18, 0.2)",
                        borderRadius: "15px",
                        padding: "5px",
                      }}
                    >
                      <img src={warning} alt="" width="22px" height="25px" />{" "}
                      &nbsp; &nbsp; Maintinance
                    </p>
                  </div>
                </Col>
                <Col
                  xs={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                  // xl={{ span: 2 }}
                >
                  <div
                    style={{
                      // display: "flex",
                      // justifyContent: "space-between",
                      // marginLeft: "3px",
                      borderRadius: "12px",
                      //   backgroundColor: "#fcfcfc",
                    }}
                  >
                    <Progress
                      style={{
                        textAlign: "center",
                        padding: "15px",
                        display: "block",
                      }}
                      strokeColor={"#DC3938"}
                      type="dashboard"
                      percent={65}
                    />
                    <p
                      style={{
                        fontSize: "10px",
                        fontWeight: "500",
                        margin: "1px",
                        textAlign: "center",
                        margin: "15px",
                        backgroundColor: "rgba(220, 57, 56, 0.1)",
                        borderRadius: "15px",
                        padding: "5px",
                      }}
                    >
                      <img src={critical} alt="" /> &nbsp; &nbsp; Dismantle
                    </p>
                  </div>
                </Col>
                <Col
                  xs={{ span: 12 }}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                  // xl={{ span: 2 }}
                >
                  <div
                    style={{
                      // display: "flex",
                      justifyContent: "space-between",
                      marginLeft: "3px",
                      borderRadius: "12px",

                      //   backgroundColor: "#fcfcfc",
                    }}
                  >
                    <Progress
                      style={{
                        textAlign: "center",
                        padding: "15px",
                        display: "block",
                      }}
                      strokeColor={"#878787"}
                      type="dashboard"
                      percent={15}
                    />
                    <p
                      style={{
                        textAlign: "center",
                        margin: "5px",
                        marginTop: "15px",
                        marginLeft: "10px",
                        backgroundColor: "rgba(197, 197, 197, 0.15)",
                        borderRadius: "15px",
                        padding: "5px",
                        fontSize: "10px",
                        fontWeight: "500",
                      }}
                    >
                      <img src={undefined} alt="" /> &nbsp; &nbsp; Undefined
                    </p>
                  </div>
                </Col> */}
                </Row>
              </div>
            </Col>
            <Col
              xs={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 12 }}
              // xl={{ span: 2 }}
            >
              <div
                style={{
                  color: "#000",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",

                  // borderLeft: "3px solid #6C6B75",
                  borderTopLeftRadius: "3px",
                  // paddingLeft: "6px",
                  alignItems: "center",
                  // padding: "7px",
                  marginLeft: "-6px",
                  height: "365px",
                  // marginTop: "2px",
                  fontWeight: "bold",

                  // display: "flex",
                  justifyContent: "space-between",
                  marginRight: "15px",
                  borderRadius: "12px",

                  // borderRadius: "15px",
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
                    // marginLeft: "-2px",

                    marginTop: "2px",
                    marginBottom: "5px",
                    fontWeight: "bold",
                  }}
                >
                  Top 10 Functions
                </h3>
                {/* <h4
              style={{
                color: "#000",
                borderLeft: "3px solid #3D9E47",
                borderRadius: "3px",
                paddingLeft: "6px",
                alignItems: "center",
                marginLeft: "3px",
                marginTop: "2px",
                fontWeight: "bold",
                float: "left",
              }}
            >
              Devices Statistics
            </h4> */}
                <SpinLoading spinning={loading}>
                  {/* <TableStyle
                    // style={{ marginTop: "-5px" }}
                    columns={columns}
                    pagination={{ pageSize: 4 }}
                    dataSource={myDeviceInformation}
                    // style={{ padding: "0px" }}
                  /> */}

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
                    onCancel={cancel}
                    // okButtonProps={{ background: "#0f0" }}
                    type="success"
                    okText="Yes"
                    cancelText="No"
                  >
                    <OnBoardStyledButton
                      // onClick={handleConfirm}
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
                    {/* <a href="#">Delete</a> */}
                  </PopConfirmStyled>
                </>
              ) : null}

              <AddStyledButton onClick={showModal} style={{ display: "none" }}>
                + Add Device
              </AddStyledButton>
              <div style={{ display: "flex", marginTop: "3px" }}>
                <h3
                  style={{
                    marginLeft: "10px",
                    // float: "right",
                    marginRight: "20px",
                    // fontWeight: "bold",
                  }}
                >
                  Row :<b style={{ color: "#3D9E47" }}> {rowCount}</b>
                </h3>
                <h3
                  style={{
                    marginLeft: "10px",
                    // float: "right",
                    marginRight: "20px",
                    // fontWeight: "bold",
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
            {/* <button onClick={showMainModal}>Click</button> */}
            <MainTableModal
              width={"75%"}
              // title="Basic Modal"
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
                    {/* <MainTableMainP
                      onClick={() => showTable("Stack Switches")}
                      active={"Stack Switches" === tableName}
                    >
                      Stack Switches
                    </MainTableMainP> */}
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
                    {/* <MainTableMainP onClick={() => showTable("Boards")}>
                Boards
              </MainTableMainP>
              <MainTableMainP onClick={() => showTable("SubBoard")}>
                Sub Board
              </MainTableMainP> */}
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
                            {/* <Col span={6}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Creation Date
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={5}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allSiteData.creation_date}
                            </MainTableColP>
                          </Col> */}
                          </Row>
                          {/* <Row
                          style={{
                            paddingTop: "15px",
                            backgroundColor: "#FFFFFF",
                          }}
                        >
                          <Col span={6}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Modification Date
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={5}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allSiteData.modification_date}
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
                        </Row> */}
                          {/* <Row
                          style={{
                            paddingTop: "15px",
                            backgroundColor: "#F1FFE1",
                          }}
                        >
                          <Col span={6}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Total Count
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={5}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allSiteData.total_count}
                            </MainTableColP>
                          </Col>
                          <Col span={5}>
                        <p style={{ paddingLeft: "40px" }}>Status</p>
                      </Col>
                      <Col span={2}>:</Col>
                      <Col span={5}>
                        <p style={{ paddingLeft: "40px" }}>5rag</p>
                      </Col>
                        </Row> */}
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Rack Name
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.rack_name}
                                  </MainTableColP>
                                </Col>
                                {/* <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Creation Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.creation_date}
                                  </MainTableColP>
                                </Col> */}
                                <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Width
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Site Name
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.site_name}
                                  </MainTableColP>
                                </Col>
                                {/* <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Modification date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.modification_date}
                                  </MainTableColP>
                                </Col> */}
                                {/* <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Depth
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.depth}
                                  </MainTableColP>
                                </Col> */}
                                <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Rack Modal
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                {/* <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Unit Position
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.unit_position}
                                  </MainTableColP>
                                </Col> */}
                                <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Status
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.status}
                                  </MainTableColP>
                                </Col>
                                <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Height
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.height}
                                  </MainTableColP>
                                </Col>
                                {/* <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    PN Code
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.pn_code}
                                  </MainTableColP>
                                </Col> */}
                              </Row>
                              <Row
                                style={{
                                  paddingTop: "15px",
                                  backgroundColor: "#FFF",
                                }}
                              >
                                <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Serial Number
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.serial_number}
                                  </MainTableColP>
                                </Col>
                                <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    RU
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.ru}
                                  </MainTableColP>
                                </Col>
                              </Row>
                              {/* <Row
                                style={{
                                  paddingTop: "15px",
                                  backgroundColor: "#F1FFE1",
                                }}
                              > */}
                              {/* <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Manufacturer Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.manufacturer_date}
                                  </MainTableColP>
                                </Col> */}
                              {/* <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    RFS Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.rfs_date}
                                  </MainTableColP>
                                </Col> */}
                              {/* <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Rack Modal
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {item.rack_model}
                                  </MainTableColP>
                                </Col> */}
                              {/* </Row> */}
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
                          {/* <Col span={4}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Subrack Id No.
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={3}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allDeviceData.subrack_id_number}
                            </MainTableColP>
                          </Col> */}
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
                          {/* <Col span={4}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Criticality
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={3}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allDeviceData.criticality}
                            </MainTableColP> 
                          </Col>*/}
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
                          {/* <Col span={4}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              RFS Date
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={3}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allDeviceData.rfs_date}
                            </MainTableColP>
                          </Col> */}
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
                          {/* <Col span={4}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Software Type
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={3}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allDeviceData.software_type}
                            </MainTableColP>
                          </Col> */}
                          {/* <Col span={4}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Max Power
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={3}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allDeviceData.max_power}
                            </MainTableColP>
                          </Col> */}
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
                          {/* <Col span={4}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Domain
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={3}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allDeviceData.domain}
                            </MainTableColP>
                          </Col> */}
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

                        {/* <Row
                          style={{
                            paddingTop: "15px",
                            backgroundColor: "#fff",
                          }}
                        >
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
                              Rack Name
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={3}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allDeviceData.rack_name}
                            </MainTableColP>
                          </Col>
                          <Col span={4}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              Site Type
                            </MainTableColP>
                          </Col>
                          <Col span={1}>:</Col>
                          <Col span={3}>
                            <MainTableColP style={{ paddingLeft: "40px" }}>
                              {allDeviceData.site_type}
                            </MainTableColP>
                          </Col>
                        </Row> */}
                        {/* <Row
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
                        </Row> */}
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Module Name
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allBoardData.board_name}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Serial Number
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allBoardData.serial_number}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    EOL Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Device Name
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allBoardData.device_name}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Manufacturer date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allBoardData.manufacturer_date}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    RFS Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    EOS Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allBoardData.eos_date}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Creation date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allBoardData.creation_date}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    PN Code
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Device Slot Id
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allBoardData.device_slot_id}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Modification Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allBoardData.modification_date}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Hardware Version
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Software Version
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allBoardData.software_version}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Status
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allBoardData.status}
                                  </MainTableColP>
                                </Col>
                              </Row>
                              <Row
                                style={{
                                  paddingTop: "15px",
                                  backgroundColor: "#fff",
                                }}
                              >
                                {/* <Col span={4}>
                        <MainTableColP style={{ paddingLeft: "40px" }}>
                          Domain
                        </MainTableColP>
                      </Col>
                      <Col span={1}>:</Col>
                      <Col span={3}>
                        <MainTableColP style={{ paddingLeft: "40px" }}>
                          5rag
                        </MainTableColP>
                      </Col> */}
                                {/* <Col span={4}>
                        <MainTableColP style={{ paddingLeft: "40px" }}>
                          Authentication
                        </MainTableColP>
                      </Col>
                      <Col span={1}>:</Col>
                      <Col span={3}>
                        <MainTableColP style={{ paddingLeft: "40px" }}>
                          5rag
                        </MainTableColP>
                      </Col> */}
                              </Row>
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    SubBoard Name
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSubBoardData.subboard_name}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    SubSlot Number
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSubBoardData.subslot_number}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Status
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Device Name
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSubBoardData.device_name}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Software Version
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSubBoardData.software_version}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Eos Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    SubBoard Type
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSubBoardData.subboard_type}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Hardware Version
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSubBoardData.hardware_version}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    EOL Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    subrack Id
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSubBoardData.subrack_id}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Slot Number
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSubBoardData.slot_number}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    RFS Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Serial Number
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSubBoardData.serial_number}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Creation Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSubBoardData.creation_date}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Modification Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    PN Code
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    SFP Id
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSFPData.sfp_id}
                                  </MainTableColP>
                                </Col>

                                <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Creation Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Device Name
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSFPData.device_name}
                                  </MainTableColP>
                                </Col>
                                {/* <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Speed
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSFPData.speed}
                                  </MainTableColP>
                                </Col> */}
                                <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Modification Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Media Type
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSFPData.media_type}
                                  </MainTableColP>
                                </Col>

                                <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Status
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Port Name
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSFPData.port_name}
                                  </MainTableColP>
                                </Col>

                                <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    EOS Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Port Type
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSFPData.port_type}
                                  </MainTableColP>
                                </Col>

                                <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    EOL Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Serial Number
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSFPData.serial_number}
                                  </MainTableColP>
                                </Col>
                                <Col span={6}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Mode
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={5}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allSFPData.mode}
                                  </MainTableColP>
                                </Col>
                                {/* <Col span={4}>
                        <MainTableColP style={{ paddingLeft: "40px" }}>
                          Domain
                        </MainTableColP>
                      </Col>
                      <Col span={1}>:</Col>
                      <Col span={3}>
                        <MainTableColP style={{ paddingLeft: "40px" }}>
                          5rag
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
                          5rag
                        </MainTableColP>
                      </Col> */}
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Activation Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allLicenseData.activation_date}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Expiry Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allLicenseData.expiry_date}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Status
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Licensce Name
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allLicenseData.license_name}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Grace Period
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allLicenseData.grace_period}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Capacity
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Licensce Description
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allLicenseData.license_description}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Serial Number
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allLicenseData.serial_number}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Usage
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Device Name
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allLicenseData.ne_name}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Creation Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allLicenseData.creation_date}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    PN Code
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    RFS Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    {allLicenseData.rfs_date}
                                  </MainTableColP>
                                </Col>
                                <Col span={4}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
                                    Modification Date
                                  </MainTableColP>
                                </Col>
                                <Col span={1}>:</Col>
                                <Col span={3}>
                                  <MainTableColP
                                    style={{ paddingLeft: "40px" }}
                                  >
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
            <Modall
              style={{ padding: "40px", marginTop: "-30px" }}
              isModalVisible={isModalVisible}
              setIsModalVisible={setIsModalVisible}
              dataSource={dataSource}
              setDataSource={setDataSource}
              excelData={excelData}
              setRowCount={setRowCount}
              // editRecord={editRecord}
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
                rowKey="ip_address"
                columns={SecColumns}
                dataSource={dataSource}
                style={{ width: "100%", padding: "2%" }}
              />
            </div>
          </SpinLoading>
        </div>
      </SpinLoading>
    </>
  );
};

export default index;
