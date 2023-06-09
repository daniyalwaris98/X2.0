import React, { useState, useRef, useEffect } from "react";
// import uamG from "../assets/uamG.svg";
import myexport from "../assets/export.svg";
import up from "../assets/up.svg";
import down from "../assets/down.svg";
// import UamNavigation from "../../UamNavigation";
// import Modal from "./AddDnsSeerver.jsx";
// import EditModal from "./EditLicensceModal.jsx";
// import { columnSearch } from "../../../../utils";
import { Table, notification } from "antd";
import axios, { baseUrl } from "../../../../utils/axios";
import * as XLSX from "xlsx";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
} from "@ant-design/icons";
// import message from "../assets/message.svg";
import { getColumnSearchProps } from "../../../../utils/Filter.jsx";
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
  LinkStyled,
  SpinLoading,
} from "../../../AllStyling/All.styled.js";

// import {
//   TableStyling ,TableStyle,StyledExportButton,AddAtomStyledButton
// } from "./SubBoard.styled.js";
import Swal from "sweetalert2";

let excelData = [];
let columnFilters = {};

const index = () => {
  const navigate = useNavigate();

  let [dataSource, setDataSource] = useState(excelData);
  const data = useLocation();
  console.log(data.state);

  if (data?.state?.server_name) {
    // delete columnFilters["zone_name"];
    columnFilters["server_name"] = data.state.server_name;
    console.log("object", columnFilters["server_name"]);
  } else {
    delete columnFilters["server_name"];
  }

  const [Name, setSiteName] = useState("");
  const [myImg, setMyImg] = useState("");
  const [myNumber, setMyNumber] = useState("");

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
  const inputRef = useRef(null);

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

    jsonToExcel(dataSource);

    setExportLoading(false);
  };

  const jsonToExcel = (atomData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "dns_zones");
      XLSX.writeFile(wb, "dns_zones.xlsx");
      // setExportLoading(false);
      openNotification();
    } else {
      openSweetAlert("No Data Found!", "error");
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
        const res = await axios.get(baseUrl + "/getAllDnsZones");

        console.log("res", res);
        excelData = res.data;
        let serverName;
        // let filterOpenPorts;
        if (data.state !== null) {
          serverName = data?.state?.server_name;
          // filterOpenPorts = data?.state?.open_ports;
          console.log("filterOpenPorts", serverName);

          let filteredSuggestions;
          if (data?.state?.server_name) {
            columnFilters["server_name"] = data?.state?.server_name;

            filteredSuggestions = excelData.filter(
              (d) =>
                JSON.stringify(d["server_name"])
                  .replace(" ", "")
                  .toLowerCase()
                  .indexOf(serverName.toLowerCase()) > -1
            );
          }
          // else if (filterOpenPorts) {
          //   // columnFilters["open_ports"] = filterOpenPorts;

          //   filteredSuggestions = excelData.filter(
          //     (d) =>
          //       JSON.stringify(d["open_ports"])
          //         .replace(" ", "")
          //         .toLowerCase()
          //         .indexOf(filterOpenPorts.toLowerCase()) > -1
          //   );
          // }

          setRowCount(filteredSuggestions.length);
          setDataSource(filteredSuggestions);
        } else {
          setDataSource(excelData);
          setRowCount(excelData.length);
        }

        // excelData = res.data;
        // setDataSource(excelData);
        // setRowCount(excelData.length);
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
    //   width: "2%",

    //   render: (text, record) => (
    //     <a>
    //       <EditOutlined
    //         style={{ paddingRight: "50px" }}
    //         onClick={() => {
    //           edit(record);
    //         }}
    //       />
    //     </a>
    //   ),
    // },
    // {
    //   ...getColumnSearchProps(
    //     'license_id',
    //     'license_id',
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
    {
      title: "zone_name",
      dataIndex: "zone_name",
      key: "zone_name",
      render: (text, record) => (
        <p
          onClick={() => {
            navigate("/ipam/dns/records", {
              state: {
                zone_name: text,
              },
            });
          }}
          style={{
            paddingTop: "8px",
            textAlign: "left",
            paddingLeft: "15px",
            color: "#66B127",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "zone_name",
        "Zone Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "ip_address",
        "IP Address",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Zone Type",
      dataIndex: "zone_type",
      key: "zone_type",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "zone_type",
        "Zone Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Lookup Type",
      dataIndex: "lookup_type",
      key: "lookup_type",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "lookup_type",
        "Lookup Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "DNS Server",
      dataIndex: "server_name",
      key: "server_name",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "server_name",
        "DNS Server",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Server Type",
      dataIndex: "server_type",
      key: "server_type",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "server_type",
        "Server Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Zone Status",
      dataIndex: "zone_status",
      key: "zone_status",
      render: (text, record) => (
        <div>
          {text === "up" ? (
            <>
              <img src={up} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}

          {text === "down" ? (
            <>
              <img src={down} alt="" /> &nbsp;{" "}
              <span style={{ textAlign: "center" }}>{text}</span>
            </>
          ) : null}
        </div>
      ),
      ...getColumnSearchProps(
        "zone_status",
        "Zone Status",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    // {
    //   ...getColumnSearchProps(
    //     'tag_id',
    //     'tag_id',
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
      <div style={{ backgroundColor: "#FFFFFF", height: "100vh" }}>
        <div style={{ padding: "15px" }}>
          <div style={{ float: "left" }}>
            <p
              style={{
                marginLeft: "10px",
                fontWeight: "600",
                fontSize: "16px",
                color: "rgba(0,0,0,0.5)",
              }}
            >
              <LinkStyled
                style={{ color: "rgba(0,0,0,0.5)" }}
                to="/ipam/dns/main"
              >
                DNS Server
              </LinkStyled>
              / <span style={{ color: "#000" }}>DNS Zones</span>
            </p>
          </div>
          <br />
          <br />

          {/* <AddStyledButton style={{ float: "right" }} onClick={showModal}>
            + Add DNS
          </AddStyledButton> */}
          <div style={{ float: "left" }}>
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
                Col : <b style={{ color: "#3D9E47" }}> 7</b>
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
        <SpinLoading spinning={loading}>
          <div style={{ padding: "25px" }}>
            <TableStyling
              // rowSelection={rowSelection}
              scroll={{ x: 1800 }}
              // rowKey="ip_address"
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
