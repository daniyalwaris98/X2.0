import React, { useState, useEffect } from "react";
import uam from "../assets/uamm.svg";
import dcm from "../assets/dcmm.svg";
import ipam from "../assets/ipam.svg";
import device from "../assets/device.svg";
import axios, { baseUrl } from "../../../utils/axios";
import { FailedDevicesStyle, TabStyle } from "./FailedDevices.style";
import {
  IpamIcon,
  MonitoringIcon,
  NcmIcon,
  NetworkMapIcon,
  UamIcon,
} from "../../../svg";
import { TableStyling } from "../../AllStyling/All.styled";

const index = () => {
  const [uamCard, setUamCard] = useState("");
  const [ncmCard, setNcmCard] = useState("");
  const [networkCard, setNetworkCard] = useState("");
  const [ipamCard, setIpamCard] = useState("");
  const [dcmCard, setDcmCard] = useState("");

  useEffect(() => {
    const uamCardFailedDevices = async () => {
      try {
        const res = await axios.get(baseUrl + "/uamFailedDevicesCount");
        console.log("res", res);
        setUamCard(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    uamCardFailedDevices();
  }, []);

  useEffect(() => {
    const ncmCardFailedDevices = async () => {
      try {
        const res = await axios.get(baseUrl + "/ncmFailedDevicesCount");
        console.log("res", res);
        setNcmCard(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    ncmCardFailedDevices();
  }, []);

  useEffect(() => {
    const networkCardFailedDevices = async () => {
      try {
        const res = await axios.get(
          baseUrl + "/networkMappingFailedDevicesCount"
        );
        console.log("res", res);
        setNetworkCard(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    networkCardFailedDevices();
  }, []);

  useEffect(() => {
    const ipamCardFailedDevices = async () => {
      try {
        const res = await axios.get(baseUrl + "/ipamFailedDevicesCount");
        console.log("res", res);
        setIpamCard(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    ipamCardFailedDevices();
  }, []);

  useEffect(() => {
    const dcmCardFailedDevices = async () => {
      try {
        const res = await axios.get(baseUrl + "/dcmFailedDevicesCount");
        console.log("res", res);
        setDcmCard(res.data);
      } catch (err) {
        console.log(err.response);
      }
    };
    dcmCardFailedDevices();
  }, []);

  const uamColumns = [
    {
      title: "Ip Address",
      dataIndex: "ip_address",
      key: "ip_address",
    },
    {
      title: "Device Type",
      dataIndex: "device_type",
      key: "device_type",
    },

    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Failure Reason",
      dataIndex: "failure_reason",
      key: "failure_reason",
    },
  ];

  const [isTabActive, setTabActive] = useState(
    "Unified Asset Management (UAM)"
  );
  const [tableData, setTableData] = useState([]);

  const tabs = [
    // {
    //   icon: <AtomIcon />,
    //   tabText: "Atom",
    // },
    {
      icon: <UamIcon />,
      tabText: "Unified Asset Management (UAM)",
    },
    {
      icon: <NetworkMapIcon />,
      tabText: "Network Mapping",
    },
    {
      icon: <IpamIcon />,
      tabText: "IP Address Management (IPAM)",
    },
    {
      icon: <MonitoringIcon />,
      tabText: "Monitoring",
    },
    {
      icon: <NcmIcon />,
      tabText: "Network Configuration Manager (NCM)",
    },

    {
      icon: <NcmIcon />,
      tabText: "Auto Descovery",
    },
    // {
    //   icon: <NcmIcon />,
    //   tabText: "Network Configuration Manager (NCM)",
    // },
  ];

  const getTabsData = (tabName) => {
    switch (tabName) {
      case "Unified Asset Management (UAM)":
        tabApiCall("uamFailedDevices");

        break;

      case "Network Mapping":
        tabApiCall("networkMappingFailedDevices");

        break;

      case "IP Address Management (IPAM)":
        tabApiCall("ipamFailedDevices");

        break;

      case "Monitoring":
        tabApiCall("monitoringFailedDevices");

        break;

      case "Network Configuration Manager (NCM)":
        tabApiCall("ncmFailedDevices");

        break;

      default:
        tabApiCall("uamFailedDevices");
        break;
    }
  };

  const tabApiCall = async (endPoint) => {
    await axios
      .get(`${baseUrl}/${endPoint}`)
      .then((res) => {
        setTableData(res.data);
      })
      .catch((err) => {
        console.log("errr =========>", err);
      });
  };

  useEffect(() => {
    getTabsData(isTabActive);
  }, [isTabActive]);

  return (
    <FailedDevicesStyle>
      <article className="failed-devices-counter">
        <div
          style={{
            textAlign: "center",
            padding: "15px",
            color: "#6C6B75",

            marginLeft: "7px",
            boxShadow: "rgba(99, 99, 99, 0.1) 0px 1px 5px 0px",

            borderRadius: "12px",
          }}
        >
          <img src={uam} alt="" style={{ marginTop: "10px" }} />
          <p style={{ marginTop: "15px" }}>{uamCard.name}</p>
          <p
            style={{
              fontSize: "40px",
              fontWeight: "800",
              marginTop: "-10px",
            }}
          >
            {uamCard.value}
          </p>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "15px",
            color: "#6C6B75",

            marginLeft: "12px",
            boxShadow: "rgba(99, 99, 99, 0.1) 0px 1px 5px 0px",
            borderRadius: "12px",
          }}
        >
          <img src={device} alt="" style={{ marginTop: "10px" }} />
          <p style={{ marginTop: "15px" }}>{networkCard.name}</p>
          <p
            style={{
              fontSize: "40px",
              fontWeight: "800",
              marginTop: "-10px",
            }}
          >
            {networkCard.value}
          </p>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "15px",
            marginLeft: "12px",
            color: "#6C6B75",

            boxShadow: "rgba(99, 99, 99, 0.1) 0px 1px 5px 0px",

            borderRadius: "12px",
          }}
        >
          <img src={ipam} alt="" style={{ marginTop: "10px" }} />
          <p style={{ marginTop: "15px" }}>{ipamCard.name}</p>
          <p
            style={{
              fontSize: "40px",
              fontWeight: "800",
              marginTop: "-10px",
            }}
          >
            {ipamCard.value}
          </p>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "15px",
            color: "#6C6B75",

            marginLeft: "12px",
            boxShadow: "rgba(99, 99, 99, 0.1) 0px 1px 5px 0px",

            borderRadius: "12px",
          }}
        >
          <img src={dcm} alt="" style={{ marginTop: "10px" }} />
          <p style={{ marginTop: "15px" }}>Auto Descovery</p>
          <p
            style={{
              fontSize: "40px",
              fontWeight: "800",
              marginTop: "-10px",
            }}
          >
            {dcmCard.value}
          </p>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "15px",
            color: "#6C6B75",

            marginLeft: "12px",
            boxShadow: "rgba(99, 99, 99, 0.1) 0px 1px 5px 0px",

            borderRadius: "12px",
          }}
        >
          <img src={dcm} alt="" style={{ marginTop: "10px" }} />
          <p style={{ marginTop: "15px" }}>{ncmCard.name}</p>
          <p
            style={{
              fontSize: "40px",
              fontWeight: "800",
              marginTop: "-10px",
            }}
          >
            {ncmCard.value}
          </p>
        </div>
      </article>

      <article className="failed-devices-tabs">
        <article className="tabs-wrapper">
          {tabs.map((tab, index) => {
            const { icon, tabText } = tab;
            return (
              <TabStyle
                tabActive={tabText == isTabActive ? true : false}
                key={index}
                onClick={() => setTabActive(tabText)}
              >
                <span className="icon">{icon}</span>
                <p className="tab-text">{tabText}</p>
              </TabStyle>
            );
          })}
        </article>

        <article className="tab-data">
          <h3 className="title">Failed Devices</h3>

          <TableStyling dataSource={tableData} columns={uamColumns} />
        </article>
      </article>
    </FailedDevicesStyle>
  );
};

export default index;
