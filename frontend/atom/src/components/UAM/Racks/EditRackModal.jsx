import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import racks from "./assets/racks.svg";

const EditRackModel = (props) => {
  const { Option } = Select;

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
        .post(baseUrl + "/addRack ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.statusText, "error");
          } else {
            openSweetAlert(
              `Rack ${device ? "Updated" : "Updated"} Successfully`,
              "success"
            );
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllRacks")
                .then((response) => {
                  console.log(response.data);
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
  // let [pn_code, setPnCode] = useState(device ? getString(device.pn_code) : "");
  let [rack_model, setRackModel] = useState(
    device ? getString(device.rack_model) : ""
  );
  let [floor, setFloor] = useState(device ? getString(device.brand) : "");

  let type = null;

  /** This will be used to create set of options that user will see */
  let options = null;

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
      visible={props.isEditModalVisible}
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
                  // paddingBottom: "5px",
                }}
                color={"#BBBABA"}
                onClick={handleCancel}
              >
                Cancel
              </StyledButton>
            </div>
          </Col>
          <Col span={7} style={{ marginLeft: "6%" }}>
            {/* <InputWrapper>
              Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={ip_address} />
                ) : ( */}
            {/* <StyledInput
                value={site_name}
                onChange={(e) => setSiteId(e.target.value)}
                required
              /> */}
            {/* )} */}
            {/* </InputWrapper> */}
            <InputWrapper>
              Rack Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              {/* &nbsp;&nbsp; */}
              {/* {device ? (
                  <StyledInput value={site_name} />
                ) : ( */}
              {/* <Styledselect
                onChange={changeSelectOptionHandler}
                // style={{ color: "#f41" }}
              >
                <option>Choose...</option>
                <option>Algorithm</option>
                <option>Language</option>
                <option>Data Structure</option>
              </Styledselect> */}
              <StyledInput
                // readOnly
                value={rack_name}
                onChange={(e) => setRackName(e.target.value)}
                required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  // value={site_name}
                  required
                  onChange={(e) => {
                    setsite_Name(e.target.value);
                  }}
                >
                  {/* <option>Seleect Site Name</option> */}

                  {siteArray.map((item, index) => {
                    return (
                      <>
                        <option>{item}</option>
                      </>
                    );
                  })}

                  {/* <option>Choose...</option>

                <option>Algorithm</option>
                <option>Language</option>
                <option>Data Structure</option> */}
                </Styledselect>
              </div>
              {/* <StyledInput
                value={site_name}
                onChange={(e) => setSite_name(e.target.value)}
                required
              /> */}
              {/* )} */}
            </InputWrapper>
            {/* <label
              onClick={() => navigate("/uam/sites")}
              style={{
                float: "right",
                fontWeight: "600",
                color: "#6ab344",
                textDecoration: "underline",
                cursor: "pointer",
                marginRight: "10px",
              }}
            >
              + Add Site
            </label>
            <br /> */}
            {/* <InputWrapper> */}
            {/* Site Name: */}
            {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
            {/* &nbsp;&nbsp; */}
            {/* {device ? (
                  <StyledInput value={ip_address} />
                ) : ( */}
            {/* <StyledInput
                value={site_name}
                onChange={(e) => setsite_Name(e.target.value)} */}
            {/* // required */}
            {/* /> */}
            {/* )} */}
            {/* </InputWrapper> */}
            {/* <InputWrapper>
                Atom ID:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
            {/* &nbsp;&nbsp;
                {device ? (
                  <StyledInput value={atom_id}  />
                ) : (
                  <StyledInput
                    value={atom_id}
                    onChange={(e) => setAtom_id(e.target.value)}
                  />
                )}
              </InputWrapper> */}
            <InputWrapper>
              Serial Number:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={device_ru} />
                ) : ( */}
              <StyledInput
                value={serial_number}
                onChange={(e) => setserialNumber(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            {/* <InputWrapper>
              Manufacture Date:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {device ? (
                  <StyledInput value={department} />
                ) : (
              <StyledInput
                value={manufacturer_date}
                onChange={(e) => setmanufacture_date(e.target.value)}
                // required
              />
             
            </InputWrapper> */}
            {/* <InputWrapper>
              Unit Position:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
             
              <StyledInput
                value={unit_position}
                onChange={(e) => setUnit_position(e.target.value)}
                // required
              />
           
            </InputWrapper> */}
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
                  {/* <option value="" style={{ color: "rgba(0,0,0,0.1)" }}>
                      Select Status
                    </option> */}
                  {DType.map((item, index) => {
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
          <Col span={7} style={{ marginLeft: "1%" }}>
            <InputWrapper>
              RU:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={ru}
                onChange={(e) => setRu(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            {/* <InputWrapper>
              RFS Date:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
             
              <StyledInput
                value={rfs_date}
                onChange={(e) => setRfs_dt(e.target.value)}
                // required
              />
             
            </InputWrapper> */}
            <InputWrapper>
              Height:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            {/* <InputWrapper>
              Total Count:
               &nbsp;<span style={{ color: "red" }}>*</span> 
              &nbsp;&nbsp;
               {device ? (
                  <StyledInput value={myfunction} />
                ) : ( 
              <StyledInput
                value={total_count}
                onChange={(e) => setTotalCount(e.target.value)}
                // required
              />

            </InputWrapper> */}
            <InputWrapper>
              Width:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={myWidth}
                onChange={(e) => setMyWidth(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            {/* <InputWrapper>
              Depth:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;

              <StyledInput
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                // required
              />
            
            </InputWrapper> */}
          </Col>
          <Col span={7} style={{ marginLeft: "1%" }}>
            {/* <InputWrapper>
              PN Code:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
            
              <StyledInput
                value={pn_code}
                onChange={(e) => setPnCode(e.target.value)}
                // required
              />
            
            </InputWrapper> */}
            <InputWrapper>
              Rack Modal:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={rack_model}
                onChange={(e) => setRackModel(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              Brand:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                // required
              />
              {/* )} */}
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
  // white-space: nowrap;
  // display: flex;
  // justify-content: space-between;
  padding-bottom: 10px;
`;

const StyledSubmitButton = styled(Input)`
  font-size: 15px;

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
    box-shadow: #6ab344 0px 3px 8px !important;

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

export default EditRackModel;
