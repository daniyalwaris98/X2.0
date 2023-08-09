import React, { useState, useEffect } from "react";
import mylocation from "../assets/mylocation.svg";
import mydevice from "../assets/mydevices.svg";
import vendor from "../assets/vendor.svg";
import { Row, Col, Table, notification } from "antd";
import { columnSearch } from "../../../utils";
import myexport from "./assets/export.svg";
import Modal from "./AddSiteModel.jsx";
import EditModal from "./EditSiteModal.jsx";
import trash from "./assets/trash.svg";
import { useNavigate } from "react-router-dom";
import axios, { baseUrl } from "../../../utils/axios";
import MyMap from "./Map/index";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

import { EditOutlined } from "@ant-design/icons";
import {
  TableStyling,
  StyledExportButton,
  AddStyledButton,
  SpinLoading,
  CardMargin,
  DeleteButton,
} from "../../AllStyling/All.styled.js";
import SiteDeviceVender from "../FirstCard/FirstCol/SiteDeviceVender.jsx";
import Doughnut from "../FirstCard/Charts/Doughnut";
import BarChartBold from "../../ReusableComponents/Carts/BarChartBold/BarChartBold";

let excelData = [];
let columnFilters = {};

const index = () => {
  let [dataSource, setDataSource] = useState(excelData);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);

  let [exportLoading, setExportLoading] = useState(false);

  const [siteDeviceVendor, setSiteDeviceVendor] = useState([]);
  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
    console.log(JSON.parse(config));
  }, []);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllSites");
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
    const totalSites = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/totalSites");
        setSiteDeviceVendor(res.data);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    totalSites();
  }, []);

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,

    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: !configData?.uam.pages.sites.read_only,
    }),
  };

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );

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

  const postSeed = async (seed) => {
    setLoading(true);
    await axios
      .post(baseUrl + "/addSite", seed)
      .then((response) => {
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data?.response, "error");
          setLoading(false);
        } else {
          openSweetAlert("Site Added Successfully", "success");
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllSites")
              .then((response) => {
                excelData = response?.data;
                setRowCount(response?.data?.length);
                setDataSource(response?.data);
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
        console.log("error ==> " + err);
        setLoading(false);
      });
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
      width: "2%",

      render: (text, record) => (
        <>
          {!configData?.uam.pages.sites.read_only ? (
            <>
              <a disabled>
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
      title: "city",
      dataIndex: "city",
      key: "city",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

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
      title: "region",
      dataIndex: "region",
      key: "region",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "region",
        "Region",
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
      title: "latitude",
      dataIndex: "latitude",
      key: "latitude",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "latitude",
        "Latitude",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "longitude",
      dataIndex: "longitude",
      key: "longitude",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "longitude",
        "Longitude",
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
  ];

  const exportTemplate = async () => {
    jsonToExcel(seedTemp);
    openNotification();
  };

  const jsonToExcel = (atomData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "sites");
      XLSX.writeFile(wb, "sites.xlsx");
      openNotification();
    } else {
      openSweetAlert("No Data Found!", "danger");
    }
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

  const imgFun = (myimg) => {
    if (myimg === "Sites") {
      return mylocation;
    } else if (myimg === "Devices") {
      return mydevice;
    } else {
      return vendor;
    }
  };
  const nameFun = (name) => {
    if (name === "Sites") {
      navigate("/uam/sites");
    } else if (name === "Devices") {
      navigate("/uam/devices");
    } else if (name === "Vendors") {
      return vendor;
    }
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
          .post(baseUrl + "/deleteSite ", selectedRowKeys)
          .then((response) => {
            console.log("deleteSite", response);

            if (response?.response?.status == 500) {
              openSweetAlert(response?.response?.data, "error");
            } else {
              openSweetAlert(response?.data, "success");
              const promises = [];
              promises.push(
                axios
                  .get(baseUrl + "/getAllSites")
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
        openSweetAlert("Something Went Wrong!", "error");

        console.log(err);
      }
    } else {
      openSweetAlert(`No Site Selected`, "error");
    }
  };
  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div style={{ backgroundColor: "#fff", height: "100%" }}>
        <Row
          style={{
            marginTop: "5px",
            marginRight: "15px",
            marginLeft: "15px",
          }}
        >
          <Col xs={{ span: 24 }} md={{ span: 9 }} lg={{ span: 3 }}>
            <div
              style={{
                marginRight: "10px",
                marginLeft: "10px",
                borderRadius: "12px",
              }}
            >
              <div>
                <SpinLoading spinning={loading} tip="Loading...">
                  {siteDeviceVendor &&
                    siteDeviceVendor.map((item, index) => (
                      <CardMargin
                        key={index}
                        onClick={() => nameFun(item.name)}
                        style={{ cursor: "pointer" }}
                        marginBottom={index !== 2}
                      >
                        <SiteDeviceVender
                          Name={item.name}
                          myImg={imgFun(item.name)}
                          myNumber={item.value}
                        />
                      </CardMargin>
                    ))}
                </SpinLoading>
              </div>
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 15 }} lg={{ span: 6 }}>
            <div
              style={{
                marginRight: "5px",
                marginRight: "10px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",

                marginBottom: "45px",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #6C6B75",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  paddingTop: "8px",
                  fontWeight: "bold",
                }}
              >
                Data Center Status
              </h3>
              <div
                style={{
                  width: "100%",
                  textAlign: "center",
                  margin: "0 auto",
                  marginTop: "35px",
                  marginBottom: "15px",
                  height: "266px",
                }}
              >
                <Doughnut />
              </div>
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 6 }}>
            <div
              style={{
                marginRight: "10px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",

                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
                height: "260px",
              }}
            >
              <MyMap />
            </div>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }} lg={{ span: 9 }}>
            <div
              style={{
                height: "100%",
                marginRight: "10px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
                border: "1px solid #e5e5e5",
                boxShadow: "0px 5px 14px rgba(28, 29, 32, 0.03)",
              }}
            >
              <h3
                style={{
                  color: "#000",
                  borderLeft: "5px solid #6C6B75",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  paddingTop: "8px",
                  fontWeight: "bold",
                }}
              >
                Top Sites
              </h3>
              <div
                style={{
                  marginTop: "20px",
                  width: "100%",
                }}
              >
                <BarChartBold endPoint="topSites" />
              </div>
            </div>
          </Col>
        </Row>
        <br />

        <div style={{ padding: "15px" }}>
          <div style={{ float: "left", display: "flex" }}>
            <AddStyledButton
              onClick={showModal}
              disabled={!configData?.uam.pages.sites.read_only}
            >
              + Add Site
            </AddStyledButton>
            {selectedRowKeys.length > 0 ? (
              <DeleteButton onClick={deleteRow}>
                <img src={trash} width="18px" height="18px" alt="" />
                &nbsp;Delete
              </DeleteButton>
            ) : null}
            &nbsp;
            <div style={{ display: "flex", marginTop: "3px" }}>
              <h3
                style={{
                  marginLeft: "10px",
                  marginRight: "20px",
                }}
              >
                Col : <b style={{ color: "#3D9E47" }}>8</b>
              </h3>
              <h3
                style={{
                  marginLeft: "10px",
                  marginRight: "20px",
                }}
              >
                Row :<b style={{ color: "#3D9E47" }}> {rowCount}</b>
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
        <SpinLoading spinning={loading}>
          <div style={{ padding: "25px" }}>
            <TableStyling
              rowSelection={rowSelection}
              scroll={{ x: 2430 }}
              rowKey="site_id"
              columns={columns}
              dataSource={dataSource}
              style={{ width: "100%", padding: "2%" }}
            />
          </div>
        </SpinLoading>
      </div>
    </div>
  );
};

export default index;
