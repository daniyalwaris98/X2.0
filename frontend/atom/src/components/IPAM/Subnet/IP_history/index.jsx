import React, { useState, useEffect } from "react";
import axios, { baseUrl } from "../../../../utils/axios";
import Scanned from "../../assets/Scanned.svg";
import empty from "../../assets/empty.svg";
import { Link, useNavigate } from "react-router-dom";

import {
  Row,
  Col,
  Checkbox,
  Table,
  notification,
  Spin,
  Progress,
  Button,
  Input,
} from "antd";
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
  DownOutlined,
  SmileOutlined,
  AlipayOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

import {
  TableStyling,
  StyledExportButton,
  SpinLoading,
  MainTableModal,
  MainTableMainP,
  MainTableMainDiv,
  StyledSubmitButton,
  MainTableDropDown,
  MainTableColP,
  StyledselectIpam,
  InputWrapper,
  ColRowNumberStyle,
  LinkStyled,
  IPHistoryTableStyling,
} from "../../../AllStyling/All.styled";
import { columnSearch } from "../../../../utils";
let excelData = [];
let columnFilters = {};

const index = () => {
  let [dataSource, setDataSource] = useState(excelData);
  const [mainModalVisible, setMainModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ipamDeviceLoading, setIpamDeviceLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [ip_address, setIpAddress] = useState("");
  const [device_type, setDeviceType] = useState("");
  const [password_group, setPassword_group] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [mainTableloading, setMainTableLoading] = useState(false);
  const [configData, setConfigData] = useState(null);
  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
    console.log(JSON.parse(config));
  }, []);
  const onSelectChange = (selectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(selectedRowKeys);
  };
  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );
  const rowSelection = {
    selectedRowKeys,

    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: !configData?.uam.pages.sites.read_only,
    }),
  };
  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/ipHistory");
        excelData = res.data;
        setDataSource(excelData);
        setRowCount(excelData.length);
        setMainTableLoading(false);
      } catch (err) {
        console.log(err.response);
        setMainTableLoading(false);
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
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Mac Address",
      dataIndex: "mac_address",
      key: "mac_address",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "mac_address",
        "Mac Address",
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
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "date",
        "Date",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    // {
    //   title: "Usage",
    //   dataIndex: "usage",
    //   key: "size",
    //   render: (text) => (
    //     <div
    //       style={{
    //         // textAlign: "center",
    //         // marginLeft: "20px",
    //         marginTop: "-10px",
    //         paddingRight: "55px",
    //         paddingleft: "45px",
    //       }}
    //     >
    //       <Progress
    //         strokeColor="#66B127"
    //         percent={text}
    //         size="small"
    //         status="active"
    //       />
    //     </div>
    //   ),

    //   ...getColumnSearchProps(
    //     "usage",
    //     "Usage",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },

    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (text, record) => (
    //     <p
    //       style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
    //     >
    //       {text}
    //     </p>
    //   ),
    //   // text === "Down" ? (
    //   //   <>
    //   //     <img src={empty} alt="" /> &nbsp;{" "}
    //   //     <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
    //   //   </>
    //   // ) : (
    //   //   <>
    //   //     <img src={Scanned} alt="" /> &nbsp;{" "}
    //   //     <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
    //   //   </>
    //   // ),

    //   ...getColumnSearchProps(
    //     "status",
    //     "Status",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },

    // {
    //   title: "Last Used",
    //   dataIndex: "last_used",
    //   key: "last_used",
    //   render: (text, record) => (
    //     <p
    //       style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
    //     >
    //       {text}
    //     </p>
    //   ),

    //   ...getColumnSearchProps(
    //     "last_used",
    //     "Last Used",
    //     setRowCount,
    //     setDataSource,
    //     excelData,
    //     columnFilters
    //   ),
    //   ellipsis: true,
    // },
  ];
  const [duplicateRows, setDuplicateRows] = useState([]);
  useEffect(() => {
    const checkForDuplicates = () => {
      let duplicates = [];
      for (let i = 0; i < dataSource.length; i++) {
        for (let j = i + 1; j < dataSource.length; j++) {
          if (dataSource[i].dataSource === dataSource[j].dataSource) {
            duplicates.push(i);
            duplicates.push(j);
          }
        }
      }
      setDuplicateRows(duplicates);
    };
    checkForDuplicates();
  }, []);
  console.log(duplicateRows);
  // const checkForDuplicates = () => {
  //   let duplicates = [];
  //   for (let i = 0; i < dataSource.length; i++) {
  //     for (let j = i + 1; j < dataSource.length; j++) {
  //       if (dataSource[i].data === dataSource[j].data) {
  //         duplicates.push(i);
  //         duplicates.push(j);
  //       }
  //     }
  //   }
  //   setDuplicateRows(duplicates);
  // };
  // useEffect(()=>{})
  // const checkDuplicate = (record) => {
  //   // Find if there is another record with the same name and age
  //   const duplicate = dataSource.find(
  //     (item) => item.ip_address === record.ip_address
  //     // &&
  //     // item.age === record.age &&
  //     // item.key !== record.key
  //   );
  //   console.log(duplicate);
  //   return duplicate;
  // };
  function highlightDuplicates(record, index, indent) {
    let className = "";
    if (index > 0) {
      const previousRecord = dataSource[index - 1];
      if (record.ip_address === previousRecord.ip_address) {
        className = "duplicate-row";
      }
    }
    return className;
  }
  const [duplicateData, setDuplicateData] = useState([]);

  // const checkForDuplicates = (record) => {
  //   let duplicateRows = [];
  //   // dataSource.forEach((row, index) => {
  //   //   dataSource.forEach((compareRow, compareIndex) => {

  //   const duplicate = dataSource.find(
  //     (item) => item.ip_address === record.ip_address
  //   );

  //   // if (row.ip_address === compareRow.ip_address) {

  //   duplicateRows.push(duplicate);
  //   //   }
  //   // });
  //   // });
  //   setDuplicateData(duplicateRows);
  //   console.log(duplicateRows);
  // };
  const isDuplicate = (record) => {
    const names = dataSource.map((item) => item.ip_address);
    return names.filter((name) => name === record.ip_address).length > 1;
  };
  return (
    <div style={{ marginRight: "12px", marginLeft: "12px" }}>
      <div style={{ marginRight: "15px", marginLeft: "15px" }}>
        <div style={{ float: "left" }}>
          <p
            style={{
              // marginLeft: "10px",
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
            </LinkStyled>{" "}
            /<span style={{ color: "#000" }}> IP History</span>
          </p>
        </div>
        <br />
        <br />
        <br />
        <div style={{ display: "flex", marginTop: "5px" }}>
          <h4>Rows :</h4>&nbsp;
          <ColRowNumberStyle>{rowCount}</ColRowNumberStyle>
          &nbsp;&nbsp;
          <h4>Cols :</h4>&nbsp;
          <ColRowNumberStyle>4</ColRowNumberStyle>
        </div>
        <SpinLoading spinning={mainTableloading} tip="Loading...">
          <div style={{ padding: "25px" }}>
            <IPHistoryTableStyling
              // rowSelection={rowSelection}
              //   scroll={{ x: 2000 }}
              // pagination={{ pageSize: 10 }}
              // rowKey="site_name"
              columns={columns}
              dataSource={dataSource}
              // rowClassName={highlightDuplicates}
              // rowClassName={(record, index) => {
              //   if (duplicateRows.includes(index)) {
              //     return "duplicate-row";
              //   }
              // }}

              // rowClassName={(record) =>
              //   checkForDuplicates(record) ? "duplicate-row" : ""
              // }

              rowClassName={(record, i) => {
                return isDuplicate(record)
                  ? "duplicate-row"
                  : // && i % 2 == 0
                    //   ? "even-row"
                    //   : ""
                    "";
              }}

              // rowClassName={(record) =>
              //   duplicateData.includes(record) ? "duplicate-row" : ""
              // }

              // pagination={false}
              // style={{ width: "100%" }}
            />
          </div>
        </SpinLoading>
      </div>
    </div>
  );
};

export default index;
