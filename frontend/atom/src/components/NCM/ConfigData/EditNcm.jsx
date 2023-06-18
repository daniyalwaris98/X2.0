import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";

import { SpinLoading } from "../../AllStyling/All.styled";
import { devices } from "../../../data/globalData";
const EditSubnet = (props) => {
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

  const [editLoading, setEditLoading] = useState(false);

  const postDevice = async (device) => {
    setEditLoading(true);
    try {
      await axios
        .post(baseUrl + "/addNcmDevice", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            setEditLoading(false);
          } else {
            openSweetAlert(response?.data, "success");

            // openSweetAlert("Device Updated Successfully", "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllNcmDevices")
                .then((response) => {
                  console.log(response.data);
                  props.setDataSource(response.data);
                  props.excelData = response.data;
                  props.setRowCount(response.data.length);
                  props.excelData = response.data;
                  setEditLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setEditLoading(false);
                  // openSweetAlert("Something Went Wrong!", "error");
                })
            );
            return Promise.all(promises);
          }
        })
        .catch((error) => {
          console.log("in add seed device catch ==> " + error);
          setEditLoading(false);
          openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      setEditLoading(false);
      console.log(err);
    }
  };
  let [device, setDevice] = useState(props.editRecord);

  let [ipAddress, setIpAddreess] = useState(
    device ? getString(device.ip_address) : ""
  );

  let [deviceType, setDeviceType] = useState(
    device ? getString(device.device_type) : ""
  );

  let [deviceName, setDeviceName] = useState(
    device ? getString(device.device_name) : ""
  );

  const ncmDeviceType = devices.filter((device) =>
    device.module.includes("ncm")
  );

  let [id, setid] = useState(device ? getString(device.ncm_id) : "");
  let [vendor, setVendor] = useState(device ? getString(device.vendor) : "");

  let [myFunction, setFunction] = useState(
    device ? getString(device.function) : ""
  );

  let [actionState, setActionState] = useState(
    device ? getString(device.status) : ""
  );

  let [password_group, setPassword_group] = useState(
    device ? getString(device.password_group) : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    let formData = {
      ncm_id: id,
      ip_address: ipAddress,
      device_type: deviceType,
      vendor: vendor,
      function: myFunction,
      status: actionState,
      device_name: deviceName,
      password_group,
    };

    props.setIsEditModalVisible(false);
    postDevice(formData);
  };

  const handleCancel = () => {
    props.setIsEditModalVisible(false);
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

  return (
    <SpinLoading spinning={editLoading} tip="Loading...">
      <Modal
        style={{
          marginTop: "-70px",
          zIndex: "99999",
          textAlign: "center",
          alignContent: "center",
          padding: "0px",
        }}
        width="40%"
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
            <Col span={21} style={{ marginLeft: "6%" }}>
              <InputWrapper>
                IP Address: &nbsp;&nbsp;
                <StyledInput
                  value={ipAddress}
                  onChange={(e) => setIpAddreess(e.target.value)}
                />
              </InputWrapper>

              <InputWrapper>
                Device Type: &nbsp;<span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    required
                    placeholder="select"
                    value={deviceType}
                    onChange={(e) => {
                      setDeviceType(e.target.value);
                    }}
                  >
                    <option value="" style={{ color: "rgba(0,0,0,0.1)" }}>
                      Select Device Type
                    </option>

                    {ncmDeviceType.map((device, index) => {
                      return (
                        <option value={device.name} key={index}>
                          {device.name}
                        </option>
                      );
                    })}
                  </Styledselect>
                </div>
              </InputWrapper>
              <InputWrapper>
                Vendor:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    required
                    placeholder="select"
                    value={vendor}
                    onChange={(e) => {
                      setVendor(e.target.value);
                    }}
                  >
                    <option>Select Vendor</option>
                    <option value="Cisco">Cisco</option>
                    <option value="Fortinet">Fortinet</option>
                    <option value="Juniper">Juniper</option>
                    <option value="PaloAlto">PaloAlto</option>
                    <option value="Huawei">Huawei</option>
                    <option value="Juniper">Juniper</option>
                    <option value="Microsoft">Microsoft</option>
                    <option value="Linux">Linux</option>
                    <option value="Other">Other</option>
                  </Styledselect>
                </div>
              </InputWrapper>
              <InputWrapper>
                Function:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                {/* <StyledInput
                value={myFunction}
                onChange={(e) => setFunction(e.target.value)}
                // required
              /> */}
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    required
                    placeholder="select"
                    value={myFunction}
                    onChange={(e) => setFunction(e.target.value)}
                  >
                    <option value="Router">Router</option>
                    <option value="Switch">Switch</option>
                    <option value="Wireless">Wireless</option>
                    <option value="Firewall">Firewall</option>
                    <option value="VM">VM</option>
                    <option value="EXSI">EXSI</option>
                    <option value="Load Balancer">Load Balancer</option>
                    <option value="WAF">WAF</option>
                    <option value="Other">Other</option>
                  </Styledselect>
                </div>
              </InputWrapper>
              <InputWrapper>
                Device Name :
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                {/* <StyledInput
                value={types}
                onChange={(e) => setTypes(e.target.value)}
                // required
              /> */}
                {/* <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    required
                    placeholder="select"
                    value={types}
                    onChange={(e) => setTypes(e.target.value)}
                  >
                    <option value="SNMP_V1_V2">SNMP_V1_V2</option>
                    <option value="SNMP_V3">SNMP_V3</option>
                    <option value="WMI">WMI</option>
                  </Styledselect>
                </div> */}
                <StyledInput
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                Active :{/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                {/* <StyledInput
                value={actionState}
                onChange={(e) => setActionState(e.target.value)}
                // required
              /> */}
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    required
                    placeholder="select"
                    value={actionState}
                    onChange={(e) => setActionState(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Styledselect>
                </div>
              </InputWrapper>
              <InputWrapper>
                Password Group: &nbsp;<span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    value={password_group}
                    onChange={(e) => {
                      setPassword_group(e.target.value);
                    }}
                  >
                    {passwordArray.map((item, index) => {
                      return (
                        <>
                          <option>{item}</option>
                        </>
                      );
                    })}
                  </Styledselect>
                </div>
                {/* <StyledInput
                value={password_group}
                onChange={(e) => setPassword_group(e.target.value)}
                required
              /> */}
                {/* )} */}
              </InputWrapper>
            </Col>
          </Row>
          {/* <StyledSubmitButton
          style={{
            textAlign: "center",
            width: "25%",
            marginTop: "10px",
          }}
          color={"green"}
          type="submit"
          value="Done"
        />
        <br />
        <StyledButton
          style={{
            textAlign: "center",
            width: "25%",
            marginTop: "10px",
            marginLeft: "10px",
            // paddingBottom: "5px",
          }}
          color={"red"}
          onClick={handleCancel}
        >
          Cancel
        </StyledButton> */}
          &nbsp; &nbsp;
        </form>
      </Modal>
    </SpinLoading>
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
  // white-space: nowrap;
  // display: flex;
  // justify-content: space-between;
  padding-bottom: 10px;
`;

const StyledSubmitButton = styled(Input)`
  font-size: 15px;
  // height: 27px;

  // font-weight: bolder;
  // width: 15%;
  padding: auto;
  // text-align: center;
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

export default EditSubnet;
