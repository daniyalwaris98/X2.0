import React, { useState, useRef, useEffect } from "react";
import { notification, Spin, Table } from "antd";

import {
  TableStyling,
  StyledButton,
  StyledImportFileInput,
  HwBtnStyle,
  SpinLoading,
} from "../../AllStyling/All.styled.js";

import Modal from "./modal";
import XLSX from "xlsx";
import Swal from "sweetalert2";

import { columnSearch } from "../../../utils";
import axios, { baseUrl } from "../../../utils/axios";
import { RightSquareOutlined, EditOutlined } from "@ant-design/icons";

let columnFilters = {};
let excelData = [];

const Index = () => {
  let [loading, setLoading] = useState(false);
  let [sortedInfo, setSortedInfo] = useState(null);
  let [filteredInfo, setFilteredInfo] = useState(null);
  let [exportLoading, setExportLoading] = useState(false);
  let [syncToLoading, setSyncToLoading] = useState(false);
  let [syncFromLoading, setSyncFromLoading] = useState(false);
  let [dataSource, setDataSource] = useState(excelData);
  let [editRecord, setEditRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  let [inputValue, setInputValue] = useState("");
  const inputRef = useRef(null);

  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

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
    const serviceCalls = async () => {
      setLoading(true);

      try {
        await axios.get(baseUrl + "/getSNTC").then((response) => {
          setRowCount(response.data.length);
          setDataSource(response.data);
          excelData = response.data;
        });
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const openNotification = () => {
    notification.open({
      message: "File Exported Successfully",
    });
  };

  const handleChange = (filters, sorter, extra) => {
    setRowCount(extra.currentDataSource.length);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const postSNTP = async (seed) => {
    await axios.post(baseUrl + "/addSNTC", seed).then((res) => {
      if (res?.response?.status == 500) {
        openSweetAlert(res?.response?.data, "error");
      } else {
        setLoading(true);
        openSweetAlert(res?.data, "success");
        const promises = [];
        promises.push(
          axios.get(baseUrl + "/getSNTC").then((response) => {
            setRowCount(response.data.length);
            setDataSource(response.data);
            excelData = response.data;
            setLoading(false);
          })
        );
        return Promise.all(promises);
      }
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

      postSNTP(data);
    };
  };

  sortedInfo = sortedInfo || {};
  filteredInfo = filteredInfo || {};

  const showEditModal = () => {
    setIsModalVisible(true);
  };

  const edit = (record) => {
    setEditRecord(record);
    showEditModal();
  };

  const columns = [
    {
      title: "",
      key: "edit",
      width: "35px",

      render: (text, record) => (
        <a>
          <EditOutlined
            style={{ color: "#66A111" }}
            onClick={() => {
              edit(record);
            }}
          />
        </a>
      ),
    },
    {
      dataIndex: "pn_code",
      key: "pn_code",
      ...getColumnSearchProps(
        "pn_code",
        "Pn Code",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),

      ellipsis: true,
    },

    {
      title: "HW EOS Date",
      dataIndex: "hw_eos_date",
      key: "hw_eos_date",
      ...getColumnSearchProps(
        "hw_eos_date",
        "HW EOS Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),

      ellipsis: true,
    },
    {
      title: "HW EOL Date",
      dataIndex: "hw_eol_date",
      key: "hw_eol_date",
      ...getColumnSearchProps(
        "hw_eol_date",
        "HW EOL Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),

      ellipsis: true,
    },
    {
      title: "SW EOS Date",
      dataIndex: "sw_eos_date",
      key: "sw_eos_date",
      ...getColumnSearchProps(
        "sw_eos_date",
        "SW EOS Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),

      ellipsis: true,
    },
    {
      title: "SW EOL Date",
      dataIndex: "sw_eol_date",
      key: "sw_eol_date",
      ...getColumnSearchProps(
        "sw_eol_date",
        "SW EOL Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),

      ellipsis: true,
    },

    {
      title: "Manufacturer Date",
      dataIndex: "manufacturer_date",
      key: "manufacturer_date",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "manufacturer_date",
        "Manufacturer Date",
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
      title: "Modification Date",
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
  ].filter((item) => !item.hidden);

  const jsonToExcel = (seedData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binarySeedData = XLSX.utils.json_to_sheet(seedData);
      XLSX.utils.book_append_sheet(wb, binarySeedData, "hwlifecycle");
      XLSX.writeFile(wb, "hwlifecycle.xlsx");
      openNotification();
    } else {
      openSweetAlert("No Data Found!", "error");
    }
  };

  let excelTemplate = [
    {
      sntc_id: "123",
      pn_code: "qwe",
      hw_eos_date: "11-11-2012",
      hw_eol_date: "12-11-2012",
      sw_eos_date: "14-11-2012",
      sw_eol_date: "15-11-2012",
      rfs_date: "01-11-2012",
      manufactuer_date: "01-01-2012",
      creation_date: "11-11-2012",
      modification_date: "11-10-2012",
    },
  ];

  const exportTemplate = () => {
    templeteExportFile(excelTemplate);
  };

  const templeteExportFile = (atomData) => {
    let wb = XLSX.utils.book_new();
    let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
    XLSX.utils.book_append_sheet(wb, binaryAtomData, "hwlifecycle");
    XLSX.writeFile(wb, "hwlifecycle.xlsx");
    openNotification();
  };

  const exportSeed = async () => {
    setExportLoading(true);
    jsonToExcel(excelData);
    setExportLoading(false);
  };

  const syncTo = async () => {
    setSyncToLoading(true);
    await axios
      .get(baseUrl + "/syncToInventory")
      .then((response) => {
        setSyncToLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setSyncToLoading(false);
      });
  };

  const handleDelete = () => {
    if (selectedRowKeys.length > 0) {
      axios
        .post(baseUrl + "/deletePnCode", {
          user_ids: selectedRowKeys,
        })

        .then((res) => {
          setSelectedRowKeys([]);
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getSNTC")
              .then((response) => {
                setDataSource(response.data);
                excelData = response.data;
                setRowCount(excelData.length);
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
                setLoading(false);
              })
          );
          return Promise.all(promises);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      openSweetAlert("No Item is selected to delete.", "danger");
    }
  };

  const syncFrom = async () => {
    setSyncFromLoading(true);
    await axios
      .get(baseUrl + "/syncFromInventory")
      .then(() => {
        const promises = [];
        promises.push(
          axios.get(baseUrl + "/getSNTC").then((response) => {
            setRowCount(response.data.length);
            setDataSource(response.data);
            excelData = response.data;
            setSyncFromLoading(false);
          })
        );
        return Promise.all(promises);
      })
      .catch((err) => {
        console.log(err);
        setSyncFromLoading(false);
      });
  };

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
  };

  return (
    <div style={{ padding: "1% 2%" }}>
      <SpinLoading tip="Loading..." spinning={loading}>
        {isModalVisible && (
          <Modal
            isEditModalVisible={isModalVisible}
            setIsEditModalVisible={setIsModalVisible}
            dataSource={dataSource}
            setDataSource={setDataSource}
            excelData={excelData}
            editRecord={editRecord}
          />
        )}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 0 10px 0",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "0 0 2px 0",
          }}
        >
          <div style={{ display: "flex" }}>
            <StyledButton onClick={handleDelete} color={"#bb0a1e"}>
              <RightSquareOutlined /> &nbsp; Delete
            </StyledButton>
            &nbsp;
            <Spin spinning={syncToLoading}>
              <HwBtnStyle color={"#3bbdc2"} onClick={syncTo}>
                <RightSquareOutlined /> &nbsp; Sync To Inventory
              </HwBtnStyle>
            </Spin>
            &nbsp;
            <Spin spinning={syncFromLoading}>
              <HwBtnStyle color={"#3bbdc2"} onClick={syncFrom}>
                <RightSquareOutlined /> &nbsp; Sync From Inventory
              </HwBtnStyle>
            </Spin>
            <h3
              style={{
                marginLeft: "10px",
                marginRight: "20px",
              }}
            >
              Row :<b style={{ color: "#3D9E47" }}> {rowCount}</b>
            </h3>
            <h3
              style={{
                marginLeft: "10px",
                marginRight: "20px",
              }}
            >
              Col : <b style={{ color: "#3D9E47" }}>{columns.length - 1}</b>
            </h3>
          </div>
          <div style={{ display: "flex" }}>
            <HwBtnStyle color={"#3bbdc2"} onClick={exportTemplate}>
              <RightSquareOutlined /> &nbsp; Export Template
            </HwBtnStyle>
            &nbsp;
            <Spin spinning={exportLoading}>
              <HwBtnStyle color={"#3bbdc2"} onClick={exportSeed}>
                <RightSquareOutlined /> &nbsp; Export
              </HwBtnStyle>
            </Spin>
            &nbsp;
            <div>
              <StyledImportFileInput
                type="file"
                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                value={inputValue}
                onChange={() => importExcel}
                ref={inputRef}
              />
            </div>
          </div>
        </div>
        <div style={{ padding: "15px" }}>
          <TableStyling
            rowSelection={rowSelection}
            pagination={{
              defaultPageSize: 50,
              pageSizeOptions: [50, 100, 500, 1000],
            }}
            scroll={{ x: 2500 }}
            onChange={handleChange}
            columns={columns}
            dataSource={dataSource}
            rowKey="pn_code"
          />
        </div>
      </SpinLoading>
    </div>
  );
};

export default Index;
