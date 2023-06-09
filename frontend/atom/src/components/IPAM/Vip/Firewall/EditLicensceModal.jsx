import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import board from "../assets/boards.svg";

const AddLicensceModel = (props) => {
  const { Option } = Select;
  const children = [];

  // for (let i = 10; i < 36; i++) {
  //   children.push(
  //     <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
  //   );
  // }
  // const [selected, setSelected] = useState("");
  // const [lang, setLang] = useState("");

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

  // useEffect(() => {
  //     (async () => {
  //       try {
  //         const res1 = await axios.get(baseUrl + "/getAllSiteIDs");
  //         setSiteIds(res1.data);
  //         const res2 = await axios.get(baseUrl + "/getAllRackIDs");
  //         setRackIds(res2.data);
  //       } catch (err) {
  //         console.log(err.response);
  //       }
  //     })();
  //   }, []);

  // useEffect(() => {
  //     getSiteIdOptions(siteIds);
  //     getRackIdOptions(rackIds);
  //   }, [siteIds, rackIds]);

  //   const getSiteIdOptions = (values = []) => {
  //     let options = [];
  //     values.map((value) => {
  //       options.push(<Option value={value}>{value}</Option>);
  //     });
  //     setSiteIdOptions(options);
  //     // return options;
  //   };
  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };

  //   const postDevice = async (device) => {
  //     try {
  //       //console.log(device);
  //       await axios
  //         .post(baseUrl + "/addAtomDevice ", device)
  //         .then((response) => {
  //           if (response?.response?.status == 500) {
  //             openSweetAlert(response?.response?.data?.response, "error");
  //           } else {
  //             openSweetAlert(
  //               `Device ${device ? "Updated" : "Added"} Successfully`,
  //               "success"
  //             );
  //             const promises = [];
  //             promises.push(
  //               axios
  //                 .get(baseUrl + "/getAtoms")
  //                 .then((response) => {
  //                   console.log(response.data);
  //                   props.setDataSource(response.data);
  //                   props.excelData = response.data;
  //                   props.setRowCount(response.data.length);
  //                   props.excelData = response.data;
  //                 })
  //                 .catch((error) => {
  //                   console.log(error);
  //                   //  openSweetAlert("Something Went Wrong!", "error");
  //                 })
  //             );
  //             return Promise.all(promises);
  //           }
  //         })
  //         .catch((error) => {
  //           console.log("in add seed device catch ==> " + error);
  //           // openSweetAlert("Something Went Wrong!", "error");
  //         });
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  let [device, setDevice] = useState(props.editRecord);

  let [license_id, setlicense_id] = useState(
    device ? getString(device.license_id) : ""
  );
  let [license_name, setlicense_name] = useState(
    device ? getString(device.license_name) : ""
  );
  //   let [site_name, setSite_name] = useState(
  //     device ? getString(device.site_name) : ""
  //   );

  let [license_description, setlicense_description] = useState(
    device ? getString(device.license_description) : ""
  );
  let [ne_name, setne_name] = useState(device ? getString(device.ne_name) : "");
  let [rfs_dt, setrfs_dt] = useState(device ? getString(device.rfs_dt) : "");
  let [activation_dt, setactivation_dt] = useState(
    device ? getString(device.activation_dt) : ""
  );
  let [expiry_dt, setexpiry_dt] = useState(
    device ? getString(device.expiry_dt) : ""
  );
  let [grace_period, setgrace_period] = useState(
    device ? getString(device.grace_period) : ""
  );
  let [serial_number, setserial_number] = useState(
    device ? getString(device.serial_number) : ""
  );

  let [creation_dt, setcreation_dt] = useState(
    device ? getString(device.creation_dt) : ""
  );
  let [modifed_dt, setmodifed_dt] = useState(
    device ? getString(device.modifed_dt) : ""
  );
  let [status, setstatus] = useState(
    device ? getString(device.creation_dt) : ""
  );

  let [tag_id, settag_id] = useState(device ? getString(device.tag_id) : "");
  let [capacity, setcapacity] = useState(
    device ? getString(device.capacity) : ""
  );
  let [usage, setusage] = useState(device ? getString(device.usage) : "");

  let [pn_code, setpn_code] = useState(device ? getString(device.pn_code) : "");
  //   const changeSelectOptionHandler = (event) => {
  //     setSite_name(event.target.value);
  //     setRack_name(event.target.value);
  //     console.log(site_name);
  //     console.log(rack_name);
  //   };
  //   useEffect(() => {
  //     console.log(site_name);
  //     console.log(rack_name);
  //   }, [site_name, rack_name]);
  const algorithm = [
    "Searching Algorithm",
    "Sorting Algorithm",
    "Graph Algorithm",
  ];
  const language = ["C++", "Java", "Python", "C#"];
  const dataStructure = ["Arrays", "LinkedList", "Stack", "Queue"];

  /** Type variable to store different array for different dropdown */
  let type = null;

  /** This will be used to create set of options that user will see */
  let options = null;

  /** Setting Type variable according to dropdown */
  //   if (site_name === "Algorithm") {
  //     type = algorithm;
  //   } else if (site_name === "Language") {
  //     type = language;
  //   } else if (site_name === "Data Structure") {
  //     type = dataStructure;
  //   }

  /** If "Type" is null or undefined then options will be null,
   * otherwise it will create a options iterable based on our array
   */
  if (type) {
    options = type.map((option) => <option>{option}</option>);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      license_id,
      license_name,
      license_description,
      ne_name,
      rfs_dt,
      activation_dt,
      expiry_dt,
      grace_period,
      serial_number,
      creation_dt,
      modifed_dt,
      status,
      tag_id,
      capacity,
      usage,
      pn_code,
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
    // return options;
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
        marginTop: "-70px",
        zIndex: "99999",
        textAlign: "center",
        alignContent: "center",
        padding: "0px",
      }}
      width="50%"
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
              <img src={board} alt="" /> &nbsp; {device ? "Edit" : "Add"} Site
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
              license_name:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={device_name} />
                ) : ( */}
              <StyledInput
                value={license_name}
                onChange={(e) => setlicense_name(e.target.value)}
                // required
              />
              {/* )
                } */}
            </InputWrapper>
            <InputWrapper>
              license_description:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={device_ru} />
                ) : ( */}
              <StyledInput
                value={license_description}
                onChange={(e) => setlicense_description(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              ne_name:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={department} />
                ) : ( */}
              <StyledInput
                value={ne_name}
                onChange={(e) => setne_name(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              rfs_dt:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={section} />
                ) : ( */}
              <StyledInput
                value={rfs_dt}
                onChange={(e) => setrfs_dt(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              activation Date:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={criticality} />
                ) : ( */}
              <StyledInput
                value={activation_dt}
                onChange={(e) => setactivation_dt(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "1%" }}>
            <InputWrapper>
              expiry_dt:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={expiry_dt}
                onChange={(e) => setexpiry_dt(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              grace_period:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={grace_period}
                onChange={(e) => setgrace_period(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              serial_number:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={serial_number}
                onChange={(e) => setserial_number(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              creation_dt:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={creation_dt}
                onChange={(e) => setcreation_dt(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              modifed_dt:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={modifed_dt}
                onChange={(e) => setmodifed_dt(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "1%" }}>
            <InputWrapper>
              status:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={status}
                onChange={(e) => setstatus(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              capacity :{/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={capacity}
                onChange={(e) => setcapacity(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              usage:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={usage}
                onChange={(e) => setusage(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              pn_code:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={pn_code}
                onChange={(e) => setpn_code(e.target.value)}
                // required
              />
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

const StyledButton = styled(Button)`
  font-size: 15px;
  // font-weight: bolder;
  // width: 15%;
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

export default AddLicensceModel;
