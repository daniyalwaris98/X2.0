import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../../../utils/axios";
import Swal from "sweetalert2";
// import board from "./assets/board.svg";
import {
  AddButtonStyle,
  DNSTestButtonStyle,
  SpinLoading,
} from "../../../AllStyling/All.styled.js";

const AddModel = (props) => {
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
        .post(baseUrl + "/addAWSCredentials", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
          } else {
            openSweetAlert(`Credentials Added Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAWSCredentials")
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

  //   let [license_id, setlicense_id] = useState(
  //     device ? getString(device.license_id) : ""
  //   );
  let [accountLabel, setaccountLabel] = useState("");
  let [awsAccessKey, setawsAccessKey] = useState("");
  let [awsSecretAccessKey, setawsSecretAccessKey] = useState("");
  //   let [site_name, setSite_name] = useState(
  //     device ? getString(device.site_name) : ""
  //   );

  let [ip_address, setip_address] = useState("");
  let [num_zone, setnum_zone] = useState(
    device ? getString(device.num_zone) : ""
  );
  const [testLoading, setTestLoading] = useState(false);
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
  //   let type = null;

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
  //   if (type) {
  //     options = type.map((option) => <option>{option}</option>);
  //   }

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      account_label: accountLabel,
      aws_access_key: awsAccessKey,
      aws_secret_access_key: awsSecretAccessKey,
    };

    props.setIsModalVisible(false);
    console.log("devices", device);
    postDevice(device);
  };

  const [conditionButton, setConditionButton] = useState("");

  const handleCancel = () => {
    props.setIsModalVisible(false);
  };
  const testAWSConnection = async () => {
    setTestLoading(true);
    const testing = {
      account_label: accountLabel,
      aws_access_key: awsAccessKey,
      aws_secret_access_key: awsSecretAccessKey,
    };
    console.log(testing);
    try {
      //console.log(device);
      // debugger;
      await axios
        .post(baseUrl + "/testAWSConnection ", testing)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            setTestLoading(false);
          } else {
            openSweetAlert(`Connection Tested Successfully`, "success");
            console.log(
              "objectobjectobjectobjectobjectobjectobjectobjectobject"
            );
            setTestLoading(false);
            setConditionButton("show");
          }
        })
        .catch((error) => {
          console.log("in add seed device catch ==> " + error);
          setTestLoading(false);
          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      console.log(err);
      setTestLoading(false);
    }
  };
  //   const getRackIdOptions = (values = []) => {
  //     let options = [];
  //     values.map((value) => {
  //       options.push(<Option value={value}>{value}</Option>);
  //     });
  //     setRackIdOptions(options);
  //     // return options;
  //   };

  //   const getOptions = (values = []) => {
  //     let options = [];
  //     values.map((value) => {
  //       options.push(<Option value={value}>{value}</Option>);
  //     });
  //     return options;
  //   };

  return (
    <Modal
      style={{
        // marginTop: "-70px",
        zIndex: "99999",
        textAlign: "center",
        alignContent: "center",
        padding: "0px",
        backgroundColor: "rgba(238, 235, 235, 0.86)",
      }}
      width="60%"
      title=""
      centered
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
          paddingRight: "30px",
          paddingLeft: "30px",
          backgroundColor: "rgba(238, 235, 235, 0.86)",
        }}
      >
        <Row style={{ alignContent: "center" }}>
          <Col span={24} style={{ margin: "5px 5px" }}>
            <p
              style={{
                fontSize: "22px",
                float: "left",
                display: "flex",
              }}
            >
              {/* <img src={board} alt="" /> &nbsp; */}
              Add Cloud
            </p>
          </Col>
          <Col span={11}>
            <InputWrapper>
              Account Label: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={department} />
                ) : ( */}
              <StyledInput
                value={accountLabel}
                onChange={(e) => setaccountLabel(e.target.value)}
                required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              AWS Access Key: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={awsAccessKey}
                onChange={(e) =>
                  setawsAccessKey(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
                required
              />
            </InputWrapper>
          </Col>
          <Col span={2}></Col>
          <Col span={11}>
            <InputWrapper>
              AWS Secret Access Key: &nbsp;
              <span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={awsSecretAccessKey}
                onChange={(e) => setawsSecretAccessKey(e.target.value)}
                required
              />
            </InputWrapper>

            {/* <InputWrapper>
              Password: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputWrapper> */}

            {/* <InputWrapper>
              <DNSTestButtonStyle style={{ width: "100%", marginTop: "18px" }}>
                Test DNS
              </DNSTestButtonStyle>
            </InputWrapper> */}
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={24}>
            <div
              style={{
                textAlign: "center",
                // float: "right",
                display: "flex",
                justifyContent: "center",
                // marginRight: "45px",
              }}
            >
              <StyledButton
                style={{
                  //   float: "right",
                  //   marginTop: "10px",
                  width: "120px",
                  marginLeft: "10px",
                  //   marginRight: "10px",
                  // paddingBottom: "5px",
                }}
                color={"#BBBABA"}
                onClick={handleCancel}
              >
                Cancel
              </StyledButton>
              &nbsp;&nbsp; &nbsp;&nbsp;
              {conditionButton === "show" ? (
                <StyledSubmitButton
                  style={{
                    //   float: "right",
                    width: "120px",
                    //   marginTop: "10px",
                    background:
                      "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                    border: "0px",
                    cursor: "pointer",
                  }}
                  color={"green"}
                  type="submit"
                  value="Done"
                />
              ) : (
                <StyledSubmitButton
                  disabled={true}
                  style={{
                    //   float: "right",
                    width: "120px",
                    //   marginTop: "10px",
                    // background:
                    //   "linear-gradient(270deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    border: "0px",
                    cursor: "no-drop",
                    color: "#fff",
                  }}
                  color={"#fff"}
                  type="submit"
                  value="Done"
                />
              )}
            </div>
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
      <div
        style={{
          backgroundColor: "rgba(238, 235, 235, 0.86)",
          marginTop: "-25px",
          paddingBottom: "15px",
        }}
      >
        {accountLabel !== "" &&
        awsAccessKey !== "" &&
        awsSecretAccessKey !== "" ? (
          <SpinLoading spinning={testLoading}>
            <DNSTestButtonStyle
              onClick={testAWSConnection}
              style={{ width: "110px" }}
            >
              Test DNS
            </DNSTestButtonStyle>
          </SpinLoading>
        ) : (
          <DNSTestButtonStyle
            disabled
            // onClick={testAWSConnection}
            style={{
              width: "110px",
              cursor: "no-drop",
              backgroundColor: "transparent",
              color: "#4AA446",
            }}
          >
            Test DNS
          </DNSTestButtonStyle>
        )}
      </div>
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
  /* font-family: Montserrat-Regular; */
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

export default AddModel;
