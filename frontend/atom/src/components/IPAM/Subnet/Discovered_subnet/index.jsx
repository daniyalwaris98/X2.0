import React, { useState, useEffect } from "react";
import axios, { baseUrl } from "../../../../utils/axios";
import Scanned from "../../assets/Scanned.svg";
import empty from "../../assets/empty.svg";
import trash from "./assets/trash.svg";
import scanner from "./assets/scanner.svg";
import { Link, useNavigate } from "react-router-dom";
import EditModal from "./EditModal";
import Swal from "sweetalert2";

// import axios, { baseUrl } from "../../../../utils/axios";
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
  MainDivStyle,
  LinkStyled,
  DeleteButton,
} from "../../../AllStyling/All.styled";
import { columnSearch } from "../../../../utils";
let excelData = [];
let columnFilters = {};

const index = () => {
  const navigate = useNavigate();

  let [dataSource, setDataSource] = useState(excelData);
  const [mainModalVisible, setMainModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ipamDeviceLoading, setIpamDeviceLoading] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [ip_address, setIpAddress] = useState("");
  const [device_type, setDeviceType] = useState("");
  const [password_group, setPassword_group] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [mainTableloading, setMainTableLoading] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

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

  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    let user = localStorage.getItem("user");
    let userData = JSON.parse(user);

    const test = userData.monetx_configuration;

    let t = eval(test);
    let config = JSON.parse(t);
    setConfigData(config);
  }, []);

  const rowSelection = {
    selectedRowKeys,

    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: configData?.ipam.pages.discover_subnet.read_only,
    }),
  };
  useEffect(() => {
    const serviceCalls = async () => {
      setMainTableLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllDiscoveredSubnets");
        console.log("res getAllDiscoveredSubnets MAin", res);
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
  const edit = (record) => {
    setEditRecord(record);
    // setAddRecord(record);
    setIsEditModalVisible(true);
  };
  const columns = [
    {
      title: "",
      key: "edit",
      width: "2%",

      render: (text, record) => (
        <>
          {configData?.ipam.pages.discover_subnet.read_only ? (
            <>
              <a
                disabled
                // onClick={() => {
                //   edit(record);
                // }}
              >
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
      title: "Subnet Address",
      dataIndex: "subnet_address",
      key: "subnet_address",
      render: (text, record) => (
        <p
          //   onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            // textDecoration: "underline",
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            paddingTop: "10px",
            // cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "subnet_address",
        "Subnet Address",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Subnet Name",
      dataIndex: "subnet_name",
      key: "subnet_name",
      render: (text, record) => (
        <p
          //   onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            // textDecoration: "underline",
            textAlign: "left",
            paddingLeft: "15px",
            paddingTop: "10px",
            // paddingTop: "10px",
            // cursor: "pointer",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "subnet_name",
        "Subnet Name",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Subnet Mask",
      dataIndex: "subnet_mask",
      key: "subnet_mask",
      render: (text, record) => (
        <p
          // onClick={ServernameClicked}
          style={{
            // color: "#66B127",
            // textDecoration: "underline",
            textAlign: "left",
            paddingLeft: "15px",
            // paddingTop: "10px",
            paddingTop: "10px",
          }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "subnet_mask",
        "Subnet Mask",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "size",
        "Size",
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
    {
      title: "Discover From",
      dataIndex: "discover_from",
      key: "discover_from",
      render: (text, record) => (
        <p
          style={{ textAlign: "left", paddingLeft: "15px", paddingTop: "10px" }}
        >
          {text}
        </p>
      ),

      ...getColumnSearchProps(
        "discover_from",
        "Discover From",
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
        <div style={{ display: "flex", justifyContent: "center" }}>
          {configData?.ipam.pages.discover_subnet.read_only ? (
            <button
              style={{
                width: "150px",
                height: "35px",
                textAlign: "center",
                // paddingTop: "10px",
                color: "#66B127",
                fontWeight: "600",
                backgroundColor: "transparent",
                border: "1px solid #66B127",
                borderRadius: "8px",
                cursor: "no-drop",
              }}
            >
              {text}
            </button>
          ) : (
            <button
              style={{
                width: "150px",
                height: "35px",
                textAlign: "center",
                // paddingTop: "10px",
                color: "#66B127",
                fontWeight: "600",
                backgroundColor: "transparent",
                border: "1px solid #66B127",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onClick={async (e) => {
                const res = await axios.post(baseUrl + "/addSubnetInSubnet ", [
                  {
                    subnet_address: record.subnet_address,
                    subnet_name: record.subnet_name,
                    subnet_mask: record.subnet_mask,
                    size: record.size,
                  },
                ]);
                console.log(res);

                navigate("/ipam/subnet/main");
              }}
            >
              {text}
            </button>
          )}
          {/* <button
            style={{
              width: "150px",
              height: "35px",
              textAlign: "center",
              // paddingTop: "10px",
              color: "#66B127",
              fontWeight: "600",
              backgroundColor: "transparent",
              border: "1px solid #66B127",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={async (e) => {
              const res = await axios.post(baseUrl + "/addSubnetInSubnet ", [
                {
                  subnet_address: record.subnet_address,
                  subnet_name: record.subnet_name,
                  subnet_mask: record.subnet_mask,
                  size: record.size,
                },
              ]);
              console.log(res);
              // console.log(
              //   "corresponding email is :",
              //   record.subnet_address,
              //   record.subnet_name,
              //   record.subnet_mask,
              //   record.size
              // );

              navigate("/ipam/subnet/main");
            }}
          >
            {text}
          </button> */}
        </div>
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

    // {
    //   title: "Status",
    //   dataIndex: "a",
    //   key: "a",

    //   render: (text, record) => {
    //     <div style={{ display: "flex" }}>
    //       <img src={scanner} alt="" />
    //       <img src={trash} alt="" style={{ marginLeft: "15px" }} />
    //     </div>;
    //   },
    // },

    // {
    //   title: "Action",
    //   dataIndex: "active",
    //   key: "active",
    //   align: "center",
    //   render: (text, record, index) => (
    //     <div style={{ display: "flex", textAlign: "center" }}>
    //       {" "}
    //       <img
    //         style={{ marginLeft: "40%", cursor: "pointer" }}
    //         src={scanner}
    //         alt=""
    //         onClick={(e) => {
    //           console.log(
    //             "corresponding email is :",
    //             record.subnet_address,
    //             record.subnet_name,
    //             record.subnet_mask,
    //             record.size
    //           );
    //         }}
    //       />
    //       <img
    //         style={{ marginLeft: "20px", cursor: "pointer" }}
    //         src={trash}
    //         alt=""
    //         onClick={(e) => {
    //           console.log("corresponding email is :", record.subnet_address);
    //         }}
    //       />
    //     </div>
    //   ),
    // },
  ];
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
        //console.log(device);
        await axios
          .post(baseUrl + "/deleteDiscoveredSubnets ", selectedRowKeys)
          .then((response) => {
            openSweetAlert(`Discovered Subnet Deleted Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllDiscoveredSubnets")
                .then((response) => {
                  console.log(response.data);
                  excelData = response.data;
                  setDataSource(response.data);
                  setRowCount(response.data.length);
                  // excelData = response.data;
                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setLoading(false);

                  //  openSweetAlert("Something Went Wrong!", "error");
                })
            );
            return Promise.all(promises);
          })
          .catch((error) => {
            setLoading(false);

            console.log("in add seed device catch ==> " + error);
            // openSweetAlert("Something Went Wrong!", "error");
          });
      } catch (err) {
        setLoading(false);

        console.log(err);
      }
    } else {
      openSweetAlert(`Now Device Selected`, "error");
    }
  };

  return (
    <div style={{ marginRight: "12px", marginLeft: "12px" }}>
      <MainDivStyle>
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
            </LinkStyled>
            / <span style={{ color: "#000" }}>Discovered Subnet</span>
          </p>
        </div>
        <br />
        <br />
        <br />

        <div style={{ display: "flex", marginTop: "5px" }}>
          {selectedRowKeys.length > 0 ? (
            <DeleteButton onClick={deleteRow}>Delete</DeleteButton>
          ) : null}
          &nbsp;
          <div style={{ marginTop: "5px", display: "flex" }}>
            <h4>Rows :</h4>&nbsp;
            <ColRowNumberStyle> {rowCount}</ColRowNumberStyle>
            &nbsp;&nbsp;
            <h4>Cols :</h4>&nbsp;
            <ColRowNumberStyle>6</ColRowNumberStyle>
          </div>
        </div>
        {isEditModalVisible && (
          <EditModal
            style={{ padding: "0px" }}
            isEditModalVisible={isEditModalVisible}
            setIsEditModalVisible={setIsEditModalVisible}
            dataSource={dataSource}
            setDataSource={setDataSource}
            excelData={excelData}
            // setRowCount={setRowCount}
            editRecord={editRecord}
            centered={true}
          />
        )}

        <SpinLoading spinning={mainTableloading} tip="Loading...">
          <div style={{ padding: "25px" }}>
            <TableStyling
              rowSelection={rowSelection}
              scroll={{ x: 2000 }}
              pagination={{ pageSize: 10 }}
              rowKey="subnet_address"
              columns={columns}
              dataSource={dataSource}
              // pagination={false}
              // style={{ width: "100%" }}
            />
          </div>
        </SpinLoading>
      </MainDivStyle>
    </div>
  );
};

export default index;
