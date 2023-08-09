import React, { useState, useRef, useEffect } from "react";
import { Button, Dropdown, notification, Select } from "antd";
import Modal from "./AddAtom";
import EditModal from "./EditAtom";
import RackNameModel from "./RackNameModel";
import StaticOnBoardModal from "./StaticOnBoardModal";
import tempexp from "./assets/exp.svg";
import hoverexp from "./assets/activeexport.svg";
import trash from "./assets/trash.svg";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

import { ImportOutlined, EditOutlined } from "@ant-design/icons";
import {
  StyledImportFileInput,
  OnBoardStyledButton,
  AddAtomStyledButton,
  StyledExportButton,
  SpinLoading,
  DeleteButton,
} from "../AllStyling/All.styled.js";

import { columnSearch } from "../../utils";
import axios, { baseUrl } from "../../utils/axios";
import SiteNameModel from "./SiteNameModel";
import CustomModal from "../ReusableComponents/CustomModal/CustomModal";
import Table from "../ReusableComponents/Table/Table";
import LoadingButton from "../ReusableComponents/LoadingButton/LoadingButton";
import { AtomStyle, DiscoverTableModelStyle } from "./Dashboard.styled";
import { CheckMarkIcon, ErrorIcon, ExportIcon } from "../../svg";
import { ResponseModel } from "../ReusableComponents/ResponseModel/ResponseModel";

const DiscoverTableModel = (props) => {
  const {
    isDiscoveryItemActive,
    setDiscoverItemAcitve,
    serviceCalls,
    openSweetAlert,
    getAtomData,
  } = props;
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [configData, setConfigData] = useState(null);
  const [subnetDevices, setSubnetDevices] = useState([]);

  useEffect(() => {
    let user = localStorage.getItem("user");
    let userData = JSON.parse(user);

    let test = userData.monetx_configuration;
    const t = eval(test);
    let config = JSON.parse(t);
    setConfigData(config);
  }, []);

  let excelData = [];
  const [dataSource, setDataSource] = useState(excelData);

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );

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

  useEffect(() => {
    handleChange();
    getSubnetDevices();
  }, []);

  const handleChange = async (value) => {
    let subnets;

    if (value) {
      subnets = value;
    } else {
      subnets = "All";
    }

    await axios
      .post(`${baseUrl}/getDiscoveryForTransition`, {
        subnet: subnets,
      })
      .then((res) => {
        if (res.status == 500) {
          ResponseModel(res.response.data, "error");
        } else {
          setDataSource(res.data);
          setRowCount(res.data.length);
        }
      })
      .catch((err) => console.log("err========>", err));
  };

  const getSubnetDevices = async () => {
    await axios
      .get(`${baseUrl}/getSubnetsDropdown`)
      .then((res) => {
        setSubnetDevices(res.data);
      })
      .catch((err) => console.log(err));
  };

  const columns = [
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
      title: (
        <Select defaultValue="All" suffixIcon={"V"} onChange={handleChange}>
          {subnetDevices.map((device, index) => {
            return (
              <Select.Option key={index} value={device}>
                {device}
              </Select.Option>
            );
          })}
        </Select>
      ),
      dataIndex: "subnet",
      key: "subnet",
    },
    {
      title: "Make & Model",
      dataIndex: "make_model",
      key: "make_model",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "make_model",
        "Make & Model",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "OS Type",
      dataIndex: "os_type",
      key: "os_type",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "os_type",
        "OS Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Vendor",
      dataIndex: "vendor",
      key: "vendor",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "vendor",
        "Vendor",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  const addDevices = async () => {
    if (selectedRowKeys.length > 0) {
      await axios
        .post(`${baseUrl}/transitDicoveryData`, selectedRowKeys)
        .then((res) => {
          if (res.status == 200) {
            if (res.data.error_list.length > 0) {
              openSweetAlert(
                "Operation Perform ",
                "success",
                res.data.error_list
              );
              serviceCalls();
              setDiscoverItemAcitve(true);
            } else {
              setDiscoverItemAcitve(false);
              openSweetAlert(
                "Devices Inserted",
                "success",
                res.data.success_list
              );
              getAtomData();
            }
          }
        })
        .catch((err) => {
          console.log("err", err);
        });
    }
  };

  return (
    <CustomModal
      isModalOpen={isDiscoveryItemActive}
      setIsModalOpen={setDiscoverItemAcitve}
      width="100%"
      footer={null}
      title="Add Devices from Discovery"
    >
      <DiscoverTableModelStyle>
        <Table
          columns={columns}
          data={dataSource}
          pagination={5}
          rowSelection={rowSelection}
          rowKey="ip_address"
        />

        <article className="button-wrapper">
          <LoadingButton
            onClick={() => addDevices()}
            btnText="+ Add Device"
            disabled={selectedRowKeys.length == 0}
          />
        </article>
      </DiscoverTableModelStyle>
    </CustomModal>
  );
};

let excelData = [];
let columnFilters = {};

const Atom = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [staticRecord, setStaticRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const inputRef = useRef(null);

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
  const [staticOnBoardRecord, setStaticOnBoardRecord] = useState({});

  const [onBoardStatus, setOnBoardStatus] = useState(false);

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
              setLoading(false);
            } else {
              openSweetAlert(
                `
              Devices Deleted : ${response?.data?.success}
              Devices Not Deleted : ${response?.data?.error}
              `,
                "success",
                response?.data?.error_list
              );
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

  const exportSeed = async (data) => {
    const UpdatedExcelData = excelData.map((data) => {
      delete data.inserted;
      delete data.exception;
      delete data.updated;
      return data;
    });

    let UpdatedFilterExcelData;

    if (data == "completed") {
      UpdatedFilterExcelData = UpdatedExcelData.filter(
        (data) => data.status == 200
      );
    } else if (data == "Not Completed") {
      UpdatedFilterExcelData = UpdatedExcelData.filter(
        (data) => data.status == 500
      );
    } else {
      UpdatedFilterExcelData = UpdatedExcelData;
    }

    if (UpdatedFilterExcelData.length > 0) {
      jsonToExcel(UpdatedFilterExcelData);
    } else {
      ResponseModel("No Data Found", "error");
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
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "atom_devices");
      XLSX.writeFile(wb, "atom_devices.xlsx");
      openNotification();
    } else {
      openSweetAlert("No Data Found!", "error");
    }
  };

  const handleOnboard = async () => {
    setLoading(true);

    if (selectedRowKeys.length > 0) {
      await axios
        .post(baseUrl + "/onBoardDevice", selectedRowKeys)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            setLoading(false);
          } else {
            openSweetAlert(response.data, "success");
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
        .catch((err) => {
          console.log(err);
          openSweetAlert("Something Went Wrong!", "error");
          setLoading(false);
        });
      setLoading(false);
    } else {
      setLoading(false);
      openSweetAlert("No device is selected.!", "error");
    }
  };

  useEffect(() => {
    getAtomData();
  }, []);

  const getAtomData = async () => {
    axios
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
          getAtomData();
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

  const [isStatusDataFilter, setStatusDataFilter] = useState([]);

  useEffect(() => {
    serviceCalls();
  }, []);

  const serviceCalls = async () => {
    setLoading(true);

    try {
      const res = await axios.get(baseUrl + "/getAtoms");
      excelData = res.data;
      setDataSource(excelData);
      setStatusDataFilter(excelData);
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
    setIsEditModalVisible(true);
  };

  const StaticOnBoard = (record) => {
    setIsStaticModalVisible(true);
    setStaticOnBoardRecord(record);
  };

  const showSiteName = async (record) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getSiteBySiteName?site_name=${record.site_name}`
      );
      setSiteData(res.data);
      setSiteNameModalVisible(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  const showRackName = async (record) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseUrl}/getRacksByRackName?rack_name=${record.rack_name}`
      );
      setRackData(res.data);
      setRackNameModalVisible(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  // const [filteredInfo, setFilteredInfo] = useState("");

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
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "6%",
      render: (text, record) => {
        return (
          <span className="status-icon" title={record.message}>
            {text == 200 ? <CheckMarkIcon /> : <ErrorIcon />}
          </span>
        );
      },

      ...getColumnSearchProps(
        "status",
        "Search by 200 / 500",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),

      // filters: [
      //   {
      //     text: "true",
      //     value: "200",
      //   },
      //   {
      //     text: "false",
      //     value: "500",
      //   },
      // ],
      // filteredValue: filteredInfo.status || null,
      // onFilter: (value, record) =>
      //   setFilteredInfo(record.status.includes(value)),
      ellipsis: true,
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

  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys);

    setOnBoardStatus(selectedRows.some((obj) => obj.status === 200));
  };

  const rowSelection = {
    columnWidth: 40,
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: (record) => ({
      disabled: configData?.atom.pages.atom.read_only,
    }),
  };

  const [isDiscoveryItemActive, setDiscoverItemAcitve] = useState(false);

  const items = [
    {
      key: "1",
      label: <p onClick={() => exportSeed("all")}>All Devices</p>,
    },
    {
      key: "2",
      label: <p onClick={() => exportSeed("completed")}>Completed</p>,
    },
    {
      key: "3",
      label: <p onClick={() => exportSeed("Not Completed")}>Not Complete</p>,
    },
  ];

  return (
    <AtomStyle>
      <AddAtomStyledButton
        onClick={() => setDiscoverItemAcitve(true)}
        disabled={configData?.atom.pages.atom.read_only}
        style={{
          marginRight: "30px",
          float: "right",
          borderRadius: "8px",
        }}
      >
        + Add devices from discovery
      </AddAtomStyledButton>

      <AddAtomStyledButton
        onClick={showModal}
        disabled={configData?.atom.pages.atom.read_only}
        style={{
          marginRight: "10px",
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
            disabled={
              onBoardStatus == false || configData?.atom.pages.atom.read_only
            }
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

          <Dropdown
            menu={{
              items,
            }}
            placement="bottomLeft"
            className="export-dropdown"
          >
            <Button>
              <span className="icon">
                <ExportIcon />
              </span>
              Export
            </Button>
          </Dropdown>
          <div>
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

      {isDiscoveryItemActive && (
        <DiscoverTableModel
          isDiscoveryItemActive={isDiscoveryItemActive}
          setDiscoverItemAcitve={setDiscoverItemAcitve}
          serviceCalls={serviceCalls}
          openSweetAlert={openSweetAlert}
          getAtomData={getAtomData}
        />
      )}

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
          staticOnBoardRecord={staticOnBoardRecord}
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
          <Table
            className="atom-table"
            rowSelection={rowSelection}
            scroll={{ x: 4000 }}
            rowKey="ip_address"
            columns={columns}
            dataSource={dataSource}
            style={{ width: "100%", padding: "2%" }}
          />
        </div>
      </SpinLoading>
    </AtomStyle>
  );
};

export default Atom;
