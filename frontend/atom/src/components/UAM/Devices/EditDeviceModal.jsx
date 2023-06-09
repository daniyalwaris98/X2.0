import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import devices from "./assets/devices.svg";
import "../../AllStyling/CSSStyling.css";

const EditDevicesModel = (props) => {
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
        .post(baseUrl + "/addDevice ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data?.response, "error");
          } else {
            openSweetAlert(
              `Device ${device ? "Updated" : "Updated"} Successfully`,
              "success"
            );
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllDevices")
                .then((response) => {
                  console.log("res edit model", response.data);
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
          console.log("in edit device catch ==> " + error);
          // openSweetAlert("Something Went Wrong!", "error");
        });
    } catch (err) {
      console.log(err);
    }
  };

  let [device, setDevice] = useState(props.editRecord);

  let [device_name, setdevice_name] = useState(
    device ? getString(device.device_name) : ""
  );
  let [site_name, setsite_name] = useState(
    device ? getString(device.site_name) : ""
  );
  //   let [site_name, setSite_name] = useState(
  //     device ? getString(device.site_name) : ""
  //   );

  let [rack_name, setrack_name] = useState(
    device ? getString(device.rack_name) : ""
  );
  let [ip_address, setip_address] = useState(
    device ? getString(device.ip_address) : ""
  );

  let [software_type, setsoftware_type] = useState(
    device ? getString(device.software_type) : ""
  );
  let [software_version, setsoftware_version] = useState(
    device ? getString(device.software_version) : ""
  );
  let [patch_version, setpatch_version] = useState(
    device ? getString(device.patch_version) : ""
  );

  let [status, setStatus] = useState(device ? getString(device.status) : "");

  let [ru, setRu] = useState(device ? getString(device.ru) : "");
  //   let [rfs_dt, setRfs_dt] = useState(
  //     device ? getString(device.rfs_dt) : ''
  //   );
  let [department, setDepartment] = useState(
    device ? getString(device.department) : ""
  );
  let [section, setSection] = useState(device ? getString(device.section) : "");
  let [criticality, setCriticality] = useState(
    device ? getString(device.criticality) : ""
  );
  let [myfunction, setMyfunction] = useState(
    device ? getString(device.function) : ""
  );
  // let [domain, setDomain] = useState(device ? getString(device.domain) : "");
  let [manufacturer, setManufacturer] = useState(
    device ? getString(device.manufacturer) : ""
  );
  let [hw_eos_date, setHw_eos_dt] = useState(
    device ? getString(device.hw_eos_date) : ""
  );
  let [hw_eol_date, setHw_eol_dt] = useState(
    device ? getString(device.hw_eol_date) : ""
  );
  let [sw_eos_date, setSw_eos_dt] = useState(
    device ? getString(device.sw_eos_date) : ""
  );
  let [sw_eol_date, setSw_eol_dt] = useState(
    device ? getString(device.sw_eol_date) : ""
  );
  let [virtual, setVirtual] = useState(device ? getString(device.virtual) : "");
  // let [rfs_date, setRfs_dt] = useState(
  //   device ? getString(device.rfs_date) : ""
  // );
  let [authentication, setAuthentication] = useState(
    device ? getString(device.authentication) : ""
  );
  let [serial_number, setSerial_number] = useState(
    device ? getString(device.serial_number) : ""
  );
  let [pn_code, setPn_code] = useState(device ? getString(device.pn_code) : "");
  let [subrack_id_number, setsubrack_id_number] = useState(
    device ? getString(device.subrack_id_number) : ""
  );
  let [manufacturer_date, setManufacture_dt] = useState(
    device ? getString(device.manufacturer_date) : ""
  );
  const [loading, setLoading] = useState(false);

  // let [max_power, setMax_power] = useState(
  //   device ? getString(device.max_power) : ""
  // );
  // let [site_type, setsite_type] = useState(
  //   device ? getString(device.site_type) : ""
  // );
  let [source, setsource] = useState(device ? getString(device.source) : "");
  let [stack, setstack] = useState(device ? getString(device.stack) : "");
  let [contract_number, setcontract_number] = useState(
    device ? getString(device.contract_number) : ""
  );
  let [contract_expiry, setcontract_expiry] = useState(
    device ? getString(device.contract_expiry) : ""
  );

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
      device_name,
      site_name,
      rack_name,
      ip_address,
      software_version,
      ru,
      department,
      section,
      criticality,
      function: myfunction,
      status,
      manufacturer,
      // hw_eos_date,
      // hw_eol_date,
      // sw_eos_date,
      // sw_eol_date,
      software_type,
      virtual,

      authentication,
      serial_number,
      pn_code,
      subrack_id_number,
      // manufacturer_date,

      source,
      stack,
      contract_number,
    };

    props.setIsEditModalVisible(false);
    postDevice(device);
  };

  const [siteArray, setSiteArray] = useState([]);
  useEffect(() => {
    const getSitesForDropdown = async () => {
      // setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getSitesForDropdown");
        console.log("getSitesForDropdown", res);
        setSiteArray(res.data);
        // console.log("a", res.data[0]);
        // setsite_name(res.data[0]);
        // setLoading(false);
      } catch (err) {
        console.log(err.response);
        // setLoading(false);
      }
    };
    getSitesForDropdown();
  }, []);

  const [rackArray, setRackArray] = useState([]);

  useEffect(() => {
    const getRacksBySiteDropdown = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${baseUrl}/getRacksBySiteDropdown?site_name=${site_name}`
        );
        console.log("getRacksBySiteDropdown", res);
        setRackArray(res.data);
        console.log(res.data[0]);
        // setRack_name(res.data[0]);
        // setRack_name(rack_name);
        // setRack_name(rack_name);
        setrack_name(res.data[0]);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    getRacksBySiteDropdown();
  }, [site_name]);

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
      width="90%"
      title=""
      closable={false}
      visible={props.isEditModalVisible}
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
              <img src={devices} alt="" /> &nbsp; {device ? "Edit" : "Add"}{" "}
              Device
            </p>
            <div
              style={{
                float: "right",
                display: "flex",
                marginRight: "55px",
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
          <Col span={7} style={{ marginLeft: "3%" }}>
            {/* <InputWrapper>
              Device Name:
              &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              
              <StyledInput
                value={device_name}
                onChange={(e) => setdevice_name(e.target.value)}
                readOnly
                // required
              />
            </InputWrapper> */}
            {/* <InputWrapper>
              Site Name: */}
            {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
            {/* &nbsp;&nbsp; */}
            {/* {device ? (
                  <StyledInput value={ip_address} />
                ) : ( */}
            {/* <StyledInput
                value={site_name}
                onChange={(e) => setsite_name(e.target.value)}
                // required
              /> */}
            {/* )} */}
            {/* </InputWrapper> */}

            <InputWrapper>
              Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  value={site_name}
                  required
                  onChange={(e) => {
                    setsite_name(e.target.value);
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

            {/* <InputWrapper>
              Rack Name:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
             
              <StyledInput
                value={rack_name}
                onChange={(e) => setrack_name(e.target.value)}
                // required
              />
              
            </InputWrapper> */}

            <InputWrapper>
              Rack Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  value={rack_name}
                  onChange={(e) => {
                    setrack_name(e.target.value);
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
            </InputWrapper>

            {/* 
            <InputWrapper>
              Ip Address:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              
              <StyledInput
                value={ip_address}
                onChange={(e) => setip_address(e.target.value)}
                // required
              />
            </InputWrapper> */}

            <InputWrapper>
              Software Version:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={department} />
                ) : ( */}
              <StyledInput
                value={software_version}
                onChange={(e) => setsoftware_version(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              Contract Expiry:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={contract_expiry}
                onChange={(e) => setcontract_expiry(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Serial Number:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={serial_number}
                onChange={(e) => setSerial_number(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Contract Number:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={contract_number}
                onChange={(e) => setcontract_number(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Manufacturer:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "1%" }}>
            <InputWrapper>
              Status: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  required
                  value={status}
                  // onChange={changeSelectOptionHandler}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Production">Production</option>

                  <option value="Dismantled">Dismantled</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Undefined">Undefined</option>
                </Styledselect>
              </div>
            </InputWrapper>
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
            <InputWrapper>
              Criticality:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={criticality}
                onChange={(e) => setCriticality(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              Department:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Section:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={section}
                onChange={(e) => setSection(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              Function:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={myfunction}
                onChange={(e) => setMyfunction(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Software Type:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={software_type}
                onChange={(e) => setsoftware_type(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "1%" }}>
            {/* <InputWrapper>
              HW EOS Date:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
           
              <StyledInput
                value={hw_eos_date}
                onChange={(e) => setHw_eos_dt(e.target.value)}
                // required
              />
             
            </InputWrapper> */}
            {/* <InputWrapper>
              HW EOL Date:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
             
              <StyledInput
                value={hw_eol_date}
                onChange={(e) => setHw_eol_dt(e.target.value)}
                // required
              />
            </InputWrapper> */}
            {/* <InputWrapper>
              SW EOS Date:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              
              <StyledInput
                value={sw_eos_date}
                onChange={(e) => setSw_eos_dt(e.target.value)}
                // required
              />
             
            </InputWrapper> */}
            {/* <InputWrapper>
              SW EOL Date:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              
              <StyledInput
                value={sw_eol_date}
                onChange={(e) => setSw_eol_dt(e.target.value)}
                // required
              />
            
            </InputWrapper> */}
            <InputWrapper>
              Virtual:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={virtual}
                onChange={(e) => setVirtual(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              Authentication:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={authentication}
                onChange={(e) => setAuthentication(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              SubRack Id Number:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={subrack_id_number}
                onChange={(e) => setsubrack_id_number(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              PN Code: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={pn_code}
                onChange={(e) => setPn_code(e.target.value)}
                // required
              />
            </InputWrapper>

            {/* <InputWrapper>
              Manufacturer Date:
              &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              
              <StyledInput
                value={manufacturer_date}
                onChange={(e) => setManufacture_dt(e.target.value)}
                // required
              />
            
            </InputWrapper> */}

            <InputWrapper>
              Source:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={source}
                onChange={(e) => setsource(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Stack:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={stack}
                onChange={(e) => setstack(e.target.value)}
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
`;
// const Styledselect = styled.select`
//   height: 2.2rem;
//   border-radius: 12px;
//   width: 100%;
//   outline: none;
//   border: 0.1px solid #cfcfcf;
// `;

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

export default EditDevicesModel;
