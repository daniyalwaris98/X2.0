import React, { useEffect, useState } from "react";
import addmember from "./assets/addmember.svg";
import { columnSearch } from "../../utils";
import axios, { baseUrl } from "../../utils//axios";
import AddModal from "./AddMember";
import EditModal from "./EditMember";
import Swal from "sweetalert2";
import { EditOutlined } from "@ant-design/icons";
import {
  TableStyling,
  SpinLoading,
  AddButtonStyle,
} from "../AllStyling/All.styled.js";

let excelData = [];
let columnFilters = {};
const index = () => {
  let [dataSource, setDataSource] = useState(excelData);
  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [loading, setLoading] = useState(false);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllAdmin");
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

  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
  }, []);

  let getColumnSearchProps = columnSearch(
    searchText,
    setSearchText,
    searchedColumn,
    setSearchedColumn
  );

  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
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
        <>
          {!configData?.atom.pages.atom.read_only ? (
            <>
              <p
                style={{
                  color: "#66B127",
                  textDecoration: "underline",
                  fontWeight: "400",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                disabled
              >
                <EditOutlined
                  style={{ paddingRight: "50px", color: "#66A111" }}
                />
              </p>
            </>
          ) : (
            <p
              style={{
                color: "#66B127",
                textDecoration: "underline",
                fontWeight: "400",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                edit(record);
              }}
            >
              <EditOutlined
                style={{ paddingRight: "50px", color: "#66A111" }}
              />
            </p>
          )}
        </>
      ),
    },
    {
      title: "Username",
      dataIndex: "user_id",
      key: "user_id",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

      ...getColumnSearchProps(
        "user_id",
        "Username",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "email_address",
      dataIndex: "email",
      key: "email",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "email",
        "Email Address",
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
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),
      ...getColumnSearchProps(
        "name",
        "Name",
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
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "role",
        "Role",
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
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "status",
        "Status",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "company_name",
        "Company Name",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Account Type",
      dataIndex: "account_type",
      key: "account_type",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "account_type",
        "Account Type",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Creation Date",
      dataIndex: "creation_date",
      key: "creation_date",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "creation_date",
        "Creation Date",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Modification Date",
      dataIndex: "modification_date",
      key: "modification_date",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "modification_date",
        "Modification Date",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Last Login",
      dataIndex: "last_login",
      key: "last_login",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "last_login",
        "Last Login",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Team",
      dataIndex: "team",
      key: "team",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "team",
        "Team",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "",
      key: "edit",

      render: (text, record) => (
        <>
          {!configData?.atom.pages.atom.read_only ? (
            <>
              <div style={{ textAlign: "center" }}>
                <button
                  style={{
                    backgroundColor: "#b12727",
                    padding: "6px",
                    fontWeight: "400",
                    textAlign: "center",
                    color: "white",
                    cursor: "pointer",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "no-drop",
                  }}
                  disabled
                >
                  Delete
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: "center" }}>
              <button
                style={{
                  backgroundColor: "#b12727",
                  // textDecoration: "underline",
                  padding: "6px",
                  fontWeight: "400",
                  textAlign: "center",
                  color: "white",
                  cursor: "pointer",
                  border: "none",
                  borderRadius: "8px",
                }}
                onClick={() => {
                  deleteUser(record.user_id);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </>
      ),
    },
  ];

  const deleteUser = async (id) => {
    setLoading(true);

    await axios
      .post(baseUrl + "/deleteUser", { user_id: id })
      .then((response) => {
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data?.response, "error");
          setLoading(false);
        } else {
          openSweetAlert("User Deleted Successfully", "success");
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllAdmin")
              .then((response) => {
                excelData = response?.data;
                setDataSource(response?.data);
                excelData = response.data;
                setDataSource(excelData);
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

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        height: "100vh",
      }}
    >
      <div style={{ marginLeft: "20px", marginRight: "20px" }}>
        <AddButtonStyle style={{ float: "right" }} onClick={showModal}>
          <img src={addmember} alt="" width="20px" height="20px" /> &nbsp; Add
          Member
        </AddButtonStyle>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      {isModalVisible && (
        <AddModal
          style={{ padding: "40px" }}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          dataSource={dataSource}
          setDataSource={setDataSource}
          excelData={excelData}
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
          editRecord={editRecord}
          centered={true}
        />
      )}
      <SpinLoading spinning={loading} tip="Loading...">
        <TableStyling
          scroll={{ x: 2600 }}
          columns={columns}
          dataSource={dataSource}
          style={{ width: "100%", padding: "2%" }}
        />
      </SpinLoading>
    </div>
  );
};

export default index;
