import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Row, Col, Modal, Input, Button, Select } from "antd";
import axios, { baseUrl } from "../../../utils/axios";
import Swal from "sweetalert2";
import sites from "../Sites/assets/sites.svg";

const EditSiteModel = (props) => {
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
  let [device, setDevice] = useState(props.editRecord);

  const postDevice = async (device) => {
    try {
      //console.log(device);
      await axios
        .post(baseUrl + "/editSntc ", device)
        .then((response) => {
          if (response?.response?.status == 500) {
            openSweetAlert(response?.response?.data, "error");
          } else {
            openSweetAlert(`PN Code Updated Successfully`, "success");
            const promises = [];
            promises.push(
              axios
                .get(baseUrl + "/getSNTC")
                .then((response) => {
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

  const regex = "^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|[1][012])-[0-9]{4}$";
  let [sntcId, setSNTCId] = useState(device ? getString(device.sntc_id) : "");
  let [pnCode, setPnCode] = useState(device ? getString(device.pn_code) : "");
  // let [itemCode, setItemCode] = useState(
  //   device ? getString(device.item_code) : ""
  // );
  // let [itemDesc, setItemDesc] = useState(
  //   device ? getString(device.item_desc) : ""
  // );
  let [hwEosDate, setHwEosDate] = useState(
    device ? getString(device.hw_eos_date) : ""
  );
  let [hwEolDate, setHwEolDate] = useState(
    device ? getString(device.hw_eol_date) : ""
  );
  let [swEosDate, setSwEosDate] = useState(
    device ? getString(device.sw_eos_date) : ""
  );
  let [swEolDate, setSwEolDate] = useState(
    device ? getString(device.sw_eol_date) : ""
  );
  let [manufactureDate, setManufactureDate] = useState(
    device ? getDateString(device.manufacturer_date) : ""
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
      // site_name,
      pn_code: pnCode,
      sntc_id: sntcId,
      sw_eol_date: swEolDate,
      sw_eos_date: swEosDate,
      hw_eol_date: hwEolDate,
      hw_eos_date: hwEosDate,
      manufacturer_date: manufactureDate,
      // item_code:itemCode,
      // item_desc:itemDesc,
      // region,
      // // site_id,
      // latitude,
      // longitude,
      // city,
      // // creation_date,
      // // modification_date,
      // status,
      // total_count,
    };

    props.setIsEditModalVisible(false);
    console.log("devices", device);
    postDevice(device);
  };

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
        marginTop: "70px",
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
        <Row
          style={{ alignContent: "center", margin: "5px 30px" }}
          gutter={[16, 16]}
        >
          <Col span={24} style={{ margin: "5px 15px" }}>
            <p
              style={{
                fontSize: "22px",
                float: "left",
                display: "flex",
              }}
            >
              <img src={sites} alt="" /> &nbsp; {device ? "Edit" : "Add"} PN
              Code
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
          <Col span={12}>
            <InputWrapper>
              Pn Code: &nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              {device ? (
                <StyledInput value={pnCode} readonly />
              ) : (
                <StyledInput
                  value={pnCode}
                  onChange={(e) => setPnCode(e.target.value)}
                  required
                />
              )}
            </InputWrapper>
            {/* <InputWrapper>
              Item Code:&nbsp;<span style={{ color: "red" }}>*</span>
              &nbsp;&nbsp;
              <StyledInput
                value={itemCode}
                onChange={(e) => setItemCode(e.target.value)}
                required
              />
            </InputWrapper> */}
            {/* <InputWrapper>
              Item Desc: &nbsp;&nbsp;
              <StyledInput
                value={itemDesc}
                onChange={(e) => setItemDesc(e.target.value)}
                // required
              />
            </InputWrapper> */}
            <InputWrapper>
              HW EOL Date: &nbsp;&nbsp;
              <StyledInput
                pattern={regex}
                placeholder="dd-mm-yyyy"
                value={hwEolDate}
                onChange={(e) => setHwEolDate(e.target.value)}
                // required
              />
            </InputWrapper>
            <InputWrapper>
              HW EOS Date: &nbsp;&nbsp;
              <StyledInput
                pattern={regex}
                placeholder="dd-mm-yyyy"
                value={hwEosDate}
                onChange={(e) => setHwEosDate(e.target.value)}
                // required
              />
            </InputWrapper>
          </Col>
          <Col span={12}>
            <InputWrapper>
              SW EOS Date: &nbsp;&nbsp;
              <StyledInput
                pattern={regex}
                placeholder="dd-mm-yyyy"
                value={swEosDate}
                onChange={(e) => setSwEosDate(e.target.value)}
                // required
              />
            </InputWrapper>
            <InputWrapper>
              SW EOL Date: &nbsp;&nbsp;
              <StyledInput
                pattern={regex}
                placeholder="dd-mm-yyyy"
                value={swEolDate}
                onChange={(e) => setSwEolDate(e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              Manufacture Date: &nbsp;&nbsp;
              <StyledInput
                pattern={regex}
                placeholder="dd-mm-yyyy"
                value={manufactureDate}
                onChange={(e) => setManufactureDate(e.target.value)}
                // required
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

export default EditSiteModel;
