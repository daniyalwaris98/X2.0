import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input } from "antd";
import axios, { baseUrl } from "../../utils/axios";
import Swal from "sweetalert2";
import "../AllStyling/CSSStyling.css";
import { devices, functions } from "../../data/globalData";

const EditAtom = (props) => {
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
        .post(baseUrl + "/editAtom ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
          } else {
            openSweetAlert(response?.data, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAtoms")
                .then((response) => {
                  props.setDataSource(response.data);
                  props.checkAtom(response.data);
                  props.checkFilter();
                  props.setSearchText("");
                  props.setSearchedColumn("");

                  props.setRowCount(response.data.length);
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
          openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      console.log(err);
    }
  };

  let [device, setDevice] = useState(props.editRecord);

  let [ip_address, setIp] = useState(
    device ? getString(device.ip_address) : ""
  );
  let [atom_id, setAtom_id] = useState(device ? getString(device.atom_id) : "");
  let [site_name, setSite_name] = useState(
    device ? getString(device.site_name) : ""
  );
  let [rack_name, setRack_name] = useState(
    device ? getString(device.rack_name) : ""
  );
  let [device_name, setDevice_name] = useState(
    device ? getString(device.device_name) : ""
  );
  let [device_ru, setDevice_ru] = useState(
    device ? getString(device.device_ru) : ""
  );
  let [department, setDepartment] = useState(
    device ? getString(device.department) : ""
  );

  let [section, setSection] = useState(device ? getString(device.section) : "");
  let [myfunction, setMyfunction] = useState(
    device ? getString(device.function) : ""
  );

  let [virtual, setVirtual] = useState(device ? getString(device.virtual) : "");
  let [device_type, setDevice_type] = useState(
    device ? getString(device.device_type) : ""
  );
  let [password_group, setPassword_group] = useState(
    device ? getString(device.password_group) : ""
  );

  const Ru = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ];

  const atomDeviceType = devices.filter((device) =>
    device.module.includes("atom")
  );

  const atomFunctions = functions.filter((atomFunction) =>
    atomFunction.module.includes("atom")
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const device = {
      ip_address,
      atom_id,
      site_name,
      rack_name,
      device_name,
      device_ru,
      department,
      section,
      function: myfunction,
      virtual,
      device_type,
      password_group,
    };

    props.setIsEditModalVisible(false);
    postDevice(device);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (ip_address.trim().length > 0) {
        handleSubmit(e);
      } else {
        console.log("workssssss");
        props.setIsModalVisible(true);
      }
    }
  };

  const changeSelectOptionHandler = (event) => {
    setSite_name(event.target.value);
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

  const [rackArray, setRackArray] = useState([]);

  useEffect(() => {
    const getRacksBySiteDropdown = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/getRacksBySiteDropdown?site_name=${site_name}`
        );
        setRackArray(res.data);
        setRack_name(res.data[0]);
      } catch (err) {
        console.log(err.response);
      }
    };
    getRacksBySiteDropdown();
  }, [site_name]);

  const [passwordArray, setPasswordArray] = useState([]);

  useEffect(() => {
    const getPasswordGroupDropdown = async () => {
      try {
        const res = await axios.get(baseUrl + "/getPasswordGroupDropdown");

        setPasswordArray(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    getPasswordGroupDropdown();
  }, [password_group]);

  const handleCancel = () => {
    props.setIsEditModalVisible(false);
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
      footer={false}
      closable={false}
      open={props.isEditModalVisible}
      bodyStyle={{ padding: "0" }}
    >
      <article
        onSubmit={handleSubmit}
        style={{
          textAlign: "center",
          padding: "15px",
          backgroundColor: "rgba(238, 235, 235, 0.86)",
        }}
      >
        <Row style={{ alignContent: "center" }}>
          <Col span={24} style={{}}>
            <p
              style={{
                fontSize: "22px",
                float: "left",
                display: "flex",
                marginLeft: "6%",
                marginBottom: "30px",
              }}
            >
              Edit Atom
            </p>
          </Col>
          <Col span={10} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              IP Address: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={ip_address}
                onChange={(e) => setIp(e.target.value)}
                readOnly
                onKeyDown={handleKeyPress}
              />
            </InputWrapper>
            <InputWrapper>
              Site Name:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              <br />
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  value={site_name}
                  onKeyDown={handleKeyPress}
                  onChange={(e) => changeSelectOptionHandler(e)}
                  // required
                >
                  <option value="">Select Site Name</option>
                  {siteArray?.map((item, index) => {
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
              Rack Name:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  value={rack_name}
                  onKeyDown={handleKeyPress}
                  // required
                  onChange={(e) => {
                    setRack_name(e.target.value);
                  }}
                >
                  <option value="">Select Rack Name</option>
                  {rackArray?.map((item, index) => {
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
              Device Name: &nbsp;&nbsp;
              <StyledInput
                value={device_name}
                onKeyDown={handleKeyPress}
                onChange={(e) =>
                  setDevice_name(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
                required
              />
            </InputWrapper>

            <InputWrapper>
              Device RU:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  // required
                  placeholder="select"
                  onKeyDown={handleKeyPress}
                  value={device_ru}
                  onChange={(e) => {
                    setDevice_ru(e.target.value);
                  }}
                >
                  <option value="">Select Device RU</option>
                  {Ru.map((item, index) => {
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
              Section: &nbsp;&nbsp;
              <StyledInput
                value={section}
                onKeyDown={handleKeyPress}
                onChange={(e) =>
                  setSection(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
              />
            </InputWrapper>
          </Col>
          <Col span={10} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              Department: &nbsp;&nbsp;
              <StyledInput
                value={department}
                onKeyDown={handleKeyPress}
                onChange={(e) =>
                  setDepartment(
                    e.target.value.replace(/[!^=&\/\\#;,+()$~%'":*?<>{}]/g, "")
                  )
                }
              />
            </InputWrapper>

            <InputWrapper>
              Function:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  onKeyDown={handleKeyPress}
                  // required
                  placeholder="select"
                  value={myfunction}
                  onChange={(e) => {
                    setMyfunction(e.target.value);
                  }}
                >
                  <option value="">Select Function</option>
                  {atomFunctions.map((atomFunction, index) => {
                    return (
                      <option value={atomFunction.name} key={index}>
                        {atomFunction.name}
                      </option>
                    );
                  })}
                </Styledselect>
              </div>
            </InputWrapper>

            <InputWrapper>
              Virtual: &nbsp;&nbsp;
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  placeholder="select"
                  value={virtual}
                  onKeyDown={handleKeyPress}
                  onChange={(e) => {
                    setVirtual(e.target.value);
                  }}
                >
                  <option value="">Select Virtual</option>
                  <option value="virtual">Virtual</option>
                  <option value="not Virtual">Not Virtual</option>
                </Styledselect>
              </div>
            </InputWrapper>

            <InputWrapper>
              Device Type:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  onKeyDown={handleKeyPress}
                  // required
                  placeholder="select"
                  value={device_type}
                  onChange={(e) => {
                    setDevice_type(e.target.value);
                  }}
                >
                  <option value="">Select Device Type</option>
                  {atomDeviceType.map((device, index) => {
                    return (
                      <option key={index} value={device.name}>
                        {device.name}
                      </option>
                    );
                  })}
                </Styledselect>
              </div>
            </InputWrapper>

            <InputWrapper>
              Password Group:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  onKeyDown={handleKeyPress}
                  value={password_group}
                  // required
                  onChange={(e) => {
                    setPassword_group(e.target.value);
                  }}
                >
                  <option value="">Select Password Group</option>
                  {passwordArray &&
                    passwordArray.map((item, index) => {
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
        </Row>
        <br />
        <Row>
          <Col span={24} style={{}}>
            <div
              style={{
                display: "flex",
                textAlign: "center",
                justifyContent: "center",
              }}
            >
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
                type="button"
              >
                Cancel
              </StyledButton>
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
                onClick={handleSubmit}
                type="submit"
              >
                Done
              </StyledSubmitButton>
            </div>
          </Col>
        </Row>
        &nbsp; &nbsp;
      </article>
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

const StyledSubmitButton = styled.button`
  font-size: 15px;
  padding: 10px;
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
    cursor: pointer;
  }
`;

const StyledButton = styled.button`
  // height: 27px;
  font-size: 15px;
  // font-weight: bolder;
  // width: 15%;
  // font-family: Montserrat-Regular;
  // box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: transparent;
  border-color: ${(props) => props.color};
  border: 1px solid rgba(0, 0, 0, 0.24);

  color: rgba(0, 0, 0, 0.24);
  border-radius: 5px;
  &:focus,
  &:hover {
    background-color: rgba(0, 0, 0, 0.24);
    border-color: rgba(0, 0, 0, 0.24);
    border: 1px solid rgba(0, 0, 0, 0.24);
    color: white;
    opacity: 0.8;
    cursor: pointer;
  }
`;

export default EditAtom;
