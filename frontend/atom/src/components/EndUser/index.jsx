import React, { useEffect, useState, useRef } from "react";
import { Button, Table, Spin } from "antd";
import addmember from "./assets/addmember.svg";
import { columnSearch } from "../../utils";
import { ReactComponent as profile } from "./assets/profile.svg";
import { ReactComponent as Modal } from "./assets/addmember.svg";
import axios, { baseUrl } from "../../utils/axios";
// import AdminNavigation from "../../AdminNavigation";
import AddModal from "./AddMember";
import EditModal from "./EditMember";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

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
  MainTableMainDiv,
  MainTableMainP,
  MainTableDropDown,
  MainTableModal,
  MainTableColP,
  SpinLoading,
  AddButtonStyle,
} from "../AllStyling/All.styled.js";

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
  let [inputValue, setInputValue] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllEndUserDetails");
        console.log("res", res);
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
  //     setLoading(true);

  //     try {
  //       const res = await axios.get(baseUrl + "/getAllAdmin");
  //       console.log("addAdmin", res);

  //       setLoading(false);
  //     } catch (err) {
  //       console.log(err.response);
  //       setLoading(false);
  //     }
  //   };
  //   serviceCalls();
  // }, []);

  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
    console.log(JSON.parse(config));
  }, []);
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
  };

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );
  // Alert
  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  useEffect(() => {
    inputRef.current.addEventListener("input", importExcel);
  }, []);

  const importExcel = (e) => {
    // console.log("first");

    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const bstr = e.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const workSheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[workSheetName];
      const fileData = XLSX.utils.sheet_to_json(workSheet, {
        header: 1,
        raw: false,
      });
      const headers = fileData[0];
      // const heads = headers.map((head) => ({ title: head, field: head }));
      fileData.splice(0, 1);
      let data = convertToJson(headers, fileData);
      // console.log(excelData);
      postSeed(data);
      // setRowCount(data.length);
      // setDataSource(data);
    };
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
  // var firstRow = excelData[0];
  // var second = excelData[1];
  // var third = excelData[2];
  // var fourth = excelData[3];
  let seedTemp = [
    // firstRow,
    // second,
    // third,
    // fourth,
    {
      ip_address: "000.000.000.000",
      // onboard_status: "",
      // atom_id: "",
      // domain: "abc",
      site_name: "hjk",
      rack_name: "wetr",
      device_name: "oiuyt",
      device_ru: "0",
      department: "hjg",
      section: "ghchg",
      // criticality: "afghbc",
      function: "abkkkcf",
      virtual: "dfghcg",
      device_type: "asddxvcert",
      password_group: "asssjndfg",
    },
  ];
  const exportTemplate = () => {
    templeteExportFile(seedTemp);
    // openNotification();
  };
  const templeteExportFile = (atomData) => {
    let wb = XLSX.utils.book_new();
    let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
    XLSX.utils.book_append_sheet(wb, binaryAtomData, "atom_devices");
    XLSX.writeFile(wb, "atom_devices.xlsx");
    openNotification();
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
    setLoading(true);
    await axios
      .post(baseUrl + "/addEndUsers", seed)
      .then((response) => {
        console.log("hahahehehoho");
        console.log(response.status);
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");
          setLoading(false);
        } else {
          openSweetAlert(response?.data, "success");
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllEndUserDetails")
              .then((response) => {
                console.log("response===>", response);
                // setExcelData(response.data);

                console.log(response.data);
                console.log("asd", response);
                excelData = response?.data;
                setRowCount(response?.data?.length);
                setDataSource(response?.data);

                console.log(response.data);

                excelData = response.data;
                setDataSource(excelData);

                setRowCount(response.data.length);
                setDataSource(response.data);
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
                setLoading(false);
              })
          );
          setLoading(false);
          return Promise.all(promises);
        }
      })
      .catch((err) => {
        // openSweetAlert("Something Went Wrong!", "danger");
        console.log("error ==> " + err);
        setLoading(false);
      });
  };

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
    setIsModalVisible(true);
    console.log("object");
    setEditRecord(null);
    setAddRecord(null);
    console.log("first");
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
    {
      title: "",
      key: "edit",
      width: "2%",

      render: (text, record) => (
        <>
          {!configData?.atom.pages.atom.read_only ? (
            <>
              <p
                style={{
                  color: "#66B127",
                  textDecoration: "underline",
                  fontWeight: "400",
                  textAlign: "center",
                  // color: "blue",
                  cursor: "pointer",
                }}
                disabled
                // onClick={() => {
                //   edit(record);
                // }}
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
                // color: "blue",
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
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "company_name",
        "Company Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    // {
    //   title: "active",
    //   dataIndex: "active",
    //   key: "active",
    //   render: (text, record) => (
    //     <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
    //   ),

    //   ...getColumnSearchProps(
    //     "active",
    //     "Active",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },

    {
      title: "PO Box",
      dataIndex: "po_box",
      key: "po_box",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "po_box",
        "PO Box",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "address",
        "Address",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Street Number",
      dataIndex: "street_name",
      key: "street_name",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "street_name",
        "Street Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "city",
        "City",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "country",
        "Country",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person",
      key: "contact_person",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "contact_person",
        "Contact Person",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Contact Number",
      dataIndex: "contact_number",
      key: "contact_number",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "contact_number",
        "Contact Number",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "email",
        "Email",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Domain Name",
      dataIndex: "domain_name",
      key: "domain_name",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "domain_name",
        "Domain Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Industry Type",
      dataIndex: "industry_type",
      key: "industry_type",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "industry_type",
        "Industry Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    // {
    //   title: "Vendor",
    //   dataIndex: "vendor",
    //   key: "vendor",
    //   render: (text, record) => (
    //     <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
    //   ),

    //   ...getColumnSearchProps(
    //     "vendor",
    //     "Vendor",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
  ];
  const deleteUser = async (id) => {
    console.log(id);

    setLoading(true);
    await axios
      .post(baseUrl + "/deleteUser", { user_id: id })
      .then((response) => {
        console.log("hahahehehoho");
        console.log(response.status);
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data?.response, "error");
          setLoading(false);
        } else {
          openSweetAlert("User Deleted Successfully", "success");
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllEndUserDetails")
              .then((response) => {
                console.log("response===>", response);
                // setExcelData(response.data);

                console.log(response.data);
                console.log("asd", response);
                excelData = response?.data;
                setRowCount(response?.data?.length);
                setDataSource(response?.data);

                console.log(response.data);

                excelData = response.data;
                setDataSource(excelData);

                setRowCount(response.data.length);
                setDataSource(response.data);
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
                setLoading(false);
              })
          );
          setLoading(false);
          return Promise.all(promises);
        }
      })
      .catch((err) => {
        // openSweetAlert("Something Went Wrong!", "danger");
        console.log("error ==> " + err);
        setLoading(false);
      });
  };
  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        height: "100vh",
      }}
    >
      <div style={{ marginLeft: "20px", marginRight: "20px" }}>
        <h2 style={{ fontWeight: 700 }}>End-User</h2>

        <div style={{ float: "right" }}>
          <StyledImportFileInput
            // disabled={!configData?.atom.pages.atom.read_only}
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            style={{ marginRight: "15px", marginLeft: "5px" }}
            type="file"
            value={inputValue}
            onChange={() => importExcel}
            ref={inputRef}
            prefix={<ImportOutlined />}
            // style={{
            //   color: "white",
            //   marginRight: "10px",
            //   borderRadius: "3px",
            //   marginLeft: "5px",
            //   backgroundColor: "#059142",
            //   border: "0px",
            // }}
          />

          <AddButtonStyle
            style={{
              float: "right",
              height: "36px",
              borderRadius: "8px",
              padding: "0px 12px",
            }}
            onClick={showModal}
            // style={{
            //   backgroundColor: "#66B127",
            //   fontWeight: "500",
            //   color: "white",
            //   height: "45px",
            //   padding: "10px",
            //   borderRadius: "8px",
            //   float: "right",
            //   marginTop: "10px",
            //   cursor: "pointer",
            //   border: "none",
            // }}
          >
            Add User
          </AddButtonStyle>
        </div>
      </div>
      <br />
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
        <TableStyling
          // rowSelection={rowSelection}
          scroll={{ x: 2600 }}
          // rowKey="ip_address"
          columns={columns}
          dataSource={dataSource}
          // pagination={false}
          style={{ width: "100%", padding: "2%" }}
        />
      </SpinLoading>
    </div>
  );
};

export default index;
