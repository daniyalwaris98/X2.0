import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../utils/axios";
import Swal from "sweetalert2";
import ipimg from "./assets/ips.svg";
import {
  TableStyling,
  StyledImportFileInput,
  StyledButton,
  OnBoardStyledButton,
  AddAtomStyledButton,
  StyledExportButton,
  StyledInput,
  Styledselect,
  InputWrapper,
  StyledSubmitButton,
  StyledModalButton,
  ColStyling,
  AddStyledButton,
  TableStyle,
} from "../AllStyling/All.styled.js";

const AddIPAMModal = (props) => {
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

  const postDevice = async (device) => {
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/addIpam ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data?.response, "error");
          } else {
            openSweetAlert(
              `IPAM ${device ? "Added" : "Added"} Successfully`,
              "success"
            );
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllIpam")
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

  // let [id, setId] = useState(device ? getString(device.id) : "");
  let [region, setregion] = useState(device ? getString(device.region) : "");
  let [site_name, setsite_id] = useState(
    device ? getString(device.site_name) : ""
  );
  let [device_name, setdevice_id] = useState(
    device ? getString(device.device_name) : ""
  );
  let [ip_address, setip_address] = useState(
    device ? getString(device.ip_address) : ""
  );
  let [subnet_mask, setsubnet_mask] = useState(
    device ? getString(device.subnet_mask) : ""
  );
  let [subnet, setsubnet] = useState(device ? getString(device.subnet) : "");
  let [protocol_status, setprotocol_status] = useState(
    device ? getString(device.protocol_status) : ""
  );
  let [admin_status, setadmin_status] = useState(
    device ? getString(device.admin_status) : ""
  );
  let [vlan, setvlan] = useState(device ? getString(device.vlan) : "");
  let [interface_name, setinterface_name] = useState(
    device ? getString(device.interface_name) : ""
  );
  let [vlan_name, setvlan_name] = useState(
    device ? getString(device.vlan_name) : ""
  );
  let [virtual_ip, setvirtual_ip] = useState(
    device ? getString(device.virtual_ip) : ""
  );
  let [description, setinterface_description] = useState(
    device ? getString(device.description) : ""
  );
  // let [creation_date, setcreation_date] = useState(
  //   device ? getString(device.creation_date) : ""
  // );
  // let [modification_date, setmodification_date] = useState(
  //   device ? getString(device.modification_date) : ""
  // );
  let [management_ip, setmanagement_ip] = useState(
    device ? getString(device.management_ip) : ""
  );
  let [site_type, setsite_type] = useState(
    device ? getString(device.site_type) : ""
  );

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
      region,
      site_name,
      device_name,
      ip_address,
      subnet_mask,
      subnet,
      protocol_status,
      admin_status,
      vlan,
      interface_name,
      vlan_name,
      virtual_ip,
      description,

      management_ip,
      site_type,
    };

    props.setIsModalVisible(false);
    console.log("devices", device);
    postDevice(device);
  };

  const handleCancel = () => {
    props.setIsModalVisible(false);
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
      width="70%"
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
            <p style={{ fontSize: "22px", float: "left", display: "flex" }}>
              <img src={ipimg} alt="" /> &nbsp; {device ? "Edit" : "Add"} IPAM
              Device
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
          <Col span={7} style={{ marginLeft: "6%" }}>
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
              Region: &nbsp;<span style={{ color: "red" }}>*</span>
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
                value={region}
                onChange={(e) =>
                  setregion(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
                required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <StyledInput
                value={site_name}
                onChange={(e) =>
                  setsite_id(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
                required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Device Name:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={device_name} />
                ) : ( */}
              <StyledInput
                value={device_name}
                onChange={(e) =>
                  setdevice_id(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
                // required
              />
              {/* )
                } */}
            </InputWrapper>
            <InputWrapper>
              Ip Address:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={device_ru} />
                ) : ( */}
              <StyledInput
                value={ip_address}
                onChange={(e) => setip_address(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Subnet Mask:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={department} />
                ) : ( */}
              <StyledInput
                value={subnet_mask}
                onChange={(e) => setsubnet_mask(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "1%" }}>
            <InputWrapper>
              Subnet:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={section} />
                ) : ( */}
              <StyledInput
                value={subnet}
                onChange={(e) => setsubnet(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              Protocol Status:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={criticality} />
                ) : ( */}
              <StyledInput
                value={protocol_status}
                onChange={(e) => setprotocol_status(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Admin Status:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={admin_status}
                onChange={(e) => setadmin_status(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              VLAN:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={vlan}
                onChange={(e) => setvlan(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Interface Name:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={virtual} />
                ) : ( */}
              <StyledInput
                value={interface_name}
                onChange={(e) => setinterface_name(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "1%" }}>
            <InputWrapper>
              Virtual Ip: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={virtual_ip}
                onChange={(e) => setvirtual_ip(e.target.value)}
                required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              Description: &nbsp;
              <span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={description}
                onChange={(e) =>
                  setinterface_description(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
                required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              Management Ip: &nbsp;
              <span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={management_ip}
                onChange={(e) => setmanagement_ip(e.target.value)}
                required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Site Type: &nbsp;
              <span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={site_type}
                onChange={(e) => setsite_type(e.target.value)}
                required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              VLAN Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={device_type} />
                ) : ( */}
              <StyledInput
                value={vlan_name}
                onChange={(e) => setvlan_name(e.target.value)}
                required
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

// const StyledInput = styled(Input)`
//   height: 2.2rem;
//   border-radius: 12px;
// `;
// const Styledselect = styled.select`
//   height: 2.2rem;
//   border-radius: 12px;
//   width: 100%;
//   outline: none;
//   border: 0.1px solid #cfcfcf;
// `;

// const InputWrapper = styled.div`
//   text-align: left;
//   font-size: 12px;
//   // white-space: nowrap;
//   // display: flex;
//   // justify-content: space-between;
//   padding-bottom: 10px;
// `;

// const StyledSubmitButton = styled(Input)`
//   font-size: 15px;
//   height: 27px;

//   // font-weight: bolder;
//   // width: 15%;
//   padding: auto;
//   // text-align: center;
//   font-family: Montserrat-Regular;
//   box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
//   background-color: ${(props) => props.color};
//   border-color: ${(props) => props.color};
//   color: white;
//   border-radius: 5px;
//   &:focus,
//   &:hover {
//     background-color: ${(props) => props.color};
//     border-color: ${(props) => props.color};
//     color: white;
//     opacity: 0.8;
//   }
// `;

// const StyledButton = styled(Button)`
//   height: 27px;
//   font-size: 15px;
//   // font-weight: bolder;
//   // width: 15%;
//   font-family: Montserrat-Regular;
//   box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
//   background-color: ${(props) => props.color};
//   border-color: ${(props) => props.color};
//   color: white;
//   border-radius: 5px;
//   &:focus,
//   &:hover {
//     background-color: ${(props) => props.color};
//     border-color: ${(props) => props.color};
//     color: white;
//     opacity: 0.8;
//   }
// `;

export default AddIPAMModal;
