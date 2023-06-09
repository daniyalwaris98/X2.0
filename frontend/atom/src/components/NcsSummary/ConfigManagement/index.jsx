import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import {
  Card,
  Col,
  Row,
  Table,
  Divider,
  Input,
  Button,
  Dropdown,
  Space,
  message,
  Menu,
  Modal,
} from "antd";
import "./glasseffect.css";
import { saveAs } from "file-saver";
// import { Diff, diffChars, diffWords } from "diff";
import ReactSpeedometer from "react-d3-speedometer";
import axios, { baseUrl } from "../../../utils/axios";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import ReactHtmlParser from "react-html-parser";
import {
  DoubleLeftOutlined,
  DownOutlined,
  SmileOutlined,
  UserOutlined,
  CaretRightOutlined,
  CaretLeftOutlined,
  DeleteTwoTone,
} from "@ant-design/icons";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "../../../App.css";
import {
  MainTableFailedDevices,
  MainTableFailedDevicesTitle,
  TableStyling,
  SummaryDevices,
  MainTitle,
  SpinLoading,
  ColRowNumberStyle,
  StyleCmdInput,
  Styledselect,
  InputWrapper,
} from "../../AllStyling/All.styled.js";
// import summary from "./assets/summary.svg";
// import inter from "./assets/interface.svg";
import { columnSearch } from "../../../utils";
import Highlighter from "react-highlight-words";
import { Markup } from "interweave";
let excelData = [];
let excelDataRestore = [];
let columnFilters = {};
const index_Main = () => {
  const navigate = useNavigate();
  const data = useLocation();

  const inputRef = useRef(null);
  const targetRef = useRef(null);

  function handleFind() {
    const inputValue = inputRef.current.value;
    const targetElement = targetRef.current.querySelector(
      `[data-name='${inputValue}']`
    );

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  }
  const findInput = useRef(null);

  const handleFindNext = () => {
    const searchTerm = findInput.current.value;
    window.find(searchTerm, false, false, false, false, true, true);
  };

  const handleFindPrevious = () => {
    const searchTerm = findInput.current.value;
    window.find(searchTerm, false, true, false, false, true, true);
  };
  console.log(data);
  const [loading, setLoading] = useState(false);
  const [loadingCompareDate, setLoadingCompareDate] = useState(false);
  const [compareSection, setCompareSection] = useState(false);
  const [rightSide, setRightSide] = useState(false);
  const [tableClickLoading, setTableClickLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState(data?.state?.ip_address);
  const [ipAddressAllData, setIpAddressAllData] = useState(data?.state?.res);
  console.log(ipAddressAllData);
  const [vendor, setvendor] = useState(data?.state?.res?.vendor);
  const [device_name, setdevice_name] = useState(data?.state?.res?.device_name);
  const [myFunction, setMyFunction] = useState(data?.state?.res?.function);
  // const [configuration, setconfiguration] = useState(
  //   data?.state?.res?.function
  // );
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  let [compareDate, setcompareDate] = useState("");
  const [searchedColumn, setSearchedColumn] = useState(null);
  let [configDatabyDate, setConfigDatabyDate] = useState("");

  const [cmdOutputData, setCmdOutputData] = useState("");
  // const [ConfigDatabyDate, setConfigDatabyDate] = useState("");
  let [dataSource, setDataSource] = useState(excelData);
  let [dataSourceRestore, setDataSourceRestore] = useState(excelDataRestore);
  const [mainModalVisible, setMainModalVisible] = useState(false);

  const [ipamDeviceLoading, setIpamDeviceLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [searchContext, setsearchContext] = useState("");
  const [ipAddressData, setIpAddressData] = useState(data?.state?.res?.alerts);
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  // const [device_type, setDeviceType] = useState("");
  // const [password_group, setPassword_group] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [mainTableloading, setMainTableLoading] = useState(false);
  const [configData, setConfigData] = useState(null);
  const [configurationComparisonData, setConfigurationComparisonData] =
    useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenRestroreData, setIsModalOpenRestroreData] = useState(false);

  const [date1Array, setdate1Array] = useState([]);
  const [date2Array, setdate2Array] = useState([]);

  const showModal = async (ip) => {
    setIsModalOpen(true);

    try {
      const resDate1 = await axios.post(
        baseUrl + "/getAllConfigurationDatesInString",
        { ip_address: ip }
      );
      console.log(resDate1.data);
      setdate1Array(resDate1.data);
      setDate1(resDate1.data[0]);
    } catch (err) {
      console.log(err);
    }

    try {
      const resDate2 = await axios.post(
        baseUrl + "/getAllConfigurationDatesInString",
        { ip_address: ip }
      );
      setdate2Array(resDate2.data);

      setDate2(resDate2.data[0]);
    } catch (err) {
      console.log(err);
    }
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModalRestroreData = () => {
    setIsModalOpenRestroreData(true);
  };
  const handleOkRestroreData = () => {
    setIsModalOpenRestroreData(false);
  };
  const handleCancelRestroreData = () => {
    setIsModalOpenRestroreData(false);
  };

  function handleSubmit(e) {
    e.preventDefault();
    setTodos([inputValue, ...todos]);
    setInputValue("");
  }

  function handleDelete(index) {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  }

  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      width: 800,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

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

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);
      const res = await axios.post(baseUrl + "/getAllConfigurationDates", {
        ip_address: ipAddress,
      });
      excelData = res.data;
      setDataSource(excelData);
      setRowCount(excelData.length);
      setLoading(false);
    };
    serviceCalls();
  }, [rowCount]);

  useEffect(() => {
    const serviceCalls = async () => {
      try {
        excelDataRestore = data?.state?.res;
        setDataSourceRestore(excelDataRestore);
      } catch (err) {
        console.log(err.response);
      }
    };
    serviceCalls();
  }, []);

  const handleBackup = async (e) => {
    e.preventDefault();
    const Data = {
      ip_address: ipAddress,
    };

    setLoading(true);

    await axios
      .post(baseUrl + "/backupConfigurations", Data)
      .then((response) => {
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");
          console.log(response.data);
          setLoading(false);
        } else {
          openSweetAlert(response?.data, "success");
          console.log(response?.data);

          const promises = [];

          axios
            .post(baseUrl + "/getAllConfigurationDates", {
              ip_address: ipAddress,
            })
            .then((response) => {
              console.log(response.data);
              excelData = response.data;
              setDataSource(excelData);
              setRowCount(excelData.length);
              setLoading(false);
            })
            .catch((error) => {});
        }
      })
      .catch((err) => {
        console.log("error ==> " + err);
        setLoading(false);
      });
  };

  const [tableName, setTableName] = useState("Configurations");
  const showTable = (myDataTable) => {
    if (myDataTable === "Configurations") {
      setTableName("Configurations");
    } else if (myDataTable === "Documentation") {
      setTableName("Documentation");
    } else if (myDataTable === "Recent Changes") {
      setTableName("Recent Changes");
    } else if (myDataTable === "Monitoring") {
      setTableName("Monitoring");
    } else if (myDataTable === "DCM") {
      setTableName("DCM");
    }
  };

  const handleCompareValue = async () => {
    setCompareSection(true);

    const Data = {
      ip_address: ipAddress,
      date1,
      date2,
    };

    await axios
      .post(baseUrl + "/configurationComparison", Data)
      .then((response) => {
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");
        } else {
          openSweetAlert("Compared successfully!", "success");
          setConfigurationComparisonData(response.data);
        }
      })
      .catch((err) => {
        console.log("error ==> " + err);
      });
  };

  const menu = (
    <Menu>
      <Menu.Item>
        <div onClick={showModalRestroreData}>
          <span style={{ color: "#66b127" }}>
            <p style={{ color: "#66b127" }}>Restore/Export</p>
          </span>
        </div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={() => showModal(ipAddress)}>
          <span style={{ color: "#66b127" }}>
            <p style={{ color: "#66b127" }}>Compare</p>
          </span>
        </div>
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => (
        <p
          onClick={async () => {
            setTableClickLoading(true);

            try {
              const res = await axios.post(
                baseUrl + "/getConfigurationFromDate",
                { date: record.date }
              );
              setRightSide(true);

              if (res?.response?.status == 500) {
                openSweetAlert(res?.response?.data, "error");
                console.log(res.data);
                setLoading(false);
              } else {
                console.log("res MAin", res);

                setConfigDatabyDate(res.data);
              }

              setTableClickLoading(false);
            } catch (err) {
              console.log(err.response);
              setTableClickLoading(false);
            }
          }}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            textAlign: "left",
            paddingTop: "10px",
            paddingLeft: "10px",
          }}
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
  const columnsRestore = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => (
        <p
          style={{
            color: "#66B127",
            textDecoration: "underline",
            textAlign: "left",
            paddingTop: "10px",
            paddingLeft: "10px",
            // cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "date",
        "Date",
        setRowCount,
        setDataSourceRestore,
        excelDataRestore,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <button
          onClick={async () => {
            setRestoreLoading(true);

            try {
              setRestoreLoading(true);
              const res = await axios.post(baseUrl + "/restoreConfiguration", {
                ip_address: ipAddress,
                date: record.date,
              });
              // setRightSide(true);

              if (res?.response?.status == 500) {
                openSweetAlert(res?.response?.data, "error");
                console.log(res?.response?.data);
                setRestoreLoading(false);
              } else {
                openSweetAlert(res?.response?.data, "success");
                console.log(res?.response?.data);

                setRestoreLoading(false);
              }
            } catch (err) {
              console.log(err.response);
              setRestoreLoading(false);
            }
          }}
          style={{
            backgroundColor: "#66B127",
            color: "white",
            border: "none",
            padding: "6px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Restore
        </button>
      ),

      ellipsis: true,
    },
    {
      title: "Export File",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => (
        <button
          onClick={async () => {
            setRestoreLoading(true);

            try {
              setRestoreLoading(true);
              const res = await axios.post(baseUrl + "/downloadConfiguration", {
                ip_address: ipAddress,
                date: record.date,
              });
              // setRightSide(true);

              if (res?.response?.status == 500) {
                openSweetAlert(res?.response?.data, "error");
                console.log(res?.response?.data);
                setRestoreLoading(false);
              } else {
                // openSweetAlert(res?.data, "success");
                console.log(res?.response?.data);
                let lyrics =
                  "But still I'm having memories of high speeds when the cops crashed\n" +
                  "As I laugh, pushin the gas while my Glocks blast\n" +
                  "We was young and we was dumb but we had heart";

                var blob = new Blob([res.data[1]], {
                  type: "text/plain;charset=utf-8",
                });
                saveAs(blob, `${res.data[0]}.cfg`);
                setRestoreLoading(false);
              }

              // setRowCount(excelData.length);
              // setTableClickLoading(false);
            } catch (err) {
              console.log(err.response);
              setRestoreLoading(false);
            }
          }}
          style={{
            backgroundColor: "#66B127",
            color: "white",
            border: "none",
            padding: "6px 10px",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Export
        </button>
      ),

      ellipsis: true,
    },
  ];

  useEffect(() => {
    window.addEventListener("keydown", function (e) {
      if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
        if (document.getElementById("search") !== document.activeElement) {
          e.preventDefault();
          console.log("Search is not in focus");
          document.getElementById("search").focus();
        } else {
          console.log("Default action of CtrlF");
          return true;
        }
      }
    });
  }, []);

  return (
    <div style={{ marginRight: "15px", marginLeft: "15px" }}>
      <br />
      <div>
        <div
          style={{
            display: "flex",

            float: "left",
            borderRadius: "5px",
          }}
        >
          <SummaryDevices
            active={"Configurations" === tableName}
            onClick={() => showTable("Configurations")}
          >
            <div style={{ display: "flex" }}>
              <MainTitle
                active={"Configurations" === tableName}
                style={{
                  paddingLeft: "20px",
                  paddingTop: "10px",
                }}
              >
                Configurations
              </MainTitle>
            </div>
          </SummaryDevices>
          <SummaryDevices
            active={"Documentation" === tableName}
            onClick={() => showTable("Documentation")}
          >
            <div style={{ display: "flex" }}>
              <MainTitle
                active={"Documentation" === tableName}
                style={{
                  paddingLeft: "20px",
                  paddingTop: "10px",
                }}
              >
                Documentation
              </MainTitle>
            </div>
          </SummaryDevices>
          <SummaryDevices
            active={"Recent Changes" === tableName}
            onClick={() => showTable("Recent Changes")}
          >
            <div style={{ display: "flex" }}>
              <MainTitle
                active={"Recent Changes" === tableName}
                style={{
                  paddingLeft: "20px",
                  paddingTop: "10px",
                }}
              >
                Recent Changes
              </MainTitle>
            </div>
          </SummaryDevices>
        </div>
        <div style={{ float: "right" }}>
          <>
            <button
              onClick={handleBackup}
              style={{
                border: "1px solid #6AB344",
                borderRadius: "5px",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                padding: "8px 15px",
                background: "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
              }}
            >
              {" "}
              Backup
            </button>{" "}
            &nbsp;&nbsp;
            <Dropdown overlay={menu}>
              <button
                className="ant-dropdown-link"
                style={{
                  border: "1px solid #6AB344",
                  borderRadius: "5px",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                  padding: "8px 15px",
                  background:
                    "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                }}
              >
                Manage Configuration <DownOutlined />
              </button>
            </Dropdown>
          </>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <div>
        {tableName === "Configurations" ? (
          <>
            <Row>
              <Col
                xs={{ span: 24 }}
                md={{ span: 10 }}
                lg={{ span: 10 }}
                style={{
                  marginRight: "6px",
                }}
              >
                <div
                  style={{
                    borderRadius: "12px",
                    backgroundColor: "#fcfcfc",
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                    height: "110px",

                    width: "100%",
                    marginTop: "8px",
                  }}
                >
                  <SpinLoading spinning={loading}>
                    <TableStyling columns={columns} dataSource={dataSource} />
                  </SpinLoading>
                </div>
              </Col>
              <Col xs={{ span: 24 }} md={{ span: 1 }} lg={{ span: 1 }}></Col>
              {rightSide ? (
                <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
                  <div
                    style={{
                      borderRadius: "12px",
                      backgroundColor: "#fcfcfc",
                      boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                      height: "110px",

                      width: "100%",
                      marginTop: "8px",
                      height: "100%",
                    }}
                  >
                    <SpinLoading spinning={tableClickLoading}>
                      <div style={{ height: "100%" }}>
                        <input
                          type="text"
                          ref={findInput}
                          onKeyDown={(e) => {
                            if (e.keyCode === 13) {
                              handleFindNext();
                              console.log("asdlk");
                            }
                          }}
                          style={{
                            width: "220px",
                            border: "1px solid gray",
                            height: "25px",
                          }}
                        />
                        <button
                          style={{
                            height: "25px",
                          }}
                          onClick={handleFindPrevious}
                        >
                          <CaretLeftOutlined />
                        </button>
                        <button
                          style={{
                            height: "25px",
                          }}
                          onClick={handleFindNext}
                        >
                          <CaretRightOutlined />
                        </button>
                        <code class="line-numbers">
                          <pre style={{ padding: "8px" }}>
                            <Highlighter
                              highlightClassName="rc-highlight"
                              searchWords={[`${targetRef}`]}
                              autoEscape={true}
                              activeStyle={{ color: "red" }}
                              textToHighlight={configDatabyDate}
                            />
                          </pre>
                        </code>
                      </div>
                    </SpinLoading>
                  </div>
                </Col>
              ) : null}
            </Row>
          </>
        ) : null}
        {tableName === "Documentation" ? (
          <>
            <Row>
              <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
                <form
                  onSubmit={handleSubmit}
                  style={{ width: "100%", display: "flex", padding: "15px" }}
                >
                  <StyledInput
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  &nbsp;&nbsp;{" "}
                  <button
                    type="submit"
                    style={{
                      width: "100px",
                      color: "#fff",
                      backgroundColor: "#6ab644",
                      border: "none",
                    }}
                  >
                    Add
                  </button>
                </form>
              </Col>

              <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
                <div
                  style={{ width: "100%", padding: "15px", height: "200px" }}
                >
                  {todos.map((todo, index) => (
                    <div
                      className="glassEffect"
                      style={{
                        padding: "5px",
                        height: "100%",
                        overflowY: "auto",
                        behavior: "smooth",
                        marginBottom: "15px",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                    >
                      <div
                        key={index}
                        style={{ float: "left", width: "90%", height: "100%" }}
                      >
                        {todo}
                      </div>
                      <div
                        style={{
                          float: "right",
                          width: "10%",
                          textAlign: "center",
                        }}
                      >
                        <DeleteTwoTone
                          twoToneColor="rgba(255,0,0,0.5)"
                          style={{
                            color: "rgba(255,0,0,0.5)",
                            fontSize: "20px",
                          }}
                          onClick={() => handleDelete(index)}
                        />
                      </div>
                      <br />
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </>
        ) : null}
      </div>

      <br />
      <Modal
        width={980}
        title=""
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <h4 style={{ textAlign: "center" }}>Compare Configuration</h4>
        <hr />
        <Row style={{ marginTop: "20px" }}>
          <Col span={12}>
            <InputWrapper style={{ marginRight: "8px" }}>
              Select a Configuration to comapare to: &nbsp;
              <span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <div className="select_type" style={{ marginTop: "8px" }}>
                <Styledselect
                  className="rectangle"
                  required
                  placeholder="select"
                  value={date1}
                  onChange={(e) => {
                    setDate1(e.target.value);
                  }}
                >
                  <option value="" style={{ color: "rgba(0,0,0,0.1)" }}>
                    Select Compare Date
                  </option>
                  {date1Array?.map((item, index) => {
                    return (
                      <>
                        <option>{item}</option>
                      </>
                    );
                  })}
                </Styledselect>
              </div>
            </InputWrapper>
          </Col>
          <Col span={12}>
            <InputWrapper>
              Select a Configuration to comapare to: &nbsp;
              <span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <div className="select_type" style={{ marginTop: "8px" }}>
                <Styledselect
                  className="rectangle"
                  required
                  placeholder="select"
                  value={date2}
                  onChange={(e) => {
                    setDate2(e.target.value);
                  }}
                >
                  <option value="" style={{ color: "rgba(0,0,0,0.1)" }}>
                    Select Compare Date
                  </option>
                  {date2Array?.map((item, index) => {
                    return (
                      <>
                        <option>{item}</option>
                      </>
                    );
                  })}
                </Styledselect>
              </div>
            </InputWrapper>
          </Col>
        </Row>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              textAlign: "center",
              marginTop: "15px",
              marginRight: "8px",
            }}
          >
            <button
              onClick={handleCompareValue}
              style={{
                border: "1px solid #6AB344",
                borderRadius: "5px",
                color: "white",
                fontWeight: "600",
                cursor: "pointer",
                // padding: "8px 15px",
                width: "100px",
                height: "2.2rem",
                background: "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
              }}
            >
              Done
            </button>
          </div>

          <div style={{ textAlign: "center", marginTop: "15px" }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                border: "1px solid #EB5757",
                borderRadius: "5px",
                color: "EB5757",
                fontWeight: "600",
                cursor: "pointer",
                // padding: "8px 15px",
                height: "2.2rem",
                background: "white",
                width: "100px",
              }}
            >
              Cancel
            </button>
            <div>{/* {commonData} */}</div>
          </div>
        </div>

        {compareSection ? (
          <>
            <Row>
              <Col span={24}>
                <div
                  style={{
                    margin: "8px",

                    borderRadius: "12px",
                    backgroundColor: "#fcfcfc",
                    boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                  }}
                >
                  {/* <pre>{configurationComparisonData}</pre> */}
                  <div
                    style={{
                      width: "100%",
                      overflowX: "auto",
                      scrollBehavior: "smooth",
                    }}
                  >
                    {/* <Markup content={configurationComparisonData} /> */}

                    {ReactHtmlParser(configurationComparisonData)}
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : null}
      </Modal>
      <Modal
        width={700}
        title=""
        visible={isModalOpenRestroreData}
        onOk={handleOkRestroreData}
        onCancel={handleCancelRestroreData}
        footer={false}
      >
        <SpinLoading spinning={restoreLoading}>
          <>
            <h4 style={{ textAlign: "center" }}>Restore Data</h4>
            <hr />
            <TableStyling
              // rowSelection={rowSelection}
              // scroll={{ x: 2000 }}
              // rowKey="ip_address"
              columns={columnsRestore}
              dataSource={dataSourceRestore}
              pagination={{ pageSize: 5 }}
              // style={{ width: "100%" }}
            />
          </>
        </SpinLoading>
      </Modal>
    </div>
  );
};

const StyledInput = styled(Input)`
  // height: 2.2rem;
  // border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  box-shadow: none !important;
  background-color: #eee;
  overflow: hidden;
  &:focus {
    border: 1px solid #6ab344 !important;
  }
`;

export default index_Main;
