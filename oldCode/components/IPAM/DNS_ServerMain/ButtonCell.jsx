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
// import EditModal from "./EditSubnet";
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

  useEffect(() => {
    let user = localStorage.getItem("user");
    let userData = JSON.parse(user);

    const test = userData.monetx_configuration;

    let t = eval(test);
    let config = JSON.parse(t);
    setConfigData(config);
  }, []);

  return pending ? (
    <SpinLoading />
  ) : (
    <div style={{ textAlign: "center" }}>
      {configData?.ipam.pages.dns_server.read_only ? (
        <button
          style={{
            backgroundColor: "#66b127 ",
            border: "none",
            padding: "5px",
            paddingLeft: "20px",
            paddingRight: "20px",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "8px",
            cursor: "no-drop",
          }}
        >
          Scan
        </button>
      ) : (
        <button
          style={{
            backgroundColor: "#66b127 ",
            border: "none",
            padding: "5px",
            paddingLeft: "20px",
            paddingRight: "20px",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={async () => {
            setPending(true);
            const ScanData = {
              ip_address: [value],
            };

            setSingleSubnet((prev) => {
              let tempSubnetArray = [...prev];
              tempSubnetArray.push(value);
              return tempSubnetArray;
            });

            try {
              await axios
                .post(baseUrl + "/scanDns", ScanData)
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
                      .get(baseUrl + "/getAllDnsServers")
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
        >
          Scan
        </button>
      )}
    </div>
  );
};

export default ButtonCell;
