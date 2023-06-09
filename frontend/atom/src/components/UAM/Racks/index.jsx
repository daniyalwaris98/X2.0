import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Table, Spin, notification } from "antd";
import Modal from "./AddRackModal.jsx";
import EditModal from "./EditRackModal.jsx";

import devices from "./assets/devices.svg";
import racks from "./assets/racks.svg";
import unit from "./assets/unit.svg";
import myexport from "../Sites/assets/export.svg";
import axios, { baseUrl } from "../../../utils/axios";
import MyMap from "./Map/index";
import { columnSearch } from "../../../utils";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { EditOutlined } from "@ant-design/icons";

import RackDeviceUnits from "./RackDeviceUnits";
import RackDetails from "./RackDetails";
import {
  TableStyling,
  StyledExportButton,
  AddStyledButton,
  SpinLoading,
  DeleteButton,
} from "../../AllStyling/All.styled.js";
import trash from "./assets/trash.svg";

let excelData = [];
let columnFilters = {};

const index = () => {
  const navigate = useNavigate();
  let [dataSource, setDataSource] = useState(excelData);
  let [topRacksdataSource, setTopRacksDataSource] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);

  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);

  const [configData, setConfigData] = useState(null);

  const [rackDeviceUnit, setRackDeviceUnit] = useState([]);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/getAllRacks");
        console.log("rees", res);
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
    const totalRacks = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/totalRacks");
        console.log("totalRacks", res);
        setRackDeviceUnit(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    totalRacks();
  }, []);

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
    jsonToExcel(excelData);
  };

  const jsonToExcel = (atomData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "racks");
      XLSX.writeFile(wb, "racks.xlsx");
      openNotification();
      //
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

  const postSeed = async (seed) => {
    setLoading(true);
    await axios
      .post(baseUrl + "/addDevice", seed)
      .then((response) => {
        console.log("hahahehehoho");
        console.log(response.status);
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data?.response, "error");
          setLoading(false);
        } else {
          openSweetAlert("Site Added Successfully", "success");
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllRacks")
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

  const columnsTopRack = [
    {
      title: "Site Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <a
          style={{
            color: "#263238",
            paddingLeft: "12px",
            fontWeight: "400",
            paddingLeft: "15px",
          }}
        >
          {text}
        </a>
      ),
    },

    {
      title: "Number of Racks",
      dataIndex: "value",
      key: "value",
      render: (text) => (
        <a style={{ color: "#263238", fontWeight: "400", paddingLeft: "15px" }}>
          {text}
        </a>
      ),
    },
  ];

  useEffect(() => {
    const deviceInformation = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/topRacks");
        console.log("deviceInformation", res);
        setTopRacksDataSource(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    deviceInformation();
  }, []);
  const nameFun = (name) => {
    if (name === "Sites") {
      navigate("/uam/sites");
    } else if (name === "Devices") {
      navigate("/uam/devices");
    } else if (name === "Vendors") {
      return vendor;
    }
  };

  const columns = [
    {
      title: "",
      key: "edit",
      width: "2%",

      render: (text, record) => (
        <>
          {!configData?.uam.pages.racks.read_only ? (
            <>
              <a
                disabled
                // onClick={() => {
                //   edit(record);
                // }}
              >
                <EditOutlined style={{ paddingRight: "50px" }} />
              </a>
            </>
          ) : (
            <a
              onClick={() => {
                edit(record);
              }}
            >
              <EditOutlined
                style={{ paddingRight: "50px", color: "#66A111" }}
              />
            </a>
          )}
        </>
      ),
    },
    {
      title: "rack_name",
      dataIndex: "rack_name",
      key: "rack_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

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
      title: "site_name",
      dataIndex: "site_name",
      key: "site_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "site_name",
        "Site Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      key: "brand",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "brand",
        "Brand",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

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
    {
      title: "rack_model",
      dataIndex: "rack_model",
      key: "rack_model",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "rack_model",
        "Rack Modal",
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
      title: "ru",
      dataIndex: "ru",
      key: "ru",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "ru",
        "RU",
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
      title: "height",
      dataIndex: "height",
      key: "height",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "height",
        "Height",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "width",
      dataIndex: "width",
      key: "width",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "width",
        "Width",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    // {
    //   title: "depth",
    //   dataIndex: "depth",
    //   key: "depth",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "depth",
    //     "Depth",
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

    // {
    //   title: "total_count",
    //   dataIndex: "total_count",
    //   key: "total_count",
    //   render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

    //   ...getColumnSearchProps(
    //     "total_count",
    //     "Total Count",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
  ];

  const deleteRow = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        //console.log(device);
        await axios
          .post(baseUrl + "/deleteRack", selectedRowKeys)
          .then((response) => {
            if (response?.response?.status == 500) {
              openSweetAlert(response?.response?.data, "error");
            } else {
              openSweetAlert(response?.data, "success");

              const promises = [];
              promises.push(
                axios
                  .get(baseUrl + "/getAllRacks")
                  .then((response) => {
                    console.log(response.data);
                    excelData = response.data;
                    setDataSource(response.data);
                    setRowCount(response.data.length);
                    // excelData = response.data;
                    setSelectedRowKeys([]);

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
      openSweetAlert(`No Rack Selected`, "error");
    }
  };

  const imgFun = (myimg) => {
    if (myimg === "Racks") {
      return racks;
    } else if (myimg === "Devices") {
      return devices;
    } else {
      return unit;
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#f1f5f5",
          height: "100%",
          marginBottom: "15px",
        }}
      >
        <Row
          style={{
            padding: "10px",
            marginTop: "5px",
            marginRight: "15px",
            marginLeft: "15px",
          }}
        >
          <Col
            xs={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 3 }}
            // xl={{ span: 2 }}
          >
            <div
              style={{
                // display: "flex",
                height: "100%",
                marginRight: "10px",
                borderRadius: "12px",
                //   backgroundColor: "#fcfcfc",
              }}
            >
              <SpinLoading spinning={loading}>
                {rackDeviceUnit.map((item, index) => (
                  <div
                    key={index}
                    style={{ marginBottom: "5px", cursor: "pointer" }}
                    onClick={() => nameFun(item.name)}
                  >
                    <RackDeviceUnits
                      Name={item.name}
                      myImg={imgFun(item.name)}
                      myNumber={item.value}
                    />
                  </div>
                ))}
              </SpinLoading>
            </div>
          </Col>

          <Col
            xs={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 10 }}
            // xl={{ span: 2 }}
          >
            <div
              style={{
                // display: "flex",

                height: "317px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                marginRight: "10px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #6C6B75",
                  borderTopLeftRadius: "6px",

                  alignItems: "center",
                  // marginLeft: "2px",
                  paddingLeft: "16px",
                  paddingTop: "10px",
                  fontWeight: "bold",
                }}
              >
                Top Racks
              </h3>
              <SpinLoading spinning={loading}>
                <TableStyling
                  columns={columnsTopRack}
                  pagination={{ pageSize: 4 }}
                  dataSource={topRacksdataSource}
                  // style={{ padding: "0px" }}
                />
              </SpinLoading>
            </div>
          </Col>
          <Col
            xs={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 11 }}
            // xl={{ span: 2 }}
          >
            <div
              style={{
                // display: "flex",
                height: "322px",
                overflowY: "scroll",
                marginRight: "10px",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #6C6B75",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "16px",
                  alignItems: "center",
                  paddingTop: "8px",
                  // marginLeft: "1px",
                  marginTop: "4px",
                  fontWeight: "bold",
                }}
              >
                Racks Details
              </h3>
              <div style={{ padding: "15px", margin: "0 auto" }}>
                <RackDetails dataSource={dataSource} />
              </div>
            </div>
          </Col>
        </Row>

        <div style={{ padding: "15px" }}>
          <div style={{ float: "left", display: "flex" }}>
            <AddStyledButton
              onClick={showModal}
              disabled={!configData?.uam.pages.racks.read_only}
            >
              + Add Rack
            </AddStyledButton>
            {selectedRowKeys.length > 0 ? (
              <DeleteButton onClick={deleteRow}>
                <img src={trash} width="18px" height="18px" alt="" />
                &nbsp;Delete
              </DeleteButton>
            ) : null}
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
                Col : <b style={{ color: "#3D9E47" }}> 12</b>
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
            width={1000}
            style={{ padding: "40px", marginTop: "-60px" }}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            dataSource={dataSource}
            setDataSource={setDataSource}
            excelData={excelData}
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
              scroll={{ x: 3000 }}
              rowKey="rack_name"
              columns={columns}
              dataSource={dataSource}
              style={{ width: "100%", padding: "2%" }}
            />
          </div>
        </SpinLoading>
      </div>
    </>
  );
};

export default index;
