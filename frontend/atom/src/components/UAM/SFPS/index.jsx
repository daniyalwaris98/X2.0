import React, { useState, useRef, useEffect } from "react";
import uamG from "../assets/uamG.svg";
import UamNavigation from "../../UamNavigation";
import myexport from "./assets/export.svg";
import { Row, Col, Table, notification } from "antd";
import message from "../assets/message.svg";
import { columnSearch } from "../../../utils";
import SFPSspeed from "./SFPSspeed";
import Modal from "./AddSFPSModal.jsx";
import EditModal from "./EditSFPSModal.jsx";
import axios, { baseUrl } from "../../../utils/axios";
import * as XLSX from "xlsx";

// import { Table } from 'antd';
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
  SpinLoading,
} from "../../AllStyling/All.styled.js";
// import {
//   AddAtomStyledButton,
//   StyledExportButton,
//   TableStyling,
// } from './SFPS.styled.js';

import Doughnut from "./Chart/Doughnut";
import BarChart from "./Chart/Bar";

let excelData = [];
let columnFilters = {};

const index = () => {
  let [dataSource, setDataSource] = useState(excelData);

  const [Name, setSiteName] = useState("");
  const [myImg, setMyImg] = useState("");
  const [myNumber, setMyNumber] = useState("");

  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const inputRef = useRef(null);
  let [exportLoading, setExportLoading] = useState(false);

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

  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: configData?.ipam.pages.ipam.read_only,
    }),
  };
  const exportSeed = async () => {
    setExportLoading(true);
    jsonToExcel(excelData);

    setExportLoading(false);
  };

  const jsonToExcel = (atomData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "sfps");
      XLSX.writeFile(wb, "sfps.xlsx");
      openNotification();
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

  // const postSeed = async (seed) => {
  //   setLoading(true);
  //   await axios
  //     .post(baseUrl + "/addAtomDevices", seed)
  //     .then((response) => {
  //       console.log("hahahehehoho");
  //       console.log(response.status);
  //       if (response?.response?.status == 500) {
  //         openSweetAlert(response?.response?.data?.response, "error");
  //         setLoading(false);
  //       } else {
  //         openSweetAlert("Atom Added Successfully", "success");
  //         const promises = [];
  //         promises.push(
  //           axios
  //             .get(baseUrl + "/getAtoms")
  //             .then((response) => {
  //               // console.log("response===>", response);
  //               // setExcelData(response.data);

  //               console.log(response.data);
  //               excelData = response?.data;
  //               setRowCount(response?.data?.length);
  //               setDataSource(response?.data);

  //               console.log(response.data);

  //               excelData = response.data;
  //               setDataSource(excelData);

  //               setRowCount(response.data.length);
  //               setDataSource(response.data);
  //               setLoading(false);
  //             })
  //             .catch((error) => {
  //               console.log(error);
  //               setLoading(false);
  //             })
  //         );
  //         setLoading(false);
  //         return Promise.all(promises);
  //       }
  //     })
  //     .catch((err) => {
  //       // openSweetAlert("Something Went Wrong!", "danger");
  //       console.log("error ==> " + err);
  //       setLoading(false);
  //     });
  // };

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllSfps");
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

  useEffect(() => {
    const sfpStatus = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/sfpStatus");
        console.log("sfpStatus", res.data);

        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    sfpStatus();
  }, []);
  useEffect(() => {
    const sfpMode = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/sfpMode");
        console.log("sfpMode", res);

        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    sfpMode();
  }, []);

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

  const columns = [
    // {
    //   title: "",
    //   key: "edit",
    //   width: "1%",

    //   render: (text, record) => (
    //     <>
    //       {!configData?.ipam.pages.ipam.read_only ? (
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
    //           <EditOutlined
    //             style={{ paddingRight: "50px", color: "#66A111" }}
    //           />
    //         </a>
    //       )}
    //     </>
    //   ),
    // },
    // {
    //   title: "sfp_id",
    //   dataIndex: "sfp_id",
    //   key: "sfp_id",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "sfp_id",
    //     "SFP Id",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    {
      title: "device_name",
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
      title: "media_type",
      dataIndex: "media_type",
      key: "media_type",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "media_type",
        "Media Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "port_name",
      dataIndex: "port_name",
      key: "port_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "port_name",
        "Port Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "port_type",
      dataIndex: "port_type",
      key: "port_type",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "port_type",
        "Port Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    // {
    //   title: "connector",
    //   dataIndex: "connector",
    //   key: "connector",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "connector",
    //     "Connector",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    {
      title: "mode",
      dataIndex: "mode",
      key: "mode",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "mode",
        "Mode",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    // {
    //   title: "speed",
    //   dataIndex: "speed",
    //   key: "speed",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "speed",
    //     "Speed",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    // {
    //   title: "wavelength",
    //   dataIndex: "wavelength",
    //   key: "wavelength",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "wavelength",
    //     "Wavelength",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    // {
    //   title: "manufacturer",
    //   dataIndex: "manufacturer",
    //   key: "manufacturer",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "manufacturer",
    //     "Manufacturer",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    // {
    //   title: "optical_direction_type",
    //   dataIndex: "optical_direction_type",
    //   key: "optical_direction_type",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "optical_direction_type",
    //     "Optical Direction Type",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    // {
    //   title: "pn_code",
    //   dataIndex: "pn_code",
    //   key: "pn_code",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "pn_code",
    //     "PN Code",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    {
      title: "creation_date",
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
      title: "modification_date",
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
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "status",
        "Status",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "eos_date",
      dataIndex: "eos_date",
      key: "eos_date",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "eos_date",
        "EOS Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "eol_date",
      dataIndex: "eol_date",
      key: "eol_date",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "eol_date",
        "EOL Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    // {
    //   title: "rfs_date",
    //   dataIndex: "rfs_date",
    //   key: "rfs_date",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "rfs_date",
    //     "RFS Date",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    {
      title: "serial_number",
      dataIndex: "serial_number",
      key: "serial_number",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "serial_number",
        "Serial Number",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  return (
    <>
      <div style={{ backgroundColor: "#f1f5f5" }}>
        <div style={{ backgroundColor: "#f1f5f5", height: "100%" }}>
          <Row
            style={{
              padding: "10px",
              marginTop: "5px",
              marginRight: "15px",
              marginLeft: "15px",
            }}
          >
            {/* <Col
              xs={{ span: 24 }}
              md={{ span: 24 }}
              lg={{ span: 11 }}
              // xl={{ span: 2 }}
            >
              <div
                style={{
                  justifyContent: "space-between",
                  height: "100%",
                  borderRadius: "12px",
                  textAlign: "center",
                  marginRight: "10px",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                  // margin: "0 auto",
                  padding: "16px",
                  backgroundColor: "#fcfcfc",
                }}
              >
                <h3
                  style={{
                    color: "#000",
                    borderLeft: "3px solid #6C6B75",
                    borderTopLeftRadius: "6px",
                    paddingLeft: "10px",
                    paddingTop: "5px",
                    alignItems: "left",
                    textAlign: "left",
                    marginLeft: "-15px",
                    marginTop: "-15px",
                    fontWeight: "bold",
                  }}
                >
                  SFPS Speed
                </h3>
                <Row style={{ marginTop: "15px" }}>
                  <Col
                    xs={{ span: 6 }}
                    md={{ span: 6 }}
                    lg={{ span: 6 }}
                    // xl={{ span: 2 }}
                  >
                    <div
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        borderRight: "1px solid #AFAFAF4D",
                        borderBottom: "1px solid #AFAFAF4D",
                      }}
                    >
                      <h4 style={{ color: "#66B127" }}>1 GB</h4>
                      <p style={{ color: "#9F9F9F" }}>un-used</p>
                      <h1 style={{ color: "#6C6B75", fontWeight: "600" }}>
                        100
                      </h1>
                    </div>
                  </Col>
                  <Col
                    xs={{ span: 6 }}
                    md={{ span: 6 }}
                    lg={{ span: 6 }}
                    // xl={{ span: 2 }}
                  >
                    <div
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        borderRight: "1px solid #AFAFAF4D",
                        borderBottom: "1px solid #AFAFAF4D",
                      }}
                    >
                      <h4 style={{ color: "#66B127" }}>1 GB</h4>
                      <p style={{ color: "#9F9F9F" }}>un-used</p>
                      <h1 style={{ color: "#6C6B75", fontWeight: "600" }}>
                        100
                      </h1>
                    </div>
                  </Col>
                  <Col
                    xs={{ span: 6 }}
                    md={{ span: 6 }}
                    lg={{ span: 6 }}
                    // xl={{ span: 2 }}
                  >
                    <div
                      style={{
                        textAlign: "left",
                        padding: "10px",

                        borderRight: "1px solid #AFAFAF4D",
                        borderBottom: "1px solid #AFAFAF4D",
                      }}
                    >
                      <h4 style={{ color: "#66B127" }}>1 GB</h4>
                      <p style={{ color: "#9F9F9F" }}>un-used</p>
                      <h1 style={{ color: "#6C6B75", fontWeight: "600" }}>
                        100
                      </h1>
                    </div>
                  </Col>
                  <Col
                    xs={{ span: 6 }}
                    md={{ span: 6 }}
                    lg={{ span: 6 }}
                    // xl={{ span: 2 }}
                  >
                    <div
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        borderBottom: "1px solid #AFAFAF4D",
                      }}
                    >
                      <h4 style={{ color: "#66B127" }}>1 GB</h4>
                      <p style={{ color: "#9F9F9F" }}>un-used</p>
                      <h1 style={{ color: "#6C6B75", fontWeight: "600" }}>
                        100
                      </h1>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col
                    xs={{ span: 6 }}
                    md={{ span: 6 }}
                    lg={{ span: 6 }}
                    // xl={{ span: 2 }}
                  >
                    <div
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        borderRight: "1px solid #AFAFAF4D",
                      }}
                    >
                      <h4 style={{ color: "#66B127" }}>1 GB</h4>
                      <p style={{ color: "#9F9F9F" }}>un-used</p>
                      <h1 style={{ color: "#6C6B75", fontWeight: "600" }}>
                        100
                      </h1>
                    </div>
                  </Col>
                  <Col xs={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }}>
                    <div
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        borderRight: "1px solid #AFAFAF4D",
                      }}
                    >
                      <h4 style={{ color: "#66B127" }}>1 GB</h4>
                      <p style={{ color: "#9F9F9F" }}>un-used</p>
                      <h1 style={{ color: "#6C6B75", fontWeight: "600" }}>
                        100
                      </h1>
                    </div>
                  </Col>
                  <Col xs={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }}>
                    <div
                      style={{
                        textAlign: "left",
                        padding: "10px",
                        borderRight: "1px solid #AFAFAF4D",
                      }}
                    >
                      <h4 style={{ color: "#66B127" }}>1 GB</h4>
                      <p style={{ color: "#9F9F9F" }}>un-used</p>
                      <h1 style={{ color: "#6C6B75", fontWeight: "600" }}>
                        100
                      </h1>
                    </div>
                  </Col>
                  <Col xs={{ span: 6 }} md={{ span: 6 }} lg={{ span: 6 }}>
                    <div style={{ textAlign: "left", padding: "10px" }}>
                      <h4 style={{ color: "#66B127" }}>1 GB</h4>
                      <p style={{ color: "#9F9F9F" }}>un-used</p>
                      <h1 style={{ color: "#6C6B75", fontWeight: "600" }}>
                        100
                      </h1>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col> */}

            <Col
              xs={{ span: 24 }}
              md={{ span: 6 }}
              lg={{ span: 6 }}
              // xl={{ span: 2 }}
            >
              <div
                style={{
                  // display: "flex",
                  justifyContent: "space-between",
                  marginRight: "10px",
                  borderRadius: "12px",
                  height: "100%",
                  width: "100%",
                  padding: "15px",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                  marginTop: "-1px",
                  backgroundColor: "#fcfcfc",
                }}
              >
                <h3
                  style={{
                    color: "#000",
                    borderLeft: "5px solid #6C6B75",
                    borderTopLeftRadius: "6px",
                    paddingLeft: "6px",
                    alignItems: "center",
                    paddingLeft: "13px",
                    paddingTop: "10px",
                    marginLeft: "-15px",
                    marginTop: "-13px",
                    fontWeight: "bold",
                  }}
                >
                  SFPS Mode
                </h3>
                <div
                  style={{
                    textAlign: "center",
                    margin: "0 auto",
                    marginTop: "20px",
                  }}
                >
                  <Doughnut />
                </div>
              </div>
            </Col>
            <Col
              xs={{ span: 24 }}
              md={{ span: 18 }}
              lg={{ span: 18 }}
              // xl={{ span: 2 }}
            >
              <div
                style={{
                  // display: "flex",
                  justifyContent: "space-between",
                  marginLeft: "5px",
                  // margin: "2px",
                  borderRadius: "12px",
                  textAlign: "center",
                  boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                  padding: "15px",
                  backgroundColor: "#fcfcfc",
                  height: "100%",
                }}
              >
                <h3
                  style={{
                    color: "#000",
                    borderLeft: "5px solid #6C6B75",
                    borderTopLeftRadius: "6px",
                    paddingLeft: "13px",
                    paddingTop: "8px",
                    alignItems: "left",
                    textAlign: "left",
                    marginLeft: "-15px",
                    marginTop: "-13px",
                    fontWeight: "bold",
                  }}
                >
                  Port Type
                </h3>
                <div style={{ margin: "15px auto", width: "100%" }}>
                  <BarChart />
                </div>
              </div>
            </Col>
          </Row>

          <div style={{ padding: "15px" }}>
            <div style={{ float: "left" }}>
              <AddStyledButton
                onClick={showModal}
                // disabled={true}
                style={{ display: "none" }}
              >
                + Add SFPS
              </AddStyledButton>
              <div style={{ display: "flex", marginTop: "3px" }}>
                <h3
                  style={{
                    marginLeft: "10px",
                    // float: "right",
                    marginRight: "20px",
                    // fontWeight: "bold",
                  }}
                >
                  Row :<b style={{ color: "#3D9E47" }}> {rowCount}</b>
                </h3>
                <h3
                  style={{
                    marginLeft: "10px",
                    // float: "right",
                    marginRight: "20px",
                    // fontWeight: "bold",
                  }}
                >
                  Col : <b style={{ color: "#3D9E47" }}> 11</b>
                </h3>
              </div>
            </div>
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
            </div>
          </div>
          <br />
          <br />
          {isModalVisible && (
            <Modal
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
          {isEditModalVisible && (
            <EditModal
              style={{ padding: "0px" }}
              isEditModalVisible={isEditModalVisible}
              setIsEditModalVisible={setIsEditModalVisible}
              dataSource={dataSource}
              setDataSource={setDataSource}
              excelData={excelData}
              setRowCount={setRowCount}
              editRecord={editRecord}
              centered={true}
            />
          )}
          <SpinLoading spinning={loading} tip="Loading...">
            <div style={{ padding: "25px" }}>
              <TableStyling
                // rowSelection={rowSelection}
                scroll={{ x: 5000 }}
                rowKey="ip_address"
                columns={columns}
                dataSource={dataSource}
                // pagination={false}
                style={{ width: "100%", padding: "2%" }}
              />
            </div>
          </SpinLoading>
          {/* <div
            style={{
              position: "fixed",
              bottom: "20px",
              right: "20px",
            }}
          >
            <img src={message} alt="" />
          </div> */}
        </div>
      </div>
    </>
  );
};

export default index;
