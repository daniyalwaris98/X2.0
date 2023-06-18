import React, { useState, useEffect, useRef } from "react";

import axios, { baseUrl } from "../../../../utils/axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import tick from "../../assets/tick.svg";
import dash from "../../assets/dash.svg";
import stop from "../../assets/stop.svg";
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
  DownOutlined,
  SmileOutlined,
  AlipayOutlined,
} from "@ant-design/icons";
import AddModal from "./AddModal.jsx";
import trash from "../assets/trash.svg";
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
  DeleteButton,
  AddButtonStyle,
  StyledInputForm,
  AddAtomStyledButton,
} from "../../../AllStyling/All.styled";
import {
  Button,
  Table,
  Space,
  notification,
  Spin,
  Input,
  Modal,
  Switch,
} from "antd";

import { ColumnHeader } from "../../../../utils/index.jsx";
import Swal from "sweetalert2";
import { columnSearch } from "../../../../utils";

let excelData = [];

let excelDataCre = [];
let s3excelData = [];
let elbexcelData = [];
let columnFilters = {};
const index = () => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [staticRecord, setStaticRecord] = useState(null);
  const [staticOnBoard, setStaticOnBoard] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [rowCountCre, setRowCountCre] = useState(0);
  const inputRef = useRef(null);
  let [exportLoading, setExportLoading] = useState(false);
  let [credataSource, setCreDataSource] = useState(excelDataCre);
  let [s3dataSource, sets3DataSource] = useState(s3excelData);
  let [elbdataSource, setelbDataSource] = useState(elbexcelData);
  const [onBoardLoading, setOnboardLoading] = useState(false);

  let [dataSource, setDataSource] = useState(excelData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isStaticModalVisible, setIsStaticModalVisible] = useState(false);
  let [loading, setLoading] = useState(false);
  let [s3loading, sets3Loading] = useState(false);
  let [elbloading, setelbLoading] = useState(false);
  let [inputValue, setInputValue] = useState("");
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [rackData, setRackData] = useState(null);
  const [s3rowCount, sets3RowCount] = useState(0);
  const [elbrowCount, setelbRowCount] = useState(0);
  const [rackNameModalVisible, setRackNameModalVisible] = useState(false);
  const [siteNameModalVisible, setSiteNameModalVisible] = useState(false);
  const [configData, setConfigData] = useState(null);
  const [mainLoading, setMainLoading] = useState(false);

  const [enabled, setEnabled] = useState("Disabled");

  // const handleChange = (value, checked, val) => {
  //   setEnabled(val ? "Enabled" : "Disabled");
  //   console.log(value, enabled, val);
  // };
  const handleChange = (checkedValue) => {
    console.log(`Switch is ${checkedValue ? "Enabled" : "Disabled"}`);
    console.log(`Checked value is ${checkedValue}`);

    setEnabled(checkedValue ? "Enabled" : "Disabled");
    console.log(enabled);
  };
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
  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  const showModal = () => {
    setEditRecord(null);
    setAddRecord(null);
    setIsModalVisible(true);
  };

  const deleteRowEc2 = async (id) => {
    // if (selectedRowKeys.length > 0) {
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/deleteEC2", { instance_id: id })
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            console.log("logs", response?.response?.data);
            setOnboardLoading(false);
          } else {
            openSweetAlert(`EC2 Deleted Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllEC2")
                .then((response) => {
                  console.log(response.data);
                  excelData = response.data;
                  setDataSource(response.data);
                  setRowCount(response.data.length);
                  setSelectedRowKeys([]);

                  // excelData = response.data;
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);

                  //  openSweetAlert("Something Went Wrong!", "error");
                })
            );
            return Promise.all(promises);
          }
        })
        .catch((error) => {
          setLoading(false);

          console.log("in add seed device catch ==> " + error);
          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
    // } else {
    //   openSweetAlert(`No Device Selected`, "error");
    // }
  };
  const deleteRowS3 = async (bucket_name) => {
    // if (selectedRowKeys.length > 0) {
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/deleteS3", { bucket_name: bucket_name })
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            console.log("logs", response?.response?.data);
            setOnboardLoading(false);
          } else {
            openSweetAlert(`S3 Deleted Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllS3")
                .then((response) => {
                  console.log(response.data);
                  s3excelData = response.data;
                  sets3DataSource(s3excelData);
                  sets3RowCount(s3excelData.length);
                  setSelectedRowKeys([]);

                  // excelData = response.data;
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);

                  //  openSweetAlert("Something Went Wrong!", "error");
                })
            );
            return Promise.all(promises);
          }
        })
        .catch((error) => {
          setLoading(false);

          console.log("in add seed device catch ==> " + error);
          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
    // } else {
    //   openSweetAlert(`No Device Selected`, "error");
    // }
  };

  const deleteRow = async (accessKey) => {
    // if (selectedRowKeys.length > 0) {
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/deleteAWSCredentials", { aws_access_key: accessKey })
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
                .get(baseUrl + "/getAWSCredentials")
                .then((response) => {
                  console.log(response.data);
                  excelData = response.data;
                  setDataSource(response.data);
                  setRowCount(response.data.length);
                  setSelectedRowKeys([]);

                  // excelData = response.data;
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);

                  //  openSweetAlert("Something Went Wrong!", "error");
                })
            );
            return Promise.all(promises);
          }
        })
        .catch((error) => {
          setLoading(false);

          console.log("in add seed device catch ==> " + error);
          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
    // } else {
    //   openSweetAlert(`No Device Selected`, "error");
    // }
  };

  const exportSeed = async () => {
    console.log("first");

    setExportLoading(true);
    jsonToExcel(excelData);
    // openNotification();
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
  const jsonToExcel = (atomData) => {
    console.log("first");
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "atom_devices");
      XLSX.writeFile(wb, "atom_devices.xlsx");
      openNotification();

      // setExportLoading(false);
    } else {
      openSweetAlert("No Data Found!", "info");
    }
  };

  const postSeed = async (seed) => {
    console.log(" sedd", seed);
    setLoading(true);
    await axios
      .post(baseUrl + "/addAtomDevices", seed)
      .then((response) => {
        console.log("hahahehehoho");
        console.log(response?.response?.status);
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");

          setLoading(false);
        } else {
          openSweetAlert(response?.data, "success");

          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAWSCredentials")
              .then((response) => {
                // console.log("response===>", response);
                // setExcelData(response.data);

                console.log(response.data);
                excelData = response?.data;
                setRowCount(response?.data?.length);
                setDataSource(response?.data);
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
                // openSweetAlert("Something Went Wrong!", "danger");
                setLoading(false);
              })
          );
          setLoading(false);
          return Promise.all(promises);
        }
      })
      .catch((err) => {
        // openSweetAlert("Something Went Wrong!", "error");
        console.log("error ==> " + err);
        setLoading(false);
      });
  };

  // useEffect(() => {
  //   const serviceCalls = async () => {
  //     setLoading(true);

  //     try {
  //       const res = await axios.get(baseUrl + "/getAWSCredentials");
  //       excelData = res.data;
  //       setDataSource(excelData);
  //       setRowCount(excelData.length);
  //       setLoading(false);
  //     } catch (err) {
  //       console.log(err.response);
  //       setLoading(false);
  //     }
  //   };
  //   serviceCalls();
  // }, []);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllEC2");
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
  // useEffect(() => {
  //   const serviceCalls = async () => {
  //     sets3Loading(true);

  //     try {
  //       const res = await axios.post(baseUrl + "/getAllS3", {
  //         aws_access_key: selectedAccessKey,
  //       });
  //       excelData = res.data;
  //       sets3DataSource(excelData);
  //       sets3RowCount(excelData.length);
  //       sets3Loading(false);
  //     } catch (err) {
  //       console.log(err.response);
  //       sets3Loading(false);
  //     }
  //   };
  //   serviceCalls();
  // }, []);
  // useEffect(() => {
  //   const serviceCalls = async () => {
  //     setelbLoading(true);

  //     try {
  //       const res = await axios.post(baseUrl + "/getAllELB", {
  //         aws_access_key: selectedAccessKey,
  //       });
  //       excelData = res.data;
  //       setelbDataSource(excelData);
  //       setelbRowCount(excelData.length);
  //       setelbLoading(false);
  //     } catch (err) {
  //       console.log(err.response);
  //       setelbLoading(false);
  //     }
  //   };
  //   serviceCalls();
  // }, []);
  const Ec2tableData = async () => {
    setLoading(true);

    try {
      const res = await axios.get(baseUrl + "/getAllEC2");
      excelData = res.data;
      setDataSource(excelData);
      setRowCount(excelData.length);
      setLoading(false);
    } catch (err) {
      console.log(err.response);
      setLoading(false);
    }
  };

  const S3tableData = async () => {
    sets3Loading(true);

    try {
      const res = await axios.get(baseUrl + "/getAllS3");
      s3excelData = res.data;
      sets3DataSource(s3excelData);
      sets3RowCount(s3excelData.length);
      sets3Loading(false);
    } catch (err) {
      console.log(err.response);
      sets3Loading(false);
    }
  };

  const ElbtableData = async () => {
    setelbLoading(true);

    try {
      const res = await axios.get(baseUrl + "/getAllELB");
      elbexcelData = res.data;
      setelbDataSource(elbexcelData);
      setelbRowCount(elbexcelData.length);
      setelbLoading(false);
    } catch (err) {
      console.log(err.response);
      setelbLoading(false);
    }
  };
  const [tableName, setTableName] = useState("EC2");
  const showTable = (myDataTable) => {
    if (myDataTable === "EC2") {
      setTableName("EC2");
      Ec2tableData();
    } else if (myDataTable === "S3") {
      setTableName("S3");
      S3tableData();
    } else if (myDataTable === "ELB") {
      setTableName("ELB");
      ElbtableData();
    }
  };

  const columns = [
    // {
    //   title: "",
    //   key: "edit",
    //   width: "5%",

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

    {
      title: "Name",
      dataIndex: "instance_name",
      key: "instance_name",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}

          // style={{
          //   color: "#66B127",
          //   textDecoration: "underline",
          //   fontWeight: "400",
          //   textAlign: "left",
          //   // color: "blue",
          //   cursor: "pointer",
          //   paddingTop: "16px",
          // }}
          // onClick={() => navigate("/monitoring/cloud/instance-details")}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "instance_name",
        "Instance Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "instance id",
      dataIndex: "instance_id",
      key: "instance_id",
      render: (text, record) => (
        <p
          onClick={async () => {
            // setMainLoading(true);
            // const res = await axios.post(baseUrl + "/getEC2MonitoringData", {
            //   instance_id: record.instance_id,
            // });

            // console.log("getMonitoringDevicesCards", res);

            navigate("/monitoring/cloud/dashboard-data", {
              state: {
                instance_id: record.instance_id,
                // res: res.data,
              },
            });
            // setMainLoading(false);
          }}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            fontWeight: "400",
            textAlign: "left",
            // color: "blue",
            cursor: "pointer",
            paddingTop: "16px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "instance_id",
        "Instance Id",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Account Label",
      dataIndex: "account_label",
      key: "account_label",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "account_label",
        "Account Label",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Region",
      dataIndex: "region_id",
      key: "region_id",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "region_id",
        "Region Id",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Monitoring Status",
      dataIndex: "monitoring_status",
      key: "monitoring_status",
      render: (text, record) => (
        <div>
          {text === "Disabled" ? (
            <>
              <button
                onClick={() => EnableMonitoring(record.instance_id, "Enabled")}
                style={{
                  backgroundColor: "#6ab127",
                  color: "#fff",
                  width: "180px",
                  height: "30px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Enable Monitoring
              </button>
            </>
          ) : null}
          {text === "Enabled" ? (
            <>
              <button
                onClick={() => EnableMonitoring(record.instance_id, "Disabled")}
                style={{
                  backgroundColor: "#DC3938",
                  color: "#fff",
                  width: "180px",
                  height: "30px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Disable Monitoring
              </button>
            </>
          ) : null}
        </div>
      ),

      // ...getColumnSearchProps(
      //   "monitoring_status",
      //   "Monitoring Status",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // ellipsis: true,
    },

    {
      title: "Action",
      dataIndex: "",
      key: "",
      render: (text, record) => (
        <img
          src={trash}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={() => deleteRowEc2(record.instance_id)}
        />
      ),

      // ...getColumnSearchProps(
      //   "region_id",
      //   "Region Id",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // ellipsis: true,
    },
  ];

  const EnableMonitoring = async (id, status) => {
    const data = {
      instance_id: id,
      monitoring_status: status,
    };
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/changeEC2Status", data)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            console.log("logs", response?.response?.data);
            setOnboardLoading(false);
          } else {
            openSweetAlert(`Status Changed Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllEC2")
                .then((response) => {
                  console.log(response.data);
                  excelData = response.data;
                  setDataSource(response.data);
                  setRowCount(response.data.length);
                  setSelectedRowKeys([]);

                  // excelData = response.data;
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);

                  //  openSweetAlert("Something Went Wrong!", "error");
                })
            );
            return Promise.all(promises);
          }
        })
        .catch((error) => {
          setLoading(false);

          console.log("in add seed device catch ==> " + error);
          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
  };
  const EnableS3Monitoring = async (bucket_name, status) => {
    const data = {
      bucket_name: bucket_name,
      monitoring_status: status,
    };
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/changeS3Status", data)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            console.log("logs", response?.response?.data);
            setOnboardLoading(false);
          } else {
            openSweetAlert(`Status Changed Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllS3")
                .then((response) => {
                  console.log(response.data);
                  // s3excelData = response.data;
                  // sets3DataSource(response.data);
                  // sets3RowCount(response.data.length);

                  s3excelData = response.data;
                  sets3DataSource(s3excelData);
                  sets3RowCount(s3excelData.length);

                  setSelectedRowKeys([]);

                  // excelData = response.data;
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);

                  //  openSweetAlert("Something Went Wrong!", "error");
                })
            );
            return Promise.all(promises);
          }
        })
        .catch((error) => {
          setLoading(false);

          console.log("in add seed device catch ==> " + error);
          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
  };
  const EnableELBMonitoring = async (lb_arn, status) => {
    const data = {
      lb_arn: lb_arn,
      monitoring_status: status,
    };
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/changeELBStatus", data)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            console.log("logs", response?.response?.data);
            setOnboardLoading(false);
          } else {
            openSweetAlert(`Status Changed Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllELB")
                .then((response) => {
                  console.log(response.data);
                  // s3excelData = response.data;
                  // sets3DataSource(response.data);
                  // sets3RowCount(response.data.length);

                  elbexcelData = response.data;
                  setelbDataSource(elbexcelData);
                  setelbRowCount(elbexcelData.length);

                  setSelectedRowKeys([]);

                  // excelData = response.data;
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);

                  //  openSweetAlert("Something Went Wrong!", "error");
                })
            );
            return Promise.all(promises);
          }
        })
        .catch((error) => {
          setLoading(false);

          console.log("in add seed device catch ==> " + error);
          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      setLoading(false);

      console.log(err);
    }
  };

  // const handleSwitchChange = (record) => {
  //   // Update the state of the switch component
  //   const newData = [...excelData];
  //   const index = newData.findIndex(
  //     (item) => record.monitoring_status === item.monitoring_status
  //   );
  //   const item = newData[index];
  //   item.isEnabled = !item.isEnabled;
  //   setDataSource(newData);
  // };
  const s3columns = [
    // {
    //   title: "",
    //   key: "edit",
    //   width: "5%",

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

    {
      title: "bucket Name",
      dataIndex: "bucket_name",
      key: "bucket_name",
      render: (text, record) => (
        <p
          onClick={async () => {
            // setMainLoading(true);
            // const res = await axios.post(baseUrl + "/getEC2MonitoringData", {
            //   instance_id: record.instance_id,
            // });

            // console.log("getMonitoringDevicesCards", res);

            navigate("/monitoring/cloud/s3-dashboard-data", {
              state: {
                bucket_name: record.bucket_name,
                // res: res.data,
              },
            });
            // setMainLoading(false);
          }}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            fontWeight: "400",
            textAlign: "left",
            // color: "blue",
            cursor: "pointer",
            paddingTop: "16px",
          }}
          // style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "bucket_name",
        "Bucket Name",
        sets3RowCount,
        sets3DataSource,
        s3excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Acount Label",
      dataIndex: "account_label",
      key: "account_label",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "account_label",
        "Acount Label",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Region",
      dataIndex: "region_id",
      key: "region_id",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "region_id",
        "Region Id",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Monitoring Status",
      dataIndex: "monitoring_status",
      key: "monitoring_status",
      render: (text, record) => (
        <div>
          {text === "Disabled" ? (
            <>
              <button
                onClick={() =>
                  EnableS3Monitoring(record.bucket_name, "Enabled")
                }
                style={{
                  backgroundColor: "#6ab127",
                  color: "#fff",
                  width: "180px",
                  height: "30px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Enable Monitoring
              </button>
            </>
          ) : null}
          {text === "Enabled" ? (
            <>
              <button
                onClick={() =>
                  EnableS3Monitoring(record.bucket_name, "Disabled")
                }
                style={{
                  backgroundColor: "#DC3938",
                  color: "#fff",
                  width: "180px",
                  height: "30px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Disable Monitoring
              </button>
            </>
          ) : null}
        </div>
      ),

      // ...getColumnSearchProps(
      //   "monitoring_status",
      //   "Monitoring Status",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // ellipsis: true,
    },

    {
      title: "Action",
      dataIndex: "",
      key: "",
      render: (text, record) => (
        <img
          src={trash}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={() => deleteRowS3(record.bucket_name)}
        />
      ),

      // ...getColumnSearchProps(
      //   "region_id",
      //   "Region Id",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // ellipsis: true,
    },
  ];
  const elbcolumns = [
    // {
    //   title: "",
    //   key: "edit",
    //   width: "5%",

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

    {
      title: "lb Name",
      dataIndex: "lb_name",
      key: "lb_name",
      render: (text, record) => (
        <p
          onClick={async () => {
            // setMainLoading(true);
            // const res = await axios.post(baseUrl + "/getEC2MonitoringData", {
            //   instance_id: record.instance_id,
            // });

            // console.log("getMonitoringDevicesCards", res);

            navigate("/monitoring/cloud/elb-dashboard-data", {
              state: {
                lb_arn: record.lb_arn,
                // res: res.data,
              },
            });
            // setMainLoading(false);
          }}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            fontWeight: "400",
            textAlign: "left",
            // color: "blue",
            cursor: "pointer",
            paddingTop: "16px",
          }}
          // style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "lb_name",
        "Load Balancer Name",
        setelbRowCount,
        setelbDataSource,
        elbexcelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "LB Type",
      dataIndex: "lb_type",
      key: "lb_type",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "lb_type",
        "Type",
        setelbRowCount,
        setelbDataSource,
        elbexcelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "lb scheme",
      dataIndex: "lb_scheme",
      key: "lb_scheme",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "lb_scheme",
        "Scheme",
        setelbRowCount,
        setelbDataSource,
        elbexcelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Region",
      dataIndex: "region_id",
      key: "region_id",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "region_id",
        "Region",
        setelbRowCount,
        setelbDataSource,
        elbexcelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Monitoring Status",
      dataIndex: "monitoring_status",
      key: "monitoring_status",
      render: (text, record) => (
        <div>
          {text === "Disabled" ? (
            <>
              <button
                onClick={() => EnableELBMonitoring(record.lb_arn, "Enabled")}
                style={{
                  backgroundColor: "#6ab127",
                  color: "#fff",
                  width: "180px",
                  height: "30px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Enable Monitoring
              </button>
            </>
          ) : null}
          {text === "Enabled" ? (
            <>
              <button
                onClick={() => EnableELBMonitoring(record.lb_arn, "Disabled")}
                style={{
                  backgroundColor: "#DC3938",
                  color: "#fff",
                  width: "180px",
                  height: "30px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Disable Monitoring
              </button>
            </>
          ) : null}
        </div>
      ),

      // ...getColumnSearchProps(
      //   "monitoring_status",
      //   "Monitoring Status",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // ellipsis: true,
    },

    {
      title: "Action",
      dataIndex: "",
      key: "",
      render: (text, record) => (
        <img
          src={trash}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={() => deleteRowS3(record.bucket_name)}
        />
      ),

      // ...getColumnSearchProps(
      //   "region_id",
      //   "Region Id",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // ellipsis: true,
    },
    // {
    //   title: "lb ARN",
    //   dataIndex: "lb_arn",
    //   key: "lb_arn",
    //   render: (text, record) => (
    //     <p
    //       style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
    //     >
    //       {text}
    //     </p>
    //   ),

    //   ...getColumnSearchProps(
    //     "lb_arn",
    //     "ARN",
    //     setelbRowCount,
    //     setelbDataSource,
    //     elbexcelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
  ];

  const columnsCre = [
    // {
    //   title: "",
    //   key: "edit",
    //   width: "5%",

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
    {
      title: "Account Label",
      dataIndex: "account_label",
      key: "account_label",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "account_label",
        "Account Label",
        setRowCountCre,
        setCreDataSource,
        excelDataCre,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "AWS Access Key",
      dataIndex: "aws_access_key",
      key: "aws_access_key",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "aws_access_key",
        "AWS Access Key",
        setRowCountCre,
        setCreDataSource,
        excelDataCre,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Access Type",
      dataIndex: "access_type",
      key: "access_type",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "access_type",
        "Access Type",
        setRowCountCre,
        setCreDataSource,
        excelDataCre,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <div style={{ textAlign: "center" }}>
          {text === false ? (
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
          {text === true ? (
            <>
              <img src={tick} alt="" /> &nbsp;
              {/* <span style={{ textAlign: "center" }}>{text}</span> */}
            </>
          ) : null}
        </div>
      ),

      ...getColumnSearchProps(
        "status",
        "Status",
        setRowCountCre,
        setCreDataSource,
        excelDataCre,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            disabled={record.status === false}
            style={{
              backgroundColor:
                record.status === false ? "rgba(255,0,0,0.5)" : "transparent",
              border:
                record.status === false
                  ? "1px solid rgb(255,0,0)"
                  : "1px solid #66B127",
              width: "100px",
              borderRadius: "8px",
              height: "30px",
              cursor: "pointer",
              fontWeight: 500,
              cursor: record.status === false ? "no-drop" : "pointer",
            }}
            onClick={() => {
              navigate("/monitoring/cloud/cloudSummary", {
                state: {
                  aws_access_key: record.aws_access_key,
                },
              });
            }}
          >
            Login
          </button>{" "}
          &nbsp;&nbsp;&nbsp;&nbsp;
        </div>
      ),

      ...getColumnSearchProps(
        "action",
        "Action",
        setRowCountCre,
        setCreDataSource,
        excelDataCre,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "",
      dataIndex: "",
      key: "",
      width: "100px",
      render: (text, record) => (
        <img
          src={trash}
          alt=""
          style={{ cursor: "pointer" }}
          onClick={() => deleteRow(record.aws_access_key)}
        />
      ),

      // ...getColumnSearchProps(
      //   "action",
      //   "Action",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      ellipsis: true,
    },
  ];

  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  // console.log(selectedRowKeys);
  const rowSelection = {
    columnWidth: 100,
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: !configData?.atom.pages.atom.read_only,
    }),
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModalReload = async () => {
    setIsModalOpen(true);

    setLoading(true);

    try {
      const res = await axios.get(baseUrl + "/getAWSCredentials");
      excelDataCre = res.data;
      setCreDataSource(excelDataCre);
      setRowCountCre(excelDataCre.length);
      setLoading(false);
    } catch (err) {
      console.log(err.response);
      setLoading(false);
    }
  };
  const handleOkReload = () => {
    setIsModalOpen(false);
  };
  const handleCancelReload = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <br />
      <div
        style={{
          width: "100%",
          // boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
          display: "flex",
          // justifyContent: "left",
          borderRadius: "5px",
          // marginLeft: "15px",
          paddingLeft: "20px",
        }}
      >
        <cloudDevices
          active={"EC2" === tableName}
          onClick={() => showTable("EC2")}
          // style={{
          //   borderBottom: "2px solid ",
          // }}
        >
          <div style={{ display: "flex" }}>
            {/* <img
              src={summary}
              width="25px"
              height="25px"
              alt=""
              style={{ marginLeft: "10px", marginTop: "8px" }}
            /> */}
            <cloudMainTitle
              active={"EC2" === tableName}
              style={{
                // paddingLeft: "20px",
                padding: "8px",
                width: "60px",
                borderRadius: "8px",
                // paddingTop: "10px",
                marginBottom: "0px !important",
                color: "EC2" === tableName ? "#fff" : "#66B127",
                backgroundColor: "EC2" === tableName ? "#66B127" : "#C6FB8940",
                // font-weight: ${(props) => (props.active ? "600" : "500")};
                // background-color: #0f0;
              }}
            >
              EC2
            </cloudMainTitle>
          </div>
        </cloudDevices>{" "}
        &nbsp;&nbsp;
        <cloudDevices
          active={"S3" === tableName}
          onClick={() => showTable("S3")}
        >
          <div style={{ display: "flex" }}>
            <cloudMainTitle
              active={"S3" === tableName}
              style={{
                padding: "8px",
                width: "60px",
                borderRadius: "8px",
                marginBottom: "0px !important",
                color: "S3" === tableName ? "#fff" : "#66B127",
                backgroundColor: "S3" === tableName ? "#66B127" : "#C6FB8940",
              }}
            >
              S3
            </cloudMainTitle>
          </div>
        </cloudDevices>
        &nbsp;&nbsp;
        <cloudDevices
          active={"ELB" === tableName}
          onClick={() => showTable("ELB")}
        >
          <div style={{ display: "flex" }}>
            <cloudMainTitle
              active={"ELB" === tableName}
              style={{
                padding: "8px",
                width: "60px",
                borderRadius: "8px",
                marginBottom: "0px !important",
                color: "ELB" === tableName ? "#fff" : "#66B127",
                backgroundColor: "ELB" === tableName ? "#66B127" : "#C6FB8940",
              }}
            >
              ELB
            </cloudMainTitle>
          </div>
        </cloudDevices>{" "}
        &nbsp;&nbsp;
        <button
          style={{
            padding: "8px",
            width: "80px",
            borderRadius: "8px",
            marginBottom: "0px !important",
            color: "#fff",
            backgroundColor: "#2D9CDB",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
          }}
          onClick={showModalReload}
        >
          Reload
        </button>
      </div>
      <div>
        {tableName === "EC2" ? (
          <SpinLoading spinning={loading} tip="Loading...">
            <div style={{ padding: "25px" }}>
              <TableStyling
                // rowSelection={rowSelection}
                // scroll={{ x: 4000 }}
                // rowKey="aws_access_key"
                columns={columns}
                dataSource={dataSource}
                // pagination={false}
                style={{ width: "100%", padding: "2%" }}
              />
            </div>
          </SpinLoading>
        ) : null}
        {tableName === "S3" ? (
          <SpinLoading spinning={loading} tip="Loading...">
            <div style={{ padding: "25px" }}>
              <TableStyling
                //  rowSelection={rowSelection}
                // scroll={{ x: 4000 }}
                //  rowKey="aws_access_key"
                columns={s3columns}
                dataSource={s3dataSource}
                // pagination={false}
                style={{ width: "100%", padding: "2%" }}
              />
            </div>
          </SpinLoading>
        ) : null}
        {tableName === "ELB" ? (
          <SpinLoading spinning={loading} tip="Loading...">
            <div style={{ padding: "25px" }}>
              <TableStyling
                //  rowSelection={rowSelection}
                // scroll={{ x: 4000 }}
                //  rowKey="aws_access_key"
                columns={elbcolumns}
                dataSource={elbdataSource}
                // pagination={false}
                style={{ width: "100%", padding: "2%" }}
              />
            </div>
          </SpinLoading>
        ) : null}
      </div>

      <Modal
        width={1000}
        title="AWS"
        footer={false}
        open={isModalOpen}
        onOk={handleOkReload}
        onCancel={handleCancelReload}
      >
        <div>
          <div style={{ marginLeft: "30px", float: "left" }}>
            {selectedRowKeys.length > 0 ? (
              <DeleteButton onClick={deleteRow}>Delete</DeleteButton>
            ) : null}
            &nbsp;
            <span>Rows :</span>
            <span>
              <b style={{ color: "#66B127" }}> {rowCountCre}</b>
            </span>
            &nbsp;&nbsp;
            <span>Columns :</span>
            <span>
              <b style={{ color: "#66B127" }}> 4</b>
            </span>
          </div>
          <div style={{ marginRight: "30px", float: "right" }}>
            <AddAtomStyledButton
              onClick={showModal}
              disabled={!configData?.atom.pages.atom.read_only}
              style={{
                //   marginRight: "30px",
                //   float: "right",
                borderRadius: "8px",
              }}
            >
              + Add Cloud
            </AddAtomStyledButton>
          </div>
        </div>
        <br />
        <br />
        {isModalVisible && (
          <AddModal
            style={{ padding: "40px" }}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            dataSource={dataSource}
            setDataSource={setDataSource}
            excelData={excelData}
            setRowCount={setRowCount}
            // editRecord={editRecord}
            addRecord={addRecord}
            centered={true}
          />
        )}

        <SpinLoading spinning={loading} tip="Loading...">
          <div style={{ padding: "25px" }}>
            <TableStyling
              rowSelection={rowSelection}
              // scroll={{ x: 4000 }}
              rowKey="aws_access_key"
              columns={columnsCre}
              dataSource={credataSource}
              // pagination={false}
              style={{ width: "100%", padding: "2%" }}
            />
          </div>
        </SpinLoading>
      </Modal>
      {/* <Switch
        checked={enabled === "Enabled"}
        onChange={handleChange}
        checkedChildren="Enabled"
        unCheckedChildren="Disabled"
      /> */}
      {/* </div>
      </div> */}
    </>
  );
};

export default index;
