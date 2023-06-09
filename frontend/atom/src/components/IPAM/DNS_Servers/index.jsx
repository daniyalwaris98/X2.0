import React, { useState, useEffect } from "react";
import ip from "../assets/ipicon.svg";
import bar from "../assets/bar.svg";
import { Pie } from "react-chartjs-2";
import "chartjs-plugin-zoom";

import { TableStyling, StyledButtonipCh } from "../../AllStyling/All.styled.js";
import { EditOutlined } from "@ant-design/icons";
import { columnSearch } from "../../../utils";
import { Table } from "antd";

let excelData = [];
let columnFilters = {};

const index = () => {
  let [dataSource, setDataSource] = useState(excelData);

  const [show, setShow] = useState(true);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [configData, setConfigData] = useState(null);

  const [buttonName, setButtonName] = useState("IP Address View");

  const showTable = (myButton) => {
    if (myButton === "IP Address View") {
      setButtonName(myButton);
    } else if (myButton === "Chart View") {
      setButtonName("Chart View");
    }
  };

  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
    console.log(JSON.parse(config));
  }, []);

  useEffect(() => {
    const serviceCalls = async () => {
      try {
        const res = await axios.get(baseUrl + "/getAllSites");
        excelData = res.data;
        setDataSource(excelData);
      } catch (err) {
        console.log(err.response);
      }
    };
    serviceCalls();
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
      disabled: !configData?.uam.pages.sites.read_only,
    }),
  };

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );

  dataSource = [
    {
      key: "1",
      address: "10.129.91.1",
      status: "Available",
      mac: "",
      vendor: "",
      scope_name: "10.129.91.0/24",
      host_name: "localhost",
    },
    {
      key: "1",
      address: "10.129.92.1",
      status: "Available",
      mac: "",
      vendor: "",
      scope_name: "10.129.91.0/24",
      host_name: "localhost",
    },
    {
      key: "1",
      address: "10.129.93.1",
      status: "Available",
      mac: "",
      vendor: "",
      scope_name: "10.129.91.0/24",
      host_name: "localhost",
    },
    {
      key: "1",
      address: "10.129.94.1",
      status: "Available",
      mac: "",
      vendor: "",
      scope_name: "10.129.91.0/24",
      host_name: "localhost",
    },
    {
      key: "1",
      address: "10.129.95.1",
      status: "Available",
      mac: "",
      vendor: "",
      scope_name: "10.129.91.0/24",
      host_name: "localhost",
    },
    {
      key: "1",
      address: "10.129.96.1",
      status: "Available",
      mac: "",
      vendor: "",
      scope_name: "10.129.91.0/24",
      host_name: "localhost",
    },
    {
      key: "1",
      address: "10.129.97.1",
      status: "Available",
      mac: "",
      vendor: "",
      scope_name: "10.129.91.0/24",
      host_name: "localhost",
    },
  ];

  const columns = [
    {
      title: "",
      key: "edit",
      width: "2%",

      render: (text, record) => (
        <>
          {!configData?.uam.pages.sites.read_only ? (
            <>
              <a
                disabled
                // onClick={() => {
                //   edit(record);
                // }}
              >
                <EditOutlined
                  style={{ paddingRight: "50px", color: "#66A111" }}
                />
              </a>
            </>
          ) : (
            <a>
              <EditOutlined
                style={{ paddingRight: "50px", color: "#66A111" }}
              />
            </a>
          )}
        </>
      ),
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
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
        "address",
        "Address",
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
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
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
      title: "MAC",
      dataIndex: "mac",
      key: "mac",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "mac",
        "MAC",
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
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
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
    {
      title: "Scope Name",
      dataIndex: "scope_name",
      key: "scope_name",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "scope_name",
        "Scope Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Host Name",
      dataIndex: "host_name",
      key: "host_name",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "host_name",
        "Host Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  const ChartPage = () => {
    showTable("Chart View");

    setShow(false);
  };

  const IpPage = () => {
    showTable("IP Address View");

    setShow(true);
  };
  return (
    <div style={{ margin: "7px", height: "100vh" }}>
      <div style={{ display: "flex" }}>
        <StyledButtonipCh
          active={"IP Address View" === buttonName}
          onClick={IpPage}
          style={{
            fontSize: "14px",
            padding: "10px",
            // backgroundColor: "#71B626",
            borderRadius: "8px",
            fontWeight: "600",
            // color: "white",
            border: "none",
            border: "1px solid #0000001A",

            cursor: "pointer",
          }}
        >
          <img src={ip} alt="" width="30px" height="30px" /> IP Address View
        </StyledButtonipCh>
        &nbsp;&nbsp;
        <StyledButtonipCh
          active={"Chart View" === buttonName}
          onClick={ChartPage}
          style={{
            fontSize: "14px",
            padding: "10px",
            // backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            fontWeight: "600",
            // color: "#8B8B8B",
            paddingRight: "25px",
            paddingLeft: "25px",
            border: "1px solid #0000001A",
            cursor: "pointer",
          }}
        >
          <img src={bar} alt="" width="20px" height="20px" /> Chart View
        </StyledButtonipCh>
      </div>
      {show ? (
        <>
          <TableStyling
            rowSelection={rowSelection}
            // scroll={{ x: 2430 }}
            pagination={{ pageSize: 14 }}
            rowKey="site_name"
            columns={columns}
            dataSource={dataSource}
            // pagination={false}
            style={{ width: "100%" }}
          />
        </>
      ) : (
        <>
          <div style={{ marginTop: "60px", width: "80%", height: "360px" }}>
            <Pie
              data={{
                labels: [
                  "Available IP addresses",
                  "Reserved IP addresses",
                  "Used IP addresses",
                  "Transient IP addresses",
                ],
                // labels: Object.keys(dcs),
                datasets: [
                  {
                    label: "# of Values",
                    backgroundColor: [
                      "#3D9E47",
                      "#6FCF97",
                      "#E2B200",
                      "#1A77F2",
                    ],
                    borderColor: "rgba(25,199,132,1)",
                    borderWidth: 1,
                    hoverOffset: 15,
                    // borderRadius: 20,
                    data: [265, 59, 80, 99],
                    // data: Object.values(dcs),
                  },
                ],
              }}
              options={{
                // cutout: "70%",

                responsive: true,
                maintainAspectRatio: false,
                layout: {
                  padding: {
                    top: 10,
                    bottom: 30,
                  },
                },
                plugins: {
                  legend: {
                    paddingBottom: 50,
                    labels: { boxWidth: 10, usePointStyle: true },

                    display: true,
                    position: "right",
                  },
                },
                // animation: {
                //   tension: {
                //     duration: 1000,
                //     easing: "linear",
                //     from: 1,
                //     to: 0,
                //     loop: true,
                //   },
                // },
                // scales: {
                //   yAxes: [
                //     {
                //       gridLines: {
                //         display: false,
                //         drawBorder: false,
                //       },
                //     },
                //   ],
                //   xAxes: [
                //     {
                //       barPercentage: 0.1,
                //       gridLines: {
                //         display: false,
                //         drawBorder: false,
                //       },
                //     },
                //   ],
                //   x: {
                //     grid: {
                //       display: false,
                //     },
                //   },
                //   y: {
                //     grid: {
                //       display: false,
                //       borderWidth: 0,
                //     },
                //   },
                // },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default index;
