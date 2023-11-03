import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select, Switch } from "antd";
import axios, { baseUrl } from "../../utils/axios";
import Swal from "sweetalert2";
import profile from "./assets/profile.svg";
import Password from "antd/lib/input/Password";

const EditMember = (props) => {
  const { Option } = Select;
  const [optionValue, setOptionValue] = useState("");
  const children = [];
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const correctDatePattern = (date) => {
    if (date != null) {
      let d = date.split(date[10]);
      return d[0] + " " + d[1];
    } else return;
  };

  const getString = (str) => {
    return str ? str : "";
  };

  const getDateString = (dateStr) => {
    return dateStr; // ? correctDatePattern(dateStr) : "";
  };

  let [siteIds, setSiteIds] = useState([]);
  let [siteIdOptions, setSiteIdOptions] = useState([]);
  let [rackIds, setRackIds] = useState([]);
  let [rackIdOptions, setRackIdOptions] = useState([]);

  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };
  const onChangeActive = (checked) => {
    console.log(`switch to ${checked}`);
  };
  const postDevice = async (device) => {
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/addEndUser ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
          } else {
            openSweetAlert(response?.data, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllEndUserDetails")
                .then((response) => {
                  props.setDataSource(response.data);
                  props.excelData = response.data;
                  props.setRowCount(response.data.length);
                  props.excelData = response.data;
                })
                .catch((error) => {
                  console.log(error);
                  //  openSweetAlert("Something Went Wrong!", "error");
                })
            );
            return Promise.all(promises);
          }
        })
        .catch((error) => {
          console.log("in add seed device catch ==> " + error);
          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      console.log(err);
    }
  };
  let [device, setDevice] = useState(props.editRecord);

  let [email, setemail_address] = useState(
    device ? getString(device.email) : ""
  );
  let [companyName, setCompanyName] = useState(
    device ? getString(device.company_name) : ""
  );
  let [POBox, setPOBox] = useState(device ? getString(device.po_box) : "");
  let [address, setAddress] = useState(device ? getString(device.address) : "");

  let [streetName, setStreetName] = useState(
    device ? getString(device.street_name) : ""
  );

  let [streetNumber, setStreetNumber] = useState(
    device ? getString(device.street_number) : ""
  );
  let [city, setcity] = useState(device ? getString(device.city) : "");
  let [country, setCountry] = useState(device ? getString(device.country) : "");
  let [contactPerson, setContactPerson] = useState(
    device ? getString(device.contact_person) : ""
  );
  let [contactNumber, setContactNumber] = useState(
    device ? getString(device.contact_number) : ""
  );
  let [domainName, setdDomainName] = useState(
    device ? getString(device.domain_name) : ""
  );
  let [industryType, setIndustryType] = useState(
    device ? getString(device.industry_type) : ""
  );

  const algorithm = [
    "Searching Algorithm",
    "Sorting Algorithm",
    "Graph Algorithm",
  ];
  const language = ["C++", "Java", "Python", "C#"];
  const dataStructure = ["Arrays", "LinkedList", "Stack", "Queue"];

  let type = null;

  let options = null;

  if (type) {
    options = type.map((option) => <option>{option}</option>);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      company_name: companyName,
      po_box: POBox,
      address,
      street_name: streetName,
      city,
      country,
      contact_person: contactPerson,
      contact_number: contactNumber,
      email,
      domain_name: domainName,
      industry_type: industryType,
    };

    props.setIsEditModalVisible(false);
    console.log("devices", device);
    postDevice(device);
  };

  const handleCancel = () => {
    props.setIsEditModalVisible(false);
  };
  const getRackIdOptions = (values = []) => {
    let options = [];
    values.map((value) => {
      options.push(<Option value={value}>{value}</Option>);
    });
    setRackIdOptions(options);
  };

  const getOptions = (values = []) => {
    let options = [];
    values.map((value) => {
      options.push(<Option value={value}>{value}</Option>);
    });
    return options;
  };

  return (
    <Modal
      style={{
        marginTop: "0px",
        zIndex: "99999",
        textAlign: "center",
        alignContent: "center",
        padding: "0px",
      }}
      width="80%"
      title=""
      closable={false}
      open={props.isEditModalVisible}
      footer=""
      bodyStyle={{ padding: "0" }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          textAlign: "center",
          padding: "15px",
          backgroundColor: "rgba(238, 235, 235, 0.86)",
        }}
      >
        <Row style={{ alignContent: "center" }}>
          <Col span={24} style={{ margin: "5px 30px" }}>
            <p
              style={{
                fontSize: "22px",
                float: "left",
                display: "flex",
              }}
            >
              <img src={profile} alt="" /> &nbsp; Edit End-User
            </p>
          </Col>
          <Col span={7} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              Company Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <StyledInput
                value={companyName}
                onChange={(e) =>
                  setCompanyName(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
                required
              />
            </InputWrapper>

            <InputWrapper>
              PO Box: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={POBox}
                onChange={(e) => setPOBox(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              Email Address: &nbsp;&nbsp;
              <br />
              <StyledInput
                type="email"
                value={email}
                onChange={(e) => setemail_address(e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              Industry Type : &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={industryType}
                onChange={(e) => setIndustryType(e.target.value)}
              />
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "2%" }}>
            <InputWrapper>
              Address: &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </InputWrapper>

            <InputWrapper>
              Street Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
              />
            </InputWrapper>

            <InputWrapper>
              City: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                value={city}
                onChange={(e) => setcity(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              Domain Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={domainName}
                onChange={(e) => setdDomainName(e.target.value)}
              />
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "2%" }}>
            <InputWrapper>
              Country: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <StyledInput
                value={country}
                onChange={(e) =>
                  setCountry(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
                required
              />
            </InputWrapper>
            <InputWrapper>
              Contact Person: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              Contact Number: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={contactNumber}
                onChange={(e) => setContactPerson(e.target.value)}
              />
            </InputWrapper>
          </Col>
        </Row>
        <br />
        &nbsp; &nbsp;
        <button
          onClick={handleCancel}
          style={{
            alignItems: "center",
            textAlign: "center",
            width: "25%",
            height: "40px",
            cursor: "pointer",
            backgroundColor: "#f95757",
            color: "white",
            borderRadius: "5px",
            border: "none",
          }}
        >
          Cancel
        </button>
        &nbsp; &nbsp;
        <StyledSubmitButton
          style={{
            alignItems: "center",
            textAlign: "center",
            width: "25%",
            marginTop: "10px",
            cursor: "pointer",
          }}
          color={"green"}
          type="submit"
          value="Edit End-User"
        />
      </form>
    </Modal>
  );
};

const StyledInput = styled(Input)`
  height: 2rem;
  border-radius: 2px;
  border: none !important;
  box-shadow: none !important;
  overflow: hidden;
  &:focus {
    border: 1px solid #6ab344 !important;
  }
`;
const Styledselect = styled.select`
  .ant-select:not(.ant-select-customize-input) > .ant-select-selector {
    height: 2rem;
  }

  height: 2rem;

  width: 100%;
  outline: none;
  border: 0.1px solid #cfcfcf;
`;

const InputWrapper = styled.div`
  text-align: left;
  font-size: 12px;

  padding-bottom: 10px;
`;

const StyledSubmitButton = styled(Input)`
  font-size: 15px;
  height: 40px;

  padding: auto;

  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: ${(props) => props.color};
  border-color: ${(props) => props.color};
  color: white;
  border-radius: 5px;
  &:focus,
  &:hover {
    background-color: ${(props) => props.color};
    border-color: ${(props) => props.color};
    color: white;
    opacity: 0.8;
  }
`;

export default EditMember;
