import React, { useState, useEffect, useRef } from "react";

import axios, { baseUrl } from "../../../../utils/axios";

import * as XLSX from "xlsx";
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
  DownOutlined,
  SmileOutlined,
  AlipayOutlined,
} from "@ant-design/icons";
// import Modal from "./AddModal.jsx";
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
  MainTableFailedDevices,
  MainTableFailedDevicesTitle,
  cloudDevices,
  cloudMainTitle,
  SummaryDevices,
  MainTitle,
  ColRowNumberStyle,
} from "../../../AllStyling/All.styled";
import { useLocation } from "react-router-dom";
import { Button, Table, Space, notification, Spin, Input } from "antd";

import { ColumnHeader } from "../../../../utils/index.jsx";
import Swal from "sweetalert2";
import { columnSearch } from "../../../../utils";
import running from "../assets/running.svg";
import not_running from "../assets/not_running.svg";
import { useNavigate } from "react-router-dom";

let excelData = [];
let s3excelData = [];
let elbexcelData = [];
let columnFilters = {};
const index = () => {
  const navigate = useNavigate();
  const data = useLocation();
  console.log(data.state);
  const [selectedAccessKey, setSelectedAccessKey] = useState(
    data.state.aws_access_key
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [staticRecord, setStaticRecord] = useState(null);
  const [staticOnBoard, setStaticOnBoard] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [s3rowCount, sets3RowCount] = useState(0);
  const [elbrowCount, setelbRowCount] = useState(0);
  const inputRef = useRef(null);
  let [exportLoading, setExportLoading] = useState(false);

  const [onBoardLoading, setOnboardLoading] = useState(false);

  let [dataSource, setDataSource] = useState(excelData);
  let [s3dataSource, sets3DataSource] = useState(s3excelData);
  let [elbdataSource, setelbDataSource] = useState(elbexcelData);
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

  const [rackNameModalVisible, setRackNameModalVisible] = useState(false);
  const [siteNameModalVisible, setSiteNameModalVisible] = useState(false);
  const [configData, setConfigData] = useState(null);

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
  const deleteRow = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        //console.log(device);
        await axios
          .post(baseUrl + "/deleteAtom", selectedRowKeys)
          .then((response) => {
            if (response?.response?.status == 500) {
              openSweetAlert(response?.response?.data, "error");
              console.log("logs", response?.response?.data);
              setOnboardLoading(false);
            } else {
              openSweetAlert(`Atom Deleted Successfully`, "success");
              const promises = [];
              promises.push(
                axios
                  .get(baseUrl + "/getAtoms")
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
    } else {
      openSweetAlert(`No Device Selected`, "error");
    }
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
              .get(baseUrl + "/getAtoms")
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
  //   const licenseData = async () => {
  //     const Data = localStorage.getItem("user");
  //     const a = JSON.parse(Data);
  //     console.log(a.user_name);

  //     const res = await axios.post(baseUrl + "/licenseValidationAfterLogin", {
  //       username: a.user_name,
  //     });
  //     setKeyResp(res.data);
  //   };
  //   licenseData();
  // }, [keyResp]);
  // useEffect(() => {
  //   const serviceCalls = async () => {
  //     setLoading(true);

  //     try {
  //       const res = await axios.post(baseUrl + "/reloadEC2", {
  //         aws_access_key: selectedAccessKey,
  //       });
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

  const S3tableData = async () => {
    sets3Loading(true);

    try {
      const res = await axios.post(baseUrl + "/reloadS3", {
        aws_access_key: selectedAccessKey,
      });
      excelData = res.data;
      sets3DataSource(excelData);
      sets3RowCount(excelData.length);
      sets3Loading(false);
    } catch (err) {
      console.log(err.response);
      sets3Loading(false);
    }
  };

  const ElbtableData = async () => {
    setelbLoading(true);
    try {
      const res = await axios.post(baseUrl + "/reloadELB", {
        aws_access_key: selectedAccessKey,
      });
      excelData = res.data;
      setelbDataSource(excelData);
      setelbRowCount(excelData.length);
      setelbLoading(false);
    } catch (err) {
      console.log(err.response);
      setelbLoading(false);
    }
  };
  const Ec2tableData = async () => {
    setLoading(true);

    try {
      const res = await axios.post(baseUrl + "/reloadEC2", {
        aws_access_key: selectedAccessKey,
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
          style={{
            color: "#66B127",
            textDecoration: "underline",
            fontWeight: "400",
            textAlign: "left",
            // color: "blue",
            cursor: "pointer",
            paddingTop: "16px",
          }}
          onClick={() => navigate("/monitoring/cloud/instance-details")}
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
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
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
      title: "state",
      dataIndex: "state",
      key: "state",
      render: (text, record) => (
        <div>
          {text === "running" ? (
            <>
              <img src={running} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}

          {text === "not running" ? (
            <>
              <img src={not_running} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}
        </div>
      ),

      ...getColumnSearchProps(
        "state",
        "State",
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
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <button
          style={{
            textAlign: "center",
            width: "60px",
            backgroundColor: "#6cb127",
            color: "white",
            border: "none",
            height: "30px",
            borderRadius: "8px",
          }}
          onClick={() =>
            AddCloud(record.instance_id, record.instance_name, record.region_id)
          }
        >
          Add
        </button>
      ),

      // ...getColumnSearchProps(
      //   "region",
      //   "Act",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // ellipsis: true,
    },
  ];
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
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
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
        sets3RowCount,
        sets3DataSource,
        s3excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <button
          style={{
            textAlign: "center",
            width: "60px",
            backgroundColor: "#6cb127",
            color: "white",
            border: "none",
            height: "30px",
            borderRadius: "8px",
          }}
          onClick={() => AddS3Cloud(record.bucket_name, record.region_id)}
        >
          Add
        </button>
      ),

      // ...getColumnSearchProps(
      //   "region",
      //   "Act",
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
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
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
    // {
    //   title: "lb dns",
    //   dataIndex: "lb_dns",
    //   key: "lb_dns",
    //   render: (text, record) => (
    //     <p
    //       style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
    //     >
    //       {text}
    //     </p>
    //   ),

    //   ...getColumnSearchProps(
    //     "lb_dns",
    //     "DNS",
    //     setelbRowCount,
    //     setelbDataSource,
    //     elbexcelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
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
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (text, record) => (
        <button
          style={{
            textAlign: "center",
            width: "60px",
            backgroundColor: "#6cb127",
            color: "white",
            border: "none",
            height: "30px",
            borderRadius: "8px",
          }}
          onClick={() =>
            AddELBCloud(
              record.lb_arn,
              record.lb_name,
              record.lb_type,
              record.lb_scheme,
              record.region_id
            )
          }
        >
          Add
        </button>
      ),

      // ...getColumnSearchProps(
      //   "region",
      //   "Act",
      //   setRowCount,
      //   setDataSource,
      //   excelData,
      //   columnFilters
      // ),
      // ellipsis: true,
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
  const AddCloud = async (id, name, region_id) => {
    setOnboardLoading(true);
    const data = {
      instance_id: id,
      instance_name: name,
      region_id: region_id,
      access_key: selectedAccessKey,
    };
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/addEC2", data)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            console.log("logs", response?.response?.data);
            setOnboardLoading(false);
          } else {
            openSweetAlert(`Cloud Added Successfully`, "success");
            const promises = [];
            // promises.push(
            //   axios
            //     .get(baseUrl + "/getAtoms")
            //     .then((response) => {
            //       console.log(response.data);
            //       excelData = response.data;
            //       setDataSource(response.data);
            //       setRowCount(response.data.length);
            //       setSelectedRowKeys([]);

            //       // excelData = response.data;
            //       setOnboardLoading(false);
            //     })
            //     .catch((error) => {
            //       console.log(error);
            //       setOnboardLoading(false);

            //       //  openSweetAlert("Something Went Wrong!", "error");
            //     })
            // );
            // return Promise.all(promises);
          }
        })
        .catch((error) => {
          setOnboardLoading(false);

          console.log("in add seed device catch ==> " + error);
          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      setOnboardLoading(false);

      console.log(err);
    }
  };
  const AddS3Cloud = async (bucketName, region_id) => {
    setOnboardLoading(true);
    const data = {
      bucket_name: bucketName,
      region_id: region_id,
      access_key: selectedAccessKey,
    };
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/addS3", data)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            console.log("logs", response?.response?.data);
            setOnboardLoading(false);
          } else {
            openSweetAlert(`S3 Bucket Added Successfully`, "success");
            const promises = [];
            // promises.push(
            //   axios
            //     .get(baseUrl + "/getAtoms")
            //     .then((response) => {
            //       console.log(response.data);
            //       excelData = response.data;
            //       setDataSource(response.data);
            //       setRowCount(response.data.length);
            //       setSelectedRowKeys([]);

            //       // excelData = response.data;
            //       setOnboardLoading(false);
            //     })
            //     .catch((error) => {
            //       console.log(error);
            //       setOnboardLoading(false);

            //       //  openSweetAlert("Something Went Wrong!", "error");
            //     })
            // );
            // return Promise.all(promises);
          }
        })
        .catch((error) => {
          setOnboardLoading(false);

          console.log("in add seed device catch ==> " + error);
          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      setOnboardLoading(false);

      console.log(err);
    }
  };
  const AddELBCloud = async (
    lb_arn,
    lb_name,
    lb_type,
    lb_scheme,
    region_id
  ) => {
    setOnboardLoading(true);
    const data = {
      lb_arn: lb_arn,
      lb_name: lb_name,
      lb_type: lb_type,
      lb_scheme: lb_scheme,
      region_id: region_id,
      access_key: selectedAccessKey,
    };
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/addELB", data)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            console.log("logs", response?.response?.data);
            setOnboardLoading(false);
          } else {
            openSweetAlert(`ELB Added Successfully`, "success");
            const promises = [];
            // promises.push(
            //   axios
            //     .get(baseUrl + "/getAtoms")
            //     .then((response) => {
            //       console.log(response.data);
            //       excelData = response.data;
            //       setDataSource(response.data);
            //       setRowCount(response.data.length);
            //       setSelectedRowKeys([]);

            //       // excelData = response.data;
            //       setOnboardLoading(false);
            //     })
            //     .catch((error) => {
            //       console.log(error);
            //       setOnboardLoading(false);

            //       //  openSweetAlert("Something Went Wrong!", "error");
            //     })
            // );
            // return Promise.all(promises);
          }
        })
        .catch((error) => {
          setOnboardLoading(false);

          console.log("in add seed device catch ==> " + error);
          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      setOnboardLoading(false);

      console.log(err);
    }
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
        </cloudDevices>
      </div>
      <div>
        {tableName === "EC2" ? (
          <SpinLoading spinning={loading} tip="Loading...">
            <div style={{ padding: "25px" }}>
              {/* <button onClick={() => AddCloud()}>Add</button> */}
              <TableStyling
                // rowSelection={rowSelection}
                // scroll={{ x: 4000 }}
                // rowKey="instance_id"
                columns={columns}
                dataSource={dataSource}
                // pagination={false}
                style={{ width: "100%", padding: "2%" }}
              />
            </div>
          </SpinLoading>
        ) : null}
        {tableName === "S3" ? (
          <SpinLoading spinning={s3loading} tip="Loading...">
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
          <SpinLoading spinning={elbloading} tip="Loading...">
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
    </>
  );
};

export default index;
