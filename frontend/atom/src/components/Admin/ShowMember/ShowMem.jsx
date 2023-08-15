import React, { useEffect, useState, useRef } from "react";
import { Button, Table, Spin } from "antd";
import addmember from "../assets/addmember.svg";
import { columnSearch } from "../../../utils";
import profile from "../assets/profile.svg";
import Modal from "./AddMember";
import AdminNavigation from "../../AdminNavigation";
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
} from "@ant-design/icons";
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
  MainTableMainDiv,
  MainTableMainP,
  MainTableDropDown,
  MainTableModal,
  MainTableColP,
} from "../../AllStyling/All.styled.js";

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

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
  };

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );

  const exportSeed = async () => {
    jsonToExcel(excelData);
    // console.log(first);
  };
  const openNotification = () => {
    notification.open({
      message: "File Exported Successfully",
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  const postSeed = async (seed) => {
    setLoading(true);
    await axios
      .post(baseUrl + "/addSite", seed)
      .then((response) => {
        console.log("hahahehehoho");
        console.log(response.status);
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data?.response, "error");
          setLoading(false);
        } else {
          openSweetAlert("Site Added Successfully", "success");
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllSites")
              .then((response) => {
                excelData = response?.data;
                setRowCount(response?.data?.length);
                setDataSource(response?.data);
                excelData = response.data;
                setDataSource(excelData);
                setRowCount(response.data.length);
                setDataSource(response.data);
                setLoading(false);
              })
              .catch((error) => {
                console.log(error);
                setLoading(false);
              })
          );
          setLoading(false);
          return Promise.all(promises);
        }
      })
      .catch((err) => {
        console.log("error ==> " + err);
        setLoading(false);
      });
  };

  const showModal = () => {
    setIsModalVisible(true);
    setEditRecord(null);
    setAddRecord(null);
  };

  const edit = (record) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
  };

  const columns = [
    {
      title: "",
      key: "edit",
      width: "2%",

      render: (text, record) => (
        <a>
          <EditOutlined
            style={{ paddingRight: "50px" }}
            onClick={() => {
              edit(record);
            }}
          />
        </a>
      ),
    },

    {
      title: "user_id",
      dataIndex: "user_id",
      key: "user_id",

      ...getColumnSearchProps(
        "user_id",
        "User Id",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "email_address",
      dataIndex: "email_address",
      key: "email_address",

      ...getColumnSearchProps(
        "email_address",
        "Email Address",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "name",
      dataIndex: "name",
      key: "name",

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
      title: "role",
      dataIndex: "role",
      key: "role",

      ...getColumnSearchProps(
        "role",
        "Role",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",

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
      title: "team",
      dataIndex: "team",
      key: "team",

      ...getColumnSearchProps(
        "team",
        "Team",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "vendor",
      dataIndex: "vendor",
      key: "vendor",

      ...getColumnSearchProps(
        "vendor",
        "vendor",
        setRowCount,
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        height: "100vh",
      }}
    >
      <div style={{ padding: "2px" }}>
        <h2
          style={{
            float: "left",
            marginLeft: "20px",
            fontWeight: "bold",
            marginTop: "2px",
          }}
        >
          <img src={profile} alt="" /> Admin
        </h2>
      </div>
      <br />
      <br />

      <div
        style={{
          borderBottom: "1px solid rgba(175, 175, 175, 0.2)",
        }}
      ></div>

      <div
        style={{
          borderBottom: "1px solid rgba(175, 175, 175, 0.2)",
          marginTop: "2px",
        }}
      >
        <AdminNavigation />
      </div>
      <div
        style={{
          marginBottom: "2px",
        }}
      ></div>
      <br />
      <div style={{ marginLeft: "20px", marginRight: "20px" }}>
        <Button
          onClick={showModal}
          style={{
            backgroundColor: "#66B127",
            fontWeight: "500",
            color: "white",
            height: "45px",
            borderRadius: "8px",
            float: "right",
            marginTop: "10px",
            zIndex: "3",
            border: "none",
          }}
        >
          <img src={addmember} alt="" width="20px" height="20px" /> &nbsp; Add
          Member
        </Button>
      </div>

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
      <Spin spinning={loading}>
        <TableStyling
          rowSelection={rowSelection}
          scroll={{ x: 1500 }}
          rowKey="ip_address"
          columns={columns}
          dataSource={dataSource}
          // pagination={false}
          style={{ width: "100%", padding: "2%" }}
        />
      </Spin>
    </div>
  );
};

export default index;
