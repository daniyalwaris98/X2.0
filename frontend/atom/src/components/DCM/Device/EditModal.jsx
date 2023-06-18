import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select, Checkbox } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import "../../AllStyling/CSSStyling.css";

const EditAtom = (props) => {
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

  let [loading, setLoading] = useState(false);
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
        .post(baseUrl + "/editDccmDevice ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data?.response, "error");
          } else {
            openSweetAlert("Device Updated Successfully", "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllDcCapacityDevices")
                .then((response) => {
                  console.log(response.data);
                  props.setDataSource(response.data);
                  props.excelData = response.data;
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
  let [device, setDevice] = useState(props.editRecord);

  let [ip_address, setIp] = useState(
    device ? getString(device.ip_address) : ""
  );
  let [source, setSource] = useState(device ? getString(device.source) : "");
  //   let [atom_id, setAtom_id] = useState(device ? getString(device.atom_id) : "");
  //   let [site_name, setSite_name] = useState(
  //     device ? getString(device.site_name) : ""
  //   );
  //   let [rack_name, setRack_name] = useState(
  //     device ? getString(device.rack_name) : ""
  //   );
  let [device_name, setDevice_name] = useState(
    device ? getString(device.device_name) : ""
  );
  //   let [device_ru, setDevice_ru] = useState(
  //     device ? getString(device.device_ru) : ""
  //   );
  //   let [department, setDepartment] = useState(
  //     device ? getString(device.department) : ""
  //   );
  //   let [section, setSection] = useState(device ? getString(device.section) : "");
  //   let [criticality, setCriticality] = useState(
  //     device ? getString(device.criticality) : ""
  //   );
  //   let [myfunction, setMyfunction] = useState(
  //     device ? getString(device.function) : ""
  //   );
  //   let [domain, setDomain] = useState(device ? getString(device.domain) : "");
  //   let [virtual, setVirtual] = useState(device ? getString(device.virtual) : "");
  let [device_type, setDevice_type] = useState(
    device ? getString(device.device_type) : ""
  );
  let [dccm_id, setdccm_id] = useState(device ? getString(device.dccm_id) : "");
  let [password_group, setPassword_group] = useState(
    device ? getString(device.password_group) : ""
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      dccm_id,
      ip_address,
      //   atom_id,
      //   site_name,
      //   rack_name,
      device_name,
      //   device_ru,
      //   department,
      //   section,
      //   criticality,
      //   function: myfunction,
      //   domain,
      //   virtual,
      device_type,
      password_group,
      source,
    };

    props.setIsEditModalVisible(false);
    console.log("devices", device);
    postDevice(device);
  };
  //   const changeSelectOptionHandler = (event) => {
  //     setSite_name(event.target.value);
  //     // setRack_name(event.target.value);
  //     // const res = axios.get(baseUrl + "/getSitesForDropdown");
  //     // console.log("getSitesForDropdown", res);
  //     // // setSiteArray(res.data);
  //     // console.log("a", res.data[0]);
  //     // setSite_name(res.data);
  //     // setLoading(false);
  //     console.log(site_name);
  //     console.log(rack_name);
  //   };
  //   useEffect(() => {
  //     // const GroupDropdown = async (event) => {
  //     //   setSite_name(event.target.value);
  //     //   // setRack_name(event.target.value);
  //     //   console.log(site_name);
  //     //   console.log(rack_name);
  //     // };
  //     // GroupDropdown(event);

  //     // const changeSelectOptionHandler = (event) => {
  //     //   setSite_name(event.target.value);
  //     //   // setRack_name(event.target.value);
  //     //   console.log(site_name);
  //     //   console.log(rack_name);
  //     // };
  //     // changeSelectOptionHandler(event);
  //     console.log(site_name);
  //     console.log(rack_name);
  //   }, [site_name, rack_name]);

  //   const [siteArray, setSiteArray] = useState([]);
  //   useEffect(() => {
  //     const getSitesForDropdown = async () => {
  //       setLoading(true);

  //       try {
  //         const res = await axios.get(baseUrl + "/getSitesForDropdown");
  //         console.log("getSitesForDropdown", res);
  //         setSiteArray(res.data);
  //         // setSite_name(res.data[0]);
  //         setLoading(false);
  //       } catch (err) {
  //         console.log(err.response);
  //         setLoading(false);
  //       }
  //     };
  //     getSitesForDropdown();
  //   }, [site_name]);

  //   const [rackArray, setRackArray] = useState([]);

  //   useEffect(() => {
  //     const getRacksBySiteDropdown = async () => {
  //       setLoading(true);

  //       try {
  //         const res = await axios.get(
  //           `${baseUrl}/getRacksBySiteDropdown?site_name=${site_name}`
  //         );
  //         console.log("getRacksBySiteDropdown", res);
  //         setRackArray(res.data);
  //         console.log(res.data[0]);
  //         // setRack_name(res.data[0]);
  //         // setRack_name(rack_name);
  //         setRack_name(rack_name);
  //         setLoading(false);
  //       } catch (err) {
  //         console.log(err.response);
  //         setLoading(false);
  //       }
  //     };
  //     getRacksBySiteDropdown();
  //   }, [site_name]);
  const [passwordArray, setPasswordArray] = useState([]);

  //   console.log(rack_name);

  useEffect(() => {
    const getPasswordGroupDropdown = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getPasswordGroupDropdown");

        console.log("getRacksBySiteDropdown", res);
        setPasswordArray(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    getPasswordGroupDropdown();
  }, [password_group]);

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
        marginTop: "-70px",
        zIndex: "99999",
        textAlign: "center",
        alignContent: "center",
        padding: "0px",
      }}
      width="50%"
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
          <Col span={24} style={{}}>
            <p style={{ fontSize: "22px", float: "left", display: "flex" }}>
              {device ? "Edit" : "Add"} Device
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
              IP Address: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={ip_address}
                pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"
                onChange={(e) => setIp(e.target.value)}
                required
              />
              {/* )} */}
            </InputWrapper>
            {/* <InputWrapper>
              Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  value={site_name}
                  onChange={(e) => changeSelectOptionHandler(e)}
                >
                 
                  {siteArray?.map((item, index) => {
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
              Rack Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  value={rack_name}
                  onChange={(e) => {
                    setRack_name(e.target.value);
                  }}
                >
                  {rackArray?.map((item, index) => {
                    return (
                      <>
                        <option>{item}</option>
                      </>
                    );
                  })}
                </Styledselect>
              </div>
              {/* <StyledInput
                value={password_group}
                onChange={(e) => setPassword_group(e.target.value)}
                required
              /> */}
            {/* )} */}
            {/* </InputWrapper> */}
            <InputWrapper>
              Device Name:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              <StyledInput
                value={device_name}
                onChange={(e) => setDevice_name(e.target.value)}
                // required
              />
              {/* )
                } */}
            </InputWrapper>
            {/* <InputWrapper> */}
            {/* Source: */}
            {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
            {/* &nbsp;&nbsp;
              <StyledInput
                value={source}
                onChange={(e) => setSource(e.target.value)} */}
            {/* // required */}
            {/* /> */}
            {/* )
                } */}
            {/* </InputWrapper> */}
            {/* <InputWrapper> */}
            {/* Device RU: */}
            {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
            {/* &nbsp;&nbsp; */}
            {/* <StyledInput
                value={device_ru}
                onChange={(e) => setDevice_ru(e.target.value)}
                // required
              /> */}
            {/* </InputWrapper> */}
            {/* <InputWrapper>
              Department:
            &nbsp;<span style={{ color: "red" }}>*</span> 
              &nbsp;&nbsp;
             
              <StyledInput
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              
              />
            
            </InputWrapper> */}
            {/* <InputWrapper>
              Section:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
             
              <StyledInput
                value={section}
                onChange={(e) => setSection(e.target.value)}
               
              />
            
            </InputWrapper> */}
          </Col>
          <Col span={10} style={{ marginLeft: "6%" }}>
            {/* <InputWrapper>
              Criticality:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              
              <StyledInput
                value={criticality}
                onChange={(e) => setCriticality(e.target.value)}
                // required
              />
           
            </InputWrapper> */}
            {/* <InputWrapper>
              Function:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
             
              <StyledInput
                value={myfunction}
                onChange={(e) => setMyfunction(e.target.value)}
                // required
              />
              
            </InputWrapper>
            <InputWrapper>
              Domain:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
             
              <StyledInput
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
               
              />
           
            </InputWrapper>
            <InputWrapper>
              Virtual:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
             
              <StyledInput
                value={virtual}
                onChange={(e) => setVirtual(e.target.value)}
                // required
              />
              
            </InputWrapper> */}
            <InputWrapper>
              Device Type: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={device_type} />
                ) : ( */}
              <StyledInput
                value={device_type}
                onChange={(e) => setDevice_type(e.target.value)}
                required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Password Group:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  value={password_group}
                  onChange={(e) => {
                    setPassword_group(e.target.value);
                  }}
                >
                  <option value="">Select</option>

                  {passwordArray.map((item, index) => {
                    return (
                      <>
                        <option>{item}</option>
                      </>
                    );
                  })}
                </Styledselect>
              </div>
              {/* <StyledInput
                value={password_group}
                onChange={(e) => setPassword_group(e.target.value)}
                required
              /> */}
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

export default EditAtom;
