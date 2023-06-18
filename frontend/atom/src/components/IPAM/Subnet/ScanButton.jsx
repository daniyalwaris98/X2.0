import React, { useState, useEffect } from "react";
import { SpinLoading } from "../../AllStyling/All.styled.js";
import addatom from "../assets/addatom.svg";
import adddevice from "../assets/adddevice.svg";
import addnew from "../assets/addnew.svg";
import Scanned from "../assets/Scanned.svg";
import Scanner from "../assets/scanner.svg";
import trash from "../assets/trash.svg";
import empty from "../assets/empty.svg";
import axios, { baseUrl } from "../../../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import EditModal from "./EditSubnet";
import {
  ImportOutlined,
  ExportOutlined,
  EditOutlined,
  DownOutlined,
  SmileOutlined,
  AlipayOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Modal,
  Radio,
  Row,
  Col,
  Checkbox,
  Table,
  notification,
  Spin,
  Progress,
  Button,
  Input,
  Dropdown,
  Menu,
  message,
  Space,
  Tooltip,
} from "antd";

const ButtonCell = ({
  value,
  setSingleSubnet,
  setScanData,
  scanData,
  setDataSource,
  setRowCount,
  excelData,

  singleSubnet,
}) => {
  const [pending, setPending] = useState(false);
  const [configData, setConfigData] = useState(null);

  const onChangeScan = (checkedValues) => {
    console.log("checked = ", checkedValues);
    setScanData(checkedValues);
  };
  const onClick = ({ key }) => {
    // message.info(`Click on item ${key}`);
    console.log("portScan,dns_Scan", scanData);
  };
  useEffect(() => {
    let user = localStorage.getItem("user");
    let userData = JSON.parse(user);

    const test = userData.monetx_configuration;

    let t = eval(test);
    let config = JSON.parse(t);
    setConfigData(config);
  }, []);
  const menu = (
    <Menu
      onClick={onClick}
      items={[
        {
          label: (
            <Checkbox.Group
              style={{
                width: "100%",
              }}
              onChange={onChangeScan}
            >
              <Checkbox value="Port Scan" style={{ padding: "10px" }}>
                Port Scan
              </Checkbox>
              <br />
              <Checkbox value="DNS Scan" style={{ padding: "10px" }}>
                DNS Scan
              </Checkbox>
            </Checkbox.Group>
          ),
          key: "1",
        },
      ]}
    />
  );
  return pending ? (
    <SpinLoading />
  ) : (
    <div style={{ textAlign: "center" }}>
      {configData?.ipam.pages.subnet.read_only ? (
        <Dropdown.Button
          disabled
          onClick={async () => {
            setPending(true);
            const ScanData = {
              options: scanData,
              subnets: value,
            };
            console.log("scanData", ScanData);

            // // console.log(typeof singleSubnet, singleSubnet);
            // // console.log("ScanDataScanDataScanDataScanDataScanData", singleSubnet);
            console.log("ScanDataScanDataScanDataScanDataScanData", value);

            // singleSubnet.push(selectedSubnetAddress);
            // setSingleSubnet(singleSubnet);

            setSingleSubnet((prev) => {
              let tempSubnetArray = [...prev];
              tempSubnetArray.push(value);
              return tempSubnetArray;
            });
            // console.log(typeof singleSubnet, singleSubnet);
            // SubnetClicked = value;
            // console.log(SubnetClicked);
            console.log(singleSubnet);
            try {
              //console.log(device);
              await axios
                .post(baseUrl + "/scanSubnets", ScanData)
                .then((response) => {
                  // setMainModalVisible(false);
                  // openSweetAlert(`Device Added Successfully`, "success");
                  // setStatusLoading(false);

                  //   setToggle((prev) => !prev);
                  // setTimeout(() => {
                  console.log("first");
                  setSingleSubnet((prev) => {
                    let tempSubnetArray = [...prev];

                    let index = tempSubnetArray.indexOf(value);
                    if (index !== -1) {
                      tempSubnetArray.splice(index, 1);
                    }
                    return tempSubnetArray;
                  });
                  setPending(false);
                  // }, 15000);
                  //   setPending(false);
                  const promises = [];
                  promises.push(
                    axios
                      .get(baseUrl + "/getAllSubnets")
                      .then((response) => {
                        var data = response.data;
                        var i;
                        // for (i = 0; i < data.length; i++) {
                        //   // data[i].name
                        //   if (data[i].status === "scanning") {
                        //     setStatusLoading(true);
                        //   } else {
                        //     setStatusLoading(false);
                        //   }
                        // }
                        // setSingleSubnet("");
                        console.log(response.data);
                        setDataSource(response.data);
                        excelData = response.data;
                        setRowCount(response.data.length);
                        excelData = response.data;

                        // setPending(false);
                      })
                      .catch((error) => {
                        console.log(error);
                        // setPending(false);

                        //  openSweetAlert("Something Went Wrong!", "error");
                      })
                  );
                  return Promise.all(promises);
                })
                .catch((error) => {
                  //   setPending(false);

                  console.log("in add seed device catch ==> " + error);
                  // openSweetAlert("Something Went Wrong!", "error");
                });
            } catch (err) {
              //   setPending(false);

              console.log(err);
            }
            // handleButtonClick(e, value);
            // setPending(false);
          }}
          style={{ background: "#66b127 !important", cursor: "no-drop" }}
          menu={menu}
          icon={<DownOutlined style={{ fontSize: "14px" }} />}
        >
          <img src={Scanner} width="18px" height="18px" alt="" /> &nbsp; Scan
        </Dropdown.Button>
      ) : (
        <Dropdown.Button
          disabled={configData?.ipam.pages.subnet.read_only}
          onClick={async () => {
            setPending(true);
            const ScanData = {
              options: scanData,
              subnets: value,
            };
            console.log("scanData", ScanData);

            // // console.log(typeof singleSubnet, singleSubnet);
            // // console.log("ScanDataScanDataScanDataScanDataScanData", singleSubnet);
            console.log("ScanDataScanDataScanDataScanDataScanData", value);

            // singleSubnet.push(selectedSubnetAddress);
            // setSingleSubnet(singleSubnet);

            setSingleSubnet((prev) => {
              let tempSubnetArray = [...prev];
              tempSubnetArray.push(value);
              return tempSubnetArray;
            });
            // console.log(typeof singleSubnet, singleSubnet);
            // SubnetClicked = value;
            // console.log(SubnetClicked);
            console.log(singleSubnet);
            try {
              //console.log(device);
              await axios
                .post(baseUrl + "/scanSubnets", ScanData)
                .then((response) => {
                  // setMainModalVisible(false);
                  // openSweetAlert(`Device Added Successfully`, "success");
                  // setStatusLoading(false);

                  //   setToggle((prev) => !prev);
                  // setTimeout(() => {
                  console.log("first");
                  setSingleSubnet((prev) => {
                    let tempSubnetArray = [...prev];

                    let index = tempSubnetArray.indexOf(value);
                    if (index !== -1) {
                      tempSubnetArray.splice(index, 1);
                    }
                    return tempSubnetArray;
                  });
                  setPending(false);
                  // }, 15000);
                  //   setPending(false);
                  const promises = [];
                  promises.push(
                    axios
                      .get(baseUrl + "/getAllSubnets")
                      .then((response) => {
                        var data = response.data;
                        var i;
                        // for (i = 0; i < data.length; i++) {
                        //   // data[i].name
                        //   if (data[i].status === "scanning") {
                        //     setStatusLoading(true);
                        //   } else {
                        //     setStatusLoading(false);
                        //   }
                        // }
                        // setSingleSubnet("");
                        console.log(response.data);
                        setDataSource(response.data);
                        excelData = response.data;
                        setRowCount(response.data.length);
                        excelData = response.data;

                        // setPending(false);
                      })
                      .catch((error) => {
                        console.log(error);
                        // setPending(false);

                        //  openSweetAlert("Something Went Wrong!", "error");
                      })
                  );
                  return Promise.all(promises);
                })
                .catch((error) => {
                  //   setPending(false);

                  console.log("in add seed device catch ==> " + error);
                  // openSweetAlert("Something Went Wrong!", "error");
                });
            } catch (err) {
              //   setPending(false);

              console.log(err);
            }
            // handleButtonClick(e, value);
            // setPending(false);
          }}
          style={{ background: "#66b127 !important" }}
          menu={menu}
          icon={<DownOutlined style={{ fontSize: "14px" }} />}
        >
          <img src={Scanner} width="18px" height="18px" alt="" /> &nbsp; Scan
        </Dropdown.Button>
      )}
    </div>
  );
};

export default ButtonCell;
