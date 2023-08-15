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

  const edit = (record) => {
    setEditRecord(record);
    setIsEditModalVisible(true);
  };

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
