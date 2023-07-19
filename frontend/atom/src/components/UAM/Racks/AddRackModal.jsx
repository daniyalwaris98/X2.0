import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import racks from "./assets/rks.svg";

const AddRackModel = (props) => {
  const getString = (str) => {
    return str ? str : "";
  };

  const [isSiteModalVisible, setIsSiteModalVisible] = useState(false);
  const showSiteModal = () => {
    setIsSiteModalVisible(true);
  };

  const handleOkSite = () => {
    setIsSiteModalVisible(false);
  };
  const handleCancelSitePopup = () => {
    setIsSiteModalVisible(false);
  };
  const statusType = ["Production", "Not Production"];

  let [siteName, setSiteName] = useState("");
  let [region, setRegion] = useState("");
  let [latitude, setLatitude] = useState("");
  let [longitude, setLongtitude] = useState("");
  let [city, setCity] = useState("");
  let [siteStatus, setSiteStatus] = useState("");

  const siteData = async (e) => {
    e.preventDefault();

    const allSiteData = {
      site_name: siteName,
      region,
      latitude,
      longitude,
      city,
      status: siteStatus,
    };

    try {
      await axios
        .post(baseUrl + "/addSite ", allSiteData)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data?.response, "error");
          } else {
            setIsSiteModalVisible(false);
            openSweetAlert(
              `Site ${device ? "Added" : "Added"} Successfully`,
              "success"
            );
            setSiteName("");
            setRegion("");

            setLatitude("");
            setLongtitude("");
            setCity("");
            setSiteStatus("");

            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getSitesForDropdown")
                .then((res) => {
                  console.log("getSitesForDropdown", res);

                  setSiteArray(res.data);
                  setsite_Name(res.data[0]);
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
        .post(baseUrl + "/addRack ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.statusText, "error");
          } else {
            openSweetAlert(`Rack Added Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllRacks")
                .then((response) => {
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

  const device = props.addRecord;

  let [rack_name, setRackName] = useState(
    device ? getString(device.rack_name) : ""
  );
  let [site_name, setsite_Name] = useState(
    device ? getString(device.site_name) : ""
  );

  let [serial_number, setserialNumber] = useState(
    device ? getString(device.serial_number) : ""
  );

  let [status, setStatus] = useState(
    device ? getString(device.status) : "Production"
  );

  let [ru, setRu] = useState(device ? getString(device.ru) : "");
  let [height, setHeight] = useState(device ? getString(device.height) : "");
  let [myWidth, setMyWidth] = useState(device ? getString(device.width) : "");
  let [rack_model, setRackModel] = useState(
    device ? getString(device.rack_model) : ""
  );
  let [floor, setFloor] = useState(device ? getString(device.floor) : "");

  let type = null;

  if (type) {
    options = type.map((option) => <option>{option}</option>);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      rack_name,
      site_name,
      serial_number,
      status,
      ru,
      height,
      width: myWidth,
      rack_model,
      floor,
    };

    props.setIsModalVisible(false);
    postDevice(device);
  };
  const [siteArray, setSiteArray] = useState([]);
  useEffect(() => {
    const getSitesForDropdown = async () => {
      try {
        const res = await axios.get(baseUrl + "/getSitesForDropdown");
        setSiteArray(res.data);
        setsite_Name(res.data[0]);
      } catch (err) {
        console.log(err.response);
      }
    };
    getSitesForDropdown();
  }, []);
  const handleCancel = () => {
    props.setIsModalVisible(false);
  };

  const DType = ["Production", "Not Production"];
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
        width="90%"
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
            <Col span={24} style={{ margin: "5px 30px" }}>
              <p
                style={{
                  fontSize: "22px",
                  float: "left",
                  display: "flex",
                }}
              >
                <img src={racks} alt="" /> &nbsp; Add Rack
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
                  onClick={handleCancel}
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
                  value={rack_name}
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
                    required
                    onChange={(e) => {
                      setsite_Name(e.target.value);
                    }}
                  >
                    {siteArray.map((item, index) => {
                      return <option key={index}>{item}</option>;
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
                  marginRight: "10px",
                }}
              >
                + Add Site
              </label>
              <br />

              <InputWrapper>
                Serial Number: &nbsp;&nbsp;
                <StyledInput
                  value={serial_number}
                  onChange={(e) => setserialNumber(e.target.value)}
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
                    {DType.map((item, index) => {
                      return <option>{item}</option>;
                    })}
                  </Styledselect>
                </div>
              </InputWrapper>
            </Col>
            <Col span={7} style={{ marginLeft: "1%" }}>
              <InputWrapper>
                RU: &nbsp;&nbsp;
                <StyledInput
                  value={ru}
                  onChange={(e) => setRu(e.target.value)}
                />
              </InputWrapper>

              <InputWrapper>
                Height: &nbsp;&nbsp;
                <StyledInput
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                />
              </InputWrapper>
              <InputWrapper>
                Width: &nbsp;&nbsp;
                <StyledInput
                  value={myWidth}
                  onChange={(e) => setMyWidth(e.target.value)}
                />
              </InputWrapper>
            </Col>
            <Col span={7} style={{ marginLeft: "1%" }}>
              <InputWrapper>
                Rack Modal: &nbsp;&nbsp;
                <StyledInput
                  value={rack_model}
                  onChange={(e) => setRackModel(e.target.value)}
                />
              </InputWrapper>

              <InputWrapper>
                Brand: &nbsp;&nbsp;
                <StyledInput
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                />
              </InputWrapper>
            </Col>
          </Row>
          &nbsp; &nbsp;
        </form>
      </Modal>

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
                    value={siteStatus}
                    onChange={(e) => {
                      setSiteStatus(e.target.value);
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
    box-shadow: #6ab344 0px 3px 8px !important;
    opacity: 0.8;
  }
`;

const StyledButton = styled(Button)`
  font-size: 15px;
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

export default AddRackModel;
