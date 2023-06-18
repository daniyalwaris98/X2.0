import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import sites from "./assets/sites.svg";
import { StyledselectIpam } from "../../AllStyling/All.styled.js";

const AddSiteModel = (props) => {
  const { Option } = Select;

  const getString = (str) => {
    return str ? str : "";
  };

  const DType = ["Production", "Not Production"];

  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  const postDevice = async (device) => {
    try {
      await axios
        .post(baseUrl + "/addSite ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data?.response, "error");
          } else {
            openSweetAlert(
              `Site ${device ? "Added" : "Added"} Successfully`,
              "success"
            );
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllSites")
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

  let [device, setDevice] = useState(props.addRecord);

  let [site_name, setSitename] = useState(
    device ? getString(device.site_name) : ""
  );
  let [region, setRegion] = useState(device ? getString(device.region) : "");

  let [latitude, setLatitude] = useState(
    device ? getString(device.latitude) : ""
  );
  let [longitude, setLongtitude] = useState(
    device ? getString(device.longitude) : ""
  );
  let [city, setCity] = useState(device ? getString(device.city) : "");
  let [creation_date, setCreation_dt] = useState(
    device ? getString(device.creation_date) : ""
  );
  let [modification_date, setModifed_dt] = useState(
    device ? getString(device.modification_date) : ""
  );
  let [status, setStatus] = useState("");

  let type = null;
  let options = null;

  if (type) {
    options = type.map((option) => <option>{option}</option>);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      site_name,
      region,
      latitude,
      longitude,
      city,
      creation_date,
      modification_date,
      status,
    };

    props.setIsModalVisible(false);
    postDevice(device);
  };

  const handleCancel = () => {
    props.setIsModalVisible(false);
  };

  return (
    <Modal
      style={{
        marginTop: "-70px",
        zIndex: "99999",
        textAlign: "center",
        alignContent: "center",
        padding: "0px",
      }}
      width="50%"
      title=""
      closable={false}
      open={props.isModalVisible}
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
              <img src={sites} alt="" /> &nbsp; {device ? "Edit" : "Add"} Site
            </p>
            <div
              style={{
                float: "right",
                display: "flex",
                marginRight: "45px",
              }}
            >
              <StyledSubmitButton
                style={{
                  float: "right",
                  width: "120px",
                  marginTop: "10px",
                  background:
                    "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                  border: "0px",
                }}
                color={"green"}
                type="submit"
                value="Done"
              />
              <StyledButton
                style={{
                  float: "right",
                  marginTop: "10px",
                  width: "120px",
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
                color={"#BBBABA"}
                onClick={handleCancel}
              >
                Cancel
              </StyledButton>
            </div>
          </Col>
          <Col span={10} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <StyledInput
                value={site_name}
                onChange={(e) => setSitename(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              Region: &nbsp;&nbsp;
              <StyledInput
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </InputWrapper>

            <InputWrapper>
              Latitude: &nbsp;&nbsp;
              <StyledInput
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
            </InputWrapper>

            <InputWrapper>
              Longitude: &nbsp;&nbsp;
              <StyledInput
                type="number"
                value={longitude}
                onChange={(e) => setLongtitude(e.target.value)}
              />
            </InputWrapper>
          </Col>
          <Col span={10} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              City: &nbsp;&nbsp;
              <StyledInput
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </InputWrapper>

            <InputWrapper>
              Status: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  required
                  placeholder="select"
                  value={status}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                >
                  <option value="">Select Status</option>
                  {DType.map((item, index) => {
                    return <option key={index}>{item}</option>;
                  })}
                </Styledselect>
              </div>
            </InputWrapper>
          </Col>
        </Row>
        &nbsp; &nbsp;
      </form>
    </Modal>
  );
};

const StyledInput = styled(Input)`
  height: 2.2rem;
  border-radius: 12px;
  border: none !important;
  box-shadow: none !important;
  overflow: hidden;
  &:focus {
    border: 1px solid #6ab344 !important;
  }
`;
const Styledselect = styled.select`
  height: 2.2rem;
  border-radius: 12px;
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
  padding: auto;
  background-color: ${(props) => props.color};
  border-color: ${(props) => props.color};
  color: white;
  border-radius: 5px;
  &:focus,
  &:hover {
    background-color: ${(props) => props.color};
    border-color: ${(props) => props.color};
    box-shadow: #6ab344 0px 3px 8px !important;

    color: white;
    opacity: 0.8;
  }
`;

const StyledButton = styled(Button)`
  font-size: 15px;
  // font-weight: bolder;
  // width: 15%;
  // font-family: Montserrat-Regular;
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

export default AddSiteModel;
