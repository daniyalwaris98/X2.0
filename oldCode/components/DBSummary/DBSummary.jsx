import React, { useState, useRef, useEffect } from "react";
import { Table, notification, Switch } from "antd";

import exportExcel from "../Atom/assets/exp.svg";
import trash from "./assets/trash.svg";

import { ImportOutlined, EditOutlined } from "@ant-design/icons";
import {
  TableStyling,
  StyledImportFileInput,
  OnBoardStyledButton,
  AddAtomStyledButton,
  StyledExportButton,
  DeleteButton,
} from "../AllStyling/All.styled.js";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { columnSearch } from "../../utils";

import axios, { baseUrl } from "../../utils/axios";

import { ResponseModel } from "../ReusableComponents/ResponseModel/ResponseModel";

let excelData = [];
let columnFilters = {};

const DBSummary = () => {
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

  const [configData, setConfigData] = useState(null);

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
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
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

  const exportSeed = async () => {
    setExportLoading(true);
    jsonToExcel(excelData);
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
    } else {
      openSweetAlert("No Data Found!", "info");
    }
  };
  const handleOnboard = () => {
    if (selectedRowKeys.length > 0) {
      let filterRes = dataSource.filter((item) =>
        selectedRowKeys.includes(item.ne_ip_address)
      );
    } else {
      openSweetAlert("No device is selected to onboard.", "danger");
    }
  };

  const postSeed = async (seed) => {
    setLoading(true);
    await axios
      .post(baseUrl + "/addPasswordGroups", seed)
      .then((response) => {
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");
          setLoading(false);
        } else {
          ResponseModel(
            `
          Password Group Not Imported: ${response?.data.error}
          Password Group Imported : ${response?.data.success}
          `,
            "success",
            response?.data.error_list
          );
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getPasswordGroups")
              .then((response) => {
                excelData = response?.data;
                setRowCount(response?.data?.length);
                setDataSource(response?.data);
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
    serviceCalls();
  }, [isModalVisible]);

  const serviceCalls = async () => {
    setLoading(true);

    try {
      const res = await axios.get(baseUrl + "/getPasswordGroups");
      excelData = res.data;
      setDataSource(excelData);
      setRowCount(excelData.length);
      setLoading(false);
    } catch (err) {
      console.log(err.response);
      setLoading(false);
    }
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
      fileData.splice(0, 1);
      let data = convertToJson(headers, fileData);
      postSeed(data);
    };
  };

  const showModal = () => {
    setEditRecord(null);
    setAddRecord(null);
    setIsModalVisible(true);
  };

  const edit = (record) => {
    setEditRecord(record);
    setIsModalVisible(true);
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
      title: "Connection Name",
      dataIndex: "connection_name",
      key: "connection_name",
      align: "center",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "connection_name",
        "Connection Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Up Time",
      dataIndex: "up_time",
      key: "up_time",
      align: "center",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "up_time",
        "Up Time",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Connected Users",
      dataIndex: "connected_users",
      key: "connected_users",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "connected_users",
        "Connected Users",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Queries Per Second",
      dataIndex: "queries_per_second",
      key: "queries_per_second",

      ...getColumnSearchProps(
        "queries_per_second",
        "Queries Per Second",
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
        await axios
          .post(baseUrl + "/deletePasswordGroup", selectedRowKeys)
          .then((response) => {
            if (response?.response?.status == 500) {
              openSweetAlert(response?.response?.data, "error");
              setSelectedRowKeys([]);
            } else {
              ResponseModel(
                `
                Password Group Not Deleted : ${response.data.error}
                Password Group Deleted : ${response.data.success}
              `,
                "success",
                response.data.error_list
              );
              const promises = [];
              promises.push(
                axios
                  .get(baseUrl + "/getPasswordGroups")
                  .then((response) => {
                    excelData = response.data;
                    setDataSource(response.data);
                    setRowCount(response.data.length);
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

  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
     
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
            onClick={exportTemplate}
            style={{
              display: "none",
              marginRight: "10px",
            }}
          >
            <img
              src={exportExcel}
              alt=""
              width="15px"
              height="15px"
              style={{ marginBottom: "3px" }}
            />{" "}
            &nbsp;&nbsp; Export Template
          </StyledExportButton>
          <StyledExportButton
            onClick={exportSeed}
            style={{
              marginRight: "12px",
            }}
          >
            <img
              src={exportExcel}
              alt=""
              width="15px"
              height="15px"
              style={{ marginBottom: "3px" }}
            />
            &nbsp;&nbsp; Export
          </StyledExportButton>

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
            />
          </div>
        </div>
      </div>

   

      <div style={{ padding: "25px", marginTop: "50px" }}>
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

export default DBSummary;
