import React, { useState, useEffect } from "react";
import { Row, Table, Modal, Form, Radio, Input, message } from "antd";
import scanning from "./assets/scanning.svg";
import { SpinLoading, TableStyling } from "../AllStyling/All.styled.js";
import axios, { baseUrl } from "../../utils/axios";

import {
  ColStyle,
  PStyle,
  DivStyle,
  ColStyleTwo,
  ColStyleThree,
  ColStyleFour,
} from "./main.styled.js";
import unknownDevices from "./assets/unknown_devices.svg";
import firewalls from "./assets/firewall.svg";
import switches from "./assets/switches.svg";
import otherDevices from "./assets/other_devices.svg";
import styled from "styled-components";
import Swal from "sweetalert2";

import { columnSearch } from "../../utils";

let excelData = [];
let excelDataSwitches = [];
let excelDataFirewall = [];
let excelDataOtherDevices = [];
let excelDataRouters = [];
let columnFilters = {};

const indexMain = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [scanSubnet, setScanSubnet] = useState("All");
  const [alertStatusLoading, setAlertStatusLoading] = useState(false);
  let [dataSource, setDataSource] = useState(excelData);
  let [SwitchesDataSource, setSwitchesDataSource] = useState(excelDataSwitches);
  let [FirewallDataSource, setFirewallDataSource] = useState(excelDataFirewall);
  let [OtherDevicesDataSource, setOtherDevicesDataSource] = useState(
    excelDataOtherDevices
  );
  let [RoutersDataSource, setRoutersDataSource] = useState(excelDataRouters);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  let [loading, setLoading] = useState(false);
  let [postloading, setPostLoading] = useState(false);
  let [FirewallLoading, setFirewallLoading] = useState(false);
  let [SwitchesLoading, setSwitchesLoading] = useState(false);
  let [OtherDevicesLoading, setOtherDevicesLoading] = useState(false);
  let [RoutersLoading, setRoutersLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [FirewallRowCount, setFirewallRowCount] = useState(0);
  const [SwitchesRowCount, setSwitchesRowCount] = useState(0);
  const [OtherDevicesRowCount, setOtherDevicesRowCount] = useState(0);
  const [RoutersRowCount, setRoutersRowCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [getCount, setCount] = useState("");

  const [value, setValue] = useState(1);
  const onChange = (e) => {
    setValue(e.target.value);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    FirewallTrigger();
    SwitchesTrigger();
    OtherDevicesTrigger();
    RoutersTrigger();
    AllDevicesDataTrigger();
  }, [scanSubnet]);

  const FirewallTrigger = async () => {
    setFirewallLoading(true);

    try {
      const res = await axios.post(baseUrl + "/getDiscoveryDataFirewalls", {
        subnet: scanSubnet,
      });
      excelDataFirewall = res.data;
      setFirewallDataSource(excelDataFirewall);
      setFirewallRowCount(excelDataFirewall.length);
      setFirewallLoading(false);
    } catch (err) {
      console.log(err.response);
      setFirewallLoading(false);
    }
  };

  const SwitchesTrigger = async () => {
    setSwitchesLoading(true);

    try {
      const res = await axios.post(baseUrl + "/getDiscoveryDataSwitches", {
        subnet: scanSubnet,
      });
      excelDataSwitches = res.data;
      setSwitchesDataSource(excelDataSwitches);
      setSwitchesRowCount(excelDataSwitches.length);
      setSwitchesLoading(false);
    } catch (err) {
      setSwitchesLoading(false);
    }
  };

  const OtherDevicesTrigger = async () => {
    setOtherDevicesLoading(true);

    try {
      const res = await axios.post(baseUrl + "/getDiscoveryDataOthers", {
        subnet: scanSubnet,
      });
      excelDataOtherDevices = res.data;
      setOtherDevicesDataSource(excelDataOtherDevices);
      setOtherDevicesRowCount(excelDataOtherDevices.length);
      setOtherDevicesLoading(false);
    } catch (err) {
      setOtherDevicesLoading(false);
    }
  };

  const RoutersTrigger = async () => {
    setRoutersLoading(true);

    try {
      const res = await axios.post(baseUrl + "/getDiscoveryDataRouters", {
        subnet: scanSubnet,
      });
      excelDataRouters = res.data;
      setRoutersDataSource(excelDataRouters);
      setRoutersRowCount(excelDataRouters.length);
      setRoutersLoading(false);
    } catch (err) {
      console.log(err.response);
      setRoutersLoading(false);
    }
  };

  const AllDevicesDataTrigger = async () => {
    setLoading(true);

    try {
      const res = await axios.post(baseUrl + "/getDiscoveryData", {
        subnet: scanSubnet,
      });
      excelData = res.data;
      setDataSource(excelData);
      setRowCount(excelData.length);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const [tableName, setTableName] = useState("Unknown Devices");

  const showTable = (myDataTable) => {
    if (myDataTable === "Unknown Devices") {
      setTableName("Unknown Devices");
      AllDevicesDataTrigger();
    } else if (myDataTable === "Firewalls") {
      setTableName("Firewalls");
      FirewallTrigger();
    } else if (myDataTable === "Switches") {
      setTableName("Switches");
      SwitchesTrigger();
    } else if (myDataTable === "Routers") {
      setTableName("Routers");
      RoutersTrigger();
    } else if (myDataTable === "Other Devices") {
      setTableName("Other Devices");
      OtherDevicesTrigger();
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

  const onFinish = async (values) => {
    setPostLoading(true);

    await axios
      .post(baseUrl + "/autoDiscover", values)
      .then((response) => {
        message.info("Scanning Started...");

        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");

          setPostLoading(false);
        } else {
          openSweetAlert(response?.data, "success");
          values.range("");
          values.ip_address("");
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getDiscoveryData")
              .then((response) => {
                excelData = response?.data;
                setRowCount(response?.data?.length);
                setDataSource(response?.data);

                setPostLoading(false);
              })
              .catch((error) => {
                console.log(error);
                // openSweetAlert("Something Went Wrong!", "danger");
                setPostLoading(false);
              })
          );
          setPostLoading(false);
          return Promise.all(promises);
        }
      })
      .catch((err) => {
        openSweetAlert(response?.data, "error");
        console.log("error ==> " + err);
        setPostLoading(false);
      });
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
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
    columnWidth: 40,
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
  };
  const [subnetArray, setsubnetArray] = useState([]);

  useEffect(() => {
    const serviceCalls = async () => {
      setAlertStatusLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getSubnetsDropdown");
        setsubnetArray(res.data);
        setScanSubnet(res.data[0]);
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
      setLoading(true);

      try {
        const res = await axios.post(baseUrl + "/getDiscoveryData", {
          subnet: scanSubnet,
        });
        excelData = res.data;
        setDataSource(excelData);
        setRowCount(excelData.length);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, [scanSubnet]);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.post(baseUrl + "/getDiscoveryFunctionCount", {
          subnet: scanSubnet,
        });
        setCount(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, [scanSubnet]);

  const columns = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

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
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "subnet",
        "Subnet",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Make & Model",
      dataIndex: "make_model",
      key: "make_model",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "make_model",
        "Make & Model",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "OS Type",
      dataIndex: "os_type",
      key: "os_type",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "os_type",
        "OS Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "SNMP Status",
      dataIndex: "snmp_status",
      key: "snmp_status",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "snmp_status",
        "SNMP Status",
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
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
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
      title: "snmp",
      dataIndex: "snmp_version",
      key: "snmp_version",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "snmp_version",
        "SNMP Version",
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
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
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

      ...getColumnSearchProps(
        "creation_date",
        "Creation Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),
    },

    {
      title: "Modification Date",
      dataIndex: "modification_date",
      key: "modification_date",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

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
  ];

  const FirewallsColumns = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "ip_address",
        "Ip Address",
        setFirewallRowCount,
        setFirewallDataSource,
        excelDataFirewall,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "subnet",
        "Subnet",
        setFirewallRowCount,
        setFirewallDataSource,
        excelDataFirewall,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Make & Model",
      dataIndex: "make_model",
      key: "make_model",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "make_model",
        "Make & Model",
        setFirewallRowCount,
        setFirewallDataSource,
        excelDataFirewall,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "OS Type",
      dataIndex: "os_type",
      key: "os_type",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "os_type",
        "OS Type",
        setFirewallRowCount,
        setFirewallDataSource,
        excelDataFirewall,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "SNMP Status",
      dataIndex: "snmp_status",
      key: "snmp_status",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "snmp_status",
        "SNMP Status",
        setFirewallRowCount,
        setFirewallDataSource,
        excelDataFirewall,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "vendor",
        "Vendor",
        setFirewallRowCount,
        setFirewallDataSource,
        excelDataFirewall,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "snmp",
      dataIndex: "snmp_version",
      key: "snmp_version",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "snmp_version",
        "SNMP Version",
        setFirewallRowCount,
        setFirewallDataSource,
        excelDataFirewall,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "function",
      dataIndex: "function",
      key: "function",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "function",
        "Function",
        setFirewallRowCount,
        setFirewallDataSource,
        excelDataFirewall,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Creation Date",
      dataIndex: "creation_date",
      key: "creation_date",

      ...getColumnSearchProps(
        "creation_date",
        "Creation Date",
        setFirewallRowCount,
        setFirewallDataSource,
        excelDataFirewall,
        columnFilters
      ),
      ellipsis: true,
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),
    },

    {
      title: "Modification Date",
      dataIndex: "modification_date",
      key: "modification_date",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "modification_date",
        "Modification Date",
        setFirewallRowCount,
        setFirewallDataSource,
        excelDataFirewall,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  const SwitchesColumns = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "ip_address",
        "Ip Address",
        setSwitchesRowCount,
        setSwitchesDataSource,
        excelDataSwitches,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "subnet",
        "Subnet",
        setSwitchesRowCount,
        setSwitchesDataSource,
        excelDataSwitches,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Make & Model",
      dataIndex: "make_model",
      key: "make_model",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "make_model",
        "Make & Model",
        setSwitchesRowCount,
        setSwitchesDataSource,
        excelDataSwitches,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "OS Type",
      dataIndex: "os_type",
      key: "os_type",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "os_type",
        "OS Type",
        setSwitchesRowCount,
        setSwitchesDataSource,
        excelDataSwitches,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "SNMP Status",
      dataIndex: "snmp_status",
      key: "snmp_status",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "snmp_status",
        "SNMP Status",
        setSwitchesRowCount,
        setSwitchesDataSource,
        excelDataSwitches,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "vendor",
        "Vendor",
        setSwitchesRowCount,
        setSwitchesDataSource,
        excelDataSwitches,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "snmp",
      dataIndex: "snmp_version",
      key: "snmp_version",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "snmp_version",
        "SNMP Version",
        setSwitchesRowCount,
        setSwitchesDataSource,
        excelDataSwitches,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "function",
      dataIndex: "function",
      key: "function",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "function",
        "Function",
        setSwitchesRowCount,
        setSwitchesDataSource,
        excelDataSwitches,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Creation Date",
      dataIndex: "creation_date",
      key: "creation_date",

      ...getColumnSearchProps(
        "creation_date",
        "Creation Date",
        setSwitchesRowCount,
        setSwitchesDataSource,
        excelDataSwitches,
        columnFilters
      ),
      ellipsis: true,
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),
    },

    {
      title: "Modification Date",
      dataIndex: "modification_date",
      key: "modification_date",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "modification_date",
        "Modification Date",
        setSwitchesRowCount,
        setSwitchesDataSource,
        excelDataSwitches,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  const OtherDevicesColumns = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "ip_address",
        "Ip Address",
        setOtherDevicesRowCount,
        setOtherDevicesDataSource,
        excelDataOtherDevices,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "subnet",
        "Subnet",
        setOtherDevicesRowCount,
        setOtherDevicesDataSource,
        excelDataOtherDevices,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Make & Model",
      dataIndex: "make_model",
      key: "make_model",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "make_model",
        "Make & Model",
        setOtherDevicesRowCount,
        setOtherDevicesDataSource,
        excelDataOtherDevices,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "OS Type",
      dataIndex: "os_type",
      key: "os_type",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "os_type",
        "OS Type",
        setOtherDevicesRowCount,
        setOtherDevicesDataSource,
        excelDataOtherDevices,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "SNMP Status",
      dataIndex: "snmp_status",
      key: "snmp_status",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "snmp_status",
        "SNMP Status",
        setOtherDevicesRowCount,
        setOtherDevicesDataSource,
        excelDataOtherDevices,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "vendor",
        "Vendor",
        setOtherDevicesRowCount,
        setOtherDevicesDataSource,
        excelDataOtherDevices,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "snmp",
      dataIndex: "snmp_version",
      key: "snmp_version",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "snmp_version",
        "SNMP Version",
        setOtherDevicesRowCount,
        setOtherDevicesDataSource,
        excelDataOtherDevices,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "function",
      dataIndex: "function",
      key: "function",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "function",
        "Function",
        setOtherDevicesRowCount,
        setOtherDevicesDataSource,
        excelDataOtherDevices,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Creation Date",
      dataIndex: "creation_date",
      key: "creation_date",

      ...getColumnSearchProps(
        "creation_date",
        "Creation Date",
        setOtherDevicesRowCount,
        setOtherDevicesDataSource,
        excelDataOtherDevices,
        columnFilters
      ),
      ellipsis: true,
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),
    },

    {
      title: "Modification Date",
      dataIndex: "modification_date",
      key: "modification_date",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "modification_date",
        "Modification Date",
        setOtherDevicesRowCount,
        setOtherDevicesDataSource,
        excelDataOtherDevices,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  const RoutersColumns = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "ip_address",
        "Ip Address",
        setRoutersRowCount,
        setRoutersDataSource,
        excelDataRouters,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "subnet",
        "Subnet",
        setRoutersRowCount,
        setRoutersDataSource,
        excelDataRouters,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Make & Model",
      dataIndex: "make_model",
      key: "make_model",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "make_model",
        "Make & Model",
        setRoutersRowCount,
        setRoutersDataSource,
        excelDataRouters,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "OS Type",
      dataIndex: "os_type",
      key: "os_type",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "os_type",
        "OS Type",
        setRoutersRowCount,
        setRoutersDataSource,
        excelDataRouters,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "SNMP Status",
      dataIndex: "snmp_status",
      key: "snmp_status",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "snmp_status",
        "SNMP Status",
        setRoutersRowCount,
        setRoutersDataSource,
        excelDataRouters,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "vendor",
        "Vendor",
        setRoutersRowCount,
        setRoutersDataSource,
        excelDataRouters,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "snmp",
      dataIndex: "snmp_version",
      key: "snmp_version",
      render: (text, record) => (
        <p
          style={{
            textAlign: "center",
            paddingTop: "16px",
            paddingTop: "16px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "snmp_version",
        "SNMP Version",
        setRoutersRowCount,
        setRoutersDataSource,
        excelDataRouters,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "function",
      dataIndex: "function",
      key: "function",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "function",
        "Function",
        setRoutersRowCount,
        setRoutersDataSource,
        excelDataRouters,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Creation Date",
      dataIndex: "creation_date",
      key: "creation_date",

      ...getColumnSearchProps(
        "creation_date",
        "Creation Date",
        setRoutersRowCount,
        setRoutersDataSource,
        excelDataRouters,
        columnFilters
      ),
      ellipsis: true,
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),
    },

    {
      title: "Modification Date",
      dataIndex: "modification_date",
      key: "modification_date",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "modification_date",
        "Modification Date",
        setRoutersRowCount,
        setRoutersDataSource,
        excelDataRouters,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  const [subnetScanLoadings, setSubnetScanLoading] = useState(false);

  const startScanning = async () => {
    setSubnetScanLoading(true);
    try {
      await axios
        .post(baseUrl + "/autoDiscover", { subnet: scanSubnet })
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            setSubnetScanLoading(false);
          } else {
            openSweetAlert(`Subnet Scanned Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .post(baseUrl + "/getDiscoveryData", { subnet: scanSubnet })
                .then((response) => {
                  excelData = response.data;
                  setDataSource(response.data);
                  setRowCount(response.data.length);
                  setSubnetScanLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setSubnetScanLoading(false);
                })
            );

            promises.push(
              axios
                .post(baseUrl + "/getDiscoveryFunctionCount", {
                  subnet: scanSubnet,
                })
                .then((res) => {
                  setCount(res.data);
                  setLoading(false);
                })
                .catch((err) => {
                  console.log("DiscoverFunctionError ===========>", err);
                  setLoading(false);
                })
            );

            return Promise.all(promises);
          }
        })
        .catch((error) => {
          setSubnetScanLoading(false);

          console.log("in add seed device catch ==> " + error);
        });
    } catch (err) {
      setSubnetScanLoading(false);

      console.log(err);
    }
  };

  return (
    <>
      <div style={{ marginLeft: "15px", marginRight: "15px" }}>
        <div
          style={{
            marginRight: "15px",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
            borderRadius: "12px",
            backgroundColor: "#fcfcfc",
            width: "100%",
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
            Networks
          </h3>
          <div style={{ display: "flex", padding: "8px", width: "100%" }}>
            <div style={{ textAlign: "center", width: "20%", height: "100%" }}>
              <img src={scanning} alt="" />
              <br />

              <SpinLoading spinning={subnetScanLoadings} tip="Scanning">
                <div style={{ width: "100%" }}>
                  <InputWrapper style={{ width: "18vw", textAlign: "center" }}>
                    <br />
                    <div className="select_type">
                      <Styledselect
                        className="rectangle"
                        required
                        value={scanSubnet}
                        style={{ width: "18vw", textAlign: "center" }}
                        onChange={(e) => setScanSubnet(e.target.value)}
                      >
                        {subnetArray?.map((item, index) => {
                          return <option key={index}>{item}</option>;
                        })}
                      </Styledselect>
                    </div>
                  </InputWrapper>
                </div>

                <button
                  onClick={() => startScanning()}
                  style={{
                    textAlign: "center",
                    color: "#fff",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: "#3D9E47",
                    cursor: "pointer",
                    marginTop: "8px",
                  }}
                >
                  Start Scanning Devices
                </button>
              </SpinLoading>
            </div>

            <div style={{ width: "80%" }}>
              <Row gutter={[8, 8]}>
                <ColStyle
                  className="gutter-row"
                  onClick={() => showTable("Unknown")}
                  active={"Unknown Devices" === tableName}
                  span={4}
                  style={{
                    height: "140px",
                    paddingTop: "35px",
                    marginRight: "15px",
                  }}
                >
                  <DivStyle onClick={() => showTable("Unknown Devices")}>
                    <PStyle
                      active={"Unknown Devices" === tableName}
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#000000",
                        padding: "0px",
                        margin: "0px",
                        padding: "auto",
                      }}
                    >
                      {getCount && getCount.devices}
                    </PStyle>
                    <PStyle
                      active={"Unknown Devices" === tableName}
                      style={{
                        fontWeight: 600,
                        color: "#000000",
                      }}
                    >
                      <img
                        src={unknownDevices}
                        alt=""
                        style={{ widows: "30px", height: "30px" }}
                      />{" "}
                      &nbsp; All Devices
                    </PStyle>
                  </DivStyle>
                </ColStyle>
                <ColStyleTwo
                  onClick={() => showTable("Firewalls")}
                  active={"Firewalls" === tableName}
                  span={4}
                  style={{
                    height: "140px",
                    paddingTop: "35px",
                    marginRight: "15px",
                  }}
                >
                  <DivStyle onClick={() => showTable("Firewalls")}>
                    <PStyle
                      active={"Firewalls" === tableName}
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#000000",
                        padding: "0px",
                        margin: "0px",
                        padding: "auto",
                      }}
                    >
                      {getCount && getCount.firewall}
                    </PStyle>
                    <PStyle
                      active={"Firewalls" === tableName}
                      style={{
                        fontWeight: 600,
                        color: "#000000",
                      }}
                    >
                      <img
                        src={firewalls}
                        alt=""
                        style={{ widows: "30px", height: "30px" }}
                      />{" "}
                      &nbsp; Firewalls
                    </PStyle>
                  </DivStyle>
                </ColStyleTwo>
                <ColStyleThree
                  onClick={() => showTable("Switches")}
                  active={"Switches" === tableName}
                  span={4}
                  style={{
                    height: "140px",
                    paddingTop: "35px",
                    marginRight: "15px",
                  }}
                >
                  <DivStyle onClick={() => showTable("Switches")}>
                    <PStyle
                      active={"Switches" === tableName}
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#000000",
                        padding: "0px",
                        margin: "0px",
                        padding: "auto",
                      }}
                    >
                      {getCount && getCount.switch}
                    </PStyle>
                    <PStyle
                      active={"Switches" === tableName}
                      style={{
                        fontWeight: 600,
                        color: "#000000",
                      }}
                    >
                      <img
                        src={switches}
                        alt=""
                        style={{ widows: "30px", height: "30px" }}
                      />{" "}
                      &nbsp; Switches
                    </PStyle>
                  </DivStyle>
                </ColStyleThree>
                <ColStyleThree
                  onClick={() => showTable("Routers")}
                  active={"Routers" === tableName}
                  span={4}
                  style={{
                    height: "140px",
                    paddingTop: "35px",
                    marginRight: "15px",
                  }}
                >
                  <DivStyle onClick={() => showTable("Routers")}>
                    <PStyle
                      active={"Routers" === tableName}
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#000000",
                        padding: "0px",
                        margin: "0px",
                        padding: "auto",
                      }}
                    >
                      {getCount && getCount.router}
                    </PStyle>
                    <PStyle
                      active={"Routers" === tableName}
                      style={{
                        fontWeight: 600,
                        color: "#000000",
                      }}
                    >
                      <img
                        src={switches}
                        alt=""
                        style={{ widows: "30px", height: "30px" }}
                      />{" "}
                      &nbsp; Routers
                    </PStyle>
                  </DivStyle>
                </ColStyleThree>
                <ColStyleFour
                  onClick={() => showTable("Other Devices")}
                  active={"Other Devices" === tableName}
                  span={4}
                  style={{
                    height: "140px",
                    paddingTop: "35px",
                    marginRight: "15px",
                  }}
                >
                  <DivStyle onClick={() => showTable("Other Devices")}>
                    <PStyle
                      active={"Other Devices" === tableName}
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#000000",
                        padding: "0px",
                        margin: "0px",
                        padding: "auto",
                      }}
                    >
                      {getCount && getCount.other}
                    </PStyle>
                    <PStyle
                      active={"Other Devices" === tableName}
                      style={{
                        fontWeight: 600,
                        color: "#000000",
                      }}
                    >
                      <img
                        src={otherDevices}
                        alt=""
                        style={{ widows: "30px", height: "30px" }}
                      />{" "}
                      &nbsp; Other Devices
                    </PStyle>
                  </DivStyle>
                </ColStyleFour>
              </Row>
            </div>
          </div>
        </div>
        <br />
        <div
          style={{
            marginRight: "15px",
            boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
            borderRadius: "12px",
            backgroundColor: "#fcfcfc",
            width: "100%",
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
            Discovery Status
          </h3>

          <SpinLoading spinning={loading} tip="Loading...">
            {tableName === "Unknown Devices" ? (
              <TableStyling
                rowSelection={rowSelection}
                scroll={{ x: 2200 }}
                rowKey="ip_address"
                columns={columns}
                dataSource={dataSource}
                style={{ width: "100%", padding: "2%" }}
              />
            ) : null}

            {tableName === "Firewalls" ? (
              <TableStyling
                rowSelection={rowSelection}
                scroll={{ x: 2200 }}
                rowKey="ip_address"
                columns={FirewallsColumns}
                dataSource={FirewallDataSource}
                style={{ width: "100%", padding: "2%" }}
              />
            ) : null}

            {tableName === "Switches" ? (
              <TableStyling
                rowSelection={rowSelection}
                scroll={{ x: 2200 }}
                rowKey="ip_address"
                columns={SwitchesColumns}
                dataSource={SwitchesDataSource}
                style={{ width: "100%", padding: "2%" }}
              />
            ) : null}

            {tableName === "Routers" ? (
              <TableStyling
                rowSelection={rowSelection}
                scroll={{ x: 2200 }}
                rowKey="ip_address"
                columns={RoutersColumns}
                dataSource={RoutersDataSource}
                style={{ width: "100%", padding: "2%" }}
              />
            ) : null}

            {tableName === "Other Devices" ? (
              <TableStyling
                rowSelection={rowSelection}
                scroll={{ x: 2200 }}
                rowKey="ip_address"
                columns={OtherDevicesColumns}
                dataSource={OtherDevicesDataSource}
                style={{ width: "100%", padding: "2%" }}
              />
            ) : null}
          </SpinLoading>
        </div>
      </div>

      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        footer={false}
        onCancel={handleCancel}
      >
        <SpinLoading spinning={postloading}>
          <div style={{ backgroundColor: "rgba(0,0,0,0.06)", padding: "10px" }}>
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>Subnet</Radio>
              <Radio value={2}>IP Range</Radio>
            </Radio.Group>
            <br />
            <br />
            <Form
              layout="horizontal"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              disabled={value == 2 ? true : false}
              style={{
                display: "flex",
              }}
            >
              <Form.Item
                label="Subnet"
                name="subnet"
                rules={[
                  {
                    required: true,
                    message: "Please input your subnet!",
                  },
                ]}
              >
                <StyledInput
                  style={{ width: "220px" }}
                  placeholder="111.111.111.111/26"
                />
              </Form.Item>{" "}
              &nbsp;&nbsp;
              <button
                disabled={value == 2 ? true : false}
                type="primary"
                htmltype="submit"
                style={{
                  height: "32px",
                  width: "80px",
                  textAlign: "center",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#3D9E47",

                  cursor: value == 2 ? "no-drop" : "pointer",
                }}
              >
                Submit
              </button>
            </Form>
            <Form
              layout="horizontal"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              disabled={value == 1 ? true : false}
              style={{
                display: "flex",
              }}
            >
              <Form.Item
                label="Ip Range"
                name="Range"
                rules={[
                  {
                    required: true,
                    message: "Please input your Ip Range!",
                  },
                ]}
              >
                <StyledInput
                  style={{ width: "220px" }}
                  placeholder="111.111.111.111-112"
                />
              </Form.Item>{" "}
              &nbsp;&nbsp;
              <button
                disabled={value == 1 ? true : false}
                type="primary"
                htmltype="submit"
                style={{
                  height: "32px",
                  width: "80px",
                  textAlign: "center",
                  color: "#fff",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  border: "none",
                  backgroundColor: "#3D9E47",

                  cursor: value == 1 ? "no-drop" : "pointer",
                }}
              >
                Submit
              </button>
            </Form>
          </div>
        </SpinLoading>
      </Modal>
    </>
  );
};
const StyledInput = styled(Input)`
  border-radius: 12px;
  border: none !important;
  box-shadow: none !important;
  overflow: hidden;
  background-color: rbga(120, 0, 0, 0.5);
  &:focus {
    border: 1px solid #6ab344 !important;
  }
`;
const Styledselect = styled.select`
  height: 2.2rem;
  border-radius: 12px;
  width: 100%;
  outline: none;
  border: 0.1px solid #cfcfcf;
`;
const InputWrapper = styled.div`
  text-align: left;
  font-size: 12px;

  padding-bottom: 10px;
`;

export default indexMain;
