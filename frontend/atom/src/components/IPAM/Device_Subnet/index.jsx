import React, { useState, useEffect } from "react";
import exportExcel from "../../Atom/assets/exp.svg";
import { Table, Select, notification } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import "../../AllStyling/CSSStyling.css";
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
  OnBoardStyledButton,
} from "../../AllStyling/All.styled";

import { columnSearch } from "../../../utils";
let excelData = [];
let columnFilters = {};
const index = () => {
  const { Option } = Select;

  let [dataSource, setDataSource] = useState(excelData);

  const [configData, setConfigData] = useState(null);
  const [loading, setLoading] = useState("");
  const [allIpamDeviceLoading, setAllIpamDeviceLoading] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [onboardLoading, setOnboardLoading] = useState(false);
  const [password_group, setPassword_group] = useState();
  const [ipamDate, setIpamDate] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  let [fetchLoading, setFetchLoading] = useState("empty");
  let [fetchDate, setFetchDate] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("green");
  const [searchedColumn, setSearchedColumn] = useState(null);
  let allConfig;
  useEffect(() => {
    let user = localStorage.getItem("user");
    let userData = JSON.parse(user);

    const test = userData.monetx_configuration;

    let t = eval(test);
    let config = JSON.parse(t);
    setConfigData(config);
  }, []);

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );
  const [dateArray, setDateArray] = useState([]);

  useEffect(() => {
    const getPasswordGroupDropdown = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllIpamDates");

        console.log("getAllIpamDates", res);
        setDateArray(res.data);
        setIpamDate(res.data[0]);

        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    getPasswordGroupDropdown();
  }, []);

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
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "ipam_fetch_devices");
      XLSX.writeFile(wb, "ipam_fetch_devices.xlsx");
    }
  };
  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: configData?.ipam.pages.devices_subnet.read_only,
    }),
  };

  useEffect(() => {
    const getAllIpamFetchDevices = async () => {
      setAllIpamDeviceLoading(true);
      const status = await axios.get(baseUrl + "/getIpamFetchStatus");
      if (status.data.fetch_status === "Running") {
        setFetchLoading("true");
        setBackgroundColor("red");
      } else if (status.data.fetch_status === "Completed") {
        setFetchLoading("false");
        setBackgroundColor("green");
      } else {
        setFetchLoading("empty");
      }
      setFetchDate(status.data.fetch_date);

      try {
        const res = await axios.get(baseUrl + "/getAllIpamFetchDevices");

        console.log("getAllIpamFetchDevices", res);

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
  // const jsonToExcel = (atomData) => {
  //   if (rowCount !== 0) {
  //     let wb = XLSX.utils.book_new();
  //     let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
  //     XLSX.utils.book_append_sheet(wb, binaryAtomData, "devices_subnet");
  //     XLSX.writeFile(wb, "devices_subnet.xlsx");

  //     // setExportLoading(false);
  //   }
  // };
  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  const handleOnboard = async () => {
    // setOnboardLoading(true);
    setFetchLoading("true");
    setFetchDate(new Date().toLocaleString());
    setBackgroundColor("red");
    axios
      .get(baseUrl + "/fetchIpamDevices")
      .then((response) => {
        console.log("fetchIpamDevices", response.data);
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
  const columns = [
    // {
    //   title: "",
    //   key: "edit",
    //   width: "2%",

    //   render: (text, record) => (
    //     <>
    //       {!configData?.ipam.pages.devices.read_only ? (
    //         <>
    //           <p
    //             style={{
    //               color: "#66B127",
    //               textDecoration: "underline",
    //               fontWeight: "400",
    //               textAlign: "center",
    //               // color: "blue",
    //               cursor: "pointer",
    //             }}
    //             disabled
    //             // onClick={() => {
    //             //   edit(record);
    //             // }}
    //           >
    //             <EditOutlined
    //               style={{ paddingRight: "50px", color: "#66A111" }}
    //             />
    //           </p>
    //         </>
    //       ) : (
    //         <p
    //           style={{
    //             color: "#66B127",
    //             textDecoration: "underline",
    //             fontWeight: "400",
    //             textAlign: "center",
    //             // color: "blue",
    //             cursor: "pointer",
    //           }}
    //           onClick={() => {
    //             edit(record);
    //           }}
    //         >
    //           <EditOutlined
    //             style={{ paddingRight: "50px", color: "#66A111" }}
    //           />
    //         </p>
    //       )}
    //     </>
    //   ),
    // },

    {
      title: "Ip Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
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
      title: "Device Name",
      dataIndex: "device_name",
      key: "device_name",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
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
    // {
    //   title: "Host Name",
    //   dataIndex: "host_name",
    //   key: "host_name",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "host_name",
    //     "Host Name",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    {
      title: "Interface",
      dataIndex: "interface",
      key: "interface",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "interface",
        "Interface",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Interface Ip",
      dataIndex: "interface_ip",
      key: "interface_ip",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "interface_ip",
        "Interface Ip",
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
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
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
      title: "Subnet Mask",
      dataIndex: "subnet_mask",
      key: "subnet_mask",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
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
      title: "Interface Description",
      dataIndex: "interface_description",
      key: "interface_description",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "interface_description",
        "Interface Description",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "virtual Ip",
      dataIndex: "virtual_ip",
      key: "virtual_ip",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "virtual_ip",
        "Virtual Ip",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "VLAN",
      dataIndex: "vlan",
      key: "vlan",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "vlan",
        "VLAN",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "VLAN Number",
      dataIndex: "vlan_number",
      key: "vlan_number",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "vlan_number",
        "VLAN Number",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Interface Status",
      dataIndex: "interface_status",
      key: "interface_status",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "interface_status",
        "Interface Status",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Fetch Date",
      dataIndex: "fetch_date",
      key: "fetch_date",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "fetch_date",
        "Fetch Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];
  // const exportSeed = async () => {
  //   setExportLoading(true);
  //   jsonToExcel(excelData);
  //   openNotification();
  //   setExportLoading(false);
  // };
  const handleChange = async (value) => {
    console.log(`selected ${value}`);
    setLoading(true);
    await axios
      .post(baseUrl + "/getIpamByDate", { dict: value })
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
    <SpinLoading spinning={onboardLoading}>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          height: "100vh",
          marginBottom: "20px",
        }}
      >
        <br />
        <div
          style={{
            backgroundColor: "#FFFFFF",
            marginBottom: "15px",
          }}
        >
          <div style={{ marginLeft: "30px", float: "left" }}>
            <div style={{ display: "flex" }}>
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
                  disabled={configData?.ipam.pages.devices_subnet.read_only}
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
            </div>
            <br />
          </div>
          <div style={{ float: "right", marginRight: "15px", display: "flex" }}>
            <StyledExportButton
              onClick={exportSeed}
              // type="primary"
              style={{
                marginRight: "12px",
                // marginLeft: "5px",
                // color: "#9F9F9F",
              }}
            >
              {/* {<ExportOutlined />} */}
              <img
                src={exportExcel}
                alt=""
                width="15px"
                height="15px"
                style={{ marginBottom: "3px" }}
              />
              &nbsp;&nbsp; Export
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
                  zIndex: 99999,
                  borderRadius: "8px",
                  marginTop: "-0.2px",
                }}
                // value={ipamDate}
                onChange={handleChange}
                // onChange={(e) => {
                //   setPassword_group(e.target.value);
                // }}
              >
                {dateArray.map((item, index) => {
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
        <div style={{ marginTop: "-8px" }}>
          <span>Rows :</span>
          <span>
            <b style={{ color: "#66B127" }}> {rowCount}</b>
          </span>{" "}
          &nbsp;&nbsp;
          <span>Columns :</span>
          <span>
            <b style={{ color: "#66B127" }}> 12</b>
          </span>
        </div>
        <br />
        <SpinLoading spinning={allIpamDeviceLoading} tip="Loading...">
          <div style={{ padding: "25px" }}>
            <TableStyling
              scroll={{ x: 3600 }}
              columns={columns}
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
