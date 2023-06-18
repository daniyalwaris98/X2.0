import React, { useState, useRef, useEffect } from "react";
import { Table, notification } from "antd";
import Modal from "./AddNetwork";
import EditModal from "./EditNetwork";
import tempexp from "../assets/exp.svg";
import trash from "../assets/trash.svg";

import { ImportOutlined, EditOutlined } from "@ant-design/icons";
import {
  TableStyling,
  StyledImportFileInput,
  AddAtomStyledButton,
  StyledExportButton,
  SpinLoading,
  DeleteButton,
} from "../../AllStyling/All.styled.js";
import hoverexp from "../assets/activeexport.svg";

import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { columnSearch } from "../../../utils";

import axios, { baseUrl } from "../../../utils/axios";

let excelData = [];
let columnFilters = {};

const Atom = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const inputRef = useRef(null);

  const [onBoardLoading, setOnboardLoading] = useState(false);

  let [dataSource, setDataSource] = useState(excelData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  let [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
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

  const checkAtom = (allData) => {
    excelData = allData;
  };

  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  const deleteRow = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        await axios
          .post(baseUrl + "/deleteNetworks", selectedRowKeys)
          .then((response) => {
            if (response?.response?.status == 500) {
              openSweetAlert(response?.response?.data, "error");
              console.log("logs", response?.response?.data);
              setOnboardLoading(false);
            } else {
              openSweetAlert(`Network Deleted Successfully`, "success");
              const promises = [];
              promises.push(
                axios
                  .get(baseUrl + "/getAllNetworks")
                  .then((response) => {
                    console.log(response.data);
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

  const exportSeed = async () => {
    jsonToExcel(excelData);
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
      network_name: "hjk",
      subnet: "wetr",
      scan_status: "Active",
      excluded_ip_range: "1-10",
    },
  ];

  const exportTemplate = () => {
    templeteExportFile(seedTemp);
  };

  const templeteExportFile = (atomData) => {
    let wb = XLSX.utils.book_new();
    let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
    XLSX.utils.book_append_sheet(wb, binaryAtomData, "network");
    XLSX.writeFile(wb, "network.xlsx");
    openNotification();
  };

  const jsonToExcel = (atomData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "network");
      XLSX.writeFile(wb, "network.xlsx");
      openNotification();
    } else {
      openSweetAlert("No Data Found!", "error");
    }
  };

  const postSeed = async (seed) => {
    setLoading(true);

    await axios
      .post(baseUrl + "/addNetworks", seed)
      .then((response) => {
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");
          setLoading(false);
        } else {
          openSweetAlert(response?.data, "success");

          const promises = [];

          promises.push(
            axios
              .get(baseUrl + "/getAllNetworks")
              .then((response) => {
                console.log("response===============>====>", response);

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
        console.log("error ==> " + err);
        setLoading(false);
      });
  };

  const validateSheet = (seeds) => {
    console.log("seeds ========>", seeds);

    if (
      seeds[0].scan_status == "Active" ||
      seeds[0].scan_status == "inActive"
    ) {
      postSeed(seeds);
    } else if (seeds[0].scan_status == "") {
      openSweetAlert("scan status should not be empty", "error");
    } else {
      openSweetAlert("Please add valid scan status", "error");
    }
  };

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllNetworks");
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
      fileData.splice(0, 1);
      let data = convertToJson(headers, fileData);

      validateSheet(data);
    };
  };

  const showModal = () => {
    setEditRecord(null);
    setAddRecord(null);
    setIsModalVisible(true);
  };

  const edit = (record) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
  };

  const columns = [
    {
      title: "",
      key: "edit",
      width: "1%",

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

                  cursor: "pointer",
                }}
                disabled
              >
                <EditOutlined
                  style={{ paddingTop: "17px", color: "#66A111" }}
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
              <EditOutlined style={{ paddingTop: "17px", color: "#66A111" }} />
            </p>
          )}
        </>
      ),
    },

    {
      title: "Network Name",
      dataIndex: "network_name",
      key: "network_name",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "network_name",
        "Network Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "subnet",
        "Subnet",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "No. of Devices",
      dataIndex: "no_of_devices",
      key: "no_of_devices",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "no_of_devices",
        "No. of Devices",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Scan Status",
      dataIndex: "scan_status",
      key: "scan_status",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "scan_status",
        "Scan Status",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Excluded Ip Range",
      dataIndex: "excluded_ip_range",
      key: "excluded_ip_range",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "excluded_ip_range",
        "Excluded Ip Range",
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

      ...getColumnSearchProps(
        "creation_date",
        "Creation Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),
    },
    {
      title: "Modification Date",
      dataIndex: "modification_date",
      key: "modification_date",

      ...getColumnSearchProps(
        "modification_date",
        "Modification Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),
    },
  ];

  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    columnWidth: 40,
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: !configData?.atom.pages.atom.read_only,
    }),
  };

  return (
    <SpinLoading spinning={onBoardLoading} tip="Loading...">
      <AddAtomStyledButton
        onClick={showModal}
        disabled={!configData?.atom.pages.atom.read_only}
        style={{
          marginRight: "30px",
          float: "right",
          borderRadius: "8px",
        }}
      >
        + Add Network
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
          {/* <OnBoardStyledButton
            onClick={handleOnboard}
            style={{ fontSize: "14px" }}
            disabled={!configData?.atom.pages.atom.read_only}
          >
            + On Board
          </OnBoardStyledButton> */}
          {selectedRowKeys.length > 0 ? (
            <DeleteButton onClick={deleteRow}>
              <img src={trash} width="18px" height="18px" alt="" />
              &nbsp;Delete
            </DeleteButton>
          ) : null}
          <div style={{ marginTop: "10px" }}>
            <h5
              style={{
                float: "right",
                marginRight: "20px",
              }}
            >
              Col : <b style={{ color: "#66B127" }}>7</b>
            </h5>
            <h5
              style={{
                marginLeft: "10px",
                float: "right",
                marginRight: "20px",
              }}
            >
              Row : <b style={{ color: "#66B127" }}>{rowCount}</b>
            </h5>
          </div>
        </div>

        <div style={{ float: "right", display: "flex", marginTop: "15px" }}>
          <StyledExportButton
            onClick={exportTemplate}
            style={{
              display: "flex",
            }}
          >
            <img src={tempexp} alt="" width="15px" height="15px" />
            <img src={hoverexp} alt="" width="15px" height="15px" />
            &nbsp; Export Template
          </StyledExportButton>
          <StyledExportButton
            onClick={exportSeed}
            style={{
              marginRight: "5px",
              display: "flex",
            }}
          >
            <img src={tempexp} alt="" width="15px" height="15px" />
            <img src={hoverexp} alt="" width="15px" height="15px" />
            &nbsp; Export
          </StyledExportButton>

          <div>
            <StyledImportFileInput
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              style={{ float: "right", marginRight: "30px", marginLeft: "5px" }}
              type="file"
              onChange={() => importExcel}
              ref={inputRef}
              prefix={<ImportOutlined />}
            />
          </div>
        </div>
      </div>
      <br />
      <br />
      {isModalVisible && (
        <Modal
          style={{ padding: "0px" }}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          dataSource={dataSource}
          setDataSource={setDataSource}
          excelData={excelData}
          checkAtom={checkAtom}
          setRowCount={setRowCount}
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
            rowSelection={rowSelection}
            scroll={{ x: 2000 }}
            rowKey="network_id"
            columns={columns}
            dataSource={dataSource}
            style={{ width: "100%", padding: "2%" }}
          />
        </div>
      </SpinLoading>
    </SpinLoading>
  );
};

export default Atom;
