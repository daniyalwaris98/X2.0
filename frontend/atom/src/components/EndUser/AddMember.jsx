import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select, Switch } from "antd";
import axios, { baseUrl } from "../../utils/axios";
import Swal from "sweetalert2";
import { ReactComponent as profile } from "./assets/profile.svg";
import Password from "antd/lib/input/Password";

const AddMember = (props) => {
  const { Option } = Select;
  const [optionValue, setOptionValue] = useState("");
  const children = [];
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
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
  const onChangeActive = (checked) => {
    console.log(`switch to ${checked}`);
  };

  const postDevice = async (device) => {
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/addEndUser ", device)
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
                .get(baseUrl + "/getAllEndUserDetails")
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

  let [device, setDevice] = useState(props.addRecord);
  let [email, setemail_address] = useState(
    device ? getString(device.email) : ""
  );
  let [companyName, setCompanyName] = useState(
    device ? getString(device.company_name) : ""
  );
  let [POBox, setPOBox] = useState(device ? getString(device.po_box) : "");
  let [address, setAddress] = useState(device ? getString(device.address) : "");

  // let [device, setDevice] = useState(props.editRecord);

  // let [user_id, setuser_id] = useState(device ? getString(device.user_id) : "");
  let [streetName, setStreetName] = useState(
    device ? getString(device.street_name) : ""
  );

  let [streetNumber, setStreetNumber] = useState(
    device ? getString(device.street_number) : ""
  );
  let [city, setcity] = useState(device ? getString(device.city) : "");
  // let [paassword, setpassword] = useState(device ? getString(device.name) : "");
  let [country, setCountry] = useState(device ? getString(device.country) : "");
  // let [status, setstatus] = useState(device ? getString(device.status) : "");
  let [contactPerson, setContactPerson] = useState(
    device ? getString(device.contact_person) : ""
  );
  let [contactNumber, setContactNumber] = useState(
    device ? getString(device.contact_number) : ""
  );
  let [domainName, setdDomainName] = useState(
    device ? getString(device.domain_name) : ""
  );
  let [industryType, setIndustryType] = useState(
    device ? getString(device.industry_type) : ""
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
      company_name: companyName,
      po_box: POBox,
      address,
      street_name: streetName,
      city,
      country,
      contact_person: contactPerson,
      contact_number: contactNumber,
      email,
      domain_name: domainName,
      industry_type: industryType,
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

  const [roleArray, setRoleArray] = useState([]);

  // useEffect(() => {
  //   const getPasswordGroupDropdown = async () => {
  //     // setLoading(true);

  //     try {
  //       const res = await axios.get(baseUrl + "/getAllRoles");

  //       console.log("getAllRoles", res);
  //       setRoleArray(res.data);
  //       setrole(res.data[0]);

  //       // setLoading(false);
  //     } catch (err) {
  //       console.log(err.response);
  //       // setLoading(false);
  //     }
  //   };
  //   getPasswordGroupDropdown();
  // }, []);

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
              <img src={profile} alt="" /> &nbsp; Add End-User
            </p>
            {/* <div
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
              <StyledSubmitButton
                style={{
                  display: "none",
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
                  display: "none",
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
            </div> */}
          </Col>
          <Col span={7} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              Company Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <StyledInput
                value={companyName}
                onChange={(e) =>
                  setCompanyName(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
                required
              />
            </InputWrapper>
            {/* <InputWrapper>
              User Id : &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                value={user_id}
                onChange={(e) => setuser_id(e.target.value)}
                required
              />
            </InputWrapper> */}

            <InputWrapper>
              PO Box: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={POBox}
                onChange={(e) => setPOBox(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              Email Address:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="email"
                value={email}
                onChange={(e) => setemail_address(e.target.value)}
                // required
              />
            </InputWrapper>
            <InputWrapper>
              Industry Type : &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={industryType}
                onChange={(e) => setIndustryType(e.target.value)}
                // required
              />
            </InputWrapper>
            {/* <InputWrapper>
              Vendor:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                value={vendor}
                onChange={(e) => setvendor(e.target.value)}
                // required
              />
            </InputWrapper> */}
          </Col>
          <Col span={7} style={{ marginLeft: "2%" }}>
            {/* <InputWrapper>
              Team: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                value={team}
                onChange={(e) => setteam(e.target.value)}
                required
              />
            </InputWrapper> */}
            <InputWrapper>
              Address:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                // required
              />
            </InputWrapper>

            {/* <InputWrapper>
              Status: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <StyledInput
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
              />
            </InputWrapper> */}

            <InputWrapper>
              Street Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={streetName}
                onChange={(e) => setStreetName(e.target.value)}
                // required
              />
            </InputWrapper>

            <InputWrapper>
              City: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                value={city}
                onChange={(e) => setcity(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              Domain Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={domainName}
                onChange={(e) => setdDomainName(e.target.value)}
                // required
              />
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "2%" }}>
            <InputWrapper>
              Country: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <StyledInput
                value={country}
                onChange={(e) =>
                  setCountry(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
                required
              />
            </InputWrapper>
            <InputWrapper>
              Contact Person: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                // required
              />
            </InputWrapper>
            <InputWrapper>
              Contact Number: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                // required
              />
            </InputWrapper>
          </Col>
        </Row>
        <br />
        {/* <StyledSubmitButton
          type="submit"
          value="Done"
          style={{
            height: "40px",
            color: "white",
            backgroundColor: "#66B127",
          }}
        >
          <b>+</b> &nbsp; Add Member
        </StyledSubmitButton> */}
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
        {/* <StyledSubmitButton
          onClick={handleCancel}
          style={{
            alignItems: "center",
            textAlign: "center",
            width: "25%",
            marginTop: "10px",
            cursor: "pointer",
          }}
          color={"#FF0200"}
          value="Cancel"
        />
        &nbsp; &nbsp; */}
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
          value="+ Add End-User"
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
  .ant-select:not(.ant-select-customize-input) > .ant-select-selector {
    height: 2rem;

    /* border-radius: 12px; */
  }

  height: 2rem;
  /* border-radius: 12px; */
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
  height: 40px;

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
  height: 27px;
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

export default AddMember;
