import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../utils/axios";
import Swal from "sweetalert2";

const StaticOnBoardModal = (props) => {
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
        .post(baseUrl + "/addDeviceStatically ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data?.response, "error");
          } else {
            openSweetAlert(
              `Device ${device ? "Updated" : "Added"} Successfully`,
              "success"
            );
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAtoms")
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

  const [loading, setLoading] = useState(false);

  let [device, setDevice] = useState(props.staticRecord);

  let [device_name, setdevice_name] = useState(
    device ? getString(device.device_name) : ""
  );
  let [ip_address, setipaddress] = useState(
    device ? getString(device.ip_address) : ""
  );
  let [rack_name, setRack_name] = useState(
    device ? getString(device.rack_name) : ""
  );
  let [site_name, setSite_name] = useState(
    device ? getString(device.site_name) : ""
  );
  let [domain, setdomain] = useState(device ? getString(device.domain) : "");
  let [section, setSection] = useState(device ? getString(device.section) : "");

  let [department, setDepartment] = useState(
    device ? getString(device.department) : ""
  );
  let [virtual, setVirtual] = useState(device ? getString(device.virtual) : "");

  let [device_ru, setDevice_ru] = useState(
    device ? getString(device.device_ru) : ""
  );

  let [authentication, setauthentication] = useState(
    device ? getString(device.authentication) : ""
  );
  let [contract_number, setcontract_number] = useState(
    device ? getString(device.contract_number) : ""
  );
  let [subrack_id_number, setsubrack_id_number] = useState(
    device ? getString(device.subrack_id_number) : ""
  );
  let [manufacturer_date, setmanufacturer_date] = useState(
    device ? getString(device.manufacturer_date) : ""
  );
  let [hw_eos_date, sethw_eos_date] = useState(
    device ? getString(device.hw_eos_date) : ""
  );
  let [hw_eol_date, sethw_eol_date] = useState(
    device ? getString(device.hw_eol_date) : ""
  );
  let [sw_eos_date, setsw_eos_date] = useState(
    device ? getString(device.hw_eol_date) : ""
  );
  let [sw_eol_date, setsw_eol_date] = useState(
    device ? getString(device.sw_eol_date) : ""
  );
  let [rfs_date, setrfs_date] = useState(
    device ? getString(device.rfs_date) : ""
  );
  let [patch_version, setpatch_version] = useState(
    device ? getString(device.patch_version) : ""
  );
  let [software_version, setsoftware_version] = useState(
    device ? getString(device.software_version) : ""
  );
  let [hardware_version, sethardware_version] = useState(
    device ? getString(device.hardware_version) : ""
  );

  let [criticality, setCriticality] = useState(
    device ? getString(device.criticality) : ""
  );
  let [myfunction, setMyfunction] = useState(
    device ? getString(device.function) : ""
  );
  let [serial_number, setserial_number] = useState(
    device ? getString(device.serial_number) : ""
  );
  let [pn_code, setpn_code] = useState(device ? getString(device.pn_code) : "");
  let [max_power, setmax_power] = useState(
    device ? getString(device.max_power) : ""
  );

  let [ru, setru] = useState(device ? getString(device.ru) : "");
  let [site_type, setsite_type] = useState(
    device ? getString(device.site_type) : ""
  );
  let [manufacturer, setmanufacturer] = useState(
    device ? getString(device.manufacturer) : ""
  );
  let [status, setstatus] = useState(device ? getString(device.status) : "");
  let [stack, setstack] = useState(device ? getString(device.stack) : "");
  let [contract_expiry, setcontract_expiry] = useState(
    device ? getString(device.contract_expiry) : ""
  );

  const changeSelectOptionHandler = (event) => {
    setSite_name(event.target.value);
    // setRack_name(event.target.value);
    console.log(site_name);
    console.log(rack_name);
  };
  useEffect(() => {
    console.log(site_name);
    console.log(rack_name);
  }, [site_name, rack_name]);
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
  if (site_name === "Algorithm") {
    type = algorithm;
  } else if (site_name === "Language") {
    type = language;
  } else if (site_name === "Data Structure") {
    type = dataStructure;
  }

  /** If "Type" is null or undefined then options will be null,
   * otherwise it will create a options iterable based on our array
   */
  if (type) {
    options = type.map((option) => <option>{option}</option>);
  }

  const [siteArray, setSiteArray] = useState([]);
  useEffect(() => {
    const getSitesForDropdown = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getSitesForDropdown");
        console.log("getSitesForDropdown", res);
        setSiteArray(res.data);
        setSite_name(res.data[0]);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    getSitesForDropdown();
  }, [site_name]);

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
        setRack_name(res.data[0]);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    getRacksBySiteDropdown();
  }, [site_name]);
  const [passwordArray, setPasswordArray] = useState([]);

  // useEffect(() => {
  //   const getPasswordGroupDropdown = async () => {
  //     setLoading(true);

  //     try {
  //       const res = await axios.get(baseUrl + "/getPasswordGroupDropdown");

  //       console.log("getRacksBySiteDropdown", res);
  //       setPasswordArray(res.data);
  //       setLoading(false);
  //     } catch (err) {
  //       console.log(err.response);
  //       setLoading(false);
  //     }
  //   };
  //   getPasswordGroupDropdown();
  // }, [password_group]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      device_name,

      rack_name,

      site_name,

      domain,

      section,

      department,

      virtual,

      authentication,

      contract_number,

      subrack_id_number,

      manufacturer_date,

      hw_eos_date,

      hw_eol_date,
      ip_address,
      sw_eos_date,

      sw_eol_date,

      rfs_date,

      patch_version,

      software_version,

      hardware_version,

      criticality,

      function: myfunction,

      serial_number,

      pn_code,

      max_power,

      ru,

      site_type,

      manufacturer,

      status,

      stack,

      contract_expiry,
    };

    props.setIsStaticModalVisible(false);
    console.log("devices", device);
    postDevice(device);
  };

  const handleCancel = () => {
    props.setIsStaticModalVisible(false);
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
        marginTop: "-85px",
        zIndex: "99999",
        textAlign: "center",
        alignContent: "center",
        padding: "0px",
      }}
      width="80%"
      title=""
      closable={false}
      open={props.isStaticModalVisible}
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
              Static On Boarding
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
          <Col span={7} style={{ marginLeft: "6%" }}>
            <InputWrapper>
              Device Name: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={device_name}
                onChange={(e) => setdevice_name(e.target.value)}
                required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              Site Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              {/* &nbsp;&nbsp; */}
              {/* {device ? (
                  <StyledInput value={site_name} />
                ) : ( */}
              <Styledselect
                onChange={changeSelectOptionHandler}
                // style={{ color: "#f41" }}
              >
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
              {/* <StyledInput
                value={site_name}
                onChange={(e) => setSite_name(e.target.value)}
                required
              /> */}
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Rack Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              {/* &nbsp;&nbsp; */}
              {/* {device ? (
                  <StyledInput value={rack_name} />
                ) : ( */}
              <Styledselect
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
              {/* <StyledInput
                value={rack_name}
                onChange={(e) => setRack_name(e.target.value)}
                required
              /> */}
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Domain:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={device_name} />
                ) : ( */}
              <StyledInput
                value={domain}
                onChange={(e) => setdomain(e.target.value)}
                // required
              />
              {/* )
                } */}
            </InputWrapper>
            <InputWrapper>
              IP Address: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={device_name} />
                ) : ( */}
              <StyledInput
                value={ip_address}
                onChange={(e) => setipaddress(e.target.value)}
                required
              />
              {/* )
                } */}
            </InputWrapper>
            <InputWrapper>
              Section:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={device_ru} />
                ) : ( */}
              <StyledInput
                value={section}
                onChange={(e) => setSection(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Department:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={department} />
                ) : ( */}
              <StyledInput
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>

            <InputWrapper>
              Virtual:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={section} />
                ) : ( */}
              <StyledInput
                value={virtual}
                onChange={(e) => setVirtual(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Criticality:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={criticality} />
                ) : ( */}
              <StyledInput
                value={criticality}
                onChange={(e) => setCriticality(e.target.value)}
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
              Authentication:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={myfunction} />
                ) : ( */}
              <StyledInput
                value={authentication}
                onChange={(e) => setauthentication(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "1%" }}>
            <InputWrapper>
              Contract Number:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={virtual} />
                ) : ( */}
              <StyledInput
                value={contract_number}
                onChange={(e) => setcontract_number(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Subrack Id Number:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={device_type} />
                ) : ( */}
              <StyledInput
                value={subrack_id_number}
                onChange={(e) => setsubrack_id_number(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Manufacturer Date:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={manufacturer_date}
                onChange={(e) => setmanufacturer_date(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              HW EOS Date:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={hw_eos_date}
                onChange={(e) => sethw_eos_date(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              HW EOL Date:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={hw_eol_date}
                onChange={(e) => sethw_eol_date(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              SW EOS Date:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={sw_eos_date}
                onChange={(e) => setsw_eos_date(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              SW EOL Date:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={sw_eol_date}
                onChange={(e) => setsw_eol_date(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              RFS Date:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={rfs_date}
                onChange={(e) => setrfs_date(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Patch Version:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={patch_version}
                onChange={(e) => setpatch_version(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Software Version:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={software_version}
                onChange={(e) => setsoftware_version(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
          </Col>
          <Col span={7} style={{ marginLeft: "1%" }}>
            <InputWrapper>
              Hardware Version:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={hardware_version}
                onChange={(e) => sethardware_version(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Serial Number:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={serial_number}
                onChange={(e) => setserial_number(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              PN Code:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={pn_code}
                onChange={(e) => setpn_code(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Max Power:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={max_power}
                onChange={(e) => setmax_power(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              RU:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={ru}
                onChange={(e) => setru(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Site Type:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={site_type}
                onChange={(e) => setsite_type(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Manufacturer:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={manufacturer}
                onChange={(e) => setmanufacturer(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Status:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={status}
                onChange={(e) => setstatus(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Stack:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={stack}
                onChange={(e) => setstack(e.target.value)}
                // required
              />
              {/* )} */}
            </InputWrapper>
            <InputWrapper>
              Contract Expiry:
              {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
              &nbsp;&nbsp;
              {/* {device ? (
                  <StyledInput value={password_group} />
                ) : ( */}
              <StyledInput
                value={contract_expiry}
                onChange={(e) => setcontract_expiry(e.target.value)}
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
  height: 27px;

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
  height: 27px;
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

export default StaticOnBoardModal;
