import React, { useState, useEffect, useRef } from "react";
import downarrow from "../assets/downarrow.svg";
import arrow from "../assets/arrow.svg";
import { useNavigate } from "react-router-dom";
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
import { Row, Col, Checkbox, Table, notification, Spin, Progress } from "antd";
let excelData = [];
let columnFilters = {};

const index = () => {
  const navigate = useNavigate();

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
    // setAddRecord(record);
    setIsEditModalVisible(true);
  };

  dataSource = [
    {
      key: "1",
      scope_name: "10.129.91.1 / 255.255.255.0",
      server_name: "192.168.20.251",
      addr_served: 32,

      mask: "255.255.255.0/24",
      enabled: "Yes",
    },
    {
      key: "1",
      scope_name: "10.129.91.2 / 255.255.255.0",
      server_name: "192.168.20.251",
      addr_served: 37,
      mask: "255.255.255.0/24",
      enabled: "Yes",
    },
    {
      key: "1",
      scope_name: "10.129.91.3 / 255.255.255.0",
      server_name: "192.168.20.251",
      addr_served: 47,
      mask: "255.255.255.0/24",
      enabled: "Yes",
    },
    {
      key: "1",
      scope_name: "10.129.91.3 / 255.255.255.0",
      server_name: "192.168.20.251",
      addr_served: 95,
      mask: "255.255.255.0/24",
      enabled: "Yes",
    },
  ];

  const ServernameClicked = () => {
    navigate("/ipam/dns_servers");
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
      title: "Scope Name",
      dataIndex: "scope_name",
      key: "scope_name",
      render: (text, record) => (
        <p
          onClick={ServernameClicked}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
            cursor: "pointer",
          }}
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
      title: "Server Name",
      dataIndex: "server_name",
      key: "server_name",
      render: (text, record) => (
        <p
          onClick={ServernameClicked}
          style={{
            color: "#66B127",
            textDecoration: "underline",
            textAlign: "center",
            paddingTop: "10px",
            paddingTop: "10px",
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
      title: "Addr. Served",
      dataIndex: "addr_served",
      key: "addr_served",
      render: (text) => (
        <div
          style={{
            // textAlign: "center",
            // marginLeft: "20px",
            marginTop: "-10px",
            paddingRight: "55px",
            paddingleft: "45px",
          }}
        >
          <Progress
            strokeColor="#66B127"
            percent={text}
            size="small"
            status="active"
          />
        </div>
      ),

      ...getColumnSearchProps(
        "addr_served",
        "Addr. Served",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Mask/CIDR",
      dataIndex: "mask",
      key: "mask",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "mask",
        "Mask/CIDR",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Enabled",
      dataIndex: "enabled",
      key: "enabled",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "enabled",
        "Enabled",
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
                onChange={onChangeScope}
              >
                <div style={{ marginBottom: "20px" }}>
                  <h4>
                    {" "}
                    <img src={downarrow} alt="" /> &nbsp;&nbsp; CIDR
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
                      <Checkbox value="22" style={{ float: "left" }}>
                        22
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
                      <Checkbox value="24" style={{ float: "left" }}>
                        24
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
                      <Checkbox value="25" style={{ float: "left" }}>
                        25
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
                      {/* </Checkbox.Group> */}
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <h4>
                    {" "}
                    <img src={downarrow} alt="" /> &nbsp;&nbsp; Enabled
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
                      <Checkbox value="yes" style={{ align: "left" }}>
                        Yes
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>25</a>
                      <br />
                      {/* <Checkbox value="isc" style={{ float: "left" }}>
                      ISC
                    </Checkbox>
                    <a style={{ float: "right" }}>5</a>
                    <br /> */}

                      {/* <Checkbox value="infoblox" style={{ float: "left" }}>
                      Infoblox
                    </Checkbox>
                    <a style={{ float: "right" }}>5</a>

                    <br />

                    <Checkbox value="windows" style={{ float: "left" }}>
                      Windows
                    </Checkbox>
                    <a style={{ float: "right" }}>5</a> */}
                      {/* </Checkbox.Group> */}
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <h4>
                    {" "}
                    <img src={downarrow} alt="" /> &nbsp;&nbsp; Failover
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
                      <Checkbox value="hot_standby" style={{ float: "left" }}>
                        Hot Standby
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
                      <Checkbox value="load_balance" style={{ float: "left" }}>
                        Load Balance
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
                      <Checkbox
                        value="not_configured"
                        style={{ float: "left" }}
                      >
                        Not Configured
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
                      {/* </Checkbox.Group> */}
                    </div>
                  </div>
                </div>
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
                <div style={{ marginBottom: "20px" }}>
                  <h4>
                    {" "}
                    <img src={downarrow} alt="" /> &nbsp;&nbsp; Server Name
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
                      <Checkbox value="eastaddc01v" style={{ float: ",left" }}>
                        EASTADDC01v
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
                      <Checkbox value="eastaddc02v" style={{ float: ",left" }}>
                        EASTADDC02v
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
                      <Checkbox value="eastaddc03v" style={{ float: ",left" }}>
                        EASTADDC03v
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
                      <Checkbox value="eastaddc04v" style={{ float: ",left" }}>
                        EASTADDC04v
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
                      {/* </Checkbox.Group> */}
                    </div>
                  </div>
                </div>
                <div style={{ marginBottom: "20px" }}>
                  <h4>
                    {" "}
                    <img src={downarrow} alt="" /> &nbsp;&nbsp; Shared Network
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
                      <Checkbox
                        value="none_shared_network"
                        style={{ float: ",left" }}
                      >
                        None
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      {/* </Checkbox.Group> */}
                    </div>
                  </div>
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
                      <Checkbox value="unreachable" style={{ float: ",left" }}>
                        Unreachable
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
                      <Checkbox value="up" style={{ float: ",left" }}>
                        Up
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
                      <Checkbox value="warning" style={{ float: ",left" }}>
                        Warning
                      </Checkbox>
                      <a style={{ float: "right", color: "#71B626" }}>5</a>
                      <br />
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
                      <Checkbox value="none_vlan_id" style={{ float: ",left" }}>
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
                marginLeft: "0px",
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
                  // marginLeft: "-3px",
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
                scroll={{ x: 1300 }}
                pagination={{ pageSize: 10 }}
                // rowKey="site_name"
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
                scroll={{ x: 1500 }}
                pagination={{ pageSize: 10 }}
                // rowKey="site_name"
                columns={columns}
                dataSource={dataSource}
                // pagination={false}
                // style={{ width: "100%" }}
              />
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default index;
