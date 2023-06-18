import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select, Checkbox } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import "../../AllStyling/CSSStyling.css";
import { devices } from "../../../data/globalData";

const EditAtom = (props) => {
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
        .post(baseUrl + "/editIpamDevice ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
          } else {
            openSweetAlert("Device Updated Successfully", "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllIpamDevices")
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
          openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      console.log(err);
    }
  };

  let [device, setDevice] = useState(props.editRecord);

  let [ip_address, setIp] = useState(
    device ? getString(device.ip_address) : ""
  );
  let [source, setSource] = useState(device ? getString(device.source) : "");
  let [device_name, setDevice_name] = useState(
    device ? getString(device.device_name) : ""
  );

  let [device_type, setDeviceType] = useState(
    device ? getString(device.device_type) : ""
  );
  let [ipam_id, setIpamId] = useState(device ? getString(device.ipam_id) : "");
  let [password_group, setPassword_group] = useState(
    device ? getString(device.password_group) : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const device = {
      ipam_id,
      ip_address,
      device_name,
      device_type,
      password_group,
      source,
    };

    props.setIsEditModalVisible(false);
    postDevice(device);
  };

  const [passwordArray, setPasswordArray] = useState([]);

  useEffect(() => {
    const getPasswordGroupDropdown = async () => {
      try {
        const res = await axios.get(baseUrl + "/getPasswordGroupDropdown");
        setPasswordArray(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    getPasswordGroupDropdown();
  }, [password_group]);

  const handleCancel = () => {
    props.setIsEditModalVisible(false);
  };

  const ipamDeviceType = devices.filter((device) =>
    device.module.includes("ipam")
  );

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
          <Col span={24} style={{}}>
            <p style={{ fontSize: "22px", float: "left", display: "flex" }}>
              {device ? "Edit" : "Add"} Device
            </p>
            <div style={{ float: "right", display: "flex" }}>
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
                  // paddingBottom: "5px",
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
              IP Address: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={ip_address}
                // pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"
                onChange={(e) => setIp(e.target.value)}
                required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              Device Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={device_name}
                required
                onChange={(e) =>
                  setDevice_name(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
              />
            </InputWrapper>
          </Col>
          <Col span={10} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              Device Type: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  required
                  placeholder="select"
                  value={device_type}
                  onChange={(e) => {
                    setDeviceType(e.target.value);
                  }}
                >
                  {ipamDeviceType.map((device, index) => (
                    <option key={index} value={device.name}>
                      {device.name}
                    </option>
                  ))}
                </Styledselect>
              </div>
            </InputWrapper>
            <InputWrapper>
              Password Group: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  value={password_group}
                  required
                  onChange={(e) => {
                    setPassword_group(e.target.value);
                  }}
                >
                  <option value="">Select</option>

                  {passwordArray.map((item, index) => {
                    return (
                      <>
                        <option>{item}</option>
                      </>
                    );
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
  // height: 27px;
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

export default EditAtom;
