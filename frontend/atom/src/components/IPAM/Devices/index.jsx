import React, { useState, useEffect } from "react";
import { Row, Col, Menu, Input, Modal, Table, notification } from "antd";
import Swal from "sweetalert2";
import addatom from "../assets/addatom.svg";
import addnew from "../assets/addnew.svg";
import axios, { baseUrl } from "../../../utils/axios";

import * as XLSX from "xlsx";
import { EditOutlined } from "@ant-design/icons";
import {
  TableStyling,
  StyledExportButton,
  SpinLoading,
  MainTableModal,
  MainTableMainP,
  MainTableMainDiv,
  StyledselectIpam,
  InputWrapper,
  DeleteButton,
  AddButtonStyle,
  StyledInputForm,
} from "../../AllStyling/All.styled";
import exportExcel from "../../Atom/assets/exp.svg";
import { columnSearch } from "../../../utils";
import EditModal from "./EditModal";
import { useLocation } from "react-router-dom";
import { devices } from "../../../data/globalData";

let excelData = [];
let columnFilters = {};
let atomExcelData = [];
let atomColumnFilters = {};

const index = () => {
  const data = useLocation();

  if (data?.state?.source) {
    columnFilters["source"] = data.state.source;
  }

  let [dataSource, setDataSource] = useState(excelData);
  let [atomDataSource, setAtomDataSource] = useState(atomExcelData);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allIpamDeviceLoading, setAllIpamDeviceLoading] = useState(false);
  const [passGroup, setPassGroup] = useState("");
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedAtomRowKeys, setSelectedAtomRowKeys] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [atomSearchText, setAtomSearchText] = useState(null);
  const [atomSearchedColumn, setAtomSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [ip_address, setIpAddress] = useState("");
  const [device_type, setDeviceType] = useState("Juniper");
  const [device_name, setDeviceName] = useState("");
  const [password_group, setPassword_group] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mainModalVisible, setMainModalVisible] = useState(false);
  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    let user = localStorage.getItem("user");
    let userData = JSON.parse(user);

    let test = userData.monetx_configuration;
    const t = eval(test);
    let config = JSON.parse(t);
    setConfigData(config);
  }, []);

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );

  let getAtomColumnSearchProps = columnSearch(
    atomSearchText,
    setAtomSearchText,
    atomSearchedColumn,
    setAtomSearchedColumn
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const jsonToExcel = (atomData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "ipam_devices");
      XLSX.writeFile(wb, "ipam_devices.xlsx");
    }
  };

  useEffect(() => {
    const serviceCalls = async () => {
      setAllIpamDeviceLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllIpamDevices");

        excelData = res.data;
        let source;

        if (data.state !== null) {
          source = data?.state?.subnet;
          let filteredSuggestions;
          if (source) {
            filteredSuggestions = excelData.filter(
              (d) =>
                JSON.stringify(d["source"])
                  .replace(" ", "")
                  .toLowerCase()
                  .indexOf(source.toLowerCase()) > -1
            );
          }

          setRowCount(filteredSuggestions.length);
          setDataSource(filteredSuggestions);
        } else {
          setDataSource(excelData);
          setRowCount(excelData.length);
        }

        setAllIpamDeviceLoading(false);
      } catch (err) {
        setAllIpamDeviceLoading(false);
      }
    };
    serviceCalls();
  }, []);
  useEffect(() => {
    const serviceCalls = async () => {
      setAllIpamDeviceLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getDeviceinIpam");
        deviceExcelData = res.data;

        setAllIpamDeviceLoading(false);
      } catch (err) {
        setAllIpamDeviceLoading(false);
      }
    };
    serviceCalls();
  }, []);

  useEffect(() => {
    const addIpamByAtom = async () => {
      setAllIpamDeviceLoading(true);
      try {
        const res = await axios.get(baseUrl + "/getAtominIpam");
        atomExcelData = res.data;
        setAtomDataSource(atomExcelData);
        setAllIpamDeviceLoading(false);
      } catch (err) {
        setAllIpamDeviceLoading(false);
      }
    };
    addIpamByAtom();
  }, [rowCount]);

  const exportSeed = async () => {
    if (excelData.length > 0) {
      jsonToExcel(dataSource);
      openNotification();
    } else {
      openSweetAlert("No Data Found!", "info");
    }
  };

  const openNotification = () => {
    notification.open({
      message: "File Exported Successfully",
      onClick: () => {},
    });
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
          {configData?.ipam.pages.devices.read_only ? (
            <>
              <p
                style={{
                  color: "#66B127",
                  textDecoration: "underline",
                  fontWeight: "400",
                  textAlign: "center",
                  cursor: "no-drop",
                }}
                disabled
              >
                <EditOutlined
                  disabled
                  style={{ paddingRight: "50px", color: "#66A111" }}
                />
              </p>
            </>
          ) : (
            <p
              style={{
                color: "#66B127",
                textDecoration: "underline",
                fontWeight: "400",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                edit(record);
              }}
            >
              <EditOutlined
                style={{ paddingRight: "50px", color: "#66A111" }}
              />
            </p>
          )}
        </>
      ),
    },

    {
      title: "Ip Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          onClick={() => showAllDetails(text)}
          style={{ textAlign: "left", paddingLeft: "15px" }}
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
    {
      title: "Device Type",
      dataIndex: "device_type",
      key: "device_type",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
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
      title: "Password Group",
      dataIndex: "password_group",
      key: "password_group",
      render: (text, record) => (
        <p style={{ ttextAlign: "left", paddingLeft: "15px" }}>{text}</p>
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
    {
      title: "Source",
      dataIndex: "source",
      key: "source",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
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
  ];

  const AddAtomColumns = [
    {
      title: "Ip Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getAtomColumnSearchProps(
        "ip_address",
        "Ip Address",
        setAtomDataSource,
        atomExcelData,
        atomColumnFilters
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

      ...getAtomColumnSearchProps(
        "device_name",
        "Device Name",
        setAtomDataSource,
        atomExcelData,
        atomColumnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Function",
      dataIndex: "function",
      key: "function",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getAtomColumnSearchProps(
        "function",
        "Function",
        setAtomDataSource,
        atomExcelData,
        atomColumnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Device Type",
      dataIndex: "device_type",
      key: "onboard_status",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getAtomColumnSearchProps(
        "onboard_status",
        "Device Type",
        setAtomDataSource,
        atomExcelData,
        atomColumnFilters
      ),
      ellipsis: true,
    },
    {
      title: "OnBoard Status",
      dataIndex: "onboard_status",
      key: "onboard_status",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getAtomColumnSearchProps(
        "onboard_status",
        "OnBoard Status",
        setAtomDataSource,
        atomExcelData,
        atomColumnFilters
      ),
      ellipsis: true,
    },
  ];

  const deleteRow = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        ////console.log(device);
        await axios
          .post(baseUrl + "/deleteIpamDevice ", selectedRowKeys)
          .then((response) => {
            openSweetAlert(`Device Deleted Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllIpamDevices")
                .then((response) => {
                  //console.log(response.data);
                  excelData = response.data;
                  setDataSource(response.data);
                  setRowCount(response.data.length);
                  setSelectedRowKeys([]);
                  // excelData = response.data;
                  setLoading(false);
                })
                .catch((error) => {
                  //console.log(error);
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

        //console.log(err);
      }
    } else {
      openSweetAlert(`Now Device Selected`, "error");
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
      disabled: configData?.ipam.pages.devices.read_only,
    }),
  };

  const onSelectAtomChange = (selectedAtomRowKeys) => {
    setSelectedAtomRowKeys(selectedAtomRowKeys);
  };

  const atomRowSelection = {
    selectedAtomRowKeys,
    onChange: onSelectAtomChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({}),
  };

  const handleMainOk = () => {
    setMainModalVisible(false);
  };

  const handleMainCancel = () => {
    setMainModalVisible(false);
  };

  const showMainModal = () => {
    setMainModalVisible(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = { ip_address, device_type, device_name, password_group };
    setLoading(true);

    try {
      await axios
        .post(baseUrl + "/addIpamStatically", formData)
        .then((response) => {
          setIpAddress("");
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data.Response, "error");
            setOnboardLoading(false);
          } else {
            setDeviceName("");
            openSweetAlert(response?.data.Response, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllIpamDevices")
                .then((response) => {
                  setDataSource(response.data);
                  excelData = response.data;
                  setRowCount(response.data.length);
                  excelData = response.data;
                  setLoading(false);
                })
                .catch((error) => {
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
  };
  const handlePassGroupFormSubmit = async (e) => {
    e.preventDefault();
    const passGroupformData = {
      password_group: passGroup,
      username: username,
      password: pass,
    };
    setLoading(true);

    await axios
      .post(baseUrl + "/addUser", passGroupformData)
      .then((response) => {
        setPassGroup("");
        setUsername("");
        setPass("");
        setIsModalVisible(false);
        setLoading(false);
        openSweetAlert("Password Group Added Successfully", "success");
        const promises = [];
        promises.push(
          axios
            .get(baseUrl + "/getPasswordGroupDropdown")
            .then((res) => {
              //console.log("getPasswordGroupDropdown", res);
              setPasswordArray(res.data);
              setPassword_group(res.data[0]);

              setLoading(false);
            })
            .catch((error) => {
              //console.log(error);
              // openSweetAlert("Something Went Wrong!", "danger");
              setLoading(false);
            })
        );
        setLoading(false);
        return Promise.all(promises);
      })
      .catch((err) => {
        openSweetAlert("Device/Ip Address already exists", "error");
        setLoading(false);
      });
  };
  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  const handleAtomDevices = async (e) => {
    setLoading(true);
    if (selectedAtomRowKeys.length > 0) {
      try {
        await axios
          .post(baseUrl + "/addIpamByAtom ", selectedAtomRowKeys)
          .then((response) => {
            if (response?.response?.status == 500) {
              openSweetAlert(response?.data, "error");
            } else {
              openSweetAlert(response?.data, "success");

              const promises = [];
              promises.push(
                axios
                  .get(baseUrl + "/getAllIpamDevices")
                  .then((response) => {
                    setDataSource(response.data);
                    excelData = response.data;
                    setRowCount(response.data.length);
                    setLoading(false);
                  })
                  .catch((error) => {
                    setLoading(false);
                  })
              );
              return Promise.all(promises);
            }
          })
          .catch((error) => {
            setLoading(false);

            openSweetAlert("Device/Ip Address already exists", "error");
          });
      } catch (err) {
        setLoading(false);
      }
    } else {
      openSweetAlert("No Device Selected!", "error");
    }
  };

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
        setLoading(false);
      }
    };
    getPasswordGroupDropdown();
  }, []);

  const [tableName, setTableName] = useState("Add New");

  const showTable = (myDataTable) => {
    if (myDataTable === "Add New") {
      setTableName(myDataTable);
    } else if (myDataTable === "Add From Atom") {
      setTableName("Add From Atom");
    } else if (myDataTable === "Add From Device") {
      setTableName("Add From Device");
    }
  };

  const ipamDeviceType = devices.filter((device) =>
    device.module.includes("ipam")
  );

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        height: "100%",
        marginBottom: "20px",
      }}
    >
      <br />

      <div
        style={{
          float: "right",
          marginRight: "27px",
          backgroundColor: "#FFFFFF",
        }}
      >
        {configData?.ipam.pages.devices.read_only ? (
          <AddButtonStyle
            disabled
            style={{
              backgroundColor: "#66b127",
              border: "1px solid #66b127",
              color: "#fff",
              cursor: "no-drop",
            }}
          >
            {" "}
            + Add Devices
          </AddButtonStyle>
        ) : (
          <AddButtonStyle onClick={showMainModal}>
            {" "}
            + Add Devices
          </AddButtonStyle>
        )}
      </div>
      <br />
      <br />
      <br />
      <div
        style={{
          backgroundColor: "#FFFFFF",
          marginBottom: "15px",
        }}
      >
        <div style={{ marginLeft: "30px", float: "left" }}>
          {selectedRowKeys.length > 0 ? (
            <DeleteButton onClick={deleteRow}>Delete</DeleteButton>
          ) : null}
          &nbsp;
          <span>Rows :</span>
          <span>
            <b style={{ color: "#66B127" }}> {rowCount}</b>
          </span>
          &nbsp;&nbsp;
          <span>Columns :</span>
          <span>
            <b style={{ color: "#66B127" }}> 5</b>
          </span>
        </div>
        <div style={{ float: "right", marginRight: "15px" }}>
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
        </div>
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
                active={"Add New" === tableName}
                onClick={() => showTable("Add New")}
              >
                <img src={addnew} alt="" width="25px" height="25px" /> Add New
              </MainTableMainP>
              &nbsp;&nbsp;
              <MainTableMainP
                active={"Add From Atom" === tableName}
                onClick={() => showTable("Add From Atom")}
              >
                <img src={addatom} alt="" width="25px" height="25px" /> Add From
                Atom
              </MainTableMainP>{" "}
              &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </MainTableMainDiv>
            {tableName === "Add New" ? (
              <>
                <SpinLoading spinning={loading}>
                  <div
                    style={{
                      height: "250px",
                      paddingTop: "50px",
                    }}
                  >
                    <form onSubmit={handleFormSubmit}>
                      <Row>
                        <Col span={6}>
                          <>
                            <label>Ip Address</label>&nbsp;
                            <span style={{ color: "red" }}>*</span>
                            <StyledInputForm
                              style={{
                                width: "100%",
                                height: "2rem",
                                paddingLeft: "8px",
                              }}
                              required
                              placeholder="Ip Address"
                              value={ip_address}
                              onChange={(e) => setIpAddress(e.target.value)}
                            />
                          </>
                        </Col>
                        <Col span={6}>
                          <div style={{ marginLeft: "10px" }}>
                            <InputWrapper>
                              Device Type: &nbsp;
                              <span style={{ color: "red" }}>*</span>
                              &nbsp;&nbsp;
                              <div className="select_type">
                                <StyledselectIpam
                                  className="rectangle"
                                  required
                                  value={device_type}
                                  onChange={(e) => {
                                    setDeviceType(e.target.value);
                                  }}
                                >
                                  {ipamDeviceType.map((device, index) => (
                                    <option key={index} value={device.name}>
                                      {device.name}
                                    </option>
                                  ))}
                                </StyledselectIpam>
                              </div>
                            </InputWrapper>
                          </div>
                        </Col>
                        <Col span={6}>
                          <div style={{ marginLeft: "10px" }}>
                            <label>Device Name</label>&nbsp;
                            <span style={{ color: "red" }}>*</span>
                            <StyledInputForm
                              style={{
                                width: "100%",
                                height: "2rem",
                                paddingLeft: "8px",
                              }}
                              required
                              placeholder="Device Name"
                              value={device_name}
                              onChange={(e) =>
                                setDeviceName(
                                  e.target.value.replace(
                                    /[!^=&\/\\#;,+()$~%'":*?<>{}]/g,
                                    ""
                                  )
                                )
                              }
                            />
                          </div>
                        </Col>
                        <Col span={6}>
                          <div style={{ marginLeft: "10px" }}>
                            <InputWrapper>
                              Password Group: &nbsp;
                              <span style={{ color: "red" }}>*</span>
                              &nbsp;&nbsp;
                              <div className="select_type">
                                <StyledselectIpam
                                  className="rectangle"
                                  required
                                  value={password_group}
                                  onChange={(e) => {
                                    setPassword_group(e.target.value);
                                  }}
                                >
                                  <option>
                                    {" "}
                                    <p>Add New</p>
                                  </option>
                                  {passwordArray.map((item, index) => {
                                    return (
                                      <>
                                        <option>{item}</option>
                                      </>
                                    );
                                  })}
                                </StyledselectIpam>
                              </div>
                            </InputWrapper>
                          </div>
                        </Col>
                      </Row>

                      <Modal
                        width={"30%"}
                        title="Add New Password Group"
                        open={isModalVisible}
                        onOk={handleOk}
                        footer={false}
                        onCancel={handleCancel}
                      >
                        <form style={{ padding: "25px" }}>
                          <div>
                            <label>Password Group</label>&nbsp;
                            <span style={{ color: "red" }}>*</span>
                            <Input
                              style={{
                                width: "100%",
                                height: "2rem",
                                border: "0.3px solid rgba(0,0,0,0.2)",
                                paddingLeft: "8px",
                              }}
                              required
                              placeholder="password Group"
                              value={passGroup}
                              onChange={(e) => setPassGroup(e.target.value)}
                            />
                          </div>
                          <div style={{ marginTop: "15px" }}>
                            <label style={{ marginTop: "10px" }}>
                              Username
                            </label>
                            &nbsp;
                            <span style={{ color: "red" }}>*</span>
                            <Input
                              style={{
                                width: "100%",
                                height: "2rem",
                                border: "0.3px solid rgba(0,0,0,0.2)",
                                paddingLeft: "8px",
                              }}
                              required
                              placeholder="Username"
                              value={username}
                              onChange={(e) =>
                                setUsername(
                                  e.target.value.replace(
                                    /[!^=&\/\\#;,+()$~%'":*?<>{}]/g,
                                    ""
                                  )
                                )
                              }
                            />
                          </div>
                          <div style={{ marginTop: "15px" }}>
                            <label style={{ marginTop: "10px" }}>
                              Password
                            </label>
                            &nbsp;
                            <span style={{ color: "red" }}>*</span>
                            <Input
                              style={{
                                width: "100%",
                                height: "2rem",
                                border: "0.3px solid rgba(0,0,0,0.2)",
                                paddingLeft: "8px",
                              }}
                              required
                              placeholder="Password"
                              value={pass}
                              onChange={(e) => setPass(e.target.value)}
                            />
                          </div>
                          <div style={{ marginTop: "20px" }}>
                            <button
                              type="submit"
                              onClick={handlePassGroupFormSubmit}
                              style={{
                                backgroundColor: "#66B127",
                                color: "white",
                                width: "100%",
                                height: "35px",
                                border: "none",
                                cursor: "Pointer",
                              }}
                            >
                              Add Password Group
                            </button>
                          </div>
                        </form>
                      </Modal>
                      <div style={{ float: "right" }}>
                        <p
                          onClick={showModal}
                          style={{
                            float: "right",
                            marginRight: "5px",
                            color: "#66B127",
                            textDecoration: "underline",
                            fontWeight: "700",
                            cursor: "pointer",
                            fontSize: "10px",
                          }}
                        >
                          Add New Password Group
                        </p>
                      </div>
                      <br />
                      <br />

                      <Row>
                        <Col span={24}>
                          <div
                            style={{ textAlign: "center", marginTop: "45px" }}
                          >
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
                              <b>+</b> Add Device
                            </button>
                          </div>
                        </Col>
                      </Row>
                    </form>
                  </div>
                </SpinLoading>
              </>
            ) : null}
            {tableName === "Add From Atom" ? (
              <SpinLoading>
                <div
                  style={{
                    overflowY: "scroll",
                    textAlign: "center",
                    height: "450px",
                  }}
                >
                  <TableStyling
                    rowSelection={atomRowSelection}
                    rowKey="ip_address"
                    columns={AddAtomColumns}
                    dataSource={atomDataSource}
                    style={{ width: "100%", padding: "2%" }}
                  />
                </div>
                <div style={{ textAlign: "center", padding: "10px" }}>
                  <AddButtonStyle
                    onClick={handleAtomDevices}
                    style={{
                      cursor: "Pointer",
                    }}
                  >
                    <b>+</b> Add Device
                  </AddButtonStyle>
                </div>
              </SpinLoading>
            ) : null}
          </div>
        </div>
      </MainTableModal>

      {isEditModalVisible && (
        <EditModal
          style={{ padding: "0px" }}
          isEditModalVisible={isEditModalVisible}
          setIsEditModalVisible={setIsEditModalVisible}
          dataSource={dataSource}
          setDataSource={setDataSource}
          excelData={excelData}
          editRecord={editRecord}
          centered={true}
        />
      )}

      <SpinLoading spinning={allIpamDeviceLoading} tip="Loading...">
        <div style={{ padding: "25px" }}>
          <TableStyling
            rowSelection={rowSelection}
            rowKey="ip_address"
            columns={columns}
            dataSource={dataSource}
            style={{ width: "100%", padding: "2%" }}
          />
        </div>
      </SpinLoading>
    </div>
  );
};

export default index;
