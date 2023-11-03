import React, { useState, useRef, useEffect } from "react";
import myexport from "../assets/export.svg";
import Modal from "./AddDnsSeerver.jsx";
import { columnSearch } from "../../../utils";
import { Table, notification } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import * as XLSX from "xlsx";
import trash from "../assets/trash.svg";
import Swal from "sweetalert2";

import {
  TableStyling,
  StyledExportButton,
  AddStyledButton,
  SpinLoading,
  DeleteButton,
} from "../../AllStyling/All.styled.js";
import ButtonCell from "./ButtonCell";
import { useNavigate } from "react-router-dom";

let excelData = [];
let columnFilters = {};

const index = () => {
  const navigate = useNavigate();
  let [dataSource, setDataSource] = useState(excelData);

  const [singleSubnet, setSingleSubnet] = useState([]);

  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  let [exportLoading, setExportLoading] = useState(false);
  const [configData, setConfigData] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);

  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  useEffect(() => {
    let user = localStorage.getItem("user");
    let userData = JSON.parse(user);

    const test = userData.monetx_configuration;

    let t = eval(test);
    let config = JSON.parse(t);
    setConfigData(config);
  }, []);

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
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,

    getCheckboxProps: (record) => ({
      disabled:
        configData?.ipam.pages.dns_server.read_only ||
        singleSubnet?.includes(record.subnet_address),
    }),
  };

  const deleteRow = async () => {
    if (selectedRowKeys.length > 0) {
      try {
        await axios
          .post(baseUrl + "/deleteDns", selectedRowKeys)
          .then((response) => {
            openSweetAlert(`DNS Deleted Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllDnsServers")
                .then((response) => {
                  excelData = response.data;
                  setDataSource(response.data);
                  setRowCount(response.data.length);

                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);
                })
            );
            return Promise.all(promises);
          })
          .catch((error) => {
            setLoading(false);
          });
      } catch (err) {
        setLoading(false);

        console.log(err);
      }
    } else {
      openSweetAlert(`No DNS Selected`, "error");
    }
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
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "dns_server");
      XLSX.writeFile(wb, "dns_server.xlsx");

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
    serviceCalls();
  }, []);

  const serviceCalls = async () => {
    setLoading(true);

    try {
      const res = await axios.get(baseUrl + "/getAllDnsServers");
      excelData = res.data;
      setDataSource(excelData);
      setRowCount(excelData.length);
      setLoading(false);
    } catch (err) {
      console.log(err.response);
      setLoading(false);
    }
  };

  const showModal = () => {
    setEditRecord(null);
    setAddRecord(null);
    setIsModalVisible(true);
  };

  const columns = [
    {
      title: "server_name",
      dataIndex: "server_name",
      key: "server_name",
      render: (text, record) => (
        <p
          onClick={() => {
            navigate("/ipam/dns/zones", {
              state: {
                server_name: text,
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
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text, record) => (
        <p
          style={{
            paddingTop: "8px",
            textAlign: "left",
            paddingLeft: "15px",
          }}
        >
          {text}
        </p>
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
      title: "ip_address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          style={{
            paddingTop: "8px",
            textAlign: "left",
            paddingLeft: "15px",
          }}
        >
          {text}
        </p>
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
      title: "Number of Zones",
      dataIndex: "number_of_zones",
      key: "number_of_zones",
      render: (text, record) => (
        <p
          onClick={() => {
            navigate(
              "/ipam/dns/main"
              // , {
              //   // state: {
              //   //   server_name: text,
              //   // },
              // }
            );
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
        "number_of_zones",
        "Number of Zones",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (text, record) => {
        return (
          <ButtonCell
            style={{ padding: "8px" }}
            singleSubnet={singleSubnet}
            setSingleSubnet={setSingleSubnet}
            value={record.ip_address}
            setDataSource={setDataSource}
            setRowCount={setRowCount}
            excelData={excelData}
            // setToggle={setToggle}
          />
        );
      },
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
          {configData?.ipam.pages.dns_server.read_only ? (
            <AddStyledButton
              disabled
              style={{
                backgroundColor: "transparent",
                border: "1px solid #00a339",
                float: "right",
              }}
              onClick={showModal}
            >
              + Add DNS
            </AddStyledButton>
          ) : (
            <AddStyledButton style={{ float: "right" }} onClick={showModal}>
              + Add DNS
            </AddStyledButton>
          )}

          <div style={{ float: "left" }}>
            <div style={{ display: "flex", marginTop: "3px" }}>
              {selectedRowKeys.length > 0 ? (
                <DeleteButton onClick={deleteRow}>
                  <img src={trash} width="18px" height="18px" alt="" />
                  &nbsp;Delete
                </DeleteButton>
              ) : null}

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
                Col : <b style={{ color: "#3D9E47" }}> 4</b>
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
              rowSelection={rowSelection}
              // scroll={{ x: 4000 }}
              rowKey="ip_address"
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
