import React, { useState, useRef, useEffect } from "react";
import uamG from "../assets/uamG.svg";
import myexport from "../assets/export.svg";
import UamNavigation from "../../UamNavigation";
// import Modal from "./AddLicensceModel";
// import EditModal from "./EditLicensceModal.jsx";
import { columnSearch } from "../../../utils";
import { Table, notification } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
} from "@ant-design/icons";
import message from "../assets/message.svg";

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
//   TableStyling ,TableStyle,StyledExportButton,AddAtomStyledButton
// } from "./SubBoard.styled.js";

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
  let [exportLoading, setExportLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const inputRef = useRef(null);

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
  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
  };
  const exportSeed = async () => {
    setExportLoading(true);
    jsonToExcel(excelData);
    // openNotification();
    setExportLoading(false);
  };
  const jsonToExcel = (atomData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "licenses");
      XLSX.writeFile(wb, "licenses.xlsx");
      // setExportLoading(false);
    } else {
      openSweetAlert("No Data Found!", "error");
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
        const res = await axios.get(baseUrl + "/getAllAps");
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
    //   width: "2%",

    //   render: (text, record) => (
    //     <a>
    //       <EditOutlined
    //         style={{ paddingRight: "50px" }}
    //         onClick={() => {
    //           edit(record);
    //         }}
    //       />
    //     </a>
    //   ),
    // },
    // {
    //   ...getColumnSearchProps(
    //     'license_id',
    //     'license_id',
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    {
      title: "controller_name",
      dataIndex: "controller_name",
      key: "controller_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "controller_name",
        "Controller Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "AP IP",
      dataIndex: "ap_ip",
      key: "ap_ip",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "ap_ip",
        "AP IP",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "AP Name",
      dataIndex: "ap_name",
      key: "ap_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "ap_name",
        "AP Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Serial Number",
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
    {
      title: "AP Model",
      dataIndex: "ap_model",
      key: "ap_model",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "ap_model",
        "AP Model",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "hardware_version",
      dataIndex: "hardware_version",
      key: "hardware_version",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "hardware_version",
        "Hardware Version",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "software_version",
      dataIndex: "software_version",
      key: "software_version",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "software_version",
        "Software Version",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "description",
        "Description",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    // {
    //   ...getColumnSearchProps(
    //     'tag_id',
    //     'tag_id',
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
  ];

  return (
    <>
      <div style={{ backgroundColor: "#f1f5f5", height: "100vh" }}>
        <div style={{ padding: "15px" }}>
          <div style={{ float: "left" }}>
            <AddStyledButton
              style={{ float: "left", display: "none" }}
              onClick={showModal}
            >
              + Add Licenses
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
                Col : <b style={{ color: "#3D9E47" }}> 8</b>
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

        {/* {isModalVisible && (
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
        )} */}
        {/* {isEditModalVisible && (
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
        )} */}
        <SpinLoading spinning={loading} tip="Loading...">
          <div style={{ padding: "25px" }}>
            <TableStyling
              // rowSelection=
              // {rowSelection}
              scroll={{ x: 2000 }}
              rowKey="ip_address"
              columns={columns}
              dataSource={dataSource}
              // pagination={false}
              style={{ width: "100%", padding: "2%" }}
            />
          </div>
        </SpinLoading>
        {/* <div style={{ position: "fixed", bottom: "20px", right: "20px" }}>
          <img src={message} alt="" />
        </div> */}
      </div>
    </>
  );
};

export default index;
