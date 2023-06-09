import React, { useState, useEffect } from "react";
import axios, { baseUrl } from "../../../utils/axios";

import { Link, useNavigate } from "react-router-dom";
import { ColStyle, PStyle, DivStyle, ColStyleTow } from "./main.styled.js";
import {
  Row,
  Col,
  Checkbox,
  Table,
  notification,
  Spin,
  Progress,
  Button,
  Input,
  Modal,
} from "antd";
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
  DownOutlined,
  SmileOutlined,
  AlipayOutlined,
  ArrowRightOutlined,
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
  InputWrapper,
  ColRowNumberStyle,
  LinkStyled,
} from "../../AllStyling/All.styled";
import { columnSearch } from "../../../utils";

let criticalExcelData = [];
let informationalExcelData = [];
let deviceDownExcelData = [];
let excelData = [];

let columnFilters = {};

const index = () => {
  const navigate = useNavigate();
  let [dataSource, setDataSource] = useState(excelData);
  let [criticalDataSource, setCriticalDataSource] = useState(criticalExcelData);
  const [criticalDataSourceLoading, setCriticalDataSourceLoading] =
    useState(false);
  let [informationalDataSourceLoading, setInformationalDataSourceLoading] =
    useState(false);
  const [informationalDataSource, setInformationalDataSource] = useState(
    informationalExcelData
  );
  let [deviceDownDataSource, setDeviceDownDataSource] =
    useState(deviceDownExcelData);
  let [deviceDownDataSourceLoading, setDeviceDownDataSourceLoading] =
    useState(false);
  const [criticalRowCount, setCriticalRowCount] = useState(0);
  const [informationalRowCount, setInformationalRowCount] = useState(0);
  const [deviceDownRowCount, setDeviceDownRowCount] = useState(0);

  const [mainModalVisible, setMainModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ipamDeviceLoading, setIpamDeviceLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [ip_address, setIpAddress] = useState("");
  const [device_type, setDeviceType] = useState("");
  const [password_group, setPassword_group] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [mainTableloading, setMainTableLoading] = useState(false);
  const [configData, setConfigData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [criticalAlerts, setCriticalAlerts] = useState([]);
  const [informationalAlerts, setInformationalAlerts] = useState([]);
  const [deviceDownAlerts, setDeviceeDownAlerts] = useState([]);

  const [ipAddressData, setIpAddressData] = useState([]);
  const showData = async (ipAddress) => {
    console.log("ipAddress", ipAddress);
    try {
      // setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getIPAlerts?ipaddress=${ipAddress}`
      );
      // console.log("ipAddress data", res.data);
      setIpAddressData(res.data);
      // setLoading(false);
    } catch (err) {
      // setLoading(false);
      console.log(err);
    }
  };

  const showModal = (text) => {
    setIsModalOpen(true);
    showData(text);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [alertStatus, setAlertStatus] = useState("");
  const [alertStatusLoading, setAlertStatusLoading] = useState(false);
  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
    console.log(JSON.parse(config));
  }, []);
  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );
  const rowSelection = {
    selectedRowKeys,

    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: !configData?.uam.pages.sites.read_only,
    }),
  };
  // useEffect(() => {
  //   const serviceCalls = async () => {
  //     setMainTableLoading(true);

  //     try {
  //       const res = await axios.get(baseUrl + "/getAllAlerts");
  //       console.log("res", res);
  //       excelData = res.data;
  //       setDataSource(excelData);
  //       setRowCount(excelData.length);
  //       setMainTableLoading(false);
  //     } catch (err) {
  //       console.log(err.response);
  //       setMainTableLoading(false);
  //     }
  //   };
  //   serviceCalls();
  // }, []);
  useEffect(() => {
    const serviceCalls = async () => {
      setAlertStatusLoading(true);

      try {
        const res = await axios.get(baseUrl + "/alertStatus");
        console.log("res", res);
        setAlertStatus(res.data);
        setAlertStatusLoading(false);
      } catch (err) {
        console.log(err.response);
        setAlertStatusLoading(false);
      }
    };
    serviceCalls();
  }, []);
  useEffect(() => {
    const serviceCalls = async () => {
      setInformationalDataSourceLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getInformationalAlerts");
        console.log("res", res);
        // setInformationalAlerts(res.data);
        informationalExcelData = res.data;
        setInformationalDataSource(informationalExcelData);
        setInformationalRowCount(informationalExcelData.length);
        setInformationalDataSourceLoading(false);
      } catch (err) {
        console.log(err.response);
        setInformationalDataSourceLoading(false);
      }
    };
    serviceCalls();
  }, []);
  useEffect(() => {
    const serviceCalls = async () => {
      setDeviceDownDataSourceLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getDeviceAlerts");
        console.log("res", res);
        // setDeviceeDownAlerts(res.data);
        deviceDownExcelData = res.data;
        setDeviceDownDataSource(deviceDownExcelData);
        setDeviceDownRowCount(deviceDownExcelData.length);

        setDeviceDownDataSourceLoading(false);
      } catch (err) {
        console.log(err.response);
        setDeviceDownDataSourceLoading(false);
      }
    };
    serviceCalls();
  }, []);
  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllAlerts");
        console.log("res", res);
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
      setCriticalDataSourceLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getCriticalAlerts");
        // setCriticalAlerts(res.data);
        console.log("res", res);
        criticalExcelData = res.data;
        setCriticalDataSource(criticalExcelData);
        setCriticalRowCount(criticalExcelData.length);
        setCriticalDataSourceLoading(false);
      } catch (err) {
        console.log(err.response);
        setCriticalDataSourceLoading(false);
      }
    };
    serviceCalls();
  }, []);
  const columns = [
    // {
    //   title: "",
    //   key: "edit",
    //   width: "2%",

    //   render: (text, record) => (
    //     <>
    //       {!configData?.uam.pages.sites.read_only ? (
    //         <>
    //           <a
    //             disabled
    //             // onClick={() => {
    //             //   edit(record);
    //             // }}
    //           >
    //             <EditOutlined
    //               style={{ paddingRight: "50px", color: "#66A111" }}
    //             />
    //           </a>
    //         </>
    //       ) : (
    //         <a
    //           onClick={() => {
    //             edit(record);
    //           }}
    //         >
    //           <EditOutlined
    //             style={{ paddingRight: "50px", color: "#66A111" }}
    //           />
    //         </a>
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          onClick={() => showModal(text)}
          //   onClick={async () => {
          //     const res = await axios.post(
          //       baseUrl + "/getMonitoringDevicesCards ",
          //       { ip_address: text }
          //     );

          //     console.log("getMonitoringDevicesCards", res);
          //     navigate("/monitoringsummary/main", {
          //       state: {
          //         ip_address: text,
          //         res: res.data,
          //       },
          //     });
          //   }}
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <p
          //   onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            //   textDecoration: "underline",
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            paddingTop: "10px",
            //  cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "description",
        "Description",
        setRowCount,
        setDataSource,
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
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    // {
    //   title: "Function",
    //   dataIndex: "function",
    //   key: "function",
    //   render: (text, record) => (
    //     <p
    //       style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
    //     >
    //       {text}
    //     </p>
    //   ),

    //   ...getColumnSearchProps(
    //     "function",
    //     "Function",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
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
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];
  const criticalColumns = [
    // {
    //   title: "",
    //   key: "edit",
    //   width: "2%",

    //   render: (text, record) => (
    //     <>
    //       {!configData?.uam.pages.sites.read_only ? (
    //         <>
    //           <a
    //             disabled
    //             // onClick={() => {
    //             //   edit(record);
    //             // }}
    //           >
    //             <EditOutlined
    //               style={{ paddingRight: "50px", color: "#66A111" }}
    //             />
    //           </a>
    //         </>
    //       ) : (
    //         <a
    //           onClick={() => {
    //             edit(record);
    //           }}
    //         >
    //           <EditOutlined
    //             style={{ paddingRight: "50px", color: "#66A111" }}
    //           />
    //         </a>
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          onClick={() => showModal(text)}
          //   onClick={async () => {
          //     const res = await axios.post(
          //       baseUrl + "/getMonitoringDevicesCards ",
          //       { ip_address: text }
          //     );

          //     console.log("getMonitoringDevicesCards", res);
          //     navigate("/monitoringsummary/main", {
          //       state: {
          //         ip_address: text,
          //         res: res.data,
          //       },
          //     });
          //   }}
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

      ...getColumnSearchProps(
        "ip_address",
        "IP Address",
        setCriticalRowCount,
        setCriticalDataSource,
        criticalExcelData,
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
          //   onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            //   textDecoration: "underline",
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            paddingTop: "10px",
            //  cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "description",
        "Description",
        setCriticalRowCount,
        setCriticalDataSource,
        criticalExcelData,
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
        setCriticalRowCount,
        setCriticalDataSource,
        criticalExcelData,
        columnFilters
      ),
      ellipsis: true,
    },

    // {
    //   title: "Function",
    //   dataIndex: "function",
    //   key: "function",
    //   render: (text, record) => (
    //     <p
    //       style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
    //     >
    //       {text}
    //     </p>
    //   ),

    //   ...getColumnSearchProps(
    //     "function",
    //     "Function",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
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
        setCriticalRowCount,
        setCriticalDataSource,
        criticalExcelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];
  const informationalColumns = [
    // {
    //   title: "",
    //   key: "edit",
    //   width: "2%",

    //   render: (text, record) => (
    //     <>
    //       {!configData?.uam.pages.sites.read_only ? (
    //         <>
    //           <a
    //             disabled
    //             // onClick={() => {
    //             //   edit(record);
    //             // }}
    //           >
    //             <EditOutlined
    //               style={{ paddingRight: "50px", color: "#66A111" }}
    //             />
    //           </a>
    //         </>
    //       ) : (
    //         <a
    //           onClick={() => {
    //             edit(record);
    //           }}
    //         >
    //           <EditOutlined
    //             style={{ paddingRight: "50px", color: "#66A111" }}
    //           />
    //         </a>
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          onClick={() => showModal(text)}
          //   onClick={async () => {
          //     const res = await axios.post(
          //       baseUrl + "/getMonitoringDevicesCards ",
          //       { ip_address: text }
          //     );

          //     console.log("getMonitoringDevicesCards", res);
          //     navigate("/monitoringsummary/main", {
          //       state: {
          //         ip_address: text,
          //         res: res.data,
          //       },
          //     });
          //   }}
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

      ...getColumnSearchProps(
        "ip_address",
        "IP Address",
        setInformationalRowCount,
        setInformationalDataSource,
        informationalExcelData,
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
          //   onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            //   textDecoration: "underline",
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            paddingTop: "10px",
            //  cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "description",
        "Description",
        setInformationalRowCount,
        setInformationalDataSource,
        informationalExcelData,
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
        setInformationalRowCount,
        setInformationalDataSource,
        informationalExcelData,
        columnFilters
      ),
      ellipsis: true,
    },

    // {
    //   title: "Function",
    //   dataIndex: "function",
    //   key: "function",
    //   render: (text, record) => (
    //     <p
    //       style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
    //     >
    //       {text}
    //     </p>
    //   ),

    //   ...getColumnSearchProps(
    //     "function",
    //     "Function",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
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
        setInformationalRowCount,
        setInformationalDataSource,
        informationalExcelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];
  const deviceDownColumns = [
    // {
    //   title: "",
    //   key: "edit",
    //   width: "2%",

    //   render: (text, record) => (
    //     <>
    //       {!configData?.uam.pages.sites.read_only ? (
    //         <>
    //           <a
    //             disabled
    //             // onClick={() => {
    //             //   edit(record);
    //             // }}
    //           >
    //             <EditOutlined
    //               style={{ paddingRight: "50px", color: "#66A111" }}
    //             />
    //           </a>
    //         </>
    //       ) : (
    //         <a
    //           onClick={() => {
    //             edit(record);
    //           }}
    //         >
    //           <EditOutlined
    //             style={{ paddingRight: "50px", color: "#66A111" }}
    //           />
    //         </a>
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          onClick={() => showModal(text)}
          //   onClick={async () => {
          //     const res = await axios.post(
          //       baseUrl + "/getMonitoringDevicesCards ",
          //       { ip_address: text }
          //     );

          //     console.log("getMonitoringDevicesCards", res);
          //     navigate("/monitoringsummary/main", {
          //       state: {
          //         ip_address: text,
          //         res: res.data,
          //       },
          //     });
          //   }}
          style={{
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            // color: "#66B127",
            // textDecoration: "underline",
            // cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "ip_address",
        "IP Address",
        setDeviceDownRowCount,
        setDeviceDownDataSource,
        deviceDownExcelData,
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
          //   onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            //   textDecoration: "underline",
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            paddingTop: "10px",
            //  cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "description",
        "Description",
        setDeviceDownRowCount,
        setDeviceDownDataSource,
        deviceDownExcelData,
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
        setDeviceDownRowCount,
        setDeviceDownDataSource,
        deviceDownExcelData,
        columnFilters
      ),
      ellipsis: true,
    },

    // {
    //   title: "Function",
    //   dataIndex: "function",
    //   key: "function",
    //   render: (text, record) => (
    //     <p
    //       style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
    //     >
    //       {text}
    //     </p>
    //   ),

    //   ...getColumnSearchProps(
    //     "function",
    //     "Function",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
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
        setDeviceDownRowCount,
        setDeviceDownDataSource,
        deviceDownExcelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  const [tableName, setTableName] = useState("Total Alert");
  const showTable = (myDataTable) => {
    if (myDataTable === "Total Alert") {
      setTableName("Total Alert");
      console.log("Total Alert");
    } else if (myDataTable === "Critical") {
      setTableName("Critical");
      console.log("Critical");
    } else if (myDataTable === "Attention") {
      setTableName("Attention");
    } else if (myDataTable === "Device Status") {
      setTableName("Device Status");
    }
  };

  const IpAddressTablecolumns = [
    // {
    //   title: "",
    //   key: "edit",
    //   width: "2%",

    //   render: (text, record) => (
    //     <>
    //       {!configData?.uam.pages.sites.read_only ? (
    //         <>
    //           <a
    //             disabled
    //             // onClick={() => {
    //             //   edit(record);
    //             // }}
    //           >
    //             <EditOutlined
    //               style={{ paddingRight: "50px", color: "#66A111" }}
    //             />
    //           </a>
    //         </>
    //       ) : (
    //         <a
    //           onClick={() => {
    //             edit(record);
    //           }}
    //         >
    //           <EditOutlined
    //             style={{ paddingRight: "50px", color: "#66A111" }}
    //           />
    //         </a>
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          // onClick={() => showModal(text)}
          //   onClick={async () => {
          //     const res = await axios.post(
          //       baseUrl + "/getMonitoringDevicesCards ",
          //       { ip_address: text }
          //     );

          //     console.log("getMonitoringDevicesCards", res);
          //     navigate("/monitoringsummary/main", {
          //       state: {
          //         ip_address: text,
          //         res: res.data,
          //       },
          //     });
          //   }}
          style={{
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            // color: "#66B127",
            // textDecoration: "underline",
            // cursor: "pointer",
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
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <p
          //   onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            //   textDecoration: "underline",
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            paddingTop: "10px",
            //  cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "description",
        "Description",
        setRowCount,
        setDataSource,
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
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    // {
    //   title: "Function",
    //   dataIndex: "function",
    //   key: "function",
    //   render: (text, record) => (
    //     <p
    //       style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
    //     >
    //       {text}
    //     </p>
    //   ),

    //   ...getColumnSearchProps(
    //     "function",
    //     "Function",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
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
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  return (
    <div>
      <div style={{ backgroundColor: "#FFFFFF", textAlign: "center" }}>
        <div style={{ marginRight: "12px", marginLeft: "12px" }}>
          <div style={{ marginRight: "15px", marginLeft: "15px" }}>
            <br />
            <SpinLoading spinning={alertStatusLoading}>
              <Row>
                <ColStyle
                  onClick={() => showTable("Total Alert")}
                  active={"Total Alert" === tableName}
                  xs={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                >
                  <DivStyle
                    onClick={() => showTable("Total Alert")}
                    style={{
                      display: "grid",
                      placeItems: "center",
                      height: "150px",
                      width: "160px",
                      // padding: "15px",
                      borderRadius: "50%",
                      border: "6px solid #66b127",
                      marginLeft: "15%",
                      marginRight: "15%",
                    }}
                  >
                    <PStyle
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#66b127",
                        padding: "0px",
                        margin: "0px",
                      }}
                    >
                      {alertStatus.total}
                      {/* {alertStatus.total} */}
                    </PStyle>
                  </DivStyle>
                  <DivStyle
                  // onClick={() => showTable("Total Alert")}
                  >
                    <p
                      // active={"Total Alert" === tableName}
                      onClick={() => showTable("Total Alert")}
                      style={{
                        fontWeight: 600,
                        color: "#66b127",
                        marginTop: "8px",
                      }}
                    >
                      Total Alert
                    </p>
                  </DivStyle>
                </ColStyle>
                <ColStyleTow
                  onClick={() => showTable("Critical")}
                  active={"Critical" === tableName}
                  xs={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                >
                  <DivStyle
                    onClick={() => showTable("Critical")}
                    style={{
                      display: "grid",
                      placeItems: "center",
                      height: "150px",
                      width: "160px",
                      // padding: "15px",
                      borderRadius: "50%",
                      border: "6px solid #FF5252",
                      marginLeft: "15%",
                      marginRight: "15%",
                    }}
                  >
                    <PStyle
                      onClick={() => showTable("Critical")}
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#FF5252",
                        padding: "0px",
                        margin: "0px",
                      }}
                    >
                      {alertStatus.critical}
                      {/* {alertStatus.total} */}
                    </PStyle>
                  </DivStyle>
                  <DivStyle

                  // onClick={() => showTable("Total Alert")}
                  >
                    <p
                      onClick={() => showTable("Critical")}
                      style={{
                        fontWeight: 600,
                        color: "#FF5252",
                        marginTop: "8px",
                      }}
                    >
                      Critical
                    </p>
                  </DivStyle>
                </ColStyleTow>
                <ColStyleTow
                  onClick={() => showTable("Attention")}
                  active={"Attention" === tableName}
                  xs={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                >
                  <DivStyle
                    onClick={() => showTable("Attention")}
                    style={{
                      display: "grid",
                      placeItems: "center",
                      height: "150px",
                      width: "160px",
                      // padding: "15px",
                      borderRadius: "50%",
                      border: "6px solid #FF9A40",
                      marginLeft: "15%",
                      marginRight: "15%",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#FF9A40",
                        padding: "0px",
                        margin: "0px",
                      }}
                    >
                      {alertStatus.informational}
                      {/* {alertStatus.total} */}
                    </p>
                  </DivStyle>
                  <DivStyle
                  // active={"Informational" === tableName}
                  // onClick={() => showTable("Total Alert")}
                  >
                    <p
                      onClick={() => showTable("Attention")}
                      style={{
                        fontWeight: 600,
                        color: "#FF9A40",
                        marginTop: "8px",
                      }}
                    >
                      Attention
                    </p>
                  </DivStyle>
                </ColStyleTow>
                <ColStyleTow
                  onClick={() => showTable("Device Status")}
                  active={"Device Status" === tableName}
                  xs={{ span: 24 }}
                  md={{ span: 12 }}
                  lg={{ span: 6 }}
                >
                  <div
                    onClick={() => showTable("Device Status")}
                    style={{
                      display: "grid",
                      placeItems: "center",
                      height: "150px",
                      width: "160px",
                      // padding: "15px",
                      borderRadius: "50%",
                      border: "6px solid #6FCBFF",
                      marginLeft: "15%",
                      marginRight: "15%",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#6FCBFF",
                        padding: "0px",
                        margin: "0px",
                      }}
                    >
                      {alertStatus.device_down}
                      {/* {alertStatus.total} */}
                    </p>
                  </div>
                  <p
                    onClick={() => showTable("Device Status")}
                    style={{
                      fontWeight: 600,
                      color: "#6FCBFF",
                      marginTop: "8px",
                    }}
                  >
                    Device Status
                  </p>
                </ColStyleTow>
              </Row>
            </SpinLoading>
            {/* <div
              style={{
                padding: "12px",
                // marginRight: "30px",
                // marginLeft: "30px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
              }}
            >
              <Row>
                <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
                  <Progress
                    type="dashboard"
                    percent={alertStatus.total}
                    strokeColor="#66b127"
                  />
                  <p style={{ fontWeight: 600, color: "#66b127" }}>
                    Total Alert
                  </p>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
                  <Progress
                    type="dashboard"
                    percent={alertStatus.critical}
                    strokeColor="#FF5252"
                  />
                  <p style={{ fontWeight: 600, color: "#FF5252" }}>Critical</p>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
                  <Progress
                    type="dashboard"
                    percent={alertStatus.informational}
                    strokeColor="#FF9A40"
                  />
                  <p style={{ fontWeight: 600, color: "#FF9A40" }}>
                    Informational
                  </p>
                </Col>
                <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
                  <Progress
                    type="dashboard"
                    percent={alertStatus.device_down}
                    strokeColor="#6FCBFF"
                  />
                  <p style={{ fontWeight: 600, color: "#6FCBFF" }}>
                    Device Status
                  </p>
                </Col>
              </Row>
            </div> */}
            <br />
            {/* <div style={{ float: "left" }}>
            <p
              style={{
                // marginLeft: "10px",
                fontWeight: "600",
                fontSize: "16px",
                color: "rgba(0,0,0,0.5)",
              }}
            >
              <LinkStyled
                style={{ color: "rgba(0,0,0,0.5)" }}
                to="/ipam/subnet/main"
              >
                Subnet
              </LinkStyled>{" "}
              /<span style={{ color: "#000" }}> IP History</span>
            </p>
          </div> */}
            <br />
            {/* <br />
          <br /> */}
            {tableName === "Total Alert" ? (
              <div
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#fcfcfc",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                }}
              >
                <h3
                  style={{
                    color: "#66b127",
                    borderLeft: "5px solid #66b127",
                    borderTopLeftRadius: "6px",
                    paddingLeft: "13px",
                    alignItems: "center",
                    textAlign: "left",
                    // marginLeft: '-6px',
                    paddingTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Alerts
                </h3>
                <div
                  style={{
                    display: "flex",
                    marginTop: "5px",
                    marginLeft: "10px",
                  }}
                >
                  <h4>Rows :</h4>&nbsp;
                  <ColRowNumberStyle>{rowCount}</ColRowNumberStyle>
                  &nbsp;&nbsp;
                  <h4>Cols :</h4>&nbsp;
                  <ColRowNumberStyle>5</ColRowNumberStyle>
                </div>
                <SpinLoading spinning={mainTableloading}>
                  <div style={{ padding: "25px" }}>
                    <TableStyling
                      // rowSelection={rowSelection}
                      columns={columns}
                      dataSource={dataSource}
                    />
                  </div>
                </SpinLoading>
              </div>
            ) : null}
            {tableName === "Critical" ? (
              <div
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#fcfcfc",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                }}
              >
                <h3
                  style={{
                    color: "#66b127",
                    borderLeft: "5px solid #66b127",
                    borderTopLeftRadius: "6px",
                    paddingLeft: "13px",
                    alignItems: "center",
                    textAlign: "left",
                    // marginLeft: '-6px',
                    paddingTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Critical
                </h3>
                <div
                  style={{
                    display: "flex",
                    marginTop: "5px",
                    marginLeft: "10px",
                  }}
                >
                  <h4>Rows :</h4>&nbsp;
                  <ColRowNumberStyle>{criticalRowCount}</ColRowNumberStyle>
                  &nbsp;&nbsp;
                  <h4>Cols :</h4>&nbsp;
                  <ColRowNumberStyle>5</ColRowNumberStyle>
                </div>
                <SpinLoading spinning={criticalDataSourceLoading}>
                  <div style={{ padding: "25px" }}>
                    <TableStyling
                      //  rowSelection={rowSelection}

                      columns={criticalColumns}
                      dataSource={criticalDataSource}
                    />
                  </div>
                </SpinLoading>
              </div>
            ) : null}
            {tableName === "Attention" ? (
              <div
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#fcfcfc",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                }}
              >
                <h3
                  style={{
                    color: "#66b127",
                    borderLeft: "5px solid #66b127",
                    borderTopLeftRadius: "6px",
                    paddingLeft: "13px",
                    alignItems: "center",
                    textAlign: "left",
                    // marginLeft: '-6px',
                    paddingTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Attention
                </h3>
                <div
                  style={{
                    display: "flex",
                    marginTop: "5px",
                    marginLeft: "10px",
                  }}
                >
                  <h4>Rows :</h4>&nbsp;
                  <ColRowNumberStyle>{informationalRowCount}</ColRowNumberStyle>
                  &nbsp;&nbsp;
                  <h4>Cols :</h4>&nbsp;
                  <ColRowNumberStyle>5</ColRowNumberStyle>
                </div>
                <SpinLoading spinning={informationalDataSourceLoading}>
                  <div style={{ padding: "25px" }}>
                    <TableStyling
                      // rowSelection={rowSelection}
                      columns={informationalColumns}
                      dataSource={informationalDataSource}
                    />
                  </div>
                </SpinLoading>
              </div>
            ) : null}
            {tableName === "Device Status" ? (
              <div
                style={{
                  borderRadius: "12px",
                  backgroundColor: "#fcfcfc",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                }}
              >
                <h3
                  style={{
                    color: "#66b127",
                    borderLeft: "5px solid #66b127",
                    borderTopLeftRadius: "6px",
                    paddingLeft: "13px",
                    alignItems: "center",
                    textAlign: "left",
                    // marginLeft: '-6px',
                    paddingTop: "8px",
                    fontWeight: "bold",
                  }}
                >
                  Device Status
                </h3>
                <div
                  style={{
                    display: "flex",
                    marginTop: "5px",
                    marginLeft: "10px",
                  }}
                >
                  <h4>Rows :</h4>&nbsp;
                  <ColRowNumberStyle>{deviceDownRowCount}</ColRowNumberStyle>
                  &nbsp;&nbsp;
                  <h4>Cols :</h4>&nbsp;
                  <ColRowNumberStyle>5</ColRowNumberStyle>
                </div>
                <SpinLoading spinning={deviceDownDataSourceLoading}>
                  <div style={{ padding: "25px" }}>
                    <TableStyling
                      // rowSelection={rowSelection}
                      columns={deviceDownColumns}
                      dataSource={deviceDownDataSource}
                    />
                  </div>
                </SpinLoading>
              </div>
            ) : null}

            <br />
          </div>
        </div>
      </div>
      <Modal
        width="70%"
        title="IP Address Details"
        visible={isModalOpen}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <TableStyling
          columns={IpAddressTablecolumns}
          dataSource={ipAddressData}
        />
      </Modal>
    </div>
  );
};

export default index;
