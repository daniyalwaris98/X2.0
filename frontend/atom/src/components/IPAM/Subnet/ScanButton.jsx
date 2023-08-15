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
    setScanData(checkedValues);
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

            setSingleSubnet((prev) => {
              let tempSubnetArray = [...prev];
              tempSubnetArray.push(value);
              return tempSubnetArray;
            });

            try {
              await axios
                .post(baseUrl + "/scanSubnets", ScanData)
                .then((response) => {
                  setSingleSubnet((prev) => {
                    let tempSubnetArray = [...prev];

                    let index = tempSubnetArray.indexOf(value);
                    if (index !== -1) {
                      tempSubnetArray.splice(index, 1);
                    }
                    return tempSubnetArray;
                  });
                  setPending(false);

                  const promises = [];
                  promises.push(
                    axios
                      .get(baseUrl + "/getAllSubnets")
                      .then((response) => {
                        setDataSource(response.data);
                        excelData = response.data;
                        setRowCount(response.data.length);
                        excelData = response.data;
                      })
                      .catch((error) => {
                        console.log(error);
                      })
                  );
                  return Promise.all(promises);
                })
                .catch((error) => {});
            } catch (err) {
              console.log(err);
            }
          }}
          style={{ background: "#66b127 !important", cursor: "no-drop" }}
          overlay={menu}
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

            setSingleSubnet((prev) => {
              let tempSubnetArray = [...prev];
              tempSubnetArray.push(value);
              return tempSubnetArray;
            });

            try {
              await axios
                .post(baseUrl + "/scanSubnets", ScanData)
                .then((response) => {
                  setSingleSubnet((prev) => {
                    let tempSubnetArray = [...prev];

                    let index = tempSubnetArray.indexOf(value);
                    if (index !== -1) {
                      tempSubnetArray.splice(index, 1);
                    }
                    return tempSubnetArray;
                  });
                  setPending(false);

                  const promises = [];
                  promises.push(
                    axios
                      .get(baseUrl + "/getAllSubnets")
                      .then((response) => {
                        setDataSource(response.data);
                        excelData = response.data;
                        setRowCount(response.data.length);
                        excelData = response.data;
                      })
                      .catch((error) => {
                        console.log(error);
                      })
                  );
                  return Promise.all(promises);
                })
                .catch((error) => {
                  console.log("in add seed device catch ==> " + error);
                });
            } catch (err) {
              console.log(err);
            }
          }}
          style={{ background: "#66b127 !important" }}
          overlay={menu}
          icon={<DownOutlined style={{ fontSize: "14px" }} />}
        >
          <img src={Scanner} width="18px" height="18px" alt="" /> &nbsp; Scan
        </Dropdown.Button>
      )}
    </div>
  );
};

export default ButtonCell;
