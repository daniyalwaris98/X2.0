import React, { useState, useEffect } from "react";
import axios, { baseUrl } from "../../../../utils/axios";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import myexport from "../../assets/export.svg";

import "./style.css";
import { Modal, Dropdown, Menu, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import EditModal from "./EditModal";
import {
  TableStyling,
  SpinLoading,
  ColRowNumberStyle,
  LinkStyled,
  StyledExportButton,
} from "../../../AllStyling/All.styled";
import { getColumnSearchProps } from "./Filter.jsx";
import { ExportButtonStyle } from "./Input.styled";
import { ExportIcon } from "../../../../svg";
let excelData = [];
let columnFilters = {};
let ipexcelData = [];

const index = () => {
  const data = useLocation();
  const [ipTableloading, setipTableLoading] = useState(false);

  let [dataSource, setDataSource] = useState(excelData);
  let [ipDataSource, setIpDataSource] = useState(ipexcelData);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = async (ipAddress) => {
    setIsModalOpen(true);
    setipTableLoading(true);

    try {
      const res = await axios.post(baseUrl + "/getHistoryFromIpInIpDetails", {
        ip_address: ipAddress,
      });

      ipexcelData = res.data;
      setIpDataSource(ipexcelData);
      setipTableLoading(false);
    } catch (err) {
      console.log(err.response);
      setipTableLoading(false);
    }
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  delete columnFilters["open_ports"];
  delete columnFilters["subnet"];
  delete columnFilters["status"];

  if (data?.state?.subnet) {
    delete columnFilters["open_ports"];
    delete columnFilters["status"];

    columnFilters["subnet"] = data.state.subnet;
  } else if (data?.state?.open_ports) {
    delete columnFilters["status"];

    delete columnFilters["subnet"];
    columnFilters["open_ports"] = data.state.open_ports;
  } else if (data?.state?.status) {
    delete columnFilters["open_ports"];
    delete columnFilters["subnet"];
    columnFilters["status"] = data.state.status;
  } else if (data?.state?.all) {
    delete columnFilters["open_ports"];
    delete columnFilters["subnet"];
    delete columnFilters["status"];
  }

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  let [exportLoading, setExportLoading] = useState(false);

  const [rowCount, setRowCount] = useState(0);
  const [iprowCount, setipRowCount] = useState(0);
  const [mainTableloading, setMainTableLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [configData, setConfigData] = useState(null);
  useEffect(() => {
    let user = localStorage.getItem("user");
    let userData = JSON.parse(user);

    const test = userData.monetx_configuration;

    let t = eval(test);
    let config = JSON.parse(t);
    setConfigData(config);
  }, []);

  useEffect(() => {
    const ipServiceCalls = async () => {};
    ipServiceCalls();
  }, []);

  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  const customJsonToExcel = async (customData) => {
    const res = await axios.post(baseUrl + "/exportIpDetails", {
      date: customData,
    });
    if (res.data.length > 0) {
      let wb = XLSX.utils.book_new();
      let binaryAtomData = XLSX.utils.json_to_sheet(res.data);
      XLSX.utils.book_append_sheet(wb, binaryAtomData, "ip_details");
      XLSX.writeFile(wb, "ip_details.xlsx");
    } else {
      message.info("No Data Found");
    }
  };

  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getDataInIpDetails");
        excelData = res.data;
        let subnetAddress;
        let filterOpenPorts;
        let status;
        if (data.state !== null) {
          subnetAddress = data?.state?.subnet;
          filterOpenPorts = data?.state?.open_ports;
          status = data?.state?.status;
          console.log("filterOpenPorts", filterOpenPorts);

          let filteredSuggestions;
          if (subnetAddress) {
            filteredSuggestions = excelData.filter(
              (d) =>
                JSON.stringify(d["subnet"])
                  .replace(" ", "")
                  .toLowerCase()
                  .indexOf(subnetAddress.toLowerCase()) > -1
            );
          } else if (filterOpenPorts) {
            filteredSuggestions = excelData.filter(
              (d) =>
                JSON.stringify(d["open_ports"])
                  .replace(" ", "")
                  .toLowerCase()
                  .indexOf(filterOpenPorts.toLowerCase()) > -1
            );
          } else if (status) {
            filteredSuggestions = excelData.filter(
              (d) =>
                JSON.stringify(d["status"])
                  .replace(" ", "")
                  .toLowerCase()
                  .indexOf(status.toLowerCase()) > -1
            );
          }

          setRowCount(filteredSuggestions.length);
          setDataSource(filteredSuggestions);
        } else {
          setDataSource(excelData);
          setRowCount(excelData.length);
        }

        setMainTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
      }
    };
    serviceCalls();
  }, []);
  const [editRecord, setEditRecord] = useState(null);

  const edit = (record) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
  };
  const columnsIpClick = [
    {
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p
          onClick={() => showModal(record.ip_address)}
          style={{
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "ip_address",
        "IP Address",
        setipRowCount,
        setIpDataSource,
        ipexcelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <p
          style={{
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "status",
        "Status",
        setipRowCount,
        setIpDataSource,
        ipexcelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => (
        <p
          style={{
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "date",
        "Date",
        setipRowCount,
        setIpDataSource,
        ipexcelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];
  const columns = [
    {
      title: "",
      key: "edit",
      width: "2%",

      render: (text, record) => (
        <>
          {configData?.ipam.pages.ip_detail.read_only ? (
            <>
              <a>
                <EditOutlined
                  style={{ paddingLeft: "10px", color: "#66A111" }}
                />
              </a>
            </>
          ) : (
            <a
              onClick={() => {
                edit(record);
              }}
            >
              <EditOutlined style={{ paddingLeft: "10px", color: "#66A111" }} />
            </a>
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
          onClick={() => showModal(record.ip_address)}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            paddingTop: "10px",
            cursor: "pointer",
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
      title: "Subnet",
      dataIndex: "subnet",
      key: "subnet",

      render: (text, record) => (
        <p
          style={{
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            paddingTop: "10px",
          }}
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
      title: "MAC Address",
      dataIndex: "mac_address",
      key: "mac_address",
      render: (text, record) => (
        <p
          style={{
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "mac_address",
        "MAC Address",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <p
          style={{
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

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
      title: "VIP",
      dataIndex: "vip",
      key: "vip",
      render: (text, record) => (
        <p
          style={{
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "vip",
        "VIP",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Asset Tag",
      dataIndex: "asset_tag",
      key: "asset_tag",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "asset_tag",
        "Asset Tag",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Configuration Switch",
      dataIndex: "configuration_switch",
      key: "configuration_switch",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "configuration_switch",
        "Configuration Switch",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Configuration Interface",
      dataIndex: "configuration_interface",
      key: "configuration_interface",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "configuration_interface",
        "Configuration Interface",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Open Ports",
      dataIndex: "open_ports",
      key: "open_ports",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "open_ports",
        "Open Ports",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "IP => DNS",
      dataIndex: "ip_to_dns",
      key: "ip_to_dns",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "ip_to_dns",
        "IP => DNS",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "DNS => IP",
      dataIndex: "dns_to_ip",
      key: "dns_to_ip",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "dns_to_ip",
        "DNS => IP",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  const menu = (
    <Menu>
      <Menu.Item>
        <div onClick={() => customJsonToExcel("1hour")}>
          <span style={{ color: "#66b127" }}>
            <p style={{ color: "#66b127", padding: "0px", margin: "0px" }}>
              1 Hour
            </p>
          </span>
        </div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={() => customJsonToExcel("1day")}>
          <span style={{ color: "#66b127" }}>
            <p style={{ color: "#66b127", padding: "0px", margin: "0px" }}>
              1 Day
            </p>
          </span>
        </div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={() => customJsonToExcel("1week")}>
          <span style={{ color: "#66b127" }}>
            <p style={{ color: "#66b127", padding: "0px", margin: "0px" }}>
              1 Week
            </p>
          </span>
        </div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={() => customJsonToExcel("1month")}>
          <span style={{ color: "#66b127" }}>
            <p style={{ color: "#66b127", padding: "0px", margin: "0px" }}>
              1 Month
            </p>
          </span>
        </div>
      </Menu.Item>
      <Menu.Item>
        <div onClick={() => customJsonToExcel("1year")}>
          <span style={{ color: "#66b127" }}>
            <p style={{ color: "#66b127", padding: "0px", margin: "0px" }}>
              1 Year
            </p>
          </span>
        </div>
      </Menu.Item>
    </Menu>
  );
  return (
    <div style={{ marginLeft: "15px", marginRight: "15px" }}>
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
            to="/ipam/subnet/main"
          >
            Subnet
          </LinkStyled>
          / <span style={{ color: "#000" }}>IP Details</span>
        </p>
      </div>
      <br />
      <br />
      <br />
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
      <div style={{ marginRight: "15px", marginLeft: "15px" }}>
        <div style={{ display: "flex", float: "left" }}>
          <h4>Rows :</h4>&nbsp;
          <ColRowNumberStyle>{rowCount}</ColRowNumberStyle>
          &nbsp;&nbsp;
          <h4>Cols :</h4>&nbsp;
          <ColRowNumberStyle>11</ColRowNumberStyle>
        </div>
        <div style={{ float: "right", marginBottom: "10px" }}>
          <Dropdown overlay={menu}>
            <ExportButtonStyle>
              <span className="icon">
                <ExportIcon />
              </span>
              Export
            </ExportButtonStyle>
          </Dropdown>
        </div>
        <br />
        <br />
        <SpinLoading spinning={mainTableloading} tip="Loading...">
          <TableStyling
            scroll={{ x: 2500 }}
            pagination={{ pageSize: 10 }}
            columns={columns}
            dataSource={dataSource}
          />
        </SpinLoading>
      </div>
      <Modal
        title="Ip Address History"
        width="60%"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={false}
      >
        <SpinLoading spinning={ipTableloading} tip="Loading...">
          <div style={{ padding: "25px" }}>
            <TableStyling
              // rowSelection={rowSelection}
              // scroll={{ x: 2500 }}
              pagination={{ pageSize: 5 }}
              // rowKey="site_name"
              columns={columnsIpClick}
              dataSource={ipDataSource}
            />
          </div>
        </SpinLoading>
      </Modal>
    </div>
  );
};

export default index;
