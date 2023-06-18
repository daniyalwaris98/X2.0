import React, { useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select, Switch } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import profile from "../assets/profile.svg";

const AddMember = (props) => {
  const getString = (str) => {
    return str ? str : "";
  };

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
              `Device ${device ? "Updated" : "Added"} Successfully`,
              "success"
            );
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllSites")
                .then((response) => {
                  console.log(response.data);
                  props.setDataSource(response.data);
                  props.excelData = response.data;
                  props.setRowCount(response.data.length);
                  props.excelData = response.data;
                })
                .catch((error) => {
                  console.log(error);
                })
            );
            return Promise.all(promises);
          }
        })
        .catch((error) => {
          console.log("in add seed device catch ==> " + error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  let [device, setDevice] = useState(props.addRecord);

  let [user_id, setuser_id] = useState(device ? getString(device.user_id) : "");
  let [email_address, setemail_address] = useState(
    device ? getString(device.email_address) : ""
  );

  let [name, setname] = useState(device ? getString(device.name) : "");
  let [role, setrole] = useState(device ? getString(device.role) : "");
  let [status, setstatus] = useState(device ? getString(device.status) : "");
  let [city, setcity] = useState(device ? getString(device.city) : "");
  let [password, setpassword] = useState(
    device ? getString(device.password) : ""
  );
  let [team, setteam] = useState(device ? getString(device.team) : "");
  let [vendor, setvendor] = useState(device ? getString(device.vendor) : "");

  let type = null;

  let options = null;

  if (type) {
    options = type.map((option) => <option>{option}</option>);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      user_id,
      email_address,
      city,
      name,
      password,
      role,
      status,
      team,
      vendor,
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
        marginTop: "0px",
        zIndex: "99999",
        textAlign: "center",
        alignContent: "center",
        padding: "0px",
      }}
      width="80%"
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
              <img src={profile} alt="" /> &nbsp; {device ? "Edit" : "Add"}{" "}
              Member
            </p>
            <div
              style={{
                float: "right",
                display: "flex",
                marginRight: "45px",
              }}
            >
              Active &nbsp;
              <Switch defaultChecked style={{ backgroundColor: "#6AB344" }} />
              <StyledSubmitButton
                style={{
                  display: "none",
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
                  display: "none",
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
          <Col span={7} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              User Id : &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                value={user_id}
                onChange={(e) => setuser_id(e.target.value)}
                required
              />
            </InputWrapper>

            <InputWrapper>
              Password: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                required
              />
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "2%" }}>
            <InputWrapper>
              Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <StyledInput
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
              />
            </InputWrapper>

            <InputWrapper>
              Team: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <Select
                style={{
                  width: "100%",
                }}
                onChange={(e) => setteam(e)}
              >
                <option value="jack">Jack</option>
                <option value="jak">Jak</option>
                <option value="jac">Jac</option>
                <option value="ja">Ja</option>
              </Select>
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "2%" }}>
            <InputWrapper>
              Email Address: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="email"
                value={email_address}
                onChange={(e) => setemail_address(e.target.value)}
                required
              />
            </InputWrapper>

            <InputWrapper>
              Role: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <Select
                style={{
                  width: "100%",
                }}
                onChange={(e) => setrole(e)}
              >
                <option value="jack">Jack</option>
                <option value="jak">Jak</option>
                <option value="jac">Jac</option>
                <option value="ja">Ja</option>
              </Select>
            </InputWrapper>
          </Col>
        </Row>
        <br />
        &nbsp; &nbsp;
        <StyledSubmitButton
          onClick={handleCancel}
          style={{
            alignItems: "center",
            textAlign: "center",
            width: "25%",
            marginTop: "10px",
            cursor: "pointer",
          }}
          color={"#FF0200"}
          value="Cancle"
        />{" "}
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
          value="+ Add Member"
        />
      </form>
    </Modal>
  );
};

const StyledInput = styled(Input)`
  height: 2rem;
  border-radius: 2px;
`;
const Styledselect = styled.select`
  .ant-select:not(.ant-select-customize-input) > .ant-select-selector {
    height: 2.2rem;
    border-radius: 12px;
  }

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

const StyledButton = styled(Button)`
  height: 27px;
  font-size: 15px;
  font-family: Montserrat-Regular;
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

export default AddMember;
