import React, { useEffect, useState, useRef } from "react";
import { columnSearch } from "../../utils";

import axios, { baseUrl } from "../../utils/axios";
import AddModal from "./AddMember";
import EditModal from "./EditMember";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

import { ImportOutlined, EditOutlined } from "@ant-design/icons";
import {
  TableStyling,
  StyledImportFileInput,
  SpinLoading,
  AddButtonStyle,
} from "../AllStyling/All.styled.js";
import CustomModal from "../ReusableComponents/CustomModal/CustomModal";
import CustomInput from "../ReusableComponents/FormComponents/CustomInput/CustomInput";
import { EndUserStyle, UserModalStyle } from "./EndUser.style";

const index = () => {
  let excelData = [];
  let columnFilters = {};
  const [isModalOpen, setIsModalOpen] = useState(false);

  let [dataSource, setDataSource] = useState(excelData);

  const [searchText, setSearchText] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState(null);
  const [loading, setLoading] = useState(false);
  let [inputValue, setInputValue] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [addRecord, setAddRecord] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getAllEndUserDetails");
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

  const importExcel = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (e) => {
      const bstr = e.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const workSheetName = workbook.SheetNames[0];
      const workSheet = workbook.Sheets[workSheetName];
      const fileData = XLSX.utils.sheet_to_json(workSheet, {
        header: 1,
        raw: false,
      });
      const headers = fileData[0];
      fileData.splice(0, 1);
      let data = convertToJson(headers, fileData);
      postSeed(data);
    };
  };

  const postSeed = async (seed) => {
    setLoading(true);
    await axios
      .post(baseUrl + "/addEndUsers", seed)
      .then((response) => {
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");
          setLoading(false);
        } else {
          openSweetAlert(response?.data, "success");
          const promises = [];
          promises.push(
            axios
              .get(baseUrl + "/getAllEndUserDetails")
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

  const convertToJson = (headers, fileData) => {
    let rows = [];
    fileData.forEach((row) => {
      const rowData = {};
      row.forEach((element, index) => {
        rowData[headers[index]] = element;
      });
      rows.push(rowData);
    });
    rows = rows.filter((value) => JSON.stringify(value) !== "{}");
    return rows;
  };

  const showModal = () => {
    setIsModalOpen(true);
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
      title: "Company Name",
      dataIndex: "company_name",
      key: "company_name",
      render: (text, record) => <p style={{ textAlign: "center" }}>{text}</p>,

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
      title: "PO Box",
      dataIndex: "po_box",
      key: "po_box",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "po_box",
        "PO Box",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },

    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "address",
        "Address",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Street Number",
      dataIndex: "street_name",
      key: "street_name",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "street_name",
        "Street Name",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "city",
        "City",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "country",
        "Country",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person",
      key: "contact_person",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "contact_person",
        "Contact Person",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Contact Number",
      dataIndex: "contact_number",
      key: "contact_number",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "contact_number",
        "Contact Number",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "email",
        "Email",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Domain Name",
      dataIndex: "domain_name",
      key: "domain_name",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "domain_name",
        "Domain Name",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
    {
      title: "Industry Type",
      dataIndex: "industry_type",
      key: "industry_type",
      render: (text, record) => (
        <p style={{ textAlign: "center", paddingTop: "10px" }}>{text}</p>
      ),

      ...getColumnSearchProps(
        "industry_type",
        "Industry Type",
        setDataSource,
        excelData,
        columnFilters
      ),
      ellipsis: true,
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <EndUserStyle>
      <h1 className="title">End User</h1>

      <p className="description">
        Please add your details to first time setup the MonetX platform.
      </p>

      <h3 className="heading">Company Details</h3>

      <form className="form-wrapper" onSubmit={handleSubmit}>
        <article className="form-content">
          <CustomInput
            title="Company Name"
            required
            disabled
            value="Extravis"
          />
          <CustomInput title="PO Box" required />
          <CustomInput title="Address" />
          <CustomInput title="Country" />
        </article>

        <h3 className="heading">Personl Details</h3>

        <article className="form-content">
          <CustomInput title="Contact Person" required />
          <CustomInput title="Phone Number" required />
          <CustomInput title="Email" />
          <CustomInput title="Domin Name" />
          <CustomInput title="Industry Type" className="input-full" />
        </article>

        <article className="button-wrapper">
          <button type="submit">Update</button>
        </article>
      </form>
    </EndUserStyle>
  );
};

export default index;
