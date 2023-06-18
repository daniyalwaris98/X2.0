import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../utils/axios";
import Swal from "sweetalert2";

const AddAtom = (props) => {
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
        .post(baseUrl + "/addUser", device)

        .then((response) => {
          // console.log(response?.status);
          console.log(response?.response?.status);
          if (response?.response?.status == 500) {
            // openSweetAlert(response?.response?.data?.response, "error");
            openSweetAlert(response?.response?.data, "error");
          } else {
            openSweetAlert(response?.data, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getUsers")
                .then((response) => {
                  console.log(response.data);
                  props.setDataSource(response.data);
                  props.checkPasswordGroup(response.data);
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
  let [device, setDevice] = useState(props.addRecord);

  let [password_group, setPassword_group] = useState(
    device ? getString(device.password_group) : ""
  );
  let [username, setUsername] = useState(
    device ? getString(device.username) : ""
  );
  let [password, setPassword] = useState(
    device ? getString(device.password) : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      password_group,
      username,
      password,
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
      width="50%"
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
              {device ? "Edit" : "Add"} Password Group
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
              Password Group: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={password_group}
                onChange={(e) => setPassword_group(e.target.value)}
                required
              />
              {/* <StyledSelect
                value={password_group}
                style={{ width: "100%", borderRadius: "20px" }}
                onChange={(value) => {
                  setPassword_group(value);
                }}
              >
                {getOptions([
                  "Low",
                  "Moderate",
                  "High",
                  "Significant",
                  "Critical",
                ])}
              </StyledSelect> */}
              {/* <StyledInput
                value={criticality}
                onChange={(e) => setCriticality(e.target.value)}
              /> */}
            </InputWrapper>
            <InputWrapper>
              Password: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={ip_address} />
                ) : ( */}
              <StyledInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {/* )} */}
            </InputWrapper>
          </Col>
          <Col span={10} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              Username: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={criticality} />
                ) : ( */}
              <StyledInput
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
const StyledSelect = styled(Select)`
  height: 2.2rem;
  .ant-select {
    border-radius: 12px;
  }
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

export default AddAtom;
