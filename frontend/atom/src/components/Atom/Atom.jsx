import React, { useState, useRef, useEffect } from "react";
import { Button, Table, notification } from "antd";
import Modal from "./AddAtom";
import EditModal from "./EditAtom";
import RackNameModel from "./RackNameModel";
import StaticOnBoardModal from "./StaticOnBoardModal";
import tempexp from "./assets/exp.svg";
import hoverexp from "./assets/activeexport.svg";
import trash from "./assets/trash.svg";

import { ImportOutlined, EditOutlined } from "@ant-design/icons";
import {
  TableStyling,
  StyledImportFileInput,
  OnBoardStyledButton,
  AddAtomStyledButton,
  StyledExportButton,
  SpinLoading,
  DeleteButton,
} from "../AllStyling/All.styled.js";

import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { columnSearch } from "../../utils";

import axios, { baseUrl } from "../../utils/axios";
import SiteNameModel from "./SiteNameModel";

let excelData = [];
let columnFilters = {};

const Atom = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [staticRecord, setStaticRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const inputRef = useRef(null);

  const [onBoardLoading, setOnboardLoading] = useState(false);

  let [dataSource, setDataSource] = useState(excelData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isStaticModalVisible, setIsStaticModalVisible] = useState(false);
  let [loading, setLoading] = useState(false);
  let [inputValue, setInputValue] = useState("");
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [siteData, setSiteData] = useState(null);
  const [rackData, setRackData] = useState(null);

  const [rackNameModalVisible, setRackNameModalVisible] = useState(false);
  const [siteNameModalVisible, setSiteNameModalVisible] = useState(false);
  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    let user = localStorage.getItem("user");
    let userData = JSON.parse(user);

    let test = userData.monetx_configuration;
    const t = eval(test);
    let config = JSON.parse(t);
    setConfigData(config);
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
  const checkFilter = () => {
    columnFilters.ip_address = "";
  };

  const openSweetAlert = (title, type, errors) => {
    console.log("errors==============>", errors);

    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
      html:
        errors &&
        `<article>${errors.map((err, index) => {
          return `<p key=${index}>${err}</p>`;
        })}</article>`,
    });
  };

  const deleteRow = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        await axios
          .post(baseUrl + "/deleteAtom", selectedRowKeys)
          .then((response) => {
            if (response?.response?.status == 500) {
              openSweetAlert(response?.response?.data, "error");
              setOnboardLoading(false);
            } else {
              openSweetAlert(`Atom Deleted Successfully`, "success");
              const promises = [];
              promises.push(
                axios
                  .get(baseUrl + "/getAtoms")
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

    jsonToExcel(excelData);
    // openNotification();
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
      ip_address: "000.000.000.000",

      site_name: "hjk",
      rack_name: "wetr",
      device_name: "oiuyt",
      device_ru: "0",
      department: "hjg",
      section: "ghchg",

      function: "abkkkcf",
      virtual: "dfghcg",
      device_type: "asddxvcert",
      password_group: "asssjndfg",
    },
  ];

  const exportTemplate = () => {
    templeteExportFile(seedTemp);
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
      openSweetAlert("No Data Found!", "error");
    }
  };

  const handleOnboard = async () => {
    setOnboardLoading(true);

    if (selectedRowKeys.length > 0) {
      await axios
        .post(baseUrl + "/onBoardDevice", selectedRowKeys)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            setOnboardLoading(false);
          } else {
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAtoms")
                .then((response) => {
                  openSweetAlert(`Devices Onboarded Successfully`, "success");

                  excelData = response.data;
                  setDataSource(response.data);
                  setRowCount(response.data.length);

                  setOnboardLoading(false);
                })
                .catch((error) => {
                  console.log(error);

                  setOnboardLoading(false);
                })
            );
            return Promise.all(promises);
          }
        })
        .catch((err) => {
          console.log(err);
          openSweetAlert("Something Went Wrong!", "error");
          setLoading(false);
        });
      setLoading(false);
    } else {
      setOnboardLoading(false);
      openSweetAlert("No device is selected.!", "error");
    }
  };

  const postSeed = async (seed) => {
    setLoading(true);
    await axios
      .post(baseUrl + "/addAtomDevices", seed)
      .then((response) => {
        if (response?.status == 200) {
          openSweetAlert(
            `Successfull Atoms: ${response?.data?.success} 
             Failed Atoms : ${response?.data?.error}       
             `,
            "success",
            response?.data?.error_list
          );

          setLoading(true);
          return axios
            .get(baseUrl + "/getAtoms")
            .then((response) => {
              excelData = response?.data;
              setRowCount(response?.data?.length);
              setDataSource(response?.data);
              setLoading(false);
            })
            .catch((error) => {
              console.log(error);

              setLoading(false);
            });
        } else {
          openSweetAlert(response?.response?.data, "error");

          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("error ==>======>=======> " + err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAtoms");
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
    setIsEditModalVisible(true);
  };

  const StaticOnBoard = () => {
    setIsStaticModalVisible(true);
  };

  const showSiteName = async (record) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getSiteBySiteName?site_name=${record.site_name}`
      );
      console.log(res.data);
      setSiteData(res.data);
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
      width: "1%",

      render: (text, record) => (
        <>
          {configData?.atom.pages.atom.read_only ? (
            <>
              <p
                style={{
                  color: "#66B127",
                  textDecoration: "underline",
                  fontWeight: "400",
                  textAlign: "center",

                  cursor: "no-drop",
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
      title: "",
      key: "edit",
      width: "1%",

      render: (text, record) => (
        <>
          {configData?.atom.pages.atom.read_only ? (
            <>
              <p
                style={{
                  color: "#66B127",
                  textDecoration: "underline",
                  fontWeight: "400",
                  textAlign: "center",
                  cursor: "no-drop",
                }}
                disabled
              >
                S
              </p>
            </>
          ) : (
            <p
              style={{
                color: "#66B127",
                textDecoration: "underline",
                fontWeight: "400",
                textAlign: "center",
                paddingTop: "15px",
                cursor: "pointer",
              }}
              onClick={() => {
                StaticOnBoard(record);
              }}
            >
              S
            </p>
          )}
        </>
      ),
    },

    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "ip_address",
        "Ip Address",
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
      render: (text, record) => (
        <p
          style={{ textAlign: "left", marginLeft: "12px", paddingTop: "16px" }}
        >
          {text}
        </p>
      ),

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
      title: "Device Type",
      dataIndex: "device_type",
      key: "device_type",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "device_type",
        "Device Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "OnBoard Status",
      dataIndex: "onboard_status",
      key: "onboard_status",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "onboard_status",
        "OnBoard Status",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Function",
      dataIndex: "function",
      key: "function",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "function",
        "Function",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Site Name",
      dataIndex: "site_name",
      key: "site_name",

      ...getColumnSearchProps(
        "site_name",
        "Site Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
      render: (text, record) => (
        <p
          style={{
            color: "#66B127",
            textDecoration: "underline",
            fontWeight: "400",
            textAlign: "center",
            cursor: "pointer",
            paddingTop: "16px",
          }}
          onClick={() => {
            showSiteName(record);
          }}
        >
          {text}
        </p>
      ),
    },
    {
      title: "Rack Name",
      dataIndex: "rack_name",
      key: "rack_name",
      render: (text, record) => (
        <p
          style={{
            color: "#66B127",
            textDecoration: "underline",
            fontWeight: "400",
            textAlign: "center",
            cursor: "pointer",
            paddingTop: "16px",
          }}
          onClick={() => {
            showRackName(record);
          }}
        >
          {text}
        </p>
      ),
      ...getColumnSearchProps(
        "rack_name",
        "Rack Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Password Group",
      dataIndex: "password_group",
      key: "password_group",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
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
      title: "Device RU",
      dataIndex: "device_ru",
      key: "device_ru",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "device_ru",
        "Device RU",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "department",
        "Department",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Section",
      dataIndex: "section",
      key: "section",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "section",
        "Section",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Virtual",
      dataIndex: "virtual",
      key: "virtual",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "virtual",
        "Virtual",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    columnWidth: 40,
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: configData?.atom.pages.atom.read_only,
    }),
  };

  return (
    <SpinLoading spinning={onBoardLoading} tip="Loading...">
      <AddAtomStyledButton
        onClick={showModal}
        disabled={configData?.atom.pages.atom.read_only}
        style={{
          marginRight: "30px",
          float: "right",
          borderRadius: "8px",
        }}
      >
        + Add Atom
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
            style={{ fontSize: "14px" }}
            disabled={configData?.atom.pages.atom.read_only}
          >
            + On Board
          </OnBoardStyledButton>
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
                borderLeft: "1px solid #ddd",
                paddingLeft: "12px",
              }}
            >
              Col : <b style={{ color: "#66B127" }}>14</b>
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
          <div style={{}}>
            <StyledImportFileInput
              disabled={configData?.atom.pages.atom.read_only}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              style={{
                float: "right",
                marginRight: "30px",
                marginLeft: "5px",

                cursor: configData?.atom.pages.atom.read_only
                  ? "no-drop"
                  : "pointer",
              }}
              type="file"
              value={inputValue}
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
          checkAtom={checkAtom}
          checkFilter={checkFilter}
          editRecord={editRecord}
          setSearchText={setSearchText}
          setSearchedColumn={setSearchedColumn}
          centered={true}
        />
      )}
      {isStaticModalVisible && (
        <StaticOnBoardModal
          style={{ padding: "0px" }}
          isStaticModalVisible={isStaticModalVisible}
          setIsStaticModalVisible={setIsStaticModalVisible}
          dataSource={dataSource}
          setDataSource={setDataSource}
          excelData={excelData}
          setRowCount={setRowCount}
          staticRecord={staticRecord}
          centered={true}
        />
      )}
      {siteNameModalVisible && (
        <SiteNameModel
          siteNameModalVisible={siteNameModalVisible}
          setSiteNameModalVisible={setSiteNameModalVisible}
          dataSource={siteData}
        />
      )}
      {rackNameModalVisible && (
        <RackNameModel
          rackNameModalVisible={rackNameModalVisible}
          setRackNameModalVisible={setRackNameModalVisible}
          dataSource={rackData}
        />
      )}
      <SpinLoading spinning={loading} tip="Loading...">
        <div style={{ padding: "25px" }}>
          <TableStyling
            rowSelection={rowSelection}
            scroll={{ x: 4000 }}
            rowKey="ip_address"
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
