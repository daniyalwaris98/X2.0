import React, { useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import "../../AllStyling/CSSStyling.css";

const AddAtom = (props) => {
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
        .post(baseUrl + "/addNetwork ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
          } else {
            openSweetAlert(response?.data, "success");

            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllNetworks")
                .then((response) => {
                  props.setDataSource(response.data);
                  props.checkAtom(response.data);
                  props.setRowCount(response.data.length);
                })
                .catch((error) => {
                  console.log(error);
                })
            );
            return Promise.all(promises);
          }
        })
        .catch((error) => {
          console.log(error);
          openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      console.log(err);
    }
  };

  const device = props.addRecord;

  let [networkName, setNetworkName] = useState(
    device ? getString(device.network_name) : ""
  );
  let [subnet, setSubnet] = useState(device ? getString(device.subnet) : "");

  let [noOfDevices, setNoOfDevices] = useState(
    device ? getString(device.no_of_devices) : ""
  );
  let [scanStatus, setscanStatus] = useState(
    device ? getString(device.scan_status) : ""
  );
  let [excludedIpRange, setExcludedIpRange] = useState(
    device ? getString(device.excluded_ip_range) : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      network_name: networkName,
      subnet,
      no_of_devices: noOfDevices,
      scan_status: scanStatus,
      excluded_ip_range: excludedIpRange,
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
      width="60%"
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
          <Col span={24} style={{}}>
            <p
              style={{
                fontSize: "22px",
                float: "left",
                display: "flex",
                marginBottom: "30px",
              }}
            >
              Add Network
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
              Network Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={networkName}
                onChange={(e) =>
                  setNetworkName(
                    e.target.value.replace(
                      /[!^=&\/\\#;,+()$~%'":*?<>{}@_\-.]/g,

                      ""
                    )
                  )
                }
                required
              />
            </InputWrapper>

            <InputWrapper>
              Subnet: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={subnet}
                onChange={(e) =>
                  setSubnet(
                    e.target.value.replace(
                      /[!^=&\\\#;,+()$~%'":*?<>{}@_\-]/g,

                      ""
                    )
                  )
                }
                required
              />
            </InputWrapper>
          </Col>
          <Col span={10} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              Scan Status: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  required
                  onChange={(e) => setscanStatus(e.target.value)}
                >
                  <option value="">Choose...</option>

                  <option value="Active">Active</option>
                  <option value="InActive">InActive</option>
                </Styledselect>
              </div>
            </InputWrapper>
            <InputWrapper>
              Excluded Ip Range:
              {/* &nbsp;<span style={{ color: "red" }}>*</span>
              <br /> */}
              <StyledInput
                value={excludedIpRange}
                // required
                onChange={(e) =>
                  setExcludedIpRange(e.target.value.replace(/[^0-9-]+/g, ""))
                }
              />
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
  padding-left: 7px;
  padding-right: 7px;
  outline: none;
  border: 0.1px solid #cfcfcf;

  .ant-select-selection:hover {
    background-color: transparent;
  }

  .ant-select-dropdown-menu-item-active:not(
      .ant-select-dropdown-menu-item-disabled
    ),
  .ant-select-dropdown-menu-item:hover:not(
      .ant-select-dropdown-menu-item-disabled
    ) {
    background-color: #e5f2ff;
  }
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

export default AddAtom;
