import React, { useState, useEffect } from "react";
import { Row, Col, Table, Modal, Switch } from "antd";
import { EditOutlined } from "@ant-design/icons";

import trash from "../assets/trash.svg";
import { columnSearch } from "../../../utils";
import smnp from "../assets/snmp.svg";
import inactivesnmp from "../assets/inactivesnmp.svg";
import login from "../assets/login.svg";
import inactivelogin from "../assets/inactivelogin.svg";

import axios, { baseUrl } from "../../../utils/axios";
import {
  TableStyling,
  StyledButton,
  AddAtomStyledButton,
  StyledInput,
  Styledselect,
  InputWrapper,
  DeleteButton,
  SpinLoading,
  CreBtnStyleAuto,
  DivStyleCre,
  PStyleCre,
} from "../../AllStyling/All.styled.js";
import Swal from "sweetalert2";

let excelData = [];
let excelDatapassGroup = [];
let columnFilters = {};
let v3excelData = [];

const index = () => {
  const LoginCredentialsTrigger = () => {};
  const WMICredentialsTrigger = () => {};
  const [tableName, setTableName] = useState("SNMP Credentials");

  const showTable = (myDataTable) => {
    if (myDataTable === "SNMP Credentials") {
      setTableName("SNMP Credentials");
    } else if (myDataTable === "Login Credentials") {
      setTableName("Login Credentials");
      LoginCredentialsTrigger();
    } else if (myDataTable === "WMI Credentials") {
      setTableName("WMI Credentials");
      WMICredentialsTrigger();
    }
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  let [dataSource, setDataSource] = useState(excelData);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  let [loading, setLoading] = useState(false);
  const [discoveryCount, setDiscoveryCount] = useState("");
  const [selectedRowKeysv3, setSelectedRowKeysv3] = useState([]);
  const [alertStatusLoading, setAlertStatusLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  let [v3dataSource, setv3DataSource] = useState(v3excelData);
  const [configData, setConfigData] = useState(null);
  let [dataSourcepassGroup, setDataSourcepassGroup] =
    useState(excelDatapassGroup);
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
  const [encryptionProtocolv3, setEncryptionProtocolv3] = useState("");

  const [encryptionPasswordv3, setEncryptionPasswordv3] = useState("");

  const [usernamewmi, setUsernamewmi] = useState("");
  const [passwordwmi, setPasswordwmi] = useState("");
  const [profileNamewmi, setProfileNamewmi] = useState("");

  const [checked, setChecked] = useState([]);

  const onChangeSwitch = (isChecked, id) => {
    if (isChecked) {
      setChecked((prev) => [...prev, id]);
    } else {
      let tempArray = [...checked];
      const index = tempArray.indexOf(id);
      if (index > -1) {
        tempArray.splice(index, 1);
        setChecked(tempArray);
      }
    }
  };

  useEffect(() => {
    const serviceCalls = async () => {
      try {
        const res = await axios.get(baseUrl + "/getPasswordGroups");
        excelDatapassGroup = res.data;
        setDataSourcepassGroup(excelDatapassGroup);
      } catch (err) {
        console.log(err.response);
      }
    };
    serviceCalls();
  }, []);

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

  const handleCancelwmi = () => {
    setwmiIsModalOpen(false);
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

  const onSelectChangev3 = (selectedRowKeysv3) => {
    setSelectedRowKeysv3(selectedRowKeysv3);
  };

  const rowSelectionv3 = {
    columnWidth: 40,
    selectedRowKeysv3,
    onChange: onSelectChangev3,
    selection: Table.SELECTION_ALL,
  };

  useEffect(() => {
    const serviceCalls = async () => {
      setAlertStatusLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getDiscoveryCredentialsCount");

        setDiscoveryCount(res.data);
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
        const res = await axios.get(baseUrl + "/getV1V2Credentials");
        excelData = res.data;
        setDataSource(excelData);

        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1v2Data = {
      profile_name: profileName,
      description,
      community,
      port,
      category: "v1/v2",
    };

    if (v1v2Data.community !== "") {
      setv1v2IsModalOpen(false);

      try {
        await axios
          .post(baseUrl + "/addMonitoringCredentials ", v1v2Data)
          .then((response) => {
            if (response?.response?.status == 500) {
              openSweetAlert(response?.response?.data, "error");
              setLoading(false);
            } else {
              openSweetAlert(response.data, "success");
              setProfileName("");
              setDescription("");
              setCommunity("");
              setPort("");
              const promises = [];
              promises.push(
                axios
                  .get(baseUrl + "/getSNMPV1V2Credentials")
                  .then((response) => {
                    excelData = response.data;
                    setDataSource(excelData);
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
    } else {
      setShowError(true);
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

    setv3IsModalOpen(false);
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
            setEncryptionPasswordv3("");

            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getV3Credentials")
                .then((response) => {
                  v3excelData = response.data;
                  setv3DataSource(v3excelData);
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

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "description",
        "Description",

        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Version",
      dataIndex: "version",
      key: "version",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "version",
        "Version",

        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Cred History",
      dataIndex: "profile_name",
      key: "profile_name",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "profile_name",
        "Profile Name",

        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "community",
      dataIndex: "community",
      key: "community",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "community",
        "Community",

        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  const deleteRow = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        await axios
          .post(baseUrl + "/deleteMonitoringCreds", selectedRowKeys)
          .then((response) => {
            if (response?.response?.status == 500) {
              openSweetAlert(response?.response?.data, "error");
              setOnboardLoading(false);
            } else {
              openSweetAlert(`Credential Deleted Successfully`, "success");
              const promises = [];
              promises.push(
                axios
                  .get(baseUrl + "/getSNMPV1V2Credentials")
                  .then((response) => {
                    excelData = response.data;
                    setDataSource(response.data);
                    setSelectedRowKeys([]);

                    setLoading(false);
                  })
                  .catch((error) => {
                    console.log(error);
                    setLoading(false);
                  })
              );
              return Promise.all(promises);
            }
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

  const deleteRowV3 = async () => {
    if (selectedRowKeysv3.length > 0) {
      try {
        //console.log(device);
        await axios
          .post(baseUrl + "/deleteSNMPCredentials", selectedRowKeysv3)
          .then((response) => {
            if (response?.response?.status == 500) {
              openSweetAlert(response?.response?.data, "error");
              console.log("logs", response?.response?.data);
              setOnboardLoading(false);
            } else {
              openSweetAlert(`Credential Deleted Successfully`, "success");
              const promises = [];
              promises.push(
                axios
                  .get(baseUrl + "/getSNMPV3CredentialsForDiscovery")
                  .then((response) => {
                    v3excelData = response.data;
                    setv3DataSource(response.data);

                    setSelectedRowKeysv3([]);

                    // excelData = response.data;
                    setLoading(false);
                  })
                  .catch((error) => {
                    console.log(error);
                    setLoading(false);
                  })
              );
              return Promise.all(promises);
            }
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

  const [v3Loading, setV3Loading] = useState(false);

  useEffect(() => {
    const serviceCalls = async () => {
      setV3Loading(true);

      try {
        const res = await axios.get(baseUrl + "/getV3Credentials");
        v3excelData = res.data;
        setv3DataSource(v3excelData);

        setV3Loading(false);
      } catch (err) {
        console.log(err.response);
        setV3Loading(false);
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

  const columnspassGroup = [
    {
      title: "",
      key: "edit",
      width: "5%",

      render: (text, record) => (
        <>
          {!configData?.atom.pages.password_group.read_only ? (
            <>
              <p
                style={{
                  color: "#66B127",
                  textDecoration: "underline",
                  fontWeight: "400",
                  textAlign: "center",
                  paddingTop: "5px",
                  paddingLeft: "15px",
                  cursor: "pointer",
                }}
                disabled
              >
                <EditOutlined
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
                paddingTop: "5px",
                paddingLeft: "15px",
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
      title: "IP Address",
      dataIndex: "password_group",
      key: "password_group",
      align: "center",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "password_group",
        "Password Group",
        setDataSourcepassGroup,
        excelDatapassGroup,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "username",
      dataIndex: "username",
      key: "username",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "username",
        "Username",
        setDataSourcepassGroup,
        excelDatapassGroup,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "password",
      dataIndex: "password",
      key: "password",

      ...getColumnSearchProps(
        "password",
        "Password",
        setDataSourcepassGroup,
        excelDatapassGroup,
        columnFilters
      ),
      ellipsis: true,
      render: (text, record) => (
        <>
          {checked.includes(record.password_group) ? (
            <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
          ) : (
            <p style={{ textAlign: "center", paddingTop: "10px" }}>*******</p>
          )}
        </>
      ),
    },
    {
      title: "",
      dataIndex: "show_password",
      key: "show_password",
      width: "7%",
      render: (e, record) => (
        <Switch
          style={{ backgroundColor: "#059142" }}
          onChange={(checked) => onChangeSwitch(checked, record.password_group)}
          defaultChecked={e}
        />
      ),
    },
  ];

  return (
    <>
      <AddAtomStyledButton
        onClick={showModal}
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
      <div style={{ margin: "10px 15px" }}>
        <Row style={{ textAlign: "center" }}>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
            <DivStyleCre
              onClick={() => showTable("SNMP Credentials")}
              active={"SNMP Credentials" === tableName}
            >
              <PStyleCre active={"SNMP Credentials" === tableName}>
                <img
                  src={"SNMP Credentials" === tableName ? smnp : inactivesnmp}
                  alt=""
                  style={{ width: "20px", height: "20px" }}
                />{" "}
                SNMP Credentials
              </PStyleCre>
            </DivStyleCre>
            <DivStyleCre
              onClick={() => showTable("Login Credentials")}
              active={"Login Credentials" === tableName}
            >
              <PStyleCre active={"Login Credentials" === tableName}>
                <img
                  src={
                    "Login Credentials" === tableName ? login : inactivelogin
                  }
                  alt=""
                  style={{ width: "20px", height: "20px" }}
                />{" "}
                Login Credentials
              </PStyleCre>
            </DivStyleCre>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
            <div
              style={{
                background: "#FDFDFD",
                border: "1px solid rgba(0, 0, 0, 0.1)",

                height: "100%",
                borderRadius: "8px",
                marginLeft: "5px",
                marginRight: "5px",

                display: "grid",
                placeItems: "center",
              }}
            >
              <SpinLoading spinning={alertStatusLoading}>
                <h2 style={{ fontWeight: 700 }}>
                  {discoveryCount && discoveryCount.snmp_v2}
                </h2>
                <p>SNMP V2</p>
              </SpinLoading>
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
            <div
              style={{
                background: "#FDFDFD",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                height: "100%",
                borderRadius: "8px",
                marginRight: "5px",
                display: "grid",
                placeItems: "center",
              }}
            >
              <SpinLoading spinning={alertStatusLoading}>
                <h2 style={{ fontWeight: 700 }}>
                  {discoveryCount && discoveryCount.snmp_v3}
                </h2>
                <p>SNMP V3</p>
              </SpinLoading>
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
            <div
              style={{
                background: "#FDFDFD",
                border: "1px solid rgba(0, 0, 0, 0.1)",
                height: "100%",
                borderRadius: "8px",
                display: "grid",
                placeItems: "center",
              }}
            >
              <SpinLoading spinning={alertStatusLoading}>
                <h2 style={{ fontWeight: 700 }}>
                  {discoveryCount && discoveryCount.login}
                </h2>
                <p>SSH Login</p>
              </SpinLoading>
            </div>
          </Col>
        </Row>
        <br />
        {selectedRowKeys.length > 0 ? (
          <DeleteButton onClick={deleteRow} style={{ marginLeft: "10px" }}>
            <img src={trash} width="18px" height="18px" alt="" />
            &nbsp;Delete
          </DeleteButton>
        ) : null}
        {tableName === "SNMP Credentials" ? (
          <>
            <SpinLoading spinning={loading} tip="Loading...">
              <div style={{ padding: "15px" }}>
                <h2 style={{ fontWeight: 700 }}>V1/V2 Credentials</h2>

                <TableStyling
                  rowSelection={rowSelection}
                  rowKey="cred_id"
                  columns={columns}
                  dataSource={dataSource}
                  style={{ width: "100%", padding: "2%" }}
                />
              </div>
            </SpinLoading>

            {selectedRowKeysv3.length > 0 ? (
              <DeleteButton
                onClick={deleteRowV3}
                style={{ marginLeft: "10px" }}
              >
                <img src={trash} width="18px" height="18px" alt="" />
                &nbsp;Delete
              </DeleteButton>
            ) : null}

            <SpinLoading spinning={v3Loading} tip="Loading...">
              <div style={{ padding: "15px" }}>
                <h2 style={{ fontWeight: 700 }}>V3 Credentials</h2>

                <TableStyling
                  rowSelection={rowSelectionv3}
                  scroll={{ x: 2500 }}
                  rowKey="credentials_id"
                  columns={v3columns}
                  dataSource={v3dataSource}
                  style={{
                    width: "100%",
                    padding: "2%",
                    // margin: "0 auto"
                  }}
                />
              </div>
            </SpinLoading>
          </>
        ) : null}
        {tableName === "Login Credentials" ? (
          <SpinLoading spinning={loading} tip="Loading...">
            <div style={{ padding: "15px" }}>
              <h2 style={{ fontWeight: 700 }}>SSH Login</h2>

              <TableStyling
                rowKey="password_group"
                columns={columnspassGroup}
                dataSource={dataSourcepassGroup}
                style={{
                  width: "100%",
                  padding: "2%",
                }}
              />
            </div>
          </SpinLoading>
        ) : null}
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
            <CreBtnStyleAuto onClick={showModalv1v2}>V 1 / V 2</CreBtnStyleAuto>
            <Modal open={v1v2isModalOpen} footer={false} closable={false}>
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
                  <Col span={24}>
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
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        marginBottom: "20px",
                        width: "100%",
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
                        onClick={handleCancelv1v2}
                      >
                        Cancel
                      </StyledButton>
                    </div>
                  </Col>
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Profile Name: &nbsp;
                      <span style={{ color: "red" }}>*</span>
                      &nbsp;&nbsp;
                      <StyledInput
                        value={profileName}
                        required
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
                      {showError && (
                        <span
                          style={{
                            display: "block",
                            color: "red",
                            marginTop: "5px",
                            fontSize: "10px",
                          }}
                          className="error"
                        >
                          * This field is required
                        </span>
                      )}
                    </InputWrapper>
                    <InputWrapper>
                      Port: &nbsp;&nbsp;
                      <StyledInput
                        value={port}
                        onChange={(e) => setPort(e.target.value)}
                        // required
                      />
                    </InputWrapper>
                  </Col>
                </Row>
                &nbsp; &nbsp;
              </form>
            </Modal>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <CreBtnStyleAuto onClick={showModalv3}>V 3</CreBtnStyleAuto>

            <Modal open={v3isModalOpen} closable={false} footer={false}>
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
                        marginBottom: "30px",
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
                      <StyledInput
                        value={profileNamev3}
                        // required
                        onChange={(e) =>
                          setProfileNamev3(
                            e.target.value.replace(/[^\w\s]/gi, "")
                          )
                        }
                      />
                    </InputWrapper>
                    <InputWrapper>
                      Description: &nbsp;&nbsp;
                      <StyledInput
                        value={descriptionv3}
                        onChange={(e) => setDescriptionv3(e.target.value)}
                        // required
                      />
                    </InputWrapper>
                  </Col>
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Username: &nbsp;<span style={{ color: "red" }}>*</span>
                      &nbsp;&nbsp;
                      <StyledInput
                        value={usernamev3}
                        onChange={(e) => setUsernamev3(e.target.value)}
                        required
                      />
                    </InputWrapper>
                    <InputWrapper>
                      Port: &nbsp;&nbsp;
                      <StyledInput
                        value={portv3}
                        onChange={(e) => setPortv3(e.target.value)}
                      />
                    </InputWrapper>
                  </Col>
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Authorization Protocol: &nbsp;&nbsp;
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
                      <StyledInput
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
                          <option value="">Select Protocol</option>
                          <option value="des">DES</option>
                          <option value="AES-128">AES-128</option>
                          <option value="AES-192">AES-192</option>
                          <option value="AES-256">AES-256</option>
                        </Styledselect>
                      </div>
                    </InputWrapper>
                    <InputWrapper>
                      Encryption Password: &nbsp;&nbsp;
                      <StyledInput
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
            {/* <CreBtnStyleAuto onClick={showModalwmi}>WMI</CreBtnStyleAuto> */}
            <Modal
              // title="WMI"
              open={wmiIsModalOpen}
              footer={false}
              closable={false}
              // onOk={handleOkwmi}
              // onCancel={handleCancelwmi}
            >
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
                      {usernamewmi !== "" && passwordwmi !== "" ? (
                        <button
                          onClick={handleSubmitWmc}
                          style={{
                            float: "right",
                            width: "120px",
                            marginTop: "10px",
                            background:
                              "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                            border: "0px",
                            height: "30px",
                            borderRadius: "8px",
                          }}
                          // color={"green"}
                          type="submit"
                          // htmlFor="submit"
                          // value="Done"
                        >
                          Done
                        </button>
                      ) : (
                        <button
                          // onClick={handleSubmit}
                          disabled={true}
                          style={{
                            float: "right",
                            width: "120px",
                            marginTop: "10px",
                            background:
                              "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                            border: "0px",
                            height: "30px",
                            borderRadius: "8px",
                            cursor: "no-drop",
                          }}
                          // color={"green"}
                          // type="submit"
                          // htmlFor="submit"
                          // value="Done"
                        >
                          Done
                        </button>
                      )}
                      {/* Done
                                                  </input> */}
                      <StyledButton
                        style={{
                          float: "right",
                          marginTop: "10px",
                          width: "120px",
                          marginLeft: "10px",
                          marginRight: "10px",
                          height: "30px",
                          borderRadius: "8px",
                          // paddingBottom: "5px",
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
                      Username:
                      {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                      &nbsp;&nbsp;
                      <StyledInput
                        value={usernamewmi}
                        onChange={(e) =>
                          setUsernamewmi(
                            e.target.value.replace(/[^\w\s]/gi, "")
                          )
                        }
                        // required
                      />
                    </InputWrapper>
                    <InputWrapper>
                      Password:
                      {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                      &nbsp;&nbsp;
                      <StyledInput
                        value={passwordwmi}
                        onChange={(e) => setPasswordwmi(e.target.value)}
                        // required
                      />
                    </InputWrapper>
                  </Col>
                  <Col span={1}></Col>
                  <Col span={11}>
                    <InputWrapper>
                      Profile Name:
                      {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                      &nbsp;&nbsp;
                      <StyledInput
                        value={profileNamewmi}
                        onChange={(e) =>
                          setProfileNamewmi(
                            e.target.value.replace(/[^\w\s]/gi, "")
                          )
                        }
                        // required
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
    </>
  );
};

export default index;
