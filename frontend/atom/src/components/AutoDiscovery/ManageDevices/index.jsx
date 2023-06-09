import React, { useState, useEffect } from "react";
import { Row, Col, Space, Table, Modal } from "antd";
import tick from "../assets/tick.svg";
import stop from "../assets/stop.svg";
import dash from "../assets/dash.svg";

import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { columnSearch } from "../../../utils";
import axios, { baseUrl } from "../../../utils/axios";
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
  DeleteButton,
  CreBtnStyle,
  HoverStyle,
  HoverLabelStyle,
  SpinLoading,
  CreBtnStyleAuto,
} from "../../AllStyling/All.styled.js";
import Swal from "sweetalert2";

// import { SpinLoading, TableStyling } from "../../AllStyling/All.styled.js";

let excelData = [];
let columnFilters = {};
let v1v2excelData = [];
let v1v2columnFilters = {};
let v3excelData = [];
let v3columnFilters = {};

const index = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [alertStatusLoading, setAlertStatusLoading] = useState(false);
  const [size, setSize] = useState("small");
  const [alertStatus, setAlertStatus] = useState("");
  let [dataSource, setDataSource] = useState(excelData);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  let [loading, setLoading] = useState(false);
  const [rowCount, setRowCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [siteData, setSiteData] = useState(null);
  const [rackData, setRackData] = useState(null);
  const [v3rowCount, setv3RowCount] = useState(0);
  const [v1v2rowCount, setv1v2RowCount] = useState(0);
  const [rackNameModalVisible, setRackNameModalVisible] = useState(false);
  const [siteNameModalVisible, setSiteNameModalVisible] = useState(false);
  let [v1v2dataSource, setv1v2DataSource] = useState(v1v2excelData);
  let [v3dataSource, setv3DataSource] = useState(v3excelData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [v1v2isModalOpen, setv1v2IsModalOpen] = useState(false);
  const [v3isModalOpen, setv3IsModalOpen] = useState(false);
  const [credentialIsModalOpen, setCredentialIsModalOpen] = useState(false);
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
  const handleOkv1v2 = () => {
    setv1v2IsModalOpen(false);
  };
  const handleCancelv1v2 = () => {
    setv1v2IsModalOpen(false);
  };

  const showModalv3 = () => {
    setv3IsModalOpen(true);
  };
  const handleOkv3 = () => {
    setv3IsModalOpen(false);
  };
  const handleCancelv3 = () => {
    setv3IsModalOpen(false);
  };
  const showModalwmi = () => {
    setwmiIsModalOpen(true);
  };
  const handleOkwmi = () => {
    setwmiIsModalOpen(false);
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
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    columnWidth: 40,
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    // getCheckboxProps: () => ({
    //   disabled: !configData?.atom.pages.atom.read_only,
    // }),
  };
  // useEffect(() => {
  //   const serviceCalls = async () => {
  //     setAlertStatusLoading(true);

  //     try {
  //       const res = await axios.get(baseUrl + "/alertStatus");
  //       console.log("res", res);
  //       setAlertStatus(res.data);
  //       setAlertStatusLoading(false);
  //     } catch (err) {
  //       console.log(err.response);
  //       setAlertStatusLoading(false);
  //     }
  //   };
  //   serviceCalls();
  // }, []);
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    const v1v2Data = {
      profile_name: profileName,
      description,
      community,
      port,
      category: "v1/v2",
    };
    console.log(v1v2Data);
    setv1v2IsModalOpen(false);

    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/addMonitoringCredentials ", v1v2Data)
        .then((response) => {
          console.log("hahahehehoho");
          // console.log(response.status);
          if (response?.response?.status == 500) {
            openSweetAlert(response?.data, "error");
            console.log(response?.data);
            // openSweetAlert("Something Went Wrong!", "error");
            setLoading(false);
          } else {
            openSweetAlert("v1v2Data Added Successfully", "success");
            setProfileName("");
            setDescription("");
            setCommunity("");
            setPort("");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getV1V2Credentials")
                .then((response) => {
                  console.log("getV1V2Credentials", response);
                  // setcred(response.data);
                  // setCred_group(response.data[0]);
                  v1v2excelData = response.data;
                  setv1v2DataSource(v1v2excelData);
                  setv1v2RowCount(v1v2excelData.length);
                })
                .catch((error) => {
                  console.log(error);
                  // openSweetAlert("Something Went Wrong!", "danger");
                  // setLoading(false);
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
    console.log(v3Data);
    setv3IsModalOpen(false);
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/addMonitoringCredentials ", v3Data)
        .then((response) => {
          console.log("hahahehehoho");
          // console.log(response.status);
          if (response?.response?.status == 500) {
            openSweetAlert(response?.data, "error");
            console.log(response?.data);
            // openSweetAlert("Something Went Wrong!", "error");
            setLoading(false);
          } else {
            openSweetAlert("v3 Added Successfully", "success");
            setProfileNamev3("");
            setDescriptionv3("");
            setPortv3("");
            setUsernamev3("");
            setaAuthorizationPasswordv3("");
            // setaAuthorizationProtocolv3("");
            setEncryptionPasswordv3("");
            // setEncryptionProtocolv3("");

            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getV3Credentials")
                .then((response) => {
                  console.log("getV3Credentials", response);
                  // setcred(response.data);
                  // setCred_group(response.data[0]);

                  v3excelData = response.data;
                  setv3DataSource(v3excelData);
                  setv3RowCount(v3excelData.length);
                })
                .catch((error) => {
                  console.log(error);
                  // openSweetAlert("Something Went Wrong!", "danger");
                  // setLoading(false);
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
    console.log(wmiData);
    setwmiIsModalOpen(false);
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/addMonitoringCredentials ", wmiData)
        .then((response) => {
          console.log("hahahehehoho");
          // console.log(response.status);
          if (response?.response?.status == 500) {
            openSweetAlert(response?.data, "error");
            console.log(response?.data);
            // openSweetAlert("Something Went Wrong!", "error");
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
                  console.log("getWMICredentials", response);
                  // setcred(response.data);
                  // setCred_group(response.data[0]);
                  excelData = response.data;
                  setDataSource(excelData);
                  setRowCount(excelData.length);
                })
                .catch((error) => {
                  console.log(error);
                  // openSweetAlert("Something Went Wrong!", "danger");
                  // setLoading(false);
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
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getManageDevices");
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

  const columns = [
    // {
    //   title: "",
    //   key: "edit",
    //   width: "1%",

    //   render: (text, record) => (
    //     <>
    //       {!configData?.atom.pages.atom.read_only ? (
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
    //               style={{ paddingTop:"17px", color: "#66A111" }}
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
    //             style={{paddingTop:"17px",  color: "#66A111" }}
    //           />
    //         </p>
    //       )}
    //     </>
    //   ),
    // },

    // {
    //   title: "Atom ID",
    //   dataIndex: "atom_id",
    //   key: "atom_id",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "atom_id",
    //     "Atom Id",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },

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
      title: "OS Type",
      dataIndex: "os_type",
      key: "os_type",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
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
      // title: (
      //   <ColumnHeader
      //     dataIndex="device_name"
      //     title="Device Name"
      //     setRowCount={setRowCount}
      //     setDataSource={setDataSource}
      //     excelData={excelData}
      //     columnFilters={columnFilters}
      //   />
      // ),
      //   title: "Device Name",
      //   dataIndex: "device_name",
    },
    // {
    //   title: "Make & Modal",
    //   dataIndex: "make_modal",
    //   key: "make_modal",
    //   render: (text, record) => <p style={{ textAlign: "center",paddingTop:"16px" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "make_modal",
    //     "Make & Modal",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    {
      title: "Function",
      dataIndex: "function",
      key: "function",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingTop: "16px" }}>{text}</p>
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
      // title: (
      //   <ColumnHeader
      //     dataIndex="function"
      //     title="Function"
      //     setRowCount={setRowCount}
      //     setDataSource={setDataSource}
      //     excelData={excelData}
      //     columnFilters={columnFilters}
      //   />
      // ),
      //   title: "Function",
      //   dataIndex: "function",
    },
    {
      title: "snmp",
      dataIndex: "snmp_status",
      key: "snmp_status",
      render: (text, record) => (
        <div style={{ textAlign: "center" }}>
          {text === "Not Enabled" ? (
            <>
              <img src={dash} alt="" /> &nbsp;{" "}
              {/* <span style={{ textAlign: "center" }}>{text}</span> */}
            </>
          ) : null}
          {text === "Enabled" ? (
            <>
              <img src={tick} alt="" /> &nbsp;
              {/* <span style={{ textAlign: "center" }}>{text}</span> */}
            </>
          ) : null}
        </div>
      ),

      ...getColumnSearchProps(
        "snmp_status",
        "SNMP",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Login",
      dataIndex: "ssh_status",
      key: "ssh_status",
      render: (text, record) => (
        <div style={{ textAlign: "center" }}>
          {text === "False" ? (
            <>
              <img src={stop} alt="" /> &nbsp;{" "}
              {/* <span style={{ textAlign: "center" }}>{text}</span> */}
            </>
          ) : null}
          {text === null ? (
            <>
              <img src={dash} alt="" /> &nbsp;{" "}
              {/* <span style={{ textAlign: "center" }}>{text}</span> */}
            </>
          ) : null}
          {text === "True" ? (
            <>
              <img src={tick} alt="" /> &nbsp;
              {/* <span style={{ textAlign: "center" }}>{text}</span> */}
            </>
          ) : null}
        </div>
      ),

      ...getColumnSearchProps(
        "ssh_status",
        "Login",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
      // title: (
      //   <ColumnHeader
      //     dataIndex="function"
      //     title="Function"
      //     setRowCount={setRowCount}
      //     setDataSource={setDataSource}
      //     excelData={excelData}
      //     columnFilters={columnFilters}
      //   />
      // ),
      //   title: "Function",
      //   dataIndex: "function",
    },

    // {
    //   title: "WMI",
    //   dataIndex: "wmi",
    //   key: "wmi",

    //   ...getColumnSearchProps(
    //     "wmi",
    //     "WMI",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    //   render: (text, record) => <p style={{ textAlign: "center",paddingTop:"16px" }}>{text}</p>,

    //   // title: (
    //   //   <ColumnHeader
    //   //     dataIndex="site_name"
    //   //     title="Site Name"
    //   //     setRowCount={setRowCount}
    //   //     setDataSource={setDataSource}
    //   //     excelData={excelData}
    //   //     columnFilters={columnFilters}
    //   //   />
    //   // ),
    //   //title: "Site Name",
    //   //dataIndex: "site_name",
    // },
    // {
    //   title: "API",
    //   dataIndex: "api",
    //   key: "api",
    //   render: (text, record) => <p style={{ textAlign: "center",paddingTop:"16px" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "api",
    //     "API",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,

    //   // title: (
    //   //   <ColumnHeader
    //   //     dataIndex="rack_name"
    //   //     title="Rack Name"
    //   //     setRowCount={setRowCount}
    //   //     setDataSource={setDataSource}
    //   //     excelData={excelData}
    //   //     columnFilters={columnFilters}
    //   //   />
    //   // ),
    //   //   title: "Rack Name",
    //   //   dataIndex: "rack_name",
    // },

    // {
    //   title: "Domain",
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

    // {
    //   title: "Criticality",
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
    //   // title: (
    //   //   <ColumnHeader
    //   //     dataIndex="criticality"
    //   //     title="Criticality"
    //   //     setRowCount={setRowCount}
    //   //     setDataSource={setDataSource}
    //   //     excelData={excelData}
    //   //     columnFilters={columnFilters}
    //   //   />
    //   // ),
    //   //   title: "Criticality",
    //   //   dataIndex: "criticality",
    // },
  ];

  const [creLoading, setCreLoading] = useState(false);
  const FetchDevices = async () => {
    setCreLoading(true);

    try {
      //console.log(device);
      await axios
        .get(baseUrl + "/checkCredentialsStatus")
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            console.log("logs", response?.response?.data);
            setCreLoading(false);
          } else {
            openSweetAlert(response?.data, "success");
            setCreLoading(false);

            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getManageDevices")
                .then((response) => {
                  setCreLoading(false);

                  console.log(response.data);
                  excelData = response.data;
                  setDataSource(response.data);
                  setRowCount(response.data.length);

                  // excelData = response.data;
                  setCreLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setCreLoading(false);

                  //  openSweetAlert("Something Went Wrong!", "error");
                })
            );
            return Promise.all(promises);
          }
        })
        .catch((error) => {
          setCreLoading(false);

          console.log("in add seed device catch ==> " + error);
          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      setCreLoading(false);

      console.log(err);
    }
  };
  return (
    <>
      <br />
      <div style={{ width: "110px" }}>
        <SpinLoading spinning={creLoading} style={{ float: "left" }}>
          <button
            onClick={() => FetchDevices()}
            style={{
              marginLeft: "15px",
              width: "80px",
              height: "30px",
              color: "#fff",
              backgroundColor: "#6ab127",
              border: "none",
              borderRadius: "8px",
            }}
          >
            Fetch
          </button>
        </SpinLoading>
      </div>
      <br />

      {/* <AddAtomStyledButton
        onClick={showModal}
        // disabled={!configData?.atom.pages.password_group.read_only}
        style={{
          marginRight: "30px",
          float: "right",
          borderRadius: "8px",
        }}
      >
        + Add Credentials
      </AddAtomStyledButton>
      <br />
      <br /> */}
      <div>
        <SpinLoading spinning={loading} tip="Loading...">
          <div style={{ padding: "15px" }}>
            <TableStyling
              rowSelection={rowSelection}
              // scroll={{ y: 240 }}
              rowKey="ip_address"
              columns={columns}
              dataSource={dataSource}
              // pagination={false}
              style={{ width: "100%", padding: "2%" }}
            />
          </div>
        </SpinLoading>
      </div>
      <Modal
        title="Add Credentials"
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
        style={{
          //   marginTop: "-70px",
          zIndex: "99999",
          //   textAlign: "center",
          alignContent: "center",
          padding: "0px",
        }}
        width="40%"
      >
        <Row style={{ width: "100%", marginTop: "10px" }}>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            <CreBtnStyleAuto onClick={showModalv1v2}>V 1 / V 2</CreBtnStyleAuto>
            <Modal
              // title="V1/V2"
              // header={false}
              visible={v1v2isModalOpen}
              // onOk={handleOkv1v2}
              // onCancel={handleCancelv1v2}
              footer={false}
              closable={false}
            >
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
                      }}
                    >
                      {community !== "" ? (
                        <button
                          onClick={handleSubmit}
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
                        onClick={handleCancelv1v2}
                      >
                        Cancel
                      </StyledButton>
                    </div>
                  </Col>
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Profile Name:
                      {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                      &nbsp;&nbsp;
                      <StyledInput
                        value={profileName}
                        onChange={(e) =>
                          setProfileName(
                            e.target.value.replace(/[^\w\s]/gi, "")
                          )
                        }
                        // required
                      />
                    </InputWrapper>
                    <InputWrapper>
                      Description:
                      {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                      &nbsp;&nbsp;
                      <StyledInput
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        // required
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
                      Port:
                      {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                      &nbsp;&nbsp;
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

            <Modal
              // title="V3"
              visible={v3isModalOpen}
              closable={false}
              footer={false}
              // onOk={handleOkv3}
              // onCancel={handleCancelv3}
            >
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
                      {profileNamev3 !== "" &&
                      descriptionv3 !== "" &&
                      usernamev3 !== "" &&
                      portv3 !== "" &&
                      authorizationPasswordv3 !== "" &&
                      authorizationProtocolv3 !== "" &&
                      encryptionPasswordv3 !== "" &&
                      encryptionProtocolv3 !== "" ? (
                        <button
                          onClick={handleSubmitv3}
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
                        onClick={handleCancelv3}
                      >
                        Cancel
                      </StyledButton>
                    </div>
                  </Col>
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Profile Name:
                      {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                      &nbsp;&nbsp;
                      <StyledInput
                        value={profileNamev3}
                        onChange={(e) =>
                          setProfileNamev3(
                            e.target.value.replace(/[^\w\s]/gi, "")
                          )
                        }
                        // required
                      />
                    </InputWrapper>
                    <InputWrapper>
                      Description:
                      {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                      &nbsp;&nbsp;
                      <StyledInput
                        value={descriptionv3}
                        onChange={(e) => setDescriptionv3(e.target.value)}
                        // required
                      />
                    </InputWrapper>
                  </Col>
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Username:
                      {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                      &nbsp;&nbsp;
                      <StyledInput
                        value={usernamev3}
                        onChange={(e) => setUsernamev3(e.target.value)}
                        // required
                      />
                    </InputWrapper>
                    <InputWrapper>
                      Port:
                      {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                      &nbsp;&nbsp;
                      <StyledInput
                        value={portv3}
                        onChange={(e) => setPortv3(e.target.value)}
                        // required
                      />
                    </InputWrapper>
                  </Col>
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Authorization Protocol:
                      {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                      &nbsp;&nbsp;
                      {/* <StyledInput
                        value={authorizationProtocolv3}
                        onChange={(e) =>
                          setaAuthorizationProtocolv3(e.target.value)
                        }
                        // required
                      /> */}
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
                          {/* <option value="" style={{ color: "rgba(0,0,0,0.1)" }}>
                    Select Device RU
                  </option> */}

                          <option>MD5</option>
                          <option>SHA</option>
                          <option>SHA-256</option>
                          <option>SHA-512</option>
                        </Styledselect>
                      </div>
                    </InputWrapper>
                    {/* <InputWrapper>
                      Device RU: &nbsp;<span style={{ color: "red" }}>*</span>
                      &nbsp;&nbsp;
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
                          {/* <option value="" style={{ color: "rgba(0,0,0,0.1)" }}>
                    Select Device RU
                  </option> 

                          <option>MD5</option>
                          <option>SHA</option>
                          <option>SHA-256</option>
                          <option>SHA-512</option>
                        </Styledselect>
                      </div>
                    </InputWrapper> */}
                    <InputWrapper>
                      Authorization Password:
                      {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                      &nbsp;&nbsp;
                      <StyledInput
                        value={authorizationPasswordv3}
                        onChange={(e) =>
                          setaAuthorizationPasswordv3(e.target.value)
                        }
                        // required
                      />
                    </InputWrapper>
                  </Col>
                  <Col span={10} style={{ marginLeft: "6%" }}>
                    <InputWrapper>
                      Encryption Protocol: &nbsp;
                      <span style={{ color: "red" }}>*</span>
                      &nbsp;&nbsp;
                      {/* <StyledInput
                        value={encryptionProtocolv3}
                        onChange={(e) =>
                          setEncryptionProtocolv3(e.target.value)
                        }
                        // required
                      /> */}
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
                          {/* <option value="" style={{ color: "rgba(0,0,0,0.1)" }}>
                    Select Device RU
                  </option> */}

                          <option>DES</option>
                          <option>AES-128</option>
                          <option>AES-192</option>
                          <option>AES-256</option>
                        </Styledselect>
                      </div>
                    </InputWrapper>
                    <InputWrapper>
                      Encryption Password:
                      {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                      &nbsp;&nbsp;
                      <StyledInput
                        value={encryptionPasswordv3}
                        onChange={(e) =>
                          setEncryptionPasswordv3(e.target.value)
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
        <Row style={{ width: "100%", marginTop: "10px" }}>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 12 }}>
            {/* <CreBtnStyleAuto onClick={showModalwmi}>WMI</CreBtnStyleAuto> */}
            <Modal
              // title="WMI"
              visible={wmiIsModalOpen}
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
