import React, { useState, useEffect } from "react";
import { Table, Divider } from "antd";
import axios, { baseUrl } from "../../utils/axios";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import rcs from "./assets/rcs.svg";
import "../../App.css";
import {
  SummaryDevices,
  MainTitle,
  SpinLoading,
  StyleCmdInput,
} from "../AllStyling/All.styled.js";

const index_Main = () => {
  const data = useLocation();
  const [loading, setLoading] = useState(false);
  const [ipAddress, setIpAddress] = useState(data?.state?.res?.ip_address);
  const [vendor, setvendor] = useState(data?.state?.res?.vendor);
  const [device_name, setdevice_name] = useState(data?.state?.res?.device_name);
  const [myFunction, setMyFunction] = useState(data?.state?.res?.function);
  const [cmdOutputData, setCmdOutputData] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchContext, setsearchContext] = useState("");
  const [configData, setConfigData] = useState(null);

  const openSweetAlert = (title, type) => {
    Swal.fire({
      title,
      type,
      allowOutsideClick: false,
      confirmButtonColor: "#66B127",
    });
  };
  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
  }, []);

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,

    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
    getCheckboxProps: () => ({
      disabled: !configData?.uam.pages.sites.read_only,
    }),
  };

  const handleCommand = async (e) => {
    const Data = {
      ncm_device_id: data?.state?.res?.ncm_device_id,
      cmd: searchContext,
    };

    setLoading(true);

    await axios
      .post(baseUrl + "/sendCommand", Data)
      .then((response) => {
        if (response?.response?.status == 500) {
          openSweetAlert(response?.response?.data, "error");
          setLoading(false);
        } else {
          setCmdOutputData(response.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log("error ==> " + err);
        setLoading(false);
      });
  };

  const [tableName, setTableName] = useState("Summary");
  const showTable = (myDataTable) => {
    if (myDataTable === "Summary") {
      setTableName("Summary");
    } else if (myDataTable === "Interface") {
      setTableName("Interface");
    } else if (myDataTable === "IPAM") {
      setTableName("IPAM");
    } else if (myDataTable === "Monitoring") {
      setTableName("Monitoring");
    } else if (myDataTable === "DCM") {
      setTableName("DCM");
    }
  };
  return (
    <div style={{ marginRight: "15px", marginLeft: "15px" }}>
      <br />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          borderRadius: "5px",
        }}
      >
        <SummaryDevices
          active={"Summary" === tableName}
          onClick={() => showTable("Summary")}
        >
          <div style={{ display: "flex" }}>
            <MainTitle
              active={"Summary" === tableName}
              style={{
                paddingLeft: "20px",
                paddingTop: "10px",
              }}
            >
              Summary
            </MainTitle>
          </div>
        </SummaryDevices>
      </div>

      <div>
        {tableName === "Summary" ? (
          <>
            <div
              style={{
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
              }}
            >
              <h3
                style={{
                  borderLeft: "5px solid #66b127",
                  borderTopLeftRadius: "6px",
                  paddingLeft: "13px",
                  alignItems: "center",
                  textAlign: "left",
                  paddingTop: "8px",
                  fontWeight: "bold",
                }}
              >
                Remote Command Send
              </h3>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    width: "200px",
                    height: "70px",
                    borderRight: "0.5px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <h5>IP Address:</h5>
                  <p style={{ color: "#66b127" }}>{ipAddress}</p>
                  <Divider type="vertical" />
                </div>
                <div
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    width: "200px",
                    height: "70px",
                    borderRight: "0.5px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <h5>Device Name:</h5>
                  <p style={{ color: "#66b127" }}>{device_name}</p>
                  <Divider type="vertical" />
                </div>
                <div
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    width: "200px",
                    height: "70px",
                    borderRight: "0.5px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <h5>Vendor:</h5>
                  <p style={{ color: "#66b127" }}>{vendor}</p>
                  <Divider type="vertical" />
                </div>
                <div
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    width: "200px",
                    height: "70px",
                    borderRight: "0.5px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <h5>Function:</h5>
                  <p style={{ color: "#66b127" }}>{myFunction}</p>
                  <Divider type="vertical" />
                </div>
                {/* <div
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    width: "200px",
                    height: "70px",
                    borderRight: "0.5px solid rgba(0,0,0,0.1)",
                  }}
                >
                  <h5>Password Group:</h5>
                  <p style={{ color: "#66b127" }}>{password_group}</p>
                  <Divider type="vertical" />
                </div> */}
              </div>
            </div>
            <div
              style={{
                borderRadius: "12px",
                backgroundColor: "#fcfcfc",
                boxShadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px",
                height: "110px",
                // display: "grid",
                // placeItems: "center",
                width: "100%",
                marginTop: "8px",
              }}
            >
              <div
                style={{
                  marginRight: "5%",
                  marginLeft: "5%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: "40px",
                }}
              >
                <img src={rcs} alt="" width="25px" height="25px" />
                <StyleCmdInput
                  type="text"
                  style={{
                    width: "70%",
                    marginLeft: "15px",
                    marginRight: "15px",
                  }}
                  value={searchContext}
                  onChange={(e) => setsearchContext(e.target.value)}
                  placeholder="Search"
                  onKeyDown={(e) => {
                    if (e.keyCode === 13) {
                      handleCommand();
                    }
                  }}
                />
                <SpinLoading spinning={loading}>
                  <button
                    onClick={handleCommand}
                    style={{
                      color: "white",
                      cursor: "pointer",
                      borderRadius: "8px",
                      border: "none",
                      width: "80px",
                      height: "35px",
                      background:
                        "linear-gradient(270deg, #4AA446 0%, #6AB344 100%)",
                    }}
                  >
                    Send
                  </button>
                </SpinLoading>
              </div>
            </div>

            <h4 style={{ padding: "10px", marginTop: "8px" }}>Output:</h4>
            <SpinLoading spinning={loading}>
              <pre style={{ padding: "10px" }}>{cmdOutputData}</pre>
            </SpinLoading>
          </>
        ) : null}
        {/* {tableName === "Interface" ? (
        <>
        raza</>
        ) : null} */}
      </div>

      <br />

      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          width: "100%",
          flexDirection: "row",
          backgroundColor: "#000",
          height: "20px",
        }}
      >
        {listData.map((item, index) => (
          <>
            {item.status === "down" ? (
              <div
                style={{
                  width: "4%",
                  height: "100%",
                  background: "#db6c6c",
                  flex: 1,
                }}
              >
                {" "}
                <div
                  style={{
                    width: "1.5%",
                    height: "100%",
                    background: "#fff",
                    flex: 1,
                  }}
                ></div>
              </div>
            ) : null}

            {item.status === "up" ? (
              <div
                style={{
                  width: "4%",
                  height: "100%",
                  background: "#6627",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: "1.5%",
                    height: "100%",
                    background: "#f127",
                    flex: 1,
                  }}
                ></div>
              </div>
            ) : null}

            {item.status !== "up" && item.status !== "down" ? (
              <div
                style={{
                  width: "4%",
                  height: "100%",
                  background: "#7c7c7ced",
                  flex: 1,
                }}
              >
                <div
                  style={{
                    width: "1.5%",
                    height: "100%",
                    background: "#7c7c7ced",
                    flex: 1,
                  }}
                ></div>
              </div>
            ) : null}
          </>
        ))}
      </div> */}
    </div>
  );
};

export default index_Main;
