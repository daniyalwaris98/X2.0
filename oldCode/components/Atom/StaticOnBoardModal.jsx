import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../utils/axios";
import Swal from "sweetalert2";

const StaticOnBoardModal = (props) => {
  const { staticOnBoardRecord } = props;

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
        .post(baseUrl + "/addDeviceStatically ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
          } else {
            openSweetAlert(`Device  Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAtoms")
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

  const [deviceId, setDeviceId] = useState("");

  let [ip_address, setipaddress] = useState(
    device ? getString(device.ip_address) : ""
  );
  let [rack_name, setRack_name] = useState("");
  let [site_name, setSite_name] = useState("");
  let [domain, setdomain] = useState(device ? getString(device.domain) : "N/A");
  let [section, setSection] = useState(device ? getString(device.section) : "");

  let [department, setDepartment] = useState(
    device ? getString(device.department) : ""
  );
  let [virtual, setVirtual] = useState(device ? getString(device.virtual) : "");

  let [authentication, setauthentication] = useState(
    device ? getString(device.authentication) : "N/A"
  );
  let [contract_number, setcontract_number] = useState(
    device ? getString(device.contract_number) : "N/A"
  );
  let [subrack_id_number, setsubrack_id_number] = useState(
    device ? getString(device.subrack_id_number) : "N/A"
  );
  let [manufacturer_date, setmanufacturer_date] = useState(
    device ? getString(device.manufacturer_date) : "0"
  );
  let [hw_eos_date, sethw_eos_date] = useState(
    device ? getString(device.hw_eos_date) : "0"
  );
  let [hw_eol_date, sethw_eol_date] = useState(
    device ? getString(device.hw_eol_date) : "0"
  );
  let [sw_eos_date, setsw_eos_date] = useState(
    device ? getString(device.hw_eol_date) : "0"
  );
  let [sw_eol_date, setsw_eol_date] = useState(
    device ? getString(device.sw_eol_date) : "0"
  );
  let [rfs_date, setrfs_date] = useState(
    device ? getString(device.rfs_date) : "0"
  );
  let [patch_version, setpatch_version] = useState(
    device ? getString(device.patch_version) : "0"
  );
  let [software_version, setsoftware_version] = useState(
    device ? getString(device.software_version) : "0"
  );
  let [hardware_version, sethardware_version] = useState(
    device ? getString(device.hardware_version) : "0"
  );

  let [criticality, setCriticality] = useState(
    device ? getString(device.criticality) : "N/A"
  );
  let [myfunction, setMyfunction] = useState(
    device ? getString(device.function) : "N/A"
  );
  let [serial_number, setserial_number] = useState(
    device ? getString(device.serial_number) : "0"
  );
  let [pn_code, setpn_code] = useState(
    device ? getString(device.pn_code) : "0"
  );
  let [max_power, setmax_power] = useState(
    device ? getString(device.max_power) : "0"
  );

  let [ru, setru] = useState(device ? getString(device.ru) : "N/A");

  let [site_type, setsite_type] = useState("N/A");
  let [manufacturer, setmanufacturer] = useState(
    device ? getString(device.manufacturer) : "N/A"
  );
  let [status, setstatus] = useState(device ? getString(device.status) : "0");
  let [stack, setstack] = useState(device ? getString(device.stack) : "N/A");
  let [contract_expiry, setcontract_expiry] = useState(
    device ? getString(device.contract_expiry) : "0"
  );

  useEffect(() => {
    if (staticOnBoardRecord) {
      setdevice_name(staticOnBoardRecord.device_name);
      setipaddress(staticOnBoardRecord.ip_address);
      setRack_name(staticOnBoardRecord.rack_name);
      setSite_name(staticOnBoardRecord.site_name);
      setSection(staticOnBoardRecord.section);
      setDepartment(staticOnBoardRecord.department);
      setVirtual(staticOnBoardRecord.virtual);
      setru(
        staticOnBoardRecord.device_ru ? staticOnBoardRecord.device_ru : "N/A"
      );
      setsite_type(staticOnBoardRecord.device_type);
      setmanufacturer(staticOnBoardRecord.creation_date);
      setstatus(staticOnBoardRecord.status);
      setDeviceId(staticOnBoardRecord.atom_id);
    }
  }, [staticOnBoardRecord]);

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

  if (type) {
    options = type.map((option) => <option>{option}</option>);
  }

  const [siteArray, setSiteArray] = useState([]);
  useEffect(() => {
    getSitesForDropdown();
  }, []);

  const getSitesForDropdown = async () => {
    setLoading(true);

    try {
      const res = await axios.get(baseUrl + "/getSitesForDropdown");
      setSiteArray(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err.response);
      setLoading(false);
    }
  };

  const [rackArray, setRackArray] = useState([]);

  useEffect(() => {
    if (site_name) {
      getRacksBySiteDropdown(site_name);
    }
  }, [site_name]);

  const getRacksBySiteDropdown = async (site_name) => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${baseUrl}/getRacksBySiteDropdown?site_name=${site_name}`
      );

      setRackArray(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err.response);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      atom_id: deviceId,
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
    postDevice(device);
  };

  const handleCancel = () => {
    props.setIsStaticModalVisible(false);
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
          <Col span={24} style={{ marginBottom: "20px" }}>
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
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  value={site_name}
                  onChange={(e) => setSite_name(e.target.value)}
                >
                  <option value="">Select Site Name</option>
                  {siteArray.map((item, index) => {
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
              Rack Name: &nbsp;<span style={{ color: "red" }}>*</span>
              <br />
              <div className="select_type">
                <Styledselect
                  className="rectangle"
                  value={rack_name}
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
