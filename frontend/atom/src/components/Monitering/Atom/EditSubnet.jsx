import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import { SpinLoading } from "../../AllStyling/All.styled";
import { devices, functions, vendors } from "../../../data/globalData";

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
        .post(baseUrl + "/addMonitoringDevice", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            setEditLoading(false);
          } else {
            openSweetAlert("Device Updated Successfully", "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllMonitoringDevices")
                .then((response) => {
                  props.setDataSource(response.data);
                  props.excelData = response.data;
                  props.setRowCount(response.data.length);
                  props.excelData = response.data;
                  setEditLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  setEditLoading(false);
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

  let device = props.editRecord;

  let [ipAddress, setIpAddreess] = useState(
    device ? getString(device.ip_address) : ""
  );
  let [deviceType, setDeviceType] = useState(
    device ? getString(device.device_type) : ""
  );

  let [deviceName, setDeviceName] = useState(
    device ? getString(device.device_name) : ""
  );
  let [id, setid] = useState(device ? getString(device.monitoring_id) : "");
  let [vendor, setVendor] = useState(device ? getString(device.vendor) : "");
  let [vendorOther, setVendorOther] = useState(
    device ? getString(device.vendor) : ""
  );
  let [myFunction, setFunction] = useState(
    device ? getString(device.function) : ""
  );
  let [myFunctionOther, setFunctionOther] = useState(
    device ? getString(device.function) : ""
  );
  let [cred_group, setCred_group] = useState(
    device ? getString(device.credentials) : ""
  );
  let [actionState, setActionState] = useState(getString(device.active));
  const [credArray, setCredArray] = useState([]);

  useEffect(() => {
    const getPasswordGroupDropdown = async () => {
      try {
        const res = await axios.get(baseUrl + "/getDevCredentials");

        setCredArray(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    getPasswordGroupDropdown();
  }, [cred_group]);

  const handleSubmit = (e) => {
    e.preventDefault();

    let formData;

    if (deviceType === "Other") {
      formData = {
        monitoring_id: id,
        ip_address: ipAddress,
        device_type: "Other",
        vendor,
        function: myFunction,
        active: actionState,
        device_name: deviceName,

        credentials: cred_group,
      };
    }
    if (deviceType === "Other" && vendor === "Other") {
      formData = {
        monitoring_id: id,
        ip_address: ipAddress,
        device_type: "Other",
        vendor: vendorOther,
        function: myFunction,
        active: actionState,
        device_name: deviceName,

        credentials: cred_group,
      };
    }
    if (vendor === "Other") {
      formData = {
        monitoring_id: id,
        ip_address: ipAddress,
        device_type: deviceType,
        vendor: vendorOther,
        function: myFunction,
        active: actionState,
        device_name: deviceName,

        credentials: cred_group,
      };
    }

    if (vendor !== "Other" && deviceType !== "Other") {
      formData = {
        monitoring_id: id,
        ip_address: ipAddress,
        device_type: deviceType,
        vendor,
        function: myFunction,
        active: actionState,
        device_name: deviceName,

        credentials: cred_group,
      };
    }
    if (myFunction !== "Other") {
      formData = {
        monitoring_id: id,
        ip_address: ipAddress,
        device_type: deviceType,
        vendor,
        function: myFunction,
        active: actionState,
        device_name: deviceName,

        credentials: cred_group,
      };
    }
    if (myFunction === "Other") {
      formData = {
        monitoring_id: id,
        ip_address: ipAddress,
        device_type: deviceType,
        vendor,
        function: myFunctionOther,
        active: actionState,
        device_name: deviceName,

        credentials: cred_group,
      };
    }
    if (
      deviceType === "Other" &&
      vendor === "Other" &&
      myFunction === "Other"
    ) {
      formData = {
        monitoring_id: id,
        ip_address: ipAddress,
        device_type: "Other",
        vendor: vendorOther,
        function: myFunctionOther,
        active: actionState,
        device_name: deviceName,

        credentials: cred_group,
      };
    }
    if (
      deviceType !== "Other" &&
      vendor === "Other" &&
      myFunction === "Other"
    ) {
      formData = {
        monitoring_id: id,
        ip_address: ipAddress,
        device_type: deviceType,
        vendor: vendorOther,
        function: myFunctionOther,
        active: actionState,
        device_name: deviceName,

        credentials: cred_group,
      };
    }
    if (
      deviceType !== "Other" &&
      vendor !== "Other" &&
      myFunction === "Other"
    ) {
      formData = {
        monitoring_id: id,
        ip_address: ipAddress,
        device_type: deviceType,
        vendor: vendor,
        function: myFunctionOther,
        active: actionState,
        device_name: deviceName,

        credentials: cred_group,
      };
    }
    if (
      deviceType !== "Other" &&
      vendor !== "Other" &&
      myFunction !== "Other"
    ) {
      formData = {
        monitoring_id: id,
        ip_address: ipAddress,
        device_type: deviceType,
        vendor: vendor,
        function: myFunction,
        active: actionState,
        device_name: deviceName,

        credentials: cred_group,
      };
    }
    if (
      deviceType === "Other" &&
      vendor !== "Other" &&
      myFunction === "Other"
    ) {
      formData = {
        monitoring_id: id,
        ip_address: ipAddress,
        device_type: "Other",
        vendor: vendorOther,
        function: myFunction,
        active: actionState,
        device_name: deviceName,

        credentials: cred_group,
      };
    }
    if (
      deviceType === "Other" &&
      vendor === "Other" &&
      myFunction !== "Other"
    ) {
      formData = {
        monitoring_id: id,
        ip_address: ipAddress,
        device_type: "Other",
        vendor: vendorOther,
        function: myFunction,
        active: actionState,
        device_name: deviceName,

        credentials: cred_group,
      };
    }

    props.setIsEditModalVisible(false);
    postDevice(formData);
  };

  const handleCancel = () => {
    props.setIsEditModalVisible(false);
  };

  const deviceTy = devices.map((device) => {
    return device.name.toLowerCase();
  });

  const monitoringDeviceType = devices.filter((device) =>
    device.module.includes("monitoring")
  );

  const deviceValue = deviceTy.includes(deviceType.toLowerCase());

  const monitoringVendors = vendors.filter((vendor) =>
    vendor.module.includes("monitoring")
  );

  const monitoringFunctions = functions.filter((montiFunction) =>
    montiFunction.module.includes("monitoring")
  );

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
                {deviceType === "0ther" ? (
                  <StyledInput
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                  />
                ) : (
                  <div className="select_type">
                    <Styledselect
                      className="rectangle"
                      required
                      placeholder="select"
                      value={deviceValue ? deviceType.toLowerCase() : "other"}
                      onChange={(e) => {
                        setDeviceType(e.target.value);
                      }}
                    >
                      {monitoringDeviceType.map((device, index) => (
                        <option
                          key={index}
                          value={device.name.toLocaleLowerCase()}
                        >
                          {device.name}
                        </option>
                      ))}
                    </Styledselect>
                  </div>
                )}
              </InputWrapper>

              <InputWrapper>
                Vendor: &nbsp;<span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    required
                    placeholder="select"
                    onFocus={(e) => {
                      setVendor(e.target.value ? e.target.value : "Cisco");
                    }}
                    value={vendor.toLowerCase()}
                    onChange={(e) => {
                      setVendor(e.target.value);
                    }}
                  >
                    <option value="">Select Vendor</option>
                    {monitoringVendors.map((vendor, index) => {
                      return (
                        <option value={vendor.name.toLowerCase()} key={index}>
                          {vendor.name}
                        </option>
                      );
                    })}
                  </Styledselect>
                </div>
              </InputWrapper>
              <InputWrapper>
                Function: &nbsp;&nbsp;
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    required
                    placeholder="select"
                    value={myFunction.toLowerCase()}
                    onChange={(e) => setFunction(e.target.value)}
                  >
                    <option value="">Select Function</option>
                    {monitoringFunctions.map((monitoringFuntion, index) => {
                      return (
                        <option
                          value={monitoringFuntion.name.toLowerCase()}
                          key={index}
                        >
                          {monitoringFuntion.name}
                        </option>
                      );
                    })}
                  </Styledselect>
                </div>
              </InputWrapper>
              <InputWrapper>
                Device Name : &nbsp;&nbsp;
                <StyledInput
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  required
                />
              </InputWrapper>

              <InputWrapper>
                Credentials: &nbsp;<span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    value={cred_group}
                    required
                    onChange={(e) => {
                      setCred_group(e.target.value);
                    }}
                  >
                    <option value="">Select Crediential</option>

                    {credArray.map((item, index) => {
                      return <option key={index}>{item}</option>;
                    })}
                  </Styledselect>
                </div>
              </InputWrapper>
              <InputWrapper>
                Active : &nbsp;&nbsp;
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    required
                    placeholder="select"
                    value={actionState}
                    onChange={(e) => setActionState(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">InActive</option>
                  </Styledselect>
                </div>
              </InputWrapper>
            </Col>
          </Row>
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
  font-size: 15px;
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
