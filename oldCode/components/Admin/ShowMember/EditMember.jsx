import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select, Switch } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import profile from "../assets/profile.svg";
import Password from "antd/lib/input/Password";

const EditMember = (props) => {
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
        .post(baseUrl + "/addSite ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data?.response, "error");
          } else {
            openSweetAlert(
              `Device ${device ? "Updated" : "Added"} Successfully`,
              "success"
            );
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllSites")
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

  let [device, setDevice] = useState(props.editRecord);

  let [user_id, setuser_id] = useState(device ? getString(device.user_id) : "");
  let [email_address, setemail_address] = useState(
    device ? getString(device.email_address) : ""
  );

  let [name, setname] = useState(device ? getString(device.name) : "");
  // let [paassword, setpassword] = useState(device ? getString(device.name) : "");
  let [role, setrole] = useState(device ? getString(device.role) : "");
  let [status, setstatus] = useState(device ? getString(device.status) : "");
  let [city, setcity] = useState(device ? getString(device.city) : "");
  let [password, setpassword] = useState(
    device ? getString(device.password) : ""
  );
  let [team, setteam] = useState(device ? getString(device.team) : "");
  let [vendor, setvendor] = useState(device ? getString(device.vendor) : "");

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
      user_id,
      email_address,
      // latitude,
      // longitude,
      city,
      name,
      password,
      role,
      status,
      team,
      vendor,
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
        marginTop: "0px",
        zIndex: "99999",
        textAlign: "center",
        alignContent: "center",
        padding: "0px",
      }}
      width="80%"
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
              <img src={profile} alt="" /> &nbsp; {device ? "Edit" : "Add"} Site
            </p>
            <div
              style={{
                float: "right",
                display: "flex",
                marginRight: "45px",
              }}
            >
              Active &nbsp;
              <Switch
                defaultChecked
                onChange={onChangeActive}
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
            </div>
          </Col>
          <Col span={7} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <StyledInput
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              Password: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                required
              />
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "2%" }}>
            <InputWrapper>
              User Id : &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                value={user_id}
                onChange={(e) => setuser_id(e.target.value)}
                required
              />
            </InputWrapper>

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
              Team: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <Select
                // value="jack"
                // defaultValue="lucy"
                style={{
                  width: "100%",
                  // marginTop: "19px",
                  // height: "3rem",
                }}
                onChange={(e) => setteam(e)}
              >
                <option value="jack">Jack</option>
                <option value="jak">Jak</option>
                <option value="jac">Jac</option>
                <option value="ja">Ja</option>
              </Select>
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "2%" }}>
            <InputWrapper>
              Email Address: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                type="email"
                value={email_address}
                onChange={(e) => setemail_address(e.target.value)}
                required
              />
            </InputWrapper>

            {/* <InputWrapper>
              Vendor: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <br />
              <StyledInput
                value={vendor}
                onChange={(e) => setvendor(e.target.value)}
                required
              />
            </InputWrapper> */}
            <InputWrapper>
              Vender: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <Select
                // value="jack"
                // defaultValue="lucy"
                style={{
                  width: "100%",
                  // marginTop: "19px",
                  // height: "3rem",
                }}
                onChange={(e) => setvendor(e)}
              >
                <option value="jack">Jack</option>
                <option value="jak">Jak</option>
                <option value="jac">Jac</option>
                <option value="ja">Ja</option>
              </Select>
            </InputWrapper>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div style={{ marginLeft: "6%", marginRight: "3%" }}>
              <InputWrapper>
                Role: &nbsp;<span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                <Select
                  // value="jack"
                  // defaultValue="lucy"
                  style={{
                    width: "100%",
                    // marginTop: "19px",
                    // height: "3rem",
                  }}
                  onChange={(e) => setrole(e)}
                >
                  <option value="jack">Jack</option>
                  <option value="jak">Jak</option>
                  <option value="jac">Jac</option>
                  <option value="ja">Ja</option>
                </Select>
              </InputWrapper>
            </div>
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
        <StyledSubmitButton
          style={{
            alignItems: "center",
            textAlign: "center",
            width: "25%",
            marginTop: "10px",
          }}
          color={"green"}
          type="submit"
          value="+ Add Member"
        />
      </form>
    </Modal>
  );
};

const StyledInput = styled(Input)`
  height: 2rem;
  border-radius: 2px;
`;
const Styledselect = styled.select`
  .ant-select:not(.ant-select-customize-input) > .ant-select-selector {
    height: 2.2rem;
    border-radius: 12px;
  }

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

export default EditMember;
