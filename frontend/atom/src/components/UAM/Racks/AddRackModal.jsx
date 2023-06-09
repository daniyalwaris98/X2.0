import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import racks from "./assets/rks.svg";
import { useNavigate } from "react-router-dom";

const AddRackModel = (props) => {
  const navigate = useNavigate();
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
  // let [site_id, setSiteID] = useState("");
  let [region, setRegion] = useState("");

  let [latitude, setLatitude] = useState("");
  let [longitude, setLongtitude] = useState("");
  let [city, setCity] = useState("");
  let [siteStatus, setSiteStatus] = useState("");
  // let [total_count, setTotelCount] = useState("");

  const siteData = async (e) => {
    e.preventDefault();

    const allSiteData = {
      site_name: siteName,
      region,
      latitude,
      longitude,
      city,
      status: siteStatus,
      // total_count,
    };

    try {
      //console.log(device);
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
            // let [site_id, setSiteID] = useState("");
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
                  // console.log("a", res.data[0]);
                  setsite_Name(res.data[0]);

                  setLoading(false);
                })
                .catch((error) => {
                  console.log(error);
                  // openSweetAlert("Something Went Wrong!", "danger");
                  setLoading(false);
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
        .post(baseUrl + "/addRack ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data?.response, "error");
          } else {
            openSweetAlert(
              `Rack ${device ? "Added" : "Added"} Successfully`,
              "success"
            );
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllRacks")
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

  let [rack_name, setRackName] = useState(
    device ? getString(device.rack_name) : ""
  );
  let [site_name, setsite_Name] = useState(
    device ? getString(device.site_name) : ""
  );

  let [serial_number, setserialNumber] = useState(
    device ? getString(device.serial_number) : ""
  );
  // let [manufacturer_date, setmanufacture_date] = useState(
  //   device ? getString(device.manufacturer_date) : ""
  // );
  // let [manufacture_dt, setManufacture_dt] = useState(
  //   device ? getString(device.manufacture_dt) : ''
  // );
  // let [unit_position, setUnit_position] = useState(
  //   device ? getString(device.unit_position) : ""
  // );
  let [creation_date, setCreation_dt] = useState(
    device ? getString(device.creation_date) : ""
  );
  let [modification_date, setmodification_date] = useState(
    device ? getString(device.modification_date) : ""
  );
  let [status, setStatus] = useState(
    device ? getString(device.status) : "Production"
  );

  let [ru, setRu] = useState(device ? getString(device.ru) : "");
  // let [rfs_date, setRfs_dt] = useState(device ? getString(device.rfs_dt) : "");
  let [height, setHeight] = useState(device ? getString(device.height) : "");
  let [myWidth, setMyWidth] = useState(device ? getString(device.width) : "");
  let [depth, setDepth] = useState(device ? getString(device.depth) : "");
  // let [pn_code, setPnCode] = useState(device ? getString(device.pn_code) : "");
  let [rack_model, setRackModel] = useState(
    device ? getString(device.rack_model) : ""
  );
  let [floor, setFloor] = useState(device ? getString(device.floor) : "");

  // let [total_count, setTotalCount] = useState(
  //   device ? getString(device.total_count) : ""
  // );
  const [loading, setLoading] = useState(false);

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
      rack_name,
      site_name,

      serial_number,
      // manufacturer_date,
      // unit_position,
      // creation_date,
      // modification_date,
      status,
      ru,
      // rfs_date,
      height,
      width: myWidth,
      // depth,
      // pn_code,
      rack_model,
      floor,
      // total_count,
    };

    props.setIsModalVisible(false);
    console.log("devices", device);
    postDevice(device);
  };
  const [siteArray, setSiteArray] = useState([]);
  useEffect(() => {
    const getSitesForDropdown = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getSitesForDropdown");
        console.log("getSitesForDropdown", res);
        setSiteArray(res.data);
        // console.log("a", res.data[0]);
        setsite_Name(res.data[0]);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    getSitesForDropdown();
  }, []);
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
                <img src={racks} alt="" /> &nbsp; {device ? "Edit" : "Add"} Rack
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
              Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={ip_address} />
                ) : ( */}
              {/* <StyledInput
                value={site_name}
                onChange={(e) => setSiteId(e.target.value)}
                required
              /> */}
              {/* )} */}
              {/* </InputWrapper> */}
              <InputWrapper>
                Rack Name: &nbsp;<span style={{ color: "red" }}>*</span>
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
                  value={rack_name}
                  onChange={(e) => setRackName(e.target.value)}
                  required
                />
                {/* )} */}
              </InputWrapper>
              <InputWrapper>
                Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
                <br />
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    // value={site_name}
                    required
                    onChange={(e) => {
                      setsite_Name(e.target.value);
                    }}
                  >
                    {/* <option>Seleect Site Name</option> */}

                    {siteArray.map((item, index) => {
                      return (
                        <>
                          <option>{item}</option>
                        </>
                      );
                    })}

                    {/* <option>Choose...</option>

                <option>Algorithm</option>
                <option>Language</option>
                <option>Data Structure</option> */}
                  </Styledselect>
                </div>
                {/* <StyledInput
                value={site_name}
                onChange={(e) => setSite_name(e.target.value)}
                required
              /> */}
                {/* )} */}
              </InputWrapper>
              <label
                // onClick={() => navigate("/uam/sites")}

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
              {/* <InputWrapper> */}
              {/* Site Name: */}
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              {/* &nbsp;&nbsp; */}
              {/* {device ? (
                  <StyledInput value={ip_address} />
                ) : ( */}
              {/* <StyledInput
                value={site_name}
                onChange={(e) => setsite_Name(e.target.value)} */}
              {/* // required */}
              {/* /> */}
              {/* )} */}
              {/* </InputWrapper> */}
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
                Serial Number:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                {/* {device ? (
                  <StyledInput value={device_ru} />
                ) : ( */}
                <StyledInput
                  value={serial_number}
                  onChange={(e) => setserialNumber(e.target.value)}
                  // required
                />
                {/* )} */}
              </InputWrapper>
              {/* <InputWrapper>
              Manufacture Date:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {device ? (
                  <StyledInput value={department} />
                ) : (
              <StyledInput
                value={manufacturer_date}
                onChange={(e) => setmanufacture_date(e.target.value)}
                // required
              />
             
            </InputWrapper> */}
              {/* <InputWrapper>
              Unit Position:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
             
              <StyledInput
                value={unit_position}
                onChange={(e) => setUnit_position(e.target.value)}
                // required
              />
           
            </InputWrapper> */}
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
                    {/* <option value="" style={{ color: "rgba(0,0,0,0.1)" }}>
                      Select Status
                    </option> */}
                    {DType.map((item, index) => {
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
            <Col span={7} style={{ marginLeft: "1%" }}>
              <InputWrapper>
                RU:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
                <StyledInput
                  value={ru}
                  onChange={(e) => setRu(e.target.value)}
                  // required
                />
                {/* )} */}
              </InputWrapper>
              {/* <InputWrapper>
              RFS Date:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
             
              <StyledInput
                value={rfs_date}
                onChange={(e) => setRfs_dt(e.target.value)}
                // required
              />
             
            </InputWrapper> */}
              <InputWrapper>
                Height:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
                <StyledInput
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  // required
                />
                {/* )} */}
              </InputWrapper>
              {/* <InputWrapper>
              Total Count:
               &nbsp;<span style={{ color: "red" }}>*</span> 
              &nbsp;&nbsp;
               {device ? (
                  <StyledInput value={myfunction} />
                ) : ( 
              <StyledInput
                value={total_count}
                onChange={(e) => setTotalCount(e.target.value)}
                // required
              />

            </InputWrapper> */}
              <InputWrapper>
                Width:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
                <StyledInput
                  value={myWidth}
                  onChange={(e) => setMyWidth(e.target.value)}
                  // required
                />
                {/* )} */}
              </InputWrapper>
              {/* <InputWrapper>
                Depth:
                &nbsp;<span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
               
                <StyledInput
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  // required
                />
             
              </InputWrapper> */}
            </Col>
            <Col span={7} style={{ marginLeft: "1%" }}>
              {/* <InputWrapper>
              PN Code:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
            
              <StyledInput
                value={pn_code}
                onChange={(e) => setPnCode(e.target.value)}
                // required
              />
            
            </InputWrapper> */}
              <InputWrapper>
                Rack Modal:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
                <StyledInput
                  value={rack_model}
                  onChange={(e) => setRackModel(e.target.value)}
                  // required
                />
                {/* )} */}
              </InputWrapper>

              <InputWrapper>
                Brand:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
                <StyledInput
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                  // required
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

      <Modal
        width={"70%"}
        title="Add New Site"
        visible={isSiteModalVisible}
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
                    // paddingBottom: "5px",
                  }}
                  color={"#BBBABA"}
                  onClick={handleCancelSitePopup}
                >
                  Cancel
                </StyledButton>
              </div>
            </Col>
            <Col span={10} style={{ marginLeft: "6%" }}>
              {/* <InputWrapper>
              Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={ip_address} />
                ) : ( */}
              {/* <StyledInput
                value={site_name}
                onChange={(e) => setSiteId(e.target.value)}
                required
              /> */}
              {/* )} */}
              {/* </InputWrapper> */}
              <InputWrapper>
                Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
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
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  required
                />
              </InputWrapper>
              <InputWrapper>
                Region:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                {/* {device ? (
                  <StyledInput value={ip_address} />
                ) : ( */}
                <StyledInput
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  // required
                />
                {/* )} */}
              </InputWrapper>
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
                Latitude:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                {/* {device ? (
                  <StyledInput value={device_name} />
                ) : ( */}
                <StyledInput
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  // required
                />
                {/* )
                } */}
              </InputWrapper>

              <InputWrapper>
                Longitude:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                {/* {device ? (
                  <StyledInput value={device_ru} />
                ) : ( */}
                <StyledInput
                  value={longitude}
                  onChange={(e) => setLongtitude(e.target.value)}
                  // required
                />
                {/* )} */}
              </InputWrapper>
            </Col>
            <Col span={10} style={{ marginLeft: "6%" }}>
              <InputWrapper>
                City:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                {/* {device ? (
                  <StyledInput value={department} />
                ) : ( */}
                <StyledInput
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  // required
                />
                {/* )} */}
              </InputWrapper>
              {/* <InputWrapper>
              Creation Date: */}
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              {/* &nbsp;&nbsp; */}
              {/* {device ? (
            {/* <InputWrapper>
              Creation Date: */}
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              {/* &nbsp;&nbsp; */}
              {/* {device ? (
                  <StyledInput value={section} />
                ) : ( */}
              {/* <StyledInput
                value={creation_dt}
                onChange={(e) => setCreation_dt(e.target.value)}
                // required
              /> */}
              {/* )} */}
              {/* </InputWrapper> */}
              {/* <InputWrapper>
              Modifed date: */}
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              {/* &nbsp;&nbsp; */}
              {/* {device ? (
                  <StyledInput value={criticality} />
                ) : ( */}
              {/* <StyledInput
                value={modifed_dt}
                onChange={(e) => setModifed_dt(e.target.value)} */}
              {/* // required */}
              {/* /> */}
              {/* )} */}
              {/* </InputWrapper> */}

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
                    {/* <option value="" style={{ color: "rgba(0,0,0,0.1)" }}>
                      Select Status
                    </option> */}
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
              {/* <InputWrapper>
                Total Count:
                &nbsp;<span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                 {device ? (
                  <StyledInput value={myfunction} />
                ) : ( 
                <StyledInput
                  type="number"
                  value={total_count}
                  onChange={(e) => setTotelCount(e.target.value)}
                  // required
                />
        
              </InputWrapper> */}
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

  /* &:focus {
    background-color: yellow;
  } */

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
    box-shadow: #6ab344 0px 3px 8px !important;
    opacity: 0.8;
  }
`;

const StyledButton = styled(Button)`
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

export default AddRackModel;
