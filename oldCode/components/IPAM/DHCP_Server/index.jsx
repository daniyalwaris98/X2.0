import React, { useState, useEffect, useRef } from "react";
import downarrow from "../assets/downarrow.svg";
import arrow from "../assets/arrow.svg";
import show from "../assets/show.svg";
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
} from "../../AllStyling/All.styled.js";
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { columnSearch } from "../../../utils";
import { Row, Col, Checkbox, Table, notification, Spin } from "antd";
let excelData = [];
let columnFilters = {};

const index = () => {
  let [dataSource, setDataSource] = useState(excelData);

  const [Name, setSiteName] = useState("");
  const [myImg, setMyImg] = useState("");
  const [myNumber, setMyNumber] = useState("");
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const inputRef = useRef(null);
  let [exportLoading, setExportLoading] = useState(false);

  const [siteDeviceVendor, setSiteDeviceVendor] = useState([]);
  const [doughnutData, setDoughnutData] = useState([]);
  const [configData, setConfigData] = useState(null);

  const [isShown, setIsShown] = useState(true);

  const handleShowHide = (event) => {
    setIsShown((current) => !current);
  };

  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
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

  const openNotification = () => {
    notification.open({
      message: "File Exported Successfully",
    });
  };

  const edit = (record) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
  };

  dataSource = [
    {
      key: "1",
      dhcp_name: "Extravis DHCP",
      type: 32,
      ip_address: "192.168.20.251",
      no_of_scope: "4",
      ips_used: "3.56%",
      total_ips: "233",
    },
    {
      key: "1",
      dhcp_name: "Nets DHCP",
      type: 32,
      ip_address: "192.168.30.251",
      no_of_scope: "5",
      ips_used: "3.56%",
      total_ips: "233",
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
      title: "DHCP Name",
      dataIndex: "dhcp_name",
      key: "dhcp_name",
      render: (text, record) => (
        <p
          style={{
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "dhcp_name",
        "DHCP Name",
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
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
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
      title: "IP Address",
      dataIndex: "ip_address",
      key: "ip_address",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
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
      title: "No. of Scope",
      dataIndex: "no_of_scope",
      key: "no_of_scope",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "no_of_scope",
        "No. of Scope",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "% IPs Used",
      dataIndex: "ips_used",
      key: "ips_used",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "ips_used",
        "% IPs Used",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Total IPs",
      dataIndex: "total_ips",
      key: "total_ips",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "total_ips",
        "Total IPs",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  return (
    <div>
      <Row>
        {isShown ? (
          <Col xs={{ span: 5 }} md={{ span: 5 }} lg={{ span: 5 }}>
            <div
              style={{
                margin: "10px",
                padding: "15px",

                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
              }}
            >
              <div>
                <h3 style={{ float: "left" }}>FILTERS</h3>
                <h3 style={{ float: "right" }}>
                  <img
                    style={{ cursor: "pointer" }}
                    src={arrow}
                    alt=""
                    onClick={() => setIsShown(!isShown)}
                  />
                </h3>
              </div>
              <br />
              <br />
              <Checkbox.Group
                style={{
                  width: "100%",
                }}
                onChange={onChange}
              >
                <div style={{ marginBottom: "20px" }}>
                  <h4>
                    {" "}
                    <img src={downarrow} alt="" /> &nbsp;&nbsp; Location
                  </h4>
                  <div
                    style={{
                      borderLeft: "1px dashed #66B127",
                      marginLeft: "6px",
                    }}
                  >
                    <div style={{ marginLeft: "30px" }}>
                      {/* <Checkbox.Group
          style={{
            width: "100%",
          }}
          onChange={onChange}
        > */}
                      <Checkbox value="none" style={{ float: ",left" }}>
                        None
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      {/* </Checkbox.Group> */}
                    </div>
                  </div>
                </div>
                <br />
                <div style={{ marginBottom: "20px" }}>
                  <h4>
                    {" "}
                    <img src={downarrow} alt="" /> &nbsp;&nbsp; Status
                  </h4>
                  <div
                    style={{
                      borderLeft: "1px dashed #66B127",
                      marginLeft: "6px",
                    }}
                  >
                    <div style={{ marginLeft: "30px" }}>
                      {/* <Checkbox.Group
          style={{
            width: "100%",
          }}
          onChange={onChange}
        > */}
                      <Checkbox value="cisco" style={{ align: "left" }}>
                        CISCO
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
                      <Checkbox value="isc" style={{ float: "left" }}>
                        ISC
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />

                      <Checkbox value="infoblox" style={{ float: "left" }}>
                        Infoblox
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>

                      <br />

                      <Checkbox value="windows" style={{ float: "left" }}>
                        Windows
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      {/* </Checkbox.Group> */}
                    </div>
                  </div>
                  <br />
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <h4>
                    {" "}
                    <img src={downarrow} alt="" /> &nbsp;&nbsp; Status
                  </h4>
                  <div
                    style={{
                      borderLeft: "1px dashed #66B127",
                      marginLeft: "6px",
                    }}
                  >
                    <div style={{ marginLeft: "30px" }}>
                      {/* <Checkbox.Group
          style={{
            width: "100%",
          }}
          onChange={onChange}
        > */}
                      <Checkbox value="up" style={{ float: ",left" }}>
                        Up
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      {/* </Checkbox.Group> */}
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <h4>
                    {" "}
                    <img src={downarrow} alt="" /> &nbsp;&nbsp; VLAN ID
                  </h4>
                  <div
                    style={{
                      borderLeft: "1px dashed #66B127",
                      marginLeft: "6px",
                    }}
                  >
                    <div style={{ marginLeft: "30px" }}>
                      {/* <Checkbox.Group
          style={{
            width: "100%",
          }}
          onChange={onChange}
        > */}
                      <Checkbox value="vlan_none" style={{ float: ",left" }}>
                        None
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      {/* </Checkbox.Group> */}
                    </div>
                  </div>
                </div>
              </Checkbox.Group>
            </div>
          </Col>
        ) : (
          <Col xs={{ span: 1 }} md={{ span: 1 }} lg={{ span: 1 }}>
            <div
              style={{
                margin: "10px",
                padding: "15px",

                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                borderRadius: "5px",
                backgroundColor: "#fcfcfc",
                height: "100%",
              }}
            >
              <img
                src={show}
                alt=""
                onClick={() => setIsShown(!isShown)}
                style={{
                  marginLeft: "-3px",
                  fontSize: "16px",
                  color: "#71B626",
                  fontWeight: "900",
                  cursor: "pointer",
                }}
              />
            </div>
          </Col>
        )}
        {isShown === true ? (
          <Col xs={{ span: 19 }} md={{ span: 19 }} lg={{ span: 19 }}>
            <div>
              <div style={{ display: "flex", marginTop: "12px" }}>
                <h4>Rows :</h4>&nbsp;
                <h4 style={{ color: "#66B127", fontWeight: "700" }}>291</h4>
                &nbsp;&nbsp;
                <h4>Cols :</h4>&nbsp;
                <h4 style={{ color: "#66B127", fontWeight: "700" }}>6</h4>
              </div>
              <TableStyling
                rowSelection={rowSelection}
                // scroll={{ x: 2430 }}
                rowKey="site_name"
                columns={columns}
                dataSource={dataSource}
                // pagination={false}
                style={{ width: "100%" }}
              />
            </div>
          </Col>
        ) : (
          <Col xs={{ span: 23 }} md={{ span: 23 }} lg={{ span: 23 }}>
            <div>
              <div style={{ display: "flex", marginTop: "12px" }}>
                <h4>Rows :</h4>&nbsp;
                <h4 style={{ color: "#66B127", fontWeight: "700" }}>291</h4>
                &nbsp;&nbsp;
                <h4>Cols :</h4>&nbsp;
                <h4 style={{ color: "#66B127", fontWeight: "700" }}>6</h4>
              </div>
              <TableStyling
                rowSelection={rowSelection}
                // scroll={{ x: 2430 }}
                rowKey="site_name"
                columns={columns}
                dataSource={dataSource}
                // pagination={false}
                style={{ width: "100%" }}
              />
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default index;
