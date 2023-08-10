import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import racks from "./assets/racks.svg";

const EditRackModel = (props) => {
  const { deviceInformation } = props;

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
        .post(baseUrl + "/editRack ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
          } else {
            openSweetAlert(response.data, "success");
            deviceInformation();
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllRacks")
                .then((response) => {
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

  const DType = ["Production", "Not Production"];

  let [device, setDevice] = useState(props.editRecord);

  let [rack_name, setRackName] = useState(
    device ? getString(device.rack_name) : ""
  );
  let [id, setRackID] = useState(device ? getString(device.rack_id) : "");
  let [oldrack_name, setOldRackName] = useState(
    device ? getString(device.rack_name) : ""
  );
  let [site_name, setsite_Name] = useState(
    device ? getString(device.site_name) : ""
  );

  let [serial_number, setserialNumber] = useState(
    device ? getString(device.serial_number) : ""
  );

  let [status, setStatus] = useState(device ? getString(device.status) : "");

  let [ru, setRu] = useState(device ? getString(device.ru) : "");

  let [height, setHeight] = useState(device ? getString(device.height) : "");
  let [myWidth, setMyWidth] = useState(device ? getString(device.width) : "");
  let [rack_model, setRackModel] = useState(
    device ? getString(device.rack_model) : ""
  );
  let [floor, setFloor] = useState(device ? getString(device.brand) : "");

  let type = null;

  if (type) {
    options = type.map((option) => <option>{option}</option>);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      rack_id: id,
      rack_name,
      old_rack_name: oldrack_name,
      site_name,
      serial_number,
      status,
      ru,
      height,
      width: myWidth,
      rack_model,
      floor,
    };

    props.setIsEditModalVisible(false);
    postDevice(device);
  };

  const handleCancel = () => {
    props.setIsEditModalVisible(false);
  };

  const [siteArray, setSiteArray] = useState([]);

  useEffect(() => {
    const getSitesForDropdown = async () => {
      try {
        const res = await axios.get(baseUrl + "/getSitesForDropdown");
        setSiteArray(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    getSitesForDropdown();
  }, [site_name]);

  return (
    <Modal
      style={{
        marginTop: "-70px",
        zIndex: "99999",
        textAlign: "center",
        alignContent: "center",
        padding: "0px",
      }}
      width="90%"
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
              <img src={racks} alt="" /> &nbsp; {device ? "Edit" : "Add"} Rack
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
          <Col span={7} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              Rack Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <StyledInput
                value={rack_name}
                onChange={(e) => setRackName(e.target.value)}
                required
                readOnly
              />
            </InputWrapper>
            <InputWrapper>
              Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  required
                  value={site_name}
                  onChange={(e) => {
                    setsite_Name(e.target.value);
                  }}
                >
                  <option value="">Select Site Name</option>
                  {siteArray.map((item, index) => {
                    return (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </Styledselect>
              </div>
            </InputWrapper>
            <InputWrapper>
              Serial Number:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <StyledInput
                value={serial_number}
                onChange={(e) => setserialNumber(e.target.value)}
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
                    return (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    );
                  })}
                </Styledselect>
              </div>
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "1%" }}>
            <InputWrapper>
              RU:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <StyledInput
                value={ru}
                onChange={(e) => setRu(e.target.value)}
                // required
              />
            </InputWrapper>

            <InputWrapper>
              Height:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <StyledInput
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                // required
              />
            </InputWrapper>

            <InputWrapper>
              Width:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <StyledInput
                value={myWidth}
                onChange={(e) => setMyWidth(e.target.value)}
                // required
              />
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "1%" }}>
            <InputWrapper>
              Rack Modal:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <StyledInput
                value={rack_model}
                onChange={(e) => setRackModel(e.target.value)}
                // required
              />
            </InputWrapper>

            <InputWrapper>
              Brand:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <StyledInput
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                // required
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
    box-shadow: #6ab344 0px 3px 8px !important;

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

export default EditRackModel;
