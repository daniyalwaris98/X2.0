import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";

import { Col, Row, Input, Dropdown, Menu, Modal } from "antd";
import "./glasseffect.css";
import { saveAs } from "file-saver";
import axios, { baseUrl } from "../../../utils/axios";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import ReactHtmlParser from "react-html-parser";
import {
  DownOutlined,
  CaretRightOutlined,
  CaretLeftOutlined,
  DeleteTwoTone,
} from "@ant-design/icons";

import "../../../App.css";
import {
  TableStyling,
  SummaryDevices,
  MainTitle,
  SpinLoading,
  Styledselect,
  InputWrapper,
} from "../../AllStyling/All.styled.js";

import { columnSearch } from "../../../utils";
import Highlighter from "react-highlight-words";
import { ConfigManagmentStyle } from "./ConfigManagment.style";

let excelData = [];
let excelDataRestore = [];
let columnFilters = {};

const index_Main = () => {
  const data = useLocation();
  const targetRef = useRef(null);
  const findInput = useRef(null);
  const ipAddress = data?.state?.ip_address;

  console.log("COnfig data================>>", data);

  const handleFindNext = () => {
    const searchTerm = findInput.current.value;
    window.find(searchTerm, false, false, false, false, true, true);
  };

  const handleFindPrevious = () => {
    const searchTerm = findInput.current.value;
    window.find(searchTerm, false, true, false, false, true, true);
  };

  const [loading, setLoading] = useState(false);
  const [compareSection, setCompareSection] = useState(false);
  const [rightSide, setRightSide] = useState(false);
  const [tableClickLoading, setTableClickLoading] = useState(false);
  const [restoreLoading, setRestoreLoading] = useState(false);

  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchedColumn, setSearchedColumn] = useState(null);
  let [configDatabyDate, setConfigDatabyDate] = useState("");

  let [dataSource, setDataSource] = useState(excelData);
  let [dataSourceRestore, setDataSourceRestore] = useState(excelDataRestore);

  const [searchText, setSearchText] = useState(null);
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [rowCount, setRowCount] = useState(0);
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

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );

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
    const ipData = {
      ip_address: ipAddress,
    };

    setLoading(true);

    await axios
      .post(baseUrl + "/backupConfigurations", ipData)
      .then((response) => {
        console.log("IP response ==============>", response);

        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");
          setLoading(false);
        } else {
          openSweetAlert(response?.data, "success");

          axios
            .post(baseUrl + "/getAllConfigurationDates", ipData)
            .then((response) => {
              excelData = response.data;
              setDataSource(excelData);
              setRowCount(excelData.length);
              setLoading(false);
            })
            .catch((error) => {
              console.log(error);
            });
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
                setLoading(false);
              } else {
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

              if (res?.response?.status == 500) {
                openSweetAlert(res?.response?.data, "error");
                setRestoreLoading(false);
              } else {
                openSweetAlert(res?.response?.data, "success");

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

              if (res?.response?.status == 500) {
                openSweetAlert(res?.response?.data, "error");
                setRestoreLoading(false);
              } else {
                var blob = new Blob([res.data[1]], {
                  type: "text/plain;charset=utf-8",
                });
                saveAs(blob, `${res.data[0]}.cfg`);
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
          document.getElementById("search").focus();
        } else {
          return true;
        }
      }
    });
  }, []);

  return (
    <ConfigManagmentStyle>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px",
        }}
      >
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
            Backup
          </button>
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
                background: "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
              }}
            >
              Manage Configuration <DownOutlined />
            </button>
          </Dropdown>
        </div>
      </div>

      <div>
        {tableName === "Configurations" ? (
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
                    <div
                      className="html-template-placeholder"
                      style={{ height: "100%" }}
                    >
                      <article className="section-header">
                        <article className="time-and-date"></article>
                        <article className="search-input">
                          <input
                            type="text"
                            ref={findInput}
                            placeholder="Search"
                            onKeyDown={(e) => {
                              if (e.keyCode === 13) {
                                handleFindNext();
                              }
                            }}
                          />
                          <button onClick={handleFindPrevious}>
                            <CaretLeftOutlined />
                          </button>
                          <button onClick={handleFindNext}>
                            <CaretRightOutlined />
                          </button>
                        </article>
                      </article>
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
        ) : null}
        {tableName === "Documentation" ? (
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
              <div style={{ width: "100%", padding: "15px", height: "200px" }}>
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
        ) : null}
      </div>

      <br />
      <Modal
        width={980}
        title=""
        open={isModalOpen}
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
                    return <option key={index}>{item}</option>;
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
                    return <option>{item}</option>;
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
                height: "2.2rem",
                background: "white",
                width: "100px",
              }}
            >
              Cancel
            </button>
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
                  <div
                    style={{
                      width: "100%",
                      overflowX: "auto",
                      scrollBehavior: "smooth",
                    }}
                  >
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
        open={isModalOpenRestroreData}
        onOk={handleOkRestroreData}
        onCancel={handleCancelRestroreData}
        footer={false}
      >
        <SpinLoading spinning={restoreLoading}>
          <>
            <h4 style={{ textAlign: "center" }}>Restore Data</h4>
            <hr />
            <TableStyling
              columns={columnsRestore}
              dataSource={dataSourceRestore}
              pagination={{ pageSize: 5 }}
            />
          </>
        </SpinLoading>
      </Modal>
    </ConfigManagmentStyle>
  );
};

const StyledInput = styled(Input)`
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  box-shadow: none !important;
  background-color: #eee;
  overflow: hidden;
  &:focus {
    border: 1px solid #6ab344 !important;
  }
`;

export default index_Main;
