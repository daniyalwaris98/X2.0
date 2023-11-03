import React, { useState, useEffect } from "react";
import { Table } from "antd";

import { columnSearch } from "../../../utils";
import axios, { baseUrl } from "../../../utils/axios";

import { SpinLoading, TableStyling } from "../../AllStyling/All.styled.js";

let excelData = [];
let columnFilters = {};
const index = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  let [dataSource, setDataSource] = useState(excelData);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  let [loading, setLoading] = useState(false);

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
  };

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAtoms");
        excelData = res.data;
        setDataSource(excelData);
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

        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Make & Modal",
      dataIndex: "make_modal",
      key: "make_modal",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "make_modal",
        "Make & Modal",

        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "snmp",
      dataIndex: "snmp",
      key: "snmp",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "snmp",
        "SNMP",

        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Login",
      dataIndex: "login",
      key: "login",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "login",
        "Login",

        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "WMI",
      dataIndex: "wmi",
      key: "wmi",

      ...getColumnSearchProps(
        "wmi",
        "WMI",

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
      title: "API",
      dataIndex: "api",
      key: "api",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "16px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "api",
        "API",

        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];
  return (
    <>
      <div>
        <SpinLoading spinning={loading} tip="Loading...">
          <TableStyling
            rowSelection={rowSelection}
            scroll={{ x: 2200 }}
            rowKey="ip_address"
            columns={columns}
            dataSource={dataSource}
            style={{ width: "100%", padding: "2%" }}
          />
        </SpinLoading>
      </div>
    </>
  );
};

export default index;
