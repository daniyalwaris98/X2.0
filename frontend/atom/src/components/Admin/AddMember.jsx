import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Switch } from "antd";
import axios, { baseUrl } from "../../utils/axios";
import Swal from "sweetalert2";
import { ReactComponent as profile } from "./assets/profile.svg";
import { companies } from "../../data/globalData";

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
        .post(baseUrl + "/addAdmin ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
          } else {
            openSweetAlert(
              `User ${device ? "Added" : "Added"} Successfully`,
              "success"
            );
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllAdmin")
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
  let [email, setemail_address] = useState(
    device ? getString(device.email) : ""
  );
  let [active, setActiveState] = useState(
    device ? getString(device.active) : true
  );
  let [company_name, setcompany_name] = useState(
    device ? getString(device.company_name) : ""
  );
  let [status, setStatus] = useState(
    device ? getString(device.status) : "Active"
  );
  let [accountType, setAccountType] = useState(
    device ? getString(device.account_type) : "Permanent"
  );

  let [name, setname] = useState(device ? getString(device.name) : "");
  let [role, setrole] = useState(device ? getString(device.role) : "");
  let [password, setpassword] = useState(
    device ? getString(device.password) : ""
  );
  let [team, setteam] = useState(device ? getString(device.team) : "");
  let [username, setUsername] = useState(
    device ? getString(device.user_id) : ""
  );

  let type = null;
  let options = null;

  if (type) {
    options = type.map((option) => <option>{option}</option>);
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const device = {
      email,
      active,
      name,
      company_name,
      password,
      role,
      status,
      account_type: accountType,
      team,
      user_id: username,
    };

    props.setIsModalVisible(false);
    postDevice(device);
  };

  const handleCancel = () => {
    props.setIsModalVisible(false);
  };

  const [roleArray, setRoleArray] = useState([]);

  useEffect(() => {
    const getPasswordGroupDropdown = async () => {
      try {
        const res = await axios.get(baseUrl + "/getAllRoles");
        setRoleArray(res.data);
        setrole(res.data[0]);
      } catch (err) {
        console.log(err.response);
      }
    };
    getPasswordGroupDropdown();
  }, []);

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
      visible={props.isModalVisible}
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
              <Switch
                defaultChecked
                checked={active}
                onChange={setActiveState}
                style={{ backgroundColor: "#6AB344" }}
              />
            </div>
          </Col>
          <Col span={7} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <StyledInput
                value={name}
                onChange={(e) =>
                  setname(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
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
            <InputWrapper>
              Email Address: &nbsp;&nbsp;
              <br />
              <StyledInput
                type="email"
                value={email}
                onChange={(e) => setemail_address(e.target.value)}
              />
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "2%" }}>
            <InputWrapper>
              Role: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  required
                  value={role}
                  onChange={(e) => {
                    setrole(e.target.value);
                  }}
                >
                  {roleArray.map((item, index) => {
                    return <option>{item}</option>;
                  })}
                </Styledselect>
              </div>
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
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Active">Active</option>
                  <option value="InActive">InActive</option>
                </Styledselect>
              </div>
            </InputWrapper>

            <InputWrapper>
              Team: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                value={team}
                onChange={(e) => setteam(e.target.value)}
                required
              />
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "2%" }}>
            <InputWrapper>
              User Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <StyledInput
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
                required
              />
            </InputWrapper>
            <InputWrapper>
              Account Type: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  required
                  placeholder="select"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                >
                  <option value="Permanent">Permanent</option>
                  <option value="Not Permanent">Not Permanent</option>
                </Styledselect>
              </div>
            </InputWrapper>
            <InputWrapper>
              Company Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              {/* <StyledInput
                value={company_name}
                onChange={(e) => setcompany_name(e.target.value)}
                required
              /> */}
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  required
                  placeholder="select"
                  value={company_name}
                  onChange={(e) => setcompany_name(e.target.value)}
                >
                  {companies.map((company, index) => (
                    <option key={index} value={company}>
                      {company}
                    </option>
                  ))}
                </Styledselect>
              </div>
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
            // marginTop: "10px",
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
          value="+ Add Member"
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
  height: 2rem;
  width: 100%;
  outline: none;
  border: 0.1px solid #cfcfcf;

  .ant-select:not(.ant-select-customize-input) > .ant-select-selector {
    height: 2rem;
  }
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
