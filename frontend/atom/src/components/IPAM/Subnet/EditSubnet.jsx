import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select, Checkbox } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
// import "../AllStyling/CSSStyling.css";

const EditSubnet = (props) => {
  const { Option } = Select;

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

  let [loading, setLoading] = useState(false);
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
        .post(baseUrl + "/editSubnet", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data?.response, "error");
          } else {
            openSweetAlert("Subnet Updated Successfully", "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllSubnets")
                .then((response) => {
                  console.log(response.data);
                  props.setDataSource(response.data);
                  props.excelData = response.data;
                  props.setRowCount(response.data.length);
                  props.excelData = response.data;
                })
                .catch((error) => {
                  console.log(error);
                  // openSweetAlert("Something Went Wrong!", "error");
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

  let [subnet, setSubnet] = useState(
    device ? getString(device.subnet_address) : ""
  );
  let [subnet_id, setSubnetId] = useState(
    device ? getString(device.subnet_id) : ""
  );
  let [subnet_name, setSubnetName] = useState(
    device ? getString(device.subnet_name) : ""
  );
  let [subnet_mask, setSubnetMask] = useState(
    device ? getString(device.subnet_mask) : ""
  );
  let [location, setLocation] = useState(
    device ? getString(device.location) : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      subnet_id,
      subnet_address: subnet,
      subnet_mask,
      subnet_name,
      location,
    };

    props.setIsEditModalVisible(false);
    console.log("devices", device);
    postDevice(device);
  };
  //   const changeSelectOptionHandler = (event) => {
  //     setSite_name(event.target.value);
  //     // setRack_name(event.target.value);
  //     // const res = axios.get(baseUrl + "/getSitesForDropdown");
  //     // console.log("getSitesForDropdown", res);
  //     // // setSiteArray(res.data);
  //     // console.log("a", res.data[0]);
  //     // setSite_name(res.data);
  //     // setLoading(false);
  //     console.log(site_name);
  //     console.log(rack_name);
  //   };
  //   useEffect(() => {
  //     // const GroupDropdown = async (event) => {
  //     //   setSite_name(event.target.value);
  //     //   // setRack_name(event.target.value);
  //     //   console.log(site_name);
  //     //   console.log(rack_name);
  //     // };
  //     // GroupDropdown(event);

  //     // const changeSelectOptionHandler = (event) => {
  //     //   setSite_name(event.target.value);
  //     //   // setRack_name(event.target.value);
  //     //   console.log(site_name);
  //     //   console.log(rack_name);
  //     // };
  //     // changeSelectOptionHandler(event);
  //     console.log(site_name);
  //     console.log(rack_name);
  //   }, [site_name, rack_name]);

  //   const [siteArray, setSiteArray] = useState([]);
  //   useEffect(() => {
  //     const getSitesForDropdown = async () => {
  //       setLoading(true);

  //       try {
  //         const res = await axios.get(baseUrl + "/getSitesForDropdown");
  //         console.log("getSitesForDropdown", res);
  //         setSiteArray(res.data);
  //         // setSite_name(res.data[0]);
  //         setLoading(false);
  //       } catch (err) {
  //         console.log(err.response);
  //         setLoading(false);
  //       }
  //     };
  //     getSitesForDropdown();
  //   }, [site_name]);

  //   const [rackArray, setRackArray] = useState([]);

  //   useEffect(() => {
  //     const getRacksBySiteDropdown = async () => {
  //       setLoading(true);

  //       try {
  //         const res = await axios.get(
  //           `${baseUrl}/getRacksBySiteDropdown?site_name=${site_name}`
  //         );
  //         console.log("getRacksBySiteDropdown", res);
  //         setRackArray(res.data);
  //         console.log(res.data[0]);
  //         // setRack_name(res.data[0]);
  //         // setRack_name(rack_name);
  //         setRack_name(rack_name);
  //         setLoading(false);
  //       } catch (err) {
  //         console.log(err.response);
  //         setLoading(false);
  //       }
  //     };
  //     getRacksBySiteDropdown();
  //   }, [site_name]);
  //   const [passwordArray, setPasswordArray] = useState([]);

  //   console.log(rack_name);

  //   useEffect(() => {
  //     const getPasswordGroupDropdown = async () => {
  //       setLoading(true);

  //       try {
  //         const res = await axios.get(baseUrl + "/getPasswordGroupDropdown");

  //         console.log("getRacksBySiteDropdown", res);
  //         setPasswordArray(res.data);
  //         setLoading(false);
  //       } catch (err) {
  //         console.log(err.response);
  //         setLoading(false);
  //       }
  //     };
  //     getPasswordGroupDropdown();
  //   }, [password_group]);

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
      width="40%"
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
          <Col span={24} style={{}}>
            <p style={{ fontSize: "22px", float: "left", display: "flex" }}>
              {device ? "Edit" : "Add"} Subnet
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
              Subnet: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={subnet}
                onChange={(e) => setSubnet(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              Subnet Name:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <StyledInput
                value={subnet_name}
                onChange={(e) =>
                  setSubnetName(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
                // required
              />
            </InputWrapper>
            <InputWrapper>
              Subnet Mask: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={subnet_mask}
                onChange={(e) => setSubnetMask(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              Location:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <StyledInput
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                // required
              />
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
