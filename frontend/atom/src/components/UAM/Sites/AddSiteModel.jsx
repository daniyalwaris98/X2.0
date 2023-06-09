import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import sites from "./assets/sites.svg";
import { StyledselectIpam } from "../../AllStyling/All.styled.js";

const AddSiteModel = (props) => {
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

  const DType = ["Production", "Not Production"];
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
        .post(baseUrl + "/addSite ", device)
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
                .get(baseUrl + "/getAllSites")
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

  let [site_name, setSitename] = useState(
    device ? getString(device.site_name) : ""
  );
  // let [site_id, setSiteID] = useState(device ? getString(device.site_id) : "");
  let [region, setRegion] = useState(device ? getString(device.region) : "");
  // const [activeState, setActiveState] = useState("Active");

  let [latitude, setLatitude] = useState(
    device ? getString(device.latitude) : ""
  );
  let [longitude, setLongtitude] = useState(
    device ? getString(device.longitude) : ""
  );
  let [city, setCity] = useState(device ? getString(device.city) : "");
  let [creation_date, setCreation_dt] = useState(
    device ? getString(device.creation_date) : ""
  );
  let [modification_date, setModifed_dt] = useState(
    device ? getString(device.modification_date) : ""
  );
  let [status, setStatus] = useState(
    device ? getString(device.status) : "Production"
  );
  // let [total_count, setTotelCount] = useState(
  //   device ? getString(device.total_count) : ""
  // );

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
      site_name,
      region,
      // site_id,
      latitude,
      longitude,
      city,
      creation_date,
      modification_date,
      status,
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
              <img src={sites} alt="" /> &nbsp; {device ? "Edit" : "Add"} Site
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
                value={site_name}
                onChange={(e) => setSitename(e.target.value)}
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
                type="number"
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
                type="number"
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
            {/* <InputWrapper>
              Total Count: 
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              
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
  // font-family: Montserrat-Regular;
  /* box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px !important; */
  background-color: ${(props) => props.color};
  border-color: ${(props) => props.color};
  color: white;
  border-radius: 5px;
  &:focus,
  &:hover {
    background-color: ${(props) => props.color};
    border-color: ${(props) => props.color};
    box-shadow: #6ab344 0px 3px 8px !important;

    color: white;
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

export default AddSiteModel;
