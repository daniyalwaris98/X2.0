import React, { useState, useRef, useEffect } from "react";
// import uamG from "../assets/uamG.svg";
import myexport from "../assets/export.svg";
import up from "../assets/up.svg";
import down from "../assets/down.svg";
// import UamNavigation from "../../UamNavigation";
// import Modal from "./AddDnsSeerver.jsx";
// import EditModal from "./EditLicensceModal.jsx";
// import { columnSearch } from "../../../../utils";
import { getColumnSearchProps } from "../../../../utils/Filter.jsx";
import { Table, notification } from "antd";
import axios, { baseUrl } from "../../../../utils/axios";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
} from "@ant-design/icons";
// import message from "../assets/message.svg";

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
  SpinLoading,
  LinkStyled,
} from "../../../AllStyling/All.styled.js";
import Swal from "sweetalert2";

let excelData = [];
let columnFilters = {};

const index = () => {
  const data = useLocation();
  if (data?.state?.zone_name) {
    columnFilters["zone_name"] = data.state.zone_name;
  } else {
    delete columnFilters["zone_name"];
  }
  let [dataSource, setDataSource] = useState(excelData);

  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  const exportSeed = async () => {
    jsonToExcel(dataSource);
  };

  const jsonToExcel = (atomData) => {
    if (rowCount !== 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(atomData);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "dns_records");
      XLSX.writeFile(wb, "dns_records.xlsx");
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

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllDnsServersRecord");

        excelData = res.data;
        let zoneName;
        if (data.state !== null) {
          zoneName = data?.state?.zone_name;
          let filteredSuggestions;
          if (zoneName) {
            columnFilters["zone_name"] = zoneName;

            filteredSuggestions = excelData.filter(
              (d) =>
                JSON.stringify(d["zone_name"])
                  .replace(" ", "")
                  .toLowerCase()
                  .indexOf(zoneName.toLowerCase()) > -1
            );
          }

          setRowCount(filteredSuggestions.length);
          setDataSource(filteredSuggestions);
          if (columnFilters["zone_name"].length === 0) {
            setDataSource(excelData);
            setRowCount(excelData.length);
          }
        } else {
          setDataSource(excelData);
          setRowCount(excelData.length);
        }
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "name",
        "Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "type",
        "Type",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Data",
      dataIndex: "data",
      key: "data",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "date",
        "Data",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Zone Name",
      dataIndex: "zone_name",
      key: "zone_name",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
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
      title: "Server Name",
      dataIndex: "server_name",
      key: "server_name",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "server_name",
        "Server Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Server IP",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p style={{ textAlign: "left", paddingLeft: "15px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "ip_address",
        "Server IP",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
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
              / <span style={{ color: "#000" }}>DNS Records</span>
            </p>
          </div>
          <br />
          <br />

          <div style={{ float: "left" }}>
            <div style={{ display: "flex", marginTop: "3px" }}>
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
                Col : <b style={{ color: "#3D9E47" }}> 6</b>
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
        {isModalVisible && (
          <Modal
            style={{ padding: "40px" }}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            dataSource={dataSource}
            setDataSource={setDataSource}
            excelData={excelData}
            setRowCount={setRowCount}
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
            centered={true}
          />
        )}
        <SpinLoading spinning={loading}>
          <div style={{ padding: "25px" }}>
            <TableStyling
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
