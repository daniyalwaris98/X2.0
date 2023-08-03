import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input } from "antd";
import axios, { baseUrl } from "../../utils/axios";
import Swal from "sweetalert2";
import "../AllStyling/CSSStyling.css";
import "./main.css";
import { devices, functions } from "../../data/globalData";
import PasswordGroupModel from "../PasswordGroup/PasswordGroupModal/PasswordGroupModel";

const AddAtom = (props) => {
  const [isPassModalVisible, setIsPassModalVisible] = useState(false);
  const [isSiteModalVisible, setIsSiteModalVisible] = useState(false);
  const [isRackModalVisible, setIsRackModalVisible] = useState(false);

  const showModal = () => {
    setIsPassModalVisible(true);
  };

  const showSiteModal = () => {
    setIsSiteModalVisible(true);
  };
  const handleOkSite = () => {
    setIsSiteModalVisible(false);
  };
  const handleCancelSitePopup = () => {
    setIsSiteModalVisible(false);
  };
  const showRackModal = () => {
    setIsRackModalVisible(true);
  };

  const handleOkRack = () => {
    setIsRackModalVisible(false);
  };
  const handleCancelRackPopup = () => {
    setIsRackModalVisible(false);
  };

  useEffect(() => {
    getPassWordGroup();
  }, [isPassModalVisible]);

  const getPassWordGroup = async () => {
    await axios
      .get(baseUrl + "/getPasswordGroupDropdown")
      .then((res) => {
        setPasswordArray(res.data);
        setPassword_group(res.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let [siteName, setSiteName] = useState("");
  let [region, setRegion] = useState("");

  let [latitude, setLatitude] = useState("");
  let [longitude, setLongtitude] = useState("");
  let [city, setCity] = useState("");
  let [status, setStatus] = useState("Production");

  const siteData = async (e) => {
    e.preventDefault();

    const allSiteData = {
      site_name: siteName,
      region,
      latitude,
      longitude,
      city,
      status,
    };

    try {
      await axios
        .post(baseUrl + "/addSite ", allSiteData)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data?.response, "error");
          } else {
            openSweetAlert(
              `Site ${device ? "Added" : "Added"} Successfully`,
              "success"
            );
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getSitesForDropdown")
                .then((res) => {
                  setSiteArray(res.data);
                  setSite_name(res.data[0]);
                  setSiteArrayR(res.data);
                  setSiteNameR(res.data[0]);
                  setIsSiteModalVisible(false);
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

  let [rackName, setRackName] = useState("");
  let [siteNameR, setSiteNameR] = useState("");

  let [serial_number, setserialNumber] = useState("");
  let [unit_position, setUnit_position] = useState("");

  let [rackStatus, setRackStatus] = useState("");

  let [ru, setRu] = useState("");
  let [rfs_date, setRfs_dt] = useState("");
  let [height, setHeight] = useState("");
  let [myWidth, setMyWidth] = useState("");
  let [depth, setDepth] = useState("");
  let [pn_code, setPnCode] = useState("");
  let [rack_model, setRackModel] = useState("");
  let [brand, setBrand] = useState("");

  const RackData = async (e) => {
    e.preventDefault();

    const allRackData = {
      site_name: siteNameR,
      rack_name: rackName,
      serial_number,
      unit_position,
      status: rackStatus,
      ru,
      rfs_date,
      height,
      width: myWidth,
      depth,
      pn_code,
      rack_model,
      floor: brand,
    };

    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/addRack ", allRackData)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data?.response, "error");
          } else {
            openSweetAlert(
              // `Rack ${device ? "Added" : "Added"} Successfully`,
              response?.data,
              "success"
            );
            setIsRackModalVisible(false);
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + `/getRacksBySiteDropdown?site_name=${site_name}`)
                .then((res) => {
                  console.log("getRacksBySiteDropdown", res);

                  setRackArray(res.data);
                  // console.log("a", res.data[0]);
                  setRack_name(res.data[0]);
                })
                .catch((error) => {
                  console.log(error);
                  // openSweetAlert("Something Went Wrong!", "danger");
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
        .post(baseUrl + "/addAtomDevice", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data.Response, "error");
          } else {
            openSweetAlert(response?.data, "success");

            const promises = [];

            promises.push(
              axios
                .get(baseUrl + "/getAtoms")
                .then((response) => {
                  console.log("1", response.data);
                  props.setDataSource(response.data);
                  console.log("2", response.data);

                  props.checkAtom(response.data);
                  console.log("3", response.data);

                  props.setRowCount(response.data.length);
                  console.log("4", response.data);
                })
                .catch((error) => {
                  openSweetAlert("Something Went Wrong!", "error");
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
    device ? getString(device.device_ru) : 1
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

  const statusType = ["Production", "Not Production"];

  const atomDeviceType = devices.filter((device) =>
    device.module.includes("atom")
  );

  const atomFunctions = functions.filter((atomFunction) =>
    atomFunction.module.includes("atom")
  );

  const changeSelectOptionHandler = async (event) => {
    setSite_name(event.target.value);
    // const res = await axios.get(baseUrl + "/getSitesForDropdown");
    // setSite_name(res.data);
  };

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

  /** Setting Type variable zaccording to dropdown */
  if (site_name === "Algorithm") {
    type = algorithm;
  } else if (site_name === "Language") {
    type = language;
  } else if (site_name === "Data Structure") {
    type = dataStructure;
  }

  if (type) {
    options = type.map((option) => <option>{option}</option>);
  }
  const [siteArray, setSiteArray] = useState([]);
  const [siteArrayR, setSiteArrayR] = useState([]);

  useEffect(() => {
    const getSitesForDropdown = async () => {
      try {
        const res = await axios.get(baseUrl + "/getSitesForDropdown");

        setSiteArray(res.data);
        setSite_name(res.data[0]);

        setSiteArrayR(res.data);
        setSiteNameR(res.data[0]);
      } catch (err) {
        console.log(err.response);
      }
    };
    getSitesForDropdown();
  }, []);

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

        console.log("getPasswordGroupDropdown", res);
        setPasswordArray(res.data);
        setPassword_group(res.data[0]);
      } catch (err) {
        console.log(err.response);
      }
    };
    getPasswordGroupDropdown();
  }, []);

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

    props.setIsModalVisible(false);
    postDevice(device);
  };

  const handleCancel = () => {
    props.setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        style={{
          marginTop: "-70px",
          zIndex: "99999",
          textAlign: "center",
          alignContent: "center",
          padding: "0px",
        }}
        width="60%"
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
              <p
                style={{
                  fontSize: "22px",
                  float: "left",
                  display: "flex",
                  marginLeft: "6%",
                  marginBottom: "30px",
                }}
              >
                Add Atom
              </p>
            </Col>
            <Col span={10} style={{ marginLeft: "6%" }}>
              <InputWrapper>
                IP Address: &nbsp;<span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                <StyledInput
                  value={ip_address}
                  onChange={(e) => setIp(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                Site Name:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                <br />
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    onChange={changeSelectOptionHandler}
                  >
                    {siteArray.map((item, index) => {
                      return <option>{item}</option>;
                    })}
                  </Styledselect>
                </div>
              </InputWrapper>
              <label
                onClick={showSiteModal}
                style={{
                  float: "right",
                  fontWeight: "600",
                  color: "#6ab344",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                + Add Site
              </label>
              <br />
              <InputWrapper>
                Rack Name:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                <br />
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    value={rack_name}
                    onChange={(e) => {
                      setRack_name(e.target.value);
                    }}
                  >
                    {rackArray?.map((item, index) => {
                      return <option>{item}</option>;
                    })}
                  </Styledselect>
                </div>
              </InputWrapper>
              <label
                onClick={showRackModal}
                style={{
                  float: "right",
                  fontWeight: "600",
                  color: "#6ab344",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                + Add Rack
              </label>
              <br />
              <InputWrapper>
                Device Name:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                <StyledInput
                  value={device_name}
                  onChange={(e) =>
                    setDevice_name(
                      e.target.value.replace(
                        /[!^=&\/\\#;,+()$~%'":*?<>{}]/g,
                        ""
                      )
                    )
                  }
                />
              </InputWrapper>
              <InputWrapper>
                Device RU:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                {/* &nbsp;&nbsp; */}
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    placeholder="select"
                    value={device_ru}
                    onChange={(e) => {
                      setDevice_ru(e.target.value);
                    }}
                  >
                    {Ru &&
                      Ru.map((item, index) => {
                        return <option key={index}>{item}</option>;
                      })}
                  </Styledselect>
                </div>
              </InputWrapper>

              <InputWrapper>
                Department: &nbsp;&nbsp;
                <StyledInput
                  value={department}
                  onChange={(e) =>
                    setDepartment(
                      e.target.value.replace(
                        /[!^=&\/\\#;,+()$~%'":*?<>{}]/g,
                        ""
                      )
                    )
                  }
                />
              </InputWrapper>
            </Col>
            <Col span={10} style={{ marginLeft: "6%" }}>
              <InputWrapper>
                Section: &nbsp;&nbsp;
                <StyledInput
                  value={section}
                  onChange={(e) =>
                    setSection(
                      e.target.value.replace(
                        /[!^=&\/\\#;,+()$~%'":*?<>{}]/g,
                        ""
                      )
                    )
                  }
                />
              </InputWrapper>
              <InputWrapper>
                <AdjustInputWrapper>
                  Function:
                  {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                  {/* &nbsp;&nbsp; */}
                  <div className="select_type">
                    <Styledselect
                      className="rectangle"
                      placeholder="select"
                      value={myfunction}
                      onChange={(e) => {
                        setMyfunction(e.target.value);
                      }}
                    >
                      <option value="" style={{ color: "rgba(0,0,0,0.1)" }}>
                        Select Function
                      </option>

                      {atomFunctions.map((atomFunction, index) => {
                        return (
                          <option value={atomFunction.name} key={index}>
                            {atomFunction.name}
                          </option>
                        );
                      })}
                    </Styledselect>
                  </div>
                </AdjustInputWrapper>
              </InputWrapper>
              <AdjustInputWrapper>
                Virtual: &nbsp;&nbsp;
                <StyledInput
                  value={virtual}
                  onChange={(e) =>
                    setVirtual(
                      e.target.value.replace(
                        /[!^=&\/\\#;,+()$~%'":*?<>{}]/g,
                        ""
                      )
                    )
                  }
                />
              </AdjustInputWrapper>

              <AdjustInputWrappernext>
                Device Type:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                {/* &nbsp;&nbsp; */}
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    placeholder="select"
                    value={device_type}
                    onChange={(e) => {
                      setDevice_type(e.target.value);
                    }}
                  >
                    <option value="" style={{ color: "rgba(0,0,0,0.1)" }}>
                      Select Device Type
                    </option>
                    {atomDeviceType.map((item, index) => {
                      return <option key={index}>{item.name}</option>;
                    })}
                  </Styledselect>
                </div>
              </AdjustInputWrappernext>
              <InputWrapper>
                Password Group:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                {/* &nbsp;&nbsp; */}
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    value={password_group}
                    onChange={(e) => {
                      setPassword_group(e.target.value);
                    }}
                  >
                    {passwordArray &&
                      passwordArray.map((item, index) => {
                        return <option key={index}>{item}</option>;
                      })}
                  </Styledselect>
                </div>
              </InputWrapper>
              <label
                onClick={showModal}
                style={{
                  float: "right",
                  fontWeight: "600",
                  color: "#6ab344",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                + Add Password Group
              </label>
              <br />
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
                    // float: "right",
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
                <StyledSubmitButton
                  style={{
                    // float: "right",
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
              </div>
            </Col>
          </Row>
          &nbsp; &nbsp;
        </form>
      </Modal>

      <PasswordGroupModel
        isModalOpen={isPassModalVisible}
        setIsModalOpen={setIsPassModalVisible}
      />

      {/* <Modal
        width={"30%"}
        title="Add New Password Group"
        open={isPassModalVisible}
        onOk={handleOk}
        footer={false}
        onCancel={handleCancelPasPopup}
      >
        <form
          //   onSubmit={handlePassGroupFormSubmit}
          style={{ padding: "25px", background: "#f5f5f5" }}
        >
          <div>
            <label>Password Group</label>&nbsp;
            <span style={{ color: "red" }}>*</span>
            <StyledInput
              style={{
                width: "100%",
                height: "2rem",
                border: "0.3px solid rgba(0,0,0,0.2)",
                paddingLeft: "8px",
              }}
              required
              placeholder="password Group"
              value={passGroup}
              onChange={(e) => setPassGroup(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "15px" }}>
            <label style={{ marginTop: "10px" }}>Username</label>
            &nbsp;
            <span style={{ color: "red" }}>*</span>
            <StyledInput
              style={{
                width: "100%",
                height: "2rem",
                border: "0.3px solid rgba(0,0,0,0.2)",
                paddingLeft: "8px",
              }}
              required
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "15px" }}>
            <label style={{ marginTop: "10px" }}>Password</label>
            &nbsp;
            <span style={{ color: "red" }}>*</span>
            <StyledInput
              style={{
                width: "100%",
                height: "2rem",
                border: "0.3px solid rgba(0,0,0,0.2)",
                paddingLeft: "8px",
              }}
              required
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div style={{ marginTop: "20px" }}>
            <button
              type="submit"
              onClick={handlePassGroupFormSubmit}
              style={{
                backgroundColor: "#66B127",
                color: "white",
                width: "100%",
                height: "35px",
                border: "none",
                //   width: "120px",
                cursor: "Pointer",
              }}
            >
              Add Password Group
            </button>
          </div>
        </form>
      </Modal> */}

      <Modal
        width={"70%"}
        title="Add New Site"
        open={isSiteModalVisible}
        onOk={handleOkSite}
        footer={false}
        onCancel={handleCancelSitePopup}
      >
        <form
          onSubmit={siteData}
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
                {/* <img src={sites} alt="" /> &nbsp;  */}
                Add Site
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
                  }}
                  color={"#BBBABA"}
                  onClick={handleCancelSitePopup}
                >
                  Cancel
                </StyledButton>
              </div>
            </Col>
            <Col span={10} style={{ marginLeft: "6%" }}>
              <InputWrapper>
                Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
                <br />
                <StyledInput
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                Region: &nbsp;&nbsp;
                <StyledInput
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                />
              </InputWrapper>

              <InputWrapper>
                Latitude: &nbsp;&nbsp;
                <StyledInput
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </InputWrapper>

              <InputWrapper>
                Longitude: &nbsp;&nbsp;
                <StyledInput
                  value={longitude}
                  onChange={(e) => setLongtitude(e.target.value)}
                />
              </InputWrapper>
            </Col>
            <Col span={10} style={{ marginLeft: "6%" }}>
              <InputWrapper>
                City: &nbsp;&nbsp;
                <StyledInput
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  //
                />
              </InputWrapper>

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
                    {statusType.map((item, index) => {
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
          </Row>
          &nbsp; &nbsp;
        </form>
      </Modal>

      <Modal
        width={"70%"}
        title="Add New Rack"
        open={isRackModalVisible}
        onOk={handleOkRack}
        footer={false}
        onCancel={handleCancelRackPopup}
      >
        <form
          onSubmit={RackData}
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
                Add Rack
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
                  }}
                  onClick={() => setIsRackModalVisible(false)}
                >
                  Cancel
                </StyledButton>
              </div>
            </Col>
            <Col span={7} style={{ marginLeft: "6%" }}>
              <InputWrapper>
                Rack Name: &nbsp;<span style={{ color: "red" }}>*</span>
                <br />
                <StyledInput
                  value={rackName}
                  onChange={(e) => setRackName(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
                <br />
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    value={siteNameR}
                    required
                    onChange={(e) => {
                      setSiteNameR(e.target.value);
                    }}
                  >
                    {siteArrayR.map((item, index) => {
                      return (
                        <>
                          <option>{item}</option>
                        </>
                      );
                    })}
                  </Styledselect>
                </div>
              </InputWrapper>

              <InputWrapper>
                Serial Number: &nbsp;&nbsp;
                <StyledInput
                  value={serial_number}
                  onChange={(e) => setserialNumber(e.target.value)}
                />
              </InputWrapper>

              <InputWrapper>
                Unit Position: &nbsp;&nbsp;
                <StyledInput
                  value={unit_position}
                  onChange={(e) => setUnit_position(e.target.value)}
                />
              </InputWrapper>
              <InputWrapper>
                Brand: &nbsp;&nbsp;
                <StyledInput
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </InputWrapper>
            </Col>
            <Col span={7} style={{ marginLeft: "1%" }}>
              <InputWrapper>
                Status: &nbsp;&nbsp;
                <StyledInput
                  value={rackStatus}
                  onChange={(e) => setRackStatus(e.target.value)}
                />
              </InputWrapper>
              <InputWrapper>
                RU: &nbsp;&nbsp;
                <StyledInput
                  value={ru}
                  onChange={(e) => setRu(e.target.value)}
                />
              </InputWrapper>
              <InputWrapper>
                RFS Date: &nbsp;&nbsp;
                <StyledInput
                  value={rfs_date}
                  onChange={(e) => setRfs_dt(e.target.value)}
                />
              </InputWrapper>
              <InputWrapper>
                Height: &nbsp;&nbsp;
                <StyledInput
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </InputWrapper>
            </Col>
            <Col span={7} style={{ marginLeft: "1%" }}>
              <InputWrapper>
                Width: &nbsp;&nbsp;
                <StyledInput
                  value={myWidth}
                  onChange={(e) => setMyWidth(e.target.value)}
                />
              </InputWrapper>
              <InputWrapper>
                Depth: &nbsp;&nbsp;
                <StyledInput
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                />
              </InputWrapper>
              <InputWrapper>
                PN Code: &nbsp;&nbsp;
                <StyledInput
                  value={pn_code}
                  onChange={(e) => setPnCode(e.target.value)}
                />
              </InputWrapper>
              <InputWrapper>
                Rack Modal: &nbsp;&nbsp;
                <StyledInput
                  value={rack_model}
                  onChange={(e) => setRackModel(e.target.value)}
                />
              </InputWrapper>
            </Col>
          </Row>
          &nbsp; &nbsp;
        </form>
      </Modal>
    </>
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
  padding-left: 7px;
  padding-right: 7px;
  outline: none;
  border: 0.1px solid #cfcfcf;

  .ant-select-selection:hover {
    background-color: transparent;
  }

  .ant-select-dropdown-menu-item-active:not(
      .ant-select-dropdown-menu-item-disabled
    ),
  .ant-select-dropdown-menu-item:hover:not(
      .ant-select-dropdown-menu-item-disabled
    ) {
    background-color: #e5f2ff;
  }
`;

const InputWrapper = styled.div`
  text-align: left;
  font-size: 12px;

  padding-bottom: 10px;
`;
const AdjustInputWrapper = styled.div`
  margin-top: 5px;
  text-align: left;
  font-size: 12px;

  padding-bottom: 10px;
`;
const AdjustInputWrappernext = styled.div`
  margin-top: 22px;
  text-align: left;
  font-size: 12px;

  padding-bottom: 10px;
`;

const StyledSubmitButton = styled(Input)`
  font-size: 15px;
  padding: auto;
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
  font-size: 15px;
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

export default AddAtom;
