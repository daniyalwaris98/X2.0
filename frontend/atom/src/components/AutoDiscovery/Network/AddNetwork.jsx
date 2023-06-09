import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import "../../AllStyling/CSSStyling.css";
import { useNavigate } from "react-router-dom";

const AddAtom = (props) => {
  const navigate = useNavigate();
  const { Option } = Select;
  const children = [];
  const [isPassModalVisible, setIsPassModalVisible] = useState(false);
  const [isSiteModalVisible, setIsSiteModalVisible] = useState(false);
  const [isRackModalVisible, setIsRackModalVisible] = useState(false);
  const [passGroup, setPassGroup] = useState("");
  const [username, setUsername] = useState("");
  const [pass, setPass] = useState("");

  const showModal = () => {
    setIsPassModalVisible(true);
  };
  const handleOk = () => {
    setIsPassModalVisible(false);
  };
  const handleCancelPasPopup = () => {
    setIsPassModalVisible(false);
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

  const handlePassGroupFormSubmit = async (e) => {
    e.preventDefault();
    const passGroupformData = {
      password_group: passGroup,
      username: username,
      password: pass,
    };
    console.log(passGroupformData);
    setLoading(true);
    // try {
    //   await axios.post(baseUrl + "/addUser", passGroupformData);
    //   setPassGroup("");
    //   setUsername("");
    //   setPass("");
    //   setIsModalVisible(false);
    //   setLoading(false);
    // } catch (err) {
    //   console.log(err);
    //   setLoading(false);
    // }

    await axios
      .post(baseUrl + "/addUser", passGroupformData)
      .then((response) => {
        console.log("hahahehehoho");
        // console.log(response.status);
        setPassGroup("");
        setUsername("");
        setPass("");
        setIsPassModalVisible(false);
        setLoading(false);
        openSweetAlert(response?.data, "success");
        const promises = [];
        promises.push(
          axios
            .get(baseUrl + "/getPasswordGroupDropdown")
            .then((res) => {
              console.log("getPasswordGroupDropdown", res);
              setPasswordArray(res.data);
              setPassword_group(res.data[0]);

              setLoading(false);
            })
            .catch((error) => {
              console.log(error);
              // openSweetAlert("Something Went Wrong!", "danger");
              setLoading(false);
            })
        );
        setLoading(false);
        return Promise.all(promises);
      })
      .catch((err) => {
        openSweetAlert(response?.data, "error");
        console.log("error ==> " + err);
        setLoading(false);
      });
  };

  let [siteName, setSiteName] = useState("");
  // let [site_id, setSiteID] = useState("");
  let [region, setRegion] = useState("");

  let [latitude, setLatitude] = useState("");
  let [longitude, setLongtitude] = useState("");
  let [city, setCity] = useState("");
  let [creation_date, setCreation_dt] = useState("");
  let [modification_date, setModifed_dt] = useState("");
  let [status, setStatus] = useState("Production");
  let [total_count, setTotelCount] = useState("");

  const siteData = async (e) => {
    e.preventDefault();

    const allSiteData = {
      site_name: siteName,
      region,
      latitude,
      longitude,
      city,
      status,
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
            openSweetAlert(
              `Site ${device ? "Added" : "Added"} Successfully`,
              "success"
            );
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getSitesForDropdown")
                .then((res) => {
                  console.log("getSitesForDropdown", res);

                  setSiteArray(res.data);
                  // console.log("a", res.data[0]);
                  setSite_name(res.data[0]);
                  // const rackResp= axios
                  // .get(baseUrl + "/getSitesForDropdown");

                  setSiteArrayR(res.data);
                  // console.log("a", res.data[0]);
                  setSiteNameR(res.data[0]);

                  setIsSiteModalVisible(false);

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

  let [rackName, setRackName] = useState("");
  let [siteNameR, setSiteNameR] = useState("");

  let [serial_number, setserialNumber] = useState("");
  let [manufacturer_date, setmanufacture_date] = useState("");
  // let [manufacture_dt, setManufacture_dt] = useState(
  //   device ? getString(device.manufacture_dt) : ''
  // );
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
  // let [total_countR, setTotalCountR] = useState("");

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
      // total_count: total_countR,
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
              `Rack ${device ? "Added" : "Added"} Successfully`,
              "success"
            );
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + `/getRacksBySiteDropdown?site_name=${site_name}`)
                .then((res) => {
                  console.log("getRacksBySiteDropdown", res);

                  setRackArray(res.data);
                  // console.log("a", res.data[0]);
                  setRack_name(res.data[0]);

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

  // const postDevice = async (device) => {
  //   try {
  //     //console.log(device);
  //     await axios
  //       .post(baseUrl + "/addAtomDevice ", device)
  //       .then((response) => {
  //         if (response?.response?.status == 500) {
  //           openSweetAlert(response?.response?.data?.response, "error");
  //           console.log(response?.response?.data?.response, "error");
  //         } else {
  //           // console.log(response?.response?.status);
  //           openSweetAlert(
  //             `Atom ${device ? "Added" : "Added"} Successfully`,
  //             "success"
  //           );
  //           const promises = [];
  //           promises.push(
  //             axios
  //               .get(baseUrl + "/getAtoms")
  //               .then((response) => {
  //                 console.log(response.data);
  //                 props.setDataSource(response.data);
  //                 props.excelData = response.data;
  //                 props.setRowCount(response.data.length);
  //                 props.excelData = response.data;

  //                 // let tableData = [...props.excelData, response.data];
  //                 // // console.log(response.data);
  //                 // // tableData = response.data;
  //                 // props.setDataSource(tableData);
  //                 // props.setRowCount(tableData.length);
  //                 // props.excelData = response.data;
  //                 console.log("response===>", response);

  //                 // props.setDataSource(response.data);
  //                 // props.excelData = response.data;
  //                 // props.setRowCount(response.data.length);
  //                 // props.excelData = response.data;
  //                 console.log(response.data);
  //               })
  //               .catch((error) => {
  //                 console.log(error);
  //                 // openSweetAlert("Something Went Wrong!", "error");
  //               })
  //           );
  //           return Promise.all(promises);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log("in add seed device catch ==> " + error);
  //         openSweetAlert("Something Went Wrong!", "error");
  //       });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const postDevice = async (device) => {
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/addNetwork ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
            console.log(response?.data?.Response);
          } else {
            openSweetAlert(response?.data, "success");
            console.log(response?.data?.Response);

            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getAllNetworks")
                .then((response) => {
                  console.log("1", response.data);
                  props.setDataSource(response.data);
                  console.log("2", response.data);

                  // props.excelData = response.data;
                  props.checkAtom(response.data);
                  console.log("3", response.data);

                  props.setRowCount(response.data.length);
                  console.log("4", response.data);

                  // props.excelData = response.data;
                  // console.log("5", response.data);
                })
                .catch((error) => {
                  console.log("errorerrorerrorerrorerror", error);

                  //  openSweetAlert("Something Went Wrong!", "error");
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

  const [loading, setLoading] = useState(false);
  let [device, setDevice] = useState(props.addRecord);

  let [networkName, setNetworkName] = useState(
    device ? getString(device.network_name) : ""
  );
  let [network_id, setNetwork_id] = useState(
    device ? getString(device.network_id) : ""
  );
  let [subnet, setSubnet] = useState(device ? getString(device.subnet) : "");
  let [noOfDevices, setNoOfDevices] = useState(
    device ? getString(device.no_of_devices) : ""
  );
  let [scanStatus, setscanStatus] = useState(
    device ? getString(device.scan_status) : ""
  );
  let [excludedIpRange, setExcludedIpRange] = useState(
    device ? getString(device.excluded_ip_range) : ""
  );

  const Ru = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30,
  ];

  const statusType = ["Production", "Not Production"];

  const DType = [
    "cisco_ios",
    "cisco_ios_xe",
    "cisco_ios_xr",
    "cisco_asa",
    "cisco_nxos",
    "cisco_wlc",
    "fortinet",
    "arista",
    "huawei",
    "f5_ltm",
    "juniper",
    "juniper_screenos",
    "a10",
    "arbor",
    "fireeye",
    "greatbay",
    "infoblox",
    "paloalto",
    "prime",
    "pulse_secure",
    "ucs",
    "wire_filter",

    "cisco_APIC_server",
    "symantec",
    "firepower",
  ];
  const changeSelectOptionHandler = (event) => {
    setSite_name(event.target.value);
    // setRack_name(event.target.value);
    const res = axios.get(baseUrl + "/getSitesForDropdown");
    console.log("getSitesForDropdown", res);
    // setSiteArray(res.data);
    console.log("a", res.data[0]);
    setSite_name(res.data);
    setLoading(false);
    console.log(site_name);
    console.log(rack_name);
  };
  //   useEffect(() => {
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

  /** If "Type" is null or undefined then options will be null,
   * otherwise it will create a options iterable based on our array
   */

  //   const [siteArray, setSiteArray] = useState([]);
  //   useEffect(() => {
  //     const getSitesForDropdown = async () => {
  //       setLoading(true);

  //       try {
  //         const res = await axios.get(baseUrl + "/getSitesForDropdown");
  //         console.log("getSitesForDropdown", res);
  //         setSiteArray(res.data);
  //         // console.log("a", res.data[0]);
  //         setSite_name(res.data[0]);
  //         setLoading(false);
  //       } catch (err) {
  //         console.log(err.response);
  //         setLoading(false);
  //       }
  //     };
  //     getSitesForDropdown();
  //   }, []);
  //   const [siteArrayR, setSiteArrayR] = useState([]);
  //   useEffect(() => {
  //     const getSitesForDropdown = async () => {
  //       setLoading(true);

  //       try {
  //         const res = await axios.get(baseUrl + "/getSitesForDropdown");
  //         console.log("getSitesForDropdown", res);
  //         setSiteArrayR(res.data);
  //         // console.log("a", res.data[0]);
  //         setSiteNameR(res.data[0]);
  //         setLoading(false);
  //       } catch (err) {
  //         console.log(err.response);
  //         setLoading(false);
  //       }
  //     };
  //     getSitesForDropdown();
  //   }, []);

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
  //         console.log("b", res.data[0]);
  //         setRack_name(res.data[0]);
  //         setLoading(false);
  //       } catch (err) {
  //         console.log(err.response);
  //         setLoading(false);
  //       }
  //     };
  //     getRacksBySiteDropdown();
  //   }, [site_name]);
  //   const [passwordArray, setPasswordArray] = useState([]);

  //   useEffect(() => {
  //     const getPasswordGroupDropdown = async () => {
  //       setLoading(true);

  //       try {
  //         const res = await axios.get(baseUrl + "/getPasswordGroupDropdown");

  //         console.log("getPasswordGroupDropdown", res);
  //         setPasswordArray(res.data);
  //         setPassword_group(res.data[0]);

  //         setLoading(false);
  //       } catch (err) {
  //         console.log(err.response);
  //         setLoading(false);
  //       }
  //     };
  //     getPasswordGroupDropdown();
  //   }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const device = {
      //   network_id,
      network_name: networkName,
      subnet,
      no_of_devices: noOfDevices,
      scan_status: scanStatus,
      excluded_ip_range: excludedIpRange,
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
            <Col span={24} style={{}}>
              <p style={{ fontSize: "22px", float: "left", display: "flex" }}>
                Add Network
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
                Network Name: &nbsp;<span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                {/* {device ? (
                  <StyledInput value={ip_address} />
                ) : ( */}
                <StyledInput
                  value={networkName}
                  // pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"
                  onChange={(e) =>
                    setNetworkName(
                      e.target.value.replace(
                        /[!^=&\/\\#;,+()$~%'":*?<>{}@_\-.]/g,

                        ""
                      )
                    )
                  }
                  required
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
                Subnet: &nbsp;<span style={{ color: "red" }}>*</span>
                &nbsp;&nbsp;
                {/* {device ? (
                  <StyledInput value={device_name} />
                ) : ( */}
                <StyledInput
                  value={subnet}
                  onChange={(e) => setSubnet(e.target.value.replace(
                    /[!^=&\\\#;,+()$~%'":*?<>{}@_\-]/g,

                    ""
                  ))}
                    required
                />
                {/* )
                } */}
              </InputWrapper>
            </Col>
            <Col span={10} style={{ marginLeft: "6%" }}>
              <InputWrapper>
                Scan Status: &nbsp;<span style={{ color: "red" }}>*</span>
                <br />
                <div className="select_type">
                  <Styledselect
                    className="rectangle"
                    required
                    onChange={(e) => setscanStatus(e.target.value)}
                  >
                    <option value="">Choose...</option>

                    <option value="Active">Active</option>
                    <option value="InActive">InActive</option>
                  </Styledselect>
                </div>
              </InputWrapper>
              <InputWrapper>
                Excluded Ip Range:
                {/* &nbsp;<span style={{ color: "red" }}>*</span> */}
                &nbsp;&nbsp;
                
                <StyledInput
                  value={excludedIpRange}
                  onChange={(e) => setExcludedIpRange(e.target.value.replace(/[^0-9-]+/g,
                  ""))}
                />
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
  /* .ant-input:focus {
    border-color: #6ab344 !important;
    outline: 0 !important;
    -webkit-box-shadow: 0 0 0 2px #6ab344 !important;
    box-shadow: 0 0 0 2px #6ab344 !important;
  }  */
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
