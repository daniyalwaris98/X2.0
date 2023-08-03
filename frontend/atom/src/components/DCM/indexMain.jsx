import React, { useState, useEffect, useRef } from "react";
import dcm from "./assets/dcm.svg";
import { Row, Col, Table, Spin, Select } from "antd";
import conports from "./assets/conports.svg";
import notconports from "./assets/notconports.svg";
import totalports from "./assets/totalports.svg";
import unused from "./assets/unused.svg";
import BarChart from "./BarChart";
import { columnSearch } from "../../utils";
import myexport from "../UAM/assets/export.svg";
import * as XLSX from "xlsx";
import axios, { baseUrl } from "../../utils/axios";
import { SpinLoading } from "../AllStyling/All.styled.js";
import NotConnectedPorts from "./BarChart/NotConnectedPorts.jsx";
import UnusedSfps from "./RadialBarChart/UnusedSfps.jsx";
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
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
} from "../AllStyling/All.styled.js";
import RadialBarChart from "./RadialBarChart";

let excelData = [];
let columnFilters = {};

const index = () => {
  const [backgroundColor, setBackgroundColor] = useState("green");

  let [dataSource, setDataSource] = useState(excelData);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dcmMainloading, setDcmMainloading] = useState(false);
  const [AllIpamDeviceLoading, setAllIpamDeviceLoading] = useState(false);

  let [fetchLoading, setFetchLoading] = useState("empty");
  let [fetchDate, setFetchDate] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const inputRef = useRef(null);
  const [configData, setConfigData] = useState(null);
  const [total_ports, setTotalPorts] = useState("");
  const [connectedPorts, setConnectedPorts] = useState("");
  const [notconnectedPorts, setNotConnectedPorts] = useState("");
  const [unsedSfps, setUnusedSfps] = useState("");

  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
    console.log(JSON.parse(config));
  }, []);

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );

  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  useEffect(() => {
    const getAllIpamFetchDevices = async () => {
      setAllIpamDeviceLoading(true);
      const status = await axios.get(baseUrl + "/getEdnDcCapacityFetchStatus");

      if (status && status.data.fetch_status === "Running") {
        setFetchLoading("true");
        setBackgroundColor("red");
      } else if (status && status.data.fetch_status === "Completed") {
        setFetchLoading("false");
        setBackgroundColor("green");
      } else {
        setFetchLoading("empty");
      }
      setFetchDate(status.data.fetch_date);

      try {
        const res = await axios.get(baseUrl + "/getAllDcCapacity");

        excelData = res.data;
        setDataSource(excelData);
        setRowCount(excelData.length);
        setAllIpamDeviceLoading(false);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    getAllIpamFetchDevices();
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: !configData?.dcm.pages.dcm.read_only,
    }),
  };
  const exportSeed = async () => {
    jsonToExcel(excelData);
  };

  const jsonToExcel = (atomData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "dcm");
      XLSX.writeFile(wb, "dcm.xlsx");
      // setExportLoading(false);
    } else {
      openSweetAlert("No Data Found!", "danger");
    }
  };

  const openNotification = () => {
    notification.open({
      message: "File Exported Successfully",
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  useEffect(() => {
    const serviceCalls = async () => {
      setDcmMainloading(true);
      try {
        const res = await axios.get(baseUrl + "/getAllDcCapacity");

        excelData = res.data;
        setDataSource(excelData);
        setRowCount(excelData.length);
        setDcmMainloading(false);
      } catch (err) {
        console.log(err.response);
        setDcmMainloading(false);
      }
    };
    serviceCalls();
  }, []);
  useEffect(() => {
    const TotalPorts = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/dcCapacityTotalPorts");
        console.log("setTotalPorts", res.data);
        setTotalPorts(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    TotalPorts();
  }, []);
  useEffect(() => {
    const AllConnectedPorts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/dcCapacityConnectedPorts");
        setConnectedPorts(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    AllConnectedPorts();
  }, []);
  useEffect(() => {
    const AllNotConnectedPorts = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/dcCapacityNotConnectedPorts");
        setNotConnectedPorts(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    AllNotConnectedPorts();
  }, []);
  useEffect(() => {
    const AllUnsedSfps = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/dcCapacityUnusedSfps");
        setUnusedSfps(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    AllUnsedSfps();
  }, []);
  const handleOnboard = async () => {
    // setOnboardLoading(true);
    setFetchLoading("true");
    setFetchDate(new Date().toLocaleString());
    setBackgroundColor("red");
    axios
      .get(baseUrl + "/fetchEdnDcCapacity")
      .then((response) => {
        console.log("fetchEdnDcCapacity", response.data);
        // if (response.data === "Success") {
        //   setFetchLoading("empty");
        // }
        // setOnboardLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // openSweetAlert("Something Went Wrong!", "error");

        // setOnboardLoading(false);
      })
      //   );
      //   return Promise.all(promises);
      // })
      .catch((err) => {
        console.log(err);
        openSweetAlert("Something Went Wrong!", "error");
        // setLoading(false);
      });
    // setLoading(false);
    // } else {
    //   setOnboardLoading(false);
    //   openSweetAlert("No device is selected.!", "error");
    // }

    // setDataSource(
    //   dataSource.filter((item) => selectedDevices.includes(item.ne_ip_address))
    // );
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
  // useEffect(() => {
  //   inputRef.current.addEventListener("input", importExcel);
  // }, []);

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

  const column = [
    // {
    //   title: "",
    //   key: "edit",
    //   width: "2%",

    //   render: (text, record) => (
    //     <>
    //       {!configData?.dcm.pages.dcm.read_only ? (
    //         <>
    //           <a
    //             disabled
    //             // onClick={() => {
    //             //   edit(record);
    //             // }}
    //           >
    //             <EditOutlined style={{ paddingRight: "50px" }} />
    //           </a>
    //         </>
    //       ) : (
    //         <a
    //           onClick={() => {
    //             edit(record);
    //           }}
    //         >
    //           <EditOutlined style={{ paddingRight: "50px" }} />
    //         </a>
    //       )}
    //     </>
    //   ),
    // },
    // {
    //   title: "DC Capacity Id",
    //   dataIndex: "dc_capacity_id",
    //   key: "dc_capacity_id",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,
    //   ...getColumnSearchProps(
    //     "dc_capacity_id",
    //     "DC Capacity Id",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    {
      title: "Device Ip",
      dataIndex: "device_ip",
      key: "device_ip",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "device_ip",
        "Device Ip",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Site Name",
      dataIndex: "site_name",
      key: "site_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

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
      title: "Device Name",
      dataIndex: "device_name",
      key: "device_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,
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
      title: "OS Version",
      dataIndex: "os_version",
      key: "os_version",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "os_version",
        "OS Version",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Total 1G Ports",
      dataIndex: "total_1g_ports",
      key: "total_1g_ports",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "total_1g_ports",
        "Total 1G Ports",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Total 10G Ports",
      dataIndex: "total_10g_ports",
      key: "total_10g_ports",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "total_10g_ports",
        "Total 10G Ports",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Total 25G Ports",
      dataIndex: "total_25g_ports",
      key: "total_25g_ports",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "total_25g_ports",
        "Total 25G Ports",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Total 40G Ports",
      dataIndex: "total_40g_ports",
      key: "total_40g_ports",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "total_40g_ports",
        "Total 40G Ports",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Total 100G Ports",
      dataIndex: "total_100g_ports",
      key: "total_100g_ports",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "total_100g_ports",
        "Total 100G Ports",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Total Fast Ethernet Ports",
      dataIndex: "total_fast_ethernet_ports",
      key: "total_fast_ethernet_ports",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "total_fast_ethernet_ports",
        "Total Fast Ethernet Ports",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Connected 1G",
      dataIndex: "connected_1g",
      key: "connected_1g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "connected_1g",
        "Connected 1G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Connected 10G",
      dataIndex: "connected_10g",
      key: "connected_10g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "connected_10g",
        "Connected 10G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Connected 25G",
      dataIndex: "connected_25g",
      key: "connected_25g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "connected_25g",
        "Connected 25G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Connected 40G",
      dataIndex: "connected_40g",
      key: "connected_40g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "connected_40g",
        "Connected 40G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Connected 100G",
      dataIndex: "connected_100g",
      key: "connected_100g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "connected_100g",
        "Connected 100G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Connected Fast Ethernet",
      dataIndex: "connected_fast_ethernet",
      key: "connected_fast_ethernet",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "connected_fast_ethernet",
        "Connected Fast Ethernet",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Not Connected 1G",
      dataIndex: "not_connected_1g",
      key: "not_connected_1g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "not_connected_1g",
        "Not Connected 1G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Not Connected 10G",
      dataIndex: "not_connected_10g",
      key: "not_connected_10g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "not_connected_10g",
        "Not Connected 10G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Not Connected 25G",
      dataIndex: "not_connected_25g",
      key: "not_connected_25g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "not_connected_25g",
        "Not Connected 25G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Not Connected 40G",
      dataIndex: "not_connected_40g",
      key: "not_connected_40g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "not_connected_40g",
        "Not Connected 40G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Not Connected 100G",
      dataIndex: "not_connected_100g",
      key: "not_connected_100g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "not_connected_100g",
        "Not Connected 100G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Not Connected Fast Ethernet",
      dataIndex: "not_connected_fast_ethernet",
      key: "not_connected_fast_ethernet",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "not_connected_fast_ethernet",
        "Not Connected Fast Ethernet",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Unused SFPS 1G",
      dataIndex: "unused_sfps_1g",
      key: "unused_sfps_1g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "unused_sfps_1g",
        "Unused SFPS 1G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Unused SFPS 10G",
      dataIndex: "unused_sfps_10g",
      key: "unused_sfps_10g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "unused_sfps_10g",
        "Unused SFPS 10G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Unused SFPS 25G",
      dataIndex: "unused_sfps_25g",
      key: "unused_sfps_25g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "unused_sfps_25g",
        "Unused SFPS 25G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Unused SFPS 40G",
      dataIndex: "unused_sfps_40g",
      key: "unused_sfps_40g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "unused_sfps_40g",
        "Unused SFPS 40G",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Unused SFPS 100G",
      dataIndex: "unused_sfps_100g",
      key: "unused_sfps_100g",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "unused_sfps_100g",
        "Unused SFPS 100G",
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
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

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
  const [dateArray, setDateArray] = useState([]);

  useEffect(() => {
    const getAllDcCapacityDates = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllEdnDcCapacityDates");

        console.log("getAllEdnDcCapacityDates", res);
        setDateArray(res.data);
        setIpamDate(res.data[0]);

        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    getAllDcCapacityDates();
  }, []);
  const handleChange = async (value) => {
    console.log(`selected ${value}`);
    setLoading(true);
    await axios
      .post(baseUrl + "/getAllEdnDcCapacityByDate", { dict: value })
      .then((response) => {
        // setExcelData(response.data);
        excelData = response.data;
        setDataSource(response.data);
        setRowCount(excelData.length);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
    setLoading(false);
    // console.log(`selected ${value}`);
  };

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div style={{ backgroundColor: "#FFFFFF", height: "100%" }}>
        {/* <div style={{ padding: "2px" }}>
          <h2
            style={{
              float: "left",
              marginLeft: "20px",
              fontWeight: "bold",
              marginTop: "2px",
            }}
          >
            <img src={dcm} alt="" /> Data Center Capacity Management
          </h2>
        </div> */}
        <br />
        <br />
        <div
          style={{
            borderBottom: "1px solid rgba(175, 175, 175, 0.2)",
          }}
        ></div>

        <Row
          style={{
            padding: "10px",
            marginTop: "5px",
            marginRight: "15px",
            marginLeft: "15px",
          }}
        >
          <Col
            // span={3}
            xs={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 6 }}
            // xl={{ span: 2 }}
          >
            <div
              style={{
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                backgroundColor: "#FDFDFD",
                borderRadius: "8px",
                marginRight: "10px",
              }}
            >
              <Row style={{ padding: "10px", margin: "0 auto" }}>
                <Col span={10}>
                  <img
                    src={totalports}
                    width="70px"
                    height="70px"
                    alt=""
                    style={{ float: "right" }}
                  />
                </Col>
                <Col span={14}>
                  <SpinLoading spinning={loading}>
                    <div style={{ marginLeft: "15px" }}>
                      <p
                        style={{
                          fontSize: "12px",
                          marginTop: "10px",
                          color: "#6C6B75",
                        }}
                      >
                        {total_ports.name}
                      </p>
                      <h2 style={{ fontWeight: "700", color: "#6C6B75" }}>
                        {total_ports.value}
                      </h2>
                    </div>
                  </SpinLoading>
                </Col>
              </Row>
              <BarChart />
            </div>
          </Col>
          <Col
            // span={3}
            xs={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 6 }}
            // xl={{ span: 2 }}
          >
            <div
              style={{
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                backgroundColor: "#FDFDFD",
                borderRadius: "8px",
                marginRight: "10px",
              }}
            >
              <Row style={{ padding: "10px", margin: "0 auto" }}>
                <Col span={10}>
                  <img
                    src={conports}
                    alt=""
                    width="70px"
                    height="70px"
                    style={{ float: "right" }}
                  />
                </Col>
                <Col span={14}>
                  <SpinLoading spinning={loading}>
                    <div style={{ marginLeft: "15px" }}>
                      <p
                        style={{
                          fontSize: "12px",
                          marginTop: "10px",
                          color: "#6C6B75",
                        }}
                      >
                        {connectedPorts.name}
                      </p>
                      <h2
                        style={{
                          fontWeight: "700",
                          color: "#6C6B75",
                        }}
                      >
                        {connectedPorts.value}
                      </h2>
                    </div>
                  </SpinLoading>
                </Col>
              </Row>
              <div
                style={{
                  textAlign: "center",
                  // padding: "10px",
                  marginLeft: "5%",
                  marginRight: "10%",
                  width: "100%",
                }}
              >
                <RadialBarChart />
              </div>
            </div>
          </Col>
          <Col
            // span={3}
            xs={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 6 }}
            // xl={{ span: 2 }}
          >
            <div
              style={{
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                backgroundColor: "#FDFDFD",
                borderRadius: "8px",
                marginRight: "10px",
              }}
            >
              <Row style={{ padding: "10px", margin: "0 auto" }}>
                <Col span={10}>
                  <img
                    src={notconports}
                    width="70px"
                    height="70px"
                    alt=""
                    style={{ float: "right" }}
                  />
                </Col>
                <Col span={14}>
                  <SpinLoading spinning={loading}>
                    <div style={{ marginLeft: "15px" }}>
                      <p
                        style={{
                          fontSize: "12px",
                          marginTop: "10px",
                          color: "#6C6B75",
                        }}
                      >
                        {notconnectedPorts.name}
                      </p>
                      <h2 style={{ fontWeight: "700", color: "#6C6B75" }}>
                        {notconnectedPorts.value}
                      </h2>
                    </div>
                  </SpinLoading>
                </Col>
              </Row>

              <NotConnectedPorts />
            </div>
          </Col>
          <Col
            // span={3}
            xs={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 6 }}
            // xl={{ span: 2 }}
          >
            <div
              style={{
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                backgroundColor: "#FDFDFD",
                borderRadius: "8px",
                marginRight: "10px",
              }}
            >
              <Row style={{ padding: "10px", margin: "0 auto" }}>
                <Col span={10}>
                  <img
                    src={unused}
                    width="70px"
                    height="70px"
                    alt=""
                    style={{ float: "right" }}
                  />
                </Col>
                <Col span={14}>
                  <SpinLoading spinning={loading}>
                    <div style={{ marginLeft: "15px" }}>
                      <p
                        style={{
                          fontSize: "12px",
                          marginTop: "10px",
                          color: "#6C6B75",
                        }}
                      >
                        {unsedSfps.name}
                      </p>
                      <h2 style={{ fontWeight: "700", color: "#6C6B75" }}>
                        {unsedSfps.value}
                      </h2>
                    </div>
                  </SpinLoading>
                </Col>
              </Row>
              <div
                style={{
                  textAlign: "center",
                  // padding: "10px",
                  marginLeft: "5%",
                  marginRight: "10%",
                  width: "100%",
                }}
              >
                <UnusedSfps />
              </div>
            </div>
          </Col>
        </Row>
        <div style={{ padding: "15px" }}>
          <div style={{ float: "left" }}>
            <AddStyledButton
              style={{ display: "none" }}
              onClick={showModal}
              disabled={!configData?.dcm.pages.dcm.read_only}
            >
              + Add Site
            </AddStyledButton>
            <br />

            <div style={{ display: "flex", marginTop: "3px" }}>
              <SpinLoading
                style={{ marginLeft: "-10px" }}
                spinning={fetchLoading === "true" ? true : false}
              >
                <OnBoardStyledButton
                  onClick={handleOnboard}
                  style={{
                    fontSize: "14px",
                    float: "left",
                  }}
                  disabled={!configData?.ipam.pages.devices_subnet.read_only}
                >
                  Fetch
                </OnBoardStyledButton>
              </SpinLoading>

              {fetchLoading === "empty" ? null : (
                <div
                  style={{
                    backgroundColor,
                    padding: "0 10px 0 10px",
                    color: "white",
                    borderRadius: "5px",
                    fontWeight: "500",
                    fontSize: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  {fetchLoading === "true"
                    ? `Fetching Started At: ${fetchDate}`
                    : `Fetching Completed At: ${fetchDate}`}
                </div>
              )}
              <div style={{ marginTop: "10px", display: "flex" }}>
                <h4
                  style={{
                    marginLeft: "10px",
                    // float: "right",
                    marginRight: "20px",
                    // fontWeight: "bold",
                  }}
                >
                  Col : <b style={{ color: "#66B127" }}>29</b>
                </h4>
                <h4
                  style={{
                    marginLeft: "10px",
                    // float: "right",
                    marginRight: "20px",
                    // fontWeight: "bold",
                  }}
                >
                  Rows : <b style={{ color: "#66B127" }}>{rowCount}</b>
                </h4>
              </div>
            </div>
          </div>
          <br />
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
                // float: 'right',
                paddingTop: "4px",
              }}
            >
              <img src={myexport} alt="" width="18px" height="18px" />
              &nbsp; Export
            </StyledExportButton>

            <div
              className="select_type"
              style={{ marginLeft: "5px", float: "right" }}
            >
              {/* <label>Password Group</label>&nbsp;
                            <span style={{ color: "red" }}>*</span>
                            <Input
                              required
                              placeholder="Password Group"
                              value={passwordGroup}
                              onChange={(e) => setPasswordGroup(e.target.value)}
                            /> */}

              <Select
                // className="rectangle"
                required
                placeholder="Select Date"
                style={{
                  width: "240px",
                  // zIndex: 99999,
                  borderRadius: "8px",
                  marginTop: "-0.2px",
                }}
                // value={ipamDate}
                onChange={handleChange}
                // onChange={(e) => {
                //   setPassword_group(e.target.value);
                // }}
              >
                {dateArray &&
                  dateArray.map((item, index) => {
                    return (
                      <>
                        <Option key={index} value={item}>
                          {item}
                        </Option>
                      </>
                    );
                  })}
              </Select>
            </div>
          </div>
        </div>
        <br />
        <br />
        <SpinLoading spinning={dcmMainloading} tip="Loading...">
          <TableStyling
            // rowSelection={rowSelection}
            scroll={{ x: 6500 }}
            rowKey="ip_address"
            columns={column}
            dataSource={dataSource}
            // pagination={false}
            style={{ width: "100%", padding: "2%" }}
          />
        </SpinLoading>
      </div>
    </div>
  );
};

export default index;
