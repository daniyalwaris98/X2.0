import React, { useState, useEffect, useRef } from "react";
import myexport from "../assets/export.svg";
import { columnSearch } from "../../../utils";
import * as XLSX from "xlsx";
import Modal from "./AddSubBoardModal.jsx";
import axios, { baseUrl } from "../../../utils/axios";
import EditModal from "./EditSubBoardModal";
import Swal from "sweetalert2";

import {
  TableStyling,
  StyledExportButton,
  AddStyledButton,
  SpinLoading,
} from "../../AllStyling/All.styled.js";
import { Table, notification } from "antd";

let excelData = [];
let columnFilters = {};

const index = () => {
  let [dataSource, setDataSource] = useState(excelData);
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
  const [configData, setConfigData] = useState(null);

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

  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
    console.log(JSON.parse(config));
  }, []);
  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: !configData?.uam.pages.racks.read_only,
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
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "stack_switches");
      XLSX.writeFile(wb, "stack_switches.xlsx");
      openNotification();
      // setExportLoading(false);
    } else {
      openSweetAlert("No Data Found!", "info");
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
        const res = await axios.get(baseUrl + "/getAllSubBoards");
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
    //   width: "0.8%",

    //   render: (text, record) => (
    //     <>
    //       {!configData?.uam.pages.subboards.read_only ? (
    //         <>
    //           <a
    //             disabled
    //             // onClick={() => {
    //             //   edit(record);
    //             // }}
    //           >
    //             <EditOutlined style={{ paddingRight: "10px" }} />
    //           </a>
    //         </>
    //       ) : (
    //         <a
    //           onClick={() => {
    //             edit(record);
    //           }}
    //         >
    //           <EditOutlined
    //             style={{ paddingRight: "10px", color: "#66A111" }}
    //           />
    //         </a>
    //       )}
    //     </>
    //   ),
    // },
    {
      title: "Stack Switches Name",
      dataIndex: "subboard_name",
      key: "subboard_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "subboard_name",
        "Stack Switches Name",
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
      title: "Stack Switches Type",
      dataIndex: "subboard_type",
      key: "subboard_type",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "subboard_type",
        "Stack Switches Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "PN Code",
      dataIndex: "pn_code",
      key: "pn_code",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "pn_code",
        "PN Code",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Subrack Id",
      dataIndex: "subrack_id",
      key: "subrack_id",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "subrack_id",
        "Subrack Id",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Slot Number",
      dataIndex: "slot_number",
      key: "slot_number",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "slot_number",
        "Slot Number",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Subslot Number",
      dataIndex: "subslot_number",
      key: "subslot_number",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "subslot_number",
        "Subslot Number",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Software Version",
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
    // {
    //   title: "Hardware Version",
    //   dataIndex: "hardware_version",
    //   key: "hardware_version",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "hardware_version",
    //     "Hardware Version",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
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
      title: "Creation Date",
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
      title: "Modification date",
      dataIndex: "modification_date",
      key: "modification_date",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "modification_date",
        "Modification date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Status",
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
      title: "EOS Date",
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
      title: "EOL Date",
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
    //   title: "RFS Date",
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
  ];

  return (
    <>
      <div style={{ backgroundColor: "#f1f5f5", height: "100vh" }}>
        <div style={{ padding: "15px" }}>
          <div style={{ float: "left" }}>
            <AddStyledButton onClick={showModal} style={{ display: "none" }}>
              + Add SubBoard
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
                Col : <b style={{ color: "#3D9E47" }}> 16</b>
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
              scroll={{ x: 4000 }}
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
