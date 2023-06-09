import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import board from "./assets/board.svg";
import {
  AddButtonStyle,
  DNSTestButtonStyle,
  SpinLoading,
} from "../../AllStyling/All.styled.js";

const AddDNSModel = (props) => {
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
        .post(baseUrl + "/addDns ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data?.response, "error");
          } else {
            openSweetAlert(`DNS Added Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllDnsServers")
                .then((response) => {
                  console.log(response.data);
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

  let [server_name, setserver_name] = useState("");
  let [password, setPassword] = useState("");
  let [username, setUsername] = useState("");
  let [ip_address, setip_address] = useState("");

  const [testLoading, setTestLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      password,
      username,
      server_name,
      ip_address,
    };

    props.setIsModalVisible(false);
    postDevice(device);
  };

  const [conditionButton, setConditionButton] = useState("");

  const handleCancel = () => {
    props.setIsModalVisible(false);
  };

  const testDns = async () => {
    setTestLoading(true);
    const testing = {
      password,
      username,
      server_name,
      ip_address,
    };

    try {
      await axios
        .post(baseUrl + "/testDns ", testing)
        .then((response) => {
          console.log(response);

          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            setTestLoading(false);
          } else {
            openSweetAlert(`DNS Tested Successfully`, "success");
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

  return (
    <Modal
      style={{
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
      visible={props.isModalVisible}
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
              <img src={board} alt="" /> &nbsp; Add DNS
            </p>
          </Col>
          <Col span={11}>
            <InputWrapper>
              IP Address: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={department} />
                ) : ( */}
              <StyledInput
                value={ip_address}
                onChange={(e) => setip_address(e.target.value)}
                required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Server Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={server_name}
                onChange={(e) =>
                  setserver_name(
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
              Username: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={username}
                onChange={(e) =>
                  setUsername(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
                required
              />
            </InputWrapper>

            <InputWrapper>
              Password: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputWrapper>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={24}>
            <div
              style={{
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <StyledButton
                style={{
                  width: "120px",
                  marginLeft: "10px",
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
                    width: "120px",

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
                    width: "120px",
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
        &nbsp; &nbsp;
      </form>
      <div
        style={{
          backgroundColor: "rgba(238, 235, 235, 0.86)",
          marginTop: "-25px",
          paddingBottom: "15px",
        }}
      >
        {ip_address !== "" &&
        username !== "" &&
        server_name !== "" &&
        password !== "" ? (
          <SpinLoading spinning={testLoading}>
            <DNSTestButtonStyle onClick={testDns} style={{ width: "110px" }}>
              Test DNS
            </DNSTestButtonStyle>
          </SpinLoading>
        ) : (
          <DNSTestButtonStyle
            disabled
            onClick={testDns}
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

export default AddDNSModel;
