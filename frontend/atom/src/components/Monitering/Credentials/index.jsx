import React, { useState, useRef, useEffect } from "react";
import { Table, notification } from "antd";

import { Row, Col, Modal } from "antd";
import trash from "../assets/trash.svg";
import {
  TableStyling,
  StyledButton,
  AddAtomStyledButton,
  StyledInput,
  Styledselect,
  InputWrapper,
  DeleteButton,
  CreBtnStyle,
} from "../../AllStyling/All.styled.js";

import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { columnSearch } from "../../../utils";

import axios, { baseUrl } from "../../../utils/axios";

let excelData = [];
let v1v2excelData = [];
let v3excelData = [];

const Atom = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [v1v2rowCount, setv1v2RowCount] = useState(0);
  const [v3rowCount, setv3RowCount] = useState(0);
  const inputRef = useRef(null);

  let [dataSource, setDataSource] = useState(excelData);
  let [v1v2dataSource, setv1v2DataSource] = useState(v1v2excelData);
  let [v3dataSource, setv3DataSource] = useState(v3excelData);

  const [v1v2isModalOpen, setv1v2IsModalOpen] = useState(false);
  const [v3isModalOpen, setv3IsModalOpen] = useState(false);

  const [wmiIsModalOpen, setwmiIsModalOpen] = useState(false);

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

  let [loading, setLoading] = useState(false);
  const [configData, setConfigData] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
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

    try {
      await axios
        .post(baseUrl + "/addMonitoringCredentials ", v1v2Data)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");

            setLoading(false);
          } else {
            openSweetAlert("v1v2Data Added Successfully", "success");
            setProfileName("");
            setDescription("");
            setCommunity("");
            setPort("");
            setProfileName("");
            setDescription("");
            setCommunity("");
            setPort("");

            setIsModalOpen(false);
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getV1V2Credentials")
                .then((response) => {
                  v1v2excelData = response.data;
                  setv1v2DataSource(v1v2excelData);
                  setv1v2RowCount(v1v2excelData.length);
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

    try {
      await axios
        .post(baseUrl + "/addMonitoringCredentials ", v3Data)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");

            setLoading(false);
          } else {
            openSweetAlert("v3 Added Successfully", "success");
            setProfileNamev3("");
            setDescriptionv3("");
            setPortv3("");
            setUsernamev3("");
            setaAuthorizationPasswordv3("");
            setv3IsModalOpen(false);
            setEncryptionPasswordv3("");

            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getV3Credentials")
                .then((response) => {
                  v3excelData = response.data;
                  setv3DataSource(v3excelData);
                  setv3RowCount(v3excelData.length);
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
            openSweetAlert(response?.data, "error");
            setLoading(false);
          } else {
            openSweetAlert("WMI Added Successfully", "success");
            setUsernamewmi("");
            setPasswordwmi("");

            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getWMICredentials")
                .then((response) => {
                  excelData = response.data;
                  setDataSource(excelData);
                  setRowCount(excelData.length);
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

  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
  }, []);

  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getV1V2Credentials");
        v1v2excelData = res.data;
        setv1v2DataSource(v1v2excelData);
        setv1v2RowCount(v1v2excelData.length);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getV3Credentials");
        v3excelData = res.data;
        setv3DataSource(v3excelData);
        setv3RowCount(v3excelData.length);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getWMICredentials");
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
  }, []);

  const v3columns = [
    {
      title: "Profile Name",
      dataIndex: "profile_name",
      key: "profile_name",
      align: "left",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),
      ellipsis: true,
    },

    {
      title: "username",
      dataIndex: "username",
      key: "username",
      align: "left",

      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },

    {
      title: "Port",
      dataIndex: "port",
      key: "port",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },
    {
      title: "Authentication Protocol",
      dataIndex: "authentication_protocol",
      key: "authentication_protocol",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },
    {
      title: "Authentication Password",
      dataIndex: "authentication_password",
      key: "authentication_password",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },
    {
      title: "Encryption Protocol",
      dataIndex: "encryption_protocol",
      key: "encryption_protocol",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },
    {
      title: "Encryption Password",
      dataIndex: "encryption_password",
      key: "encryption_password",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },
  ];
  const v1v2columns = [
    {
      title: "Profile Name",
      dataIndex: "profile_name",
      key: "profile_name",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },

    {
      title: "Community",
      dataIndex: "community",
      key: "community",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },
    {
      title: "Port",
      dataIndex: "port",
      key: "port",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },
  ];

  const columns = [
    {
      title: "Profile Name",
      dataIndex: "profile_name",
      key: "profile_name",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },

    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },
    {
      title: "Password",
      dataIndex: "password",
      key: "password",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "10px" }}>{text}</p>
      ),

      ellipsis: true,
    },
  ];

  const deleteRowv3 = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        await axios
          .post(baseUrl + "/deleteMonitoringCreds ", selectedRowKeys)
          .then((response) => {
            openSweetAlert(`Credentials Deleted Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getV3Credentials")
                .then((response) => {
                  v3excelData = response.data;
                  setv3DataSource(v3excelData);
                  setv3RowCount(v3excelData.length);
                  setSelectedRowKeys([]);
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);
                })
            );
            return Promise.all(promises);
          })
          .catch((error) => {
            setLoading(false);

            console.log("in add seed device catch ==> " + error);
          });
      } catch (err) {
        setLoading(false);

        console.log(err);
      }
    } else {
      openSweetAlert(`No Credentials Selected`, "error");
    }
  };

  const deleteRowwmi = async () => {
    if (selectedRowKeysWmi.length > 0) {
      try {
        await axios
          .post(baseUrl + "/deleteMonitoringCreds ", selectedRowKeysWmi)
          .then((response) => {
            openSweetAlert(`Credentials Deleted Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getWMICredentials")
                .then((response) => {
                  excelData = response.data;
                  setDataSource(excelData);
                  setRowCount(excelData.length);
                  setSelectedRowKeysWmi([]);
                  // excelData = response.data;
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);
                })
            );
            return Promise.all(promises);
          })
          .catch((error) => {
            setLoading(false);

            console.log("in add seed device catch ==> " + error);
          });
      } catch (err) {
        setLoading(false);

        console.log(err);
      }
    } else {
      openSweetAlert(`No Credentials Selected`, "error");
    }
  };

  const deleteRowv1v2 = async () => {
    if (selectedRowKeysv1v2.length > 0) {
      try {
        await axios
          .post(baseUrl + "/deleteMonitoringCreds ", selectedRowKeysv1v2)
          .then((res) => {
            openSweetAlert(`Device Deleted Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getV1V2Credentials")
                .then((response) => {
                  v1v2excelData = response.data;
                  setv1v2DataSource(v1v2excelData);
                  setv1v2RowCount(v1v2excelData.length);
                  setSelectedRowKeysv1v2([]);
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);
                })
            );
            return Promise.all(promises);
          })
          .catch((error) => {
            setLoading(false);

            console.log("in add seed device catch ==> " + error);
          });
      } catch (err) {
        setLoading(false);

        console.log(err);
      }
    } else {
      openSweetAlert(`No Device Selected`, "error");
    }
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
  };
  const [selectedRowKeysWmi, setSelectedRowKeysWmi] = useState([]);

  const onSelectChangewmi = (selectedRowKeysWmi) => {
    setSelectedRowKeysWmi(selectedRowKeysWmi);
  };

  const rowSelectionwmi = {
    selectedRowKeysWmi,
    onChange: onSelectChangewmi,
    selection: Table.SELECTION_ALL,
  };

  const [selectedRowKeysv1v2, setSelectedRowKeysv1v2] = useState([]);

  const onSelectChangev1v2 = (selectedRowKeysv1v2) => {
    setSelectedRowKeysv1v2(selectedRowKeysv1v2);
  };

  const rowSelectionv1v2 = {
    selectedRowKeysv1v2,
    onChange: onSelectChangev1v2,
    selection: Table.SELECTION_ALL,
  };

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <AddAtomStyledButton
        onClick={showModal}
        disabled={!configData?.atom.pages.password_group.read_only}
        style={{
          marginRight: "30px",
          float: "right",
          borderRadius: "8px",
        }}
      >
        + Add Credentials
      </AddAtomStyledButton>
      <br />
      <br />
      <br />
      <div style={{ marginLeft: "15px", marginRight: "15px" }}>
        <Row style={{ width: "100%" }}>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                height: "100%",

                marginRight: "10px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #66b127",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  textAlign: "left",

                  paddingTop: "8px",
                  fontWeight: "bold",
                }}
              >
                SNMP Version 1 / Version 2
              </h3>

              {selectedRowKeysv1v2.length > 0 ? (
                <DeleteButton onClick={deleteRowv1v2}>
                  <img src={trash} width="18px" height="18px" alt="" />
                  &nbsp;Delete
                </DeleteButton>
              ) : null}
              <TableStyling
                rowSelection={rowSelectionv1v2}
                rowKey="cred_id"
                columns={v1v2columns}
                dataSource={v1v2dataSource}
                pagination={{ pageSize: 5 }}
                style={{
                  width: "100%",
                  padding: "2%",
                }}
              />
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <div
              style={{
                height: "100%",

                marginRight: "10px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #66b127",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  textAlign: "left",

                  paddingTop: "8px",
                  fontWeight: "bold",
                }}
              >
                WMI
              </h3>
              {selectedRowKeysWmi.length > 0 ? (
                <DeleteButton onClick={deleteRowwmi}>
                  <img src={trash} width="18px" height="18px" alt="" />
                  &nbsp;Delete
                </DeleteButton>
              ) : null}
              <TableStyling
                rowSelection={rowSelectionwmi}
                rowKey="cred_id"
                columns={columns}
                dataSource={dataSource}
                pagination={{ pageSize: 5 }}
                style={{
                  width: "100%",
                  padding: "2%",
                }}
              />
            </div>
          </Col>
        </Row>
        <Row style={{ width: "100%", marginTop: "10px" }}>
          <Col xs={{ span: 24 }} md={{ span: 24 }} lg={{ span: 24 }}>
            <div
              style={{
                height: "100%",

                marginRight: "10px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #66b127",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  textAlign: "left",
                  paddingTop: "8px",
                  fontWeight: "bold",
                }}
              >
                SNMP Version 3
              </h3>

              {selectedRowKeys.length > 0 ? (
                <DeleteButton onClick={deleteRowv3}>
                  <img src={trash} width="18px" height="18px" alt="" />
                  &nbsp;Delete
                </DeleteButton>
              ) : null}
              <TableStyling
                rowSelection={rowSelection}
                scroll={{ x: 2500 }}
                rowKey="cred_id"
                columns={v3columns}
                dataSource={v3dataSource}
                style={{
                  width: "100%",
                  padding: "2%",
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
      <Modal
        title="Add Credentials"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        style={{
          zIndex: "99999",
          alignContent: "center",
          padding: "0px",
        }}
        width="40%"
      >
        <Row style={{ width: "100%", marginTop: "10px" }}>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <CreBtnStyle onClick={showModalv1v2}>V 1 / V 2</CreBtnStyle>

            <Modal open={v1v2isModalOpen} footer={false}>
              <form
                onSubmit={handleSubmit}
                style={{
                  textAlign: "center",
                  padding: "15px",

                  backgroundColor: "rgba(238, 235, 235, 0.7)",
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
                      Add SNMP V1/V2
                    </p>
                    <div
                      style={{
                        float: "right",
                        display: "flex",
                        marginBottom: "30px",
                      }}
                    >
                      <button
                        style={{
                          float: "right",
                          width: "120px",
                          marginTop: "10px",
                          background:
                            "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                          border: "0px",
                          height: "30px",
                          borderRadius: "8px",
                          color: "white",
                          cursor: "pointer",
                        }}
                        type="submit"
                      >
                        Done
                      </button>

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
                        onClick={() => setv1v2IsModalOpen(false)}
                      >
                        Cancel
                      </StyledButton>
                    </div>
                  </Col>
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Profile Name: &nbsp;&nbsp;
                      <StyledInput
                        value={profileName}
                        onChange={(e) =>
                          setProfileName(
                            e.target.value.replace(/[^\w\s]/gi, "")
                          )
                        }
                      />
                    </InputWrapper>
                    <InputWrapper>
                      Description: &nbsp;&nbsp;
                      <StyledInput
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </InputWrapper>
                  </Col>
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Community: &nbsp;<span style={{ color: "red" }}>*</span>
                      &nbsp;&nbsp;
                      <StyledInput
                        value={community}
                        onChange={(e) => setCommunity(e.target.value)}
                        required
                      />
                    </InputWrapper>
                    <InputWrapper>
                      Port: &nbsp;&nbsp;
                      <StyledInput
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                      />
                    </InputWrapper>
                  </Col>
                </Row>
                &nbsp; &nbsp;
              </form>
            </Modal>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <CreBtnStyle onClick={showModalv3}>V 3</CreBtnStyle>

            <Modal visible={v3isModalOpen} closable={false} footer={false}>
              <form
                onSubmit={handleSubmitv3}
                style={{
                  textAlign: "center",
                  padding: "15px",
                  backgroundColor: "rgba(238, 235, 235, 0.7)",
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
                      Add SNMP V3
                    </p>
                    <div
                      style={{
                        float: "right",
                        display: "flex",
                      }}
                    >
                      <button
                        style={{
                          float: "right",
                          width: "120px",
                          marginTop: "10px",
                          background:
                            "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                          border: "0px",
                          height: "30px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          color: "white",
                        }}
                        type="submit"
                      >
                        Done
                      </button>

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
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Profile Name: &nbsp;&nbsp;
                      <span style={{ color: "red" }}>*</span>
                      <StyledInput
                        value={profileNamev3}
                        required
                        onChange={(e) =>
                          setProfileNamev3(
                            e.target.value.replace(/[^\w\s]/gi, "")
                          )
                        }
                      />
                    </InputWrapper>
                    <InputWrapper>
                      Description: &nbsp;&nbsp;
                      <span style={{ color: "red" }}>*</span>
                      <StyledInput
                        required
                        value={descriptionv3}
                        onChange={(e) => setDescriptionv3(e.target.value)}
                      />
                    </InputWrapper>
                  </Col>
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Username: &nbsp;&nbsp;
                      <span style={{ color: "red" }}>*</span>
                      <StyledInput
                        required
                        value={usernamev3}
                        onChange={(e) => setUsernamev3(e.target.value)}
                      />
                    </InputWrapper>
                    <InputWrapper>
                      Port: &nbsp;&nbsp;
                      <span style={{ color: "red" }}>*</span>
                      <StyledInput
                        value={portv3}
                        required
                        onChange={(e) => setPortv3(e.target.value)}
                      />
                    </InputWrapper>
                  </Col>
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Authorization Protocol: &nbsp;&nbsp;
                      <span style={{ color: "red" }}>*</span>
                      <div className="select_type">
                        <Styledselect
                          className="rectangle"
                          required
                          placeholder="select"
                          value={authorizationProtocolv3}
                          onChange={(e) =>
                            setaAuthorizationProtocolv3(e.target.value)
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
                      Authorization Password: &nbsp;&nbsp;
                      <span style={{ color: "red" }}>*</span>
                      <StyledInput
                        required
                        value={authorizationPasswordv3}
                        onChange={(e) =>
                          setaAuthorizationPasswordv3(e.target.value)
                        }
                      />
                    </InputWrapper>
                  </Col>
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Encryption Protocol: &nbsp;
                      <span style={{ color: "red" }}>*</span>
                      &nbsp;&nbsp;
                      <div className="select_type">
                        <Styledselect
                          className="rectangle"
                          required
                          placeholder="select"
                          value={encryptionProtocolv3}
                          onChange={(e) =>
                            setEncryptionProtocolv3(e.target.value)
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
                      Encryption Password: &nbsp;&nbsp;
                      <span style={{ color: "red" }}>*</span>
                      <StyledInput
                        required
                        value={encryptionPasswordv3}
                        onChange={(e) =>
                          setEncryptionPasswordv3(e.target.value)
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
        <Row style={{ width: "100%", marginTop: "10px" }}>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <CreBtnStyle onClick={showModalwmi}>WMI</CreBtnStyle>
            <Modal visible={wmiIsModalOpen} footer={false} closable={false}>
              <form
                onSubmit={handleSubmitWmc}
                style={{
                  textAlign: "center",
                  padding: "15px",
                  backgroundColor: "rgba(238, 235, 235, 0.7)",
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
                      <button
                        style={{
                          float: "right",
                          width: "120px",
                          marginTop: "10px",
                          background:
                            "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                          border: "0px",
                          height: "30px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          color: "white",
                        }}
                        type="submit"
                      >
                        Done
                      </button>

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
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Username: &nbsp;&nbsp;
                      <span style={{ color: "red" }}>*</span>
                      <StyledInput
                        value={usernamewmi}
                        required
                        onChange={(e) =>
                          setUsernamewmi(
                            e.target.value.replace(/[^\w\s]/gi, "")
                          )
                        }
                      />
                    </InputWrapper>
                    <InputWrapper>
                      Password: &nbsp;&nbsp;
                      <span style={{ color: "red" }}>*</span>
                      <StyledInput
                        required
                        value={passwordwmi}
                        onChange={(e) => setPasswordwmi(e.target.value)}
                      />
                    </InputWrapper>
                  </Col>
                  <Col span={1}></Col>
                  <Col span={11}>
                    <InputWrapper>
                      Profile Name: &nbsp;&nbsp;
                      <span style={{ color: "red" }}>*</span>
                      <StyledInput
                        required
                        value={profileNamewmi}
                        onChange={(e) =>
                          setProfileNamewmi(
                            e.target.value.replace(/[^\w\s]/gi, "")
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
  );
};

export default Atom;
