import React, { useState, useRef, useEffect } from "react";
import { Button, Table, Space, notification, Spin, Input, Switch } from "antd";
import Modal from "./AddUser";
import EditModal from "./EditUser";
import AtomNavigation from "../AtomNavigation";
import exportExcel from "../Atom/assets/exp.svg";
import atomicon from "./assets/atomicon.svg";
// import atomicon from "../Atom/assets/atomicon.svg";
import trash from "./assets/trash.svg";

// import RackNameModel from "./RackNameModel";

// import { AddAtomStyledButton } from "../../ReuseStyle/AddWidgetButton/button.styled.js";
// import { StyledExportButton } from "../../ReuseStyle/ExportExcelButton/button.styled.js";
// import { OnBoardStyledButton } from "../../ReuseStyle/OnboardButton/Onboard.styled.js";
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
  DeleteButton,
} from "../AllStyling/All.styled.js";
import { ColumnHeader } from "../../utils/index.jsx";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { columnSearch } from "../../utils";

import axios, { baseUrl } from "../../utils/axios";
// import SiteNameModel from "./SiteNameModel";

let excelData = [];
let columnFilters = {};

const Atom = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const inputRef = useRef(null);
  let [exportLoading, setExportLoading] = useState(false);

  const [checked, setChecked] = useState([]);

  let [dataSource, setDataSource] = useState(excelData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  let [loading, setLoading] = useState(false);
  let [inputValue, setInputValue] = useState("");
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [rackData, setRackData] = useState(null);

  const [rackNameModalVisible, setRackNameModalVisible] = useState(false);
  const [siteNameModalVisible, setSiteNameModalVisible] = useState(false);
  const [configData, setConfigData] = useState(null);

  const checkPasswordGroup = (allData) => {
    excelData = allData;
  };

  const onChangeSwitch = (isChecked, id) => {
    if (isChecked) {
      setChecked((prev) => [...prev, id]);
    } else {
      let tempArray = [...checked];
      const index = tempArray.indexOf(id);
      if (index > -1) {
        // only splice array when item is found
        tempArray.splice(index, 1);
        // 2nd parameter means remove one item only
        setChecked(tempArray);
      }
    }
    console.log(`switch to ${id}`);
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
  // Alert
  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };
  const exportSeed = async () => {
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
  let seedTemp = [
    {
      ip_address: "",
      atom_id: "",
      site_name: "",
      rack_name: "",
      device_name: "",
      device_ru: "",
      department: "",
      section: "",
      criticality: "",
      function: "",
      virtual: "",
      device_type: "",
      password_group: "",
    },
  ];
  const exportTemplate = async () => {
    jsonToExcel(seedTemp);
  };
  const jsonToExcel = (atomData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "password_group");
      XLSX.writeFile(wb, "password_group.xlsx");
      openNotification();

      // setExportLoading(false);
    } else {
      openSweetAlert("No Data Found!", "info");
    }
  };
  const handleOnboard = () => {
    // history.push('/onboard')
    if (selectedRowKeys.length > 0) {
      let filterRes = dataSource.filter((item) =>
        selectedRowKeys.includes(item.ne_ip_address)
      );

      // history.push({
      //   pathname: "/onboard",
      //   state: { detail: filterRes },
      // });
    } else {
      openSweetAlert("No device is selected to onboard.", "danger");
    }
  };
  const postSeed = async (seed) => {
    setLoading(true);
    await axios
      .post(baseUrl + "/addUsers", seed)
      .then((response) => {
        console.log("hahahehehoho");
        console.log(response.status);
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");
          console.log(response?.data);
          setLoading(false);
        } else {
          openSweetAlert(response?.data, "success");
          console.log(response?.data);
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getUsers")
              .then((response) => {
                // console.log("response===>", response);
                // setExcelData(response.data);

                console.log(response.data);
                excelData = response?.data;
                setRowCount(response?.data?.length);
                setDataSource(response?.data);

                console.log(response.data);
                //
                //              excelData = response.data;
                //  setDataSource(excelData);

                // // setRowCount(response.data.length);
                //setDataSource(response.data);
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
        openSweetAlert(err, "error");
        console.log("error ==> " + err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getUsers");
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
  useEffect(() => {
    inputRef.current.addEventListener("input", importExcel);
  }, []);

  const importExcel = (e) => {
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

  //   useEffect(() => {
  //     const GetCpeDetail = async () => {
  //     //     try {
  //     //       const res = await axios.get(
  //     //         baseUrl + "/getCpeDetail",

  //     //       );
  //     //       setAllData(res.data)
  //     //       // console.log("Data",res.data.cpe_ip_address);
  //     //     } catch (err) {
  //     //       console.log(err);
  //     //     }
  //     //   };
  //     //   GetCpeDetail();

  //       }, []);

  //   useEffect(() => {
  //     const serviceCalls = async () => {
  //       setLoading(true);
  //       try {
  //         const res = await axios.get(baseUrl + "/getSeeds");
  //         excelData = res.data;
  //         setDataSource(excelData);
  //         setRowCount(excelData.length);
  //         setLoading(false);
  //       } catch (err) {
  //         console.log(err.response);
  //         setLoading(false);
  //       }
  //     };
  //     serviceCalls();
  //   }, []);

  const showModal = () => {
    setEditRecord(null);
    setAddRecord(null);
    setIsModalVisible(true);
  };

  //   const showOnboardModal = (record) => {
  //     setOnboardRecord(record);
  //     setIsOnboardModalVisible(true);
  //   };

  const showEditModal = () => {
    setIsModalVisible(true);
  };
  const edit = (record) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
    // setAddRecord(record);
  };

  const showSiteName = async (record) => {
    // console.log(record);
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getSiteBySiteName?site_name=${record.site_name}`
      );
      console.log(res.data);
      setSiteData(res.data);
      // setSiteData(record);
      setSiteNameModalVisible(true);
      console.log("Site Name");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  const showRackName = async (record) => {
    console.log(record);
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getRacksByRackName?rack_name=${record.rack_name}`
      );
      console.log(res.data);
      setRackData(res.data);
      // setRackData(record);
      setRackNameModalVisible(true);
      console.log("Rack Name");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const columns = [
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
        setRowCount,
        setDataSource,
        excelData,
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
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "password",
      dataIndex: "password",
      key: "password",
      // render: (text, record) => (
      //   <p style={{ textAlign: "center", paddingTop: "5px" }}>
      //     <Switch defaultChecked onChange={onChangeSwitch} />
      //     {text}
      //   </p>
      // ),

      ...getColumnSearchProps(
        "password",
        "Password",
        setRowCount,
        setDataSource,
        excelData,
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

  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
  };
  const deleteRow = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        //console.log(device);
        await axios
          .post(baseUrl + "/deletePasswordGroup", selectedRowKeys)
          .then((response) => {
            if (response?.response?.status == 500) {
              openSweetAlert(response?.response?.data, "error");
              setSelectedRowKeys([]);

              console.log(response?.response?.data);
            } else {
              openSweetAlert(`Password Group Deleted Successfully`, "success");
              const promises = [];
              promises.push(
                axios
                  .get(baseUrl + "/getUsers")
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
        + Add Password Group
      </AddAtomStyledButton>
      <br />
      <br />
      <div>
        <div
          style={{
            float: "left",
            marginLeft: "25px",
            marginTop: "5px",
            display: "flex",
          }}
        >
          <OnBoardStyledButton
            onClick={handleOnboard}
            style={{ width: "100px", fontSize: "14px", display: "none" }}
            disabled={!configData?.atom.pages.password_group.read_only}
          >
            + On Board
          </OnBoardStyledButton>
          {selectedRowKeys.length > 0 ? (
            <DeleteButton onClick={deleteRow} style={{ marginTop: "4px" }}>
              <img src={trash} width="18px" height="18px" alt="" />
              &nbsp;Delete
            </DeleteButton>
          ) : null}
          <div style={{ marginTop: "7px" }}>
            <h5
              style={{
                marginLeft: "10px",
                float: "right",
                marginRight: "20px",
                // fontWeight: "bold",
              }}
            >
              Col :{" "}
              <b
                style={{
                  color: "#66b127",
                  fontWeight: 700,
                }}
              >
                3
              </b>
            </h5>
            <h5
              style={{
                marginLeft: "10px",
                float: "right",
                marginRight: "10px",
                // fontWeight: "bold",
              }}
            >
              Row :{" "}
              <b
                style={{
                  color: "#66b127",
                  fontWeight: 700,
                }}
              >
                {rowCount}
              </b>
            </h5>
          </div>
        </div>

        <div style={{ float: "right", display: "flex", marginTop: "15px" }}>
          <StyledExportButton
            // color={"#F3F3F3"}

            onClick={exportTemplate}
            style={{
              display: "none",
              marginRight: "10px",
              // color: "#9F9F9F",
              // marginLeft: "10px",
            }}
          >
            {/* {<ExportOutlined />}  */}
            <img
              src={exportExcel}
              alt=""
              width="15px"
              height="15px"
              style={{ marginBottom: "3px" }}
            />{" "}
            &nbsp;&nbsp; Export Template
          </StyledExportButton>
          {/* <Spin spinning={exportLoading}> */}
          <StyledExportButton
            onClick={exportSeed}
            // type="primary"
            style={{
              marginRight: "12px",
              // marginLeft: "5px",
              // color: "#9F9F9F",
            }}
          >
            {/* {<ExportOutlined />} */}
            <img
              src={exportExcel}
              alt=""
              width="15px"
              height="15px"
              style={{ marginBottom: "3px" }}
            />
            &nbsp;&nbsp; Export
          </StyledExportButton>
          {/* </Spin> */}
          <div style={{}}>
            <StyledImportFileInput
              disabled={!configData?.atom.pages.password_group.read_only}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              style={{ float: "right", marginRight: "30px", marginLeft: "5px" }}
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
          </div>
          {/* {<ImportOutlined />} Import from Excel
          </StyledImportFileInput> */}
        </div>
      </div>

      {isModalVisible && (
        <Modal
          style={{ padding: "0px" }}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          dataSource={dataSource}
          setDataSource={setDataSource}
          excelData={excelData}
          setRowCount={setRowCount}
          checkPasswordGroup={checkPasswordGroup}
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

      <div style={{ padding: "25px", marginTop: "10px" }}>
        <TableStyling
          rowSelection={rowSelection}
          rowKey="password_group"
          columns={columns}
          dataSource={dataSource}
          style={{
            width: "100%",
            padding: "2%",
          }}
        />
      </div>
    </div>
  );
};

export default Atom;
