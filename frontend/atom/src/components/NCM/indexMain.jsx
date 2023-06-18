import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { useNavigate } from "react-router-dom";

import axios, { baseUrl } from "../../utils/axios";
import { SpinLoading, TableStyling } from "../AllStyling/All.styled.js";
import { NcmDashboardStyle } from "./NcmDashboard.style";
import Container from "../ReusableComponents/Container/Container";
import BarChart from "../ReusableComponents/Carts/BarChart/BarChart";
import DonutChart from "../ReusableComponents/Carts/DonutChart/DonutChart";

const indexMain = () => {
  const [loading, setLoading] = useState(false);
  const [configBackupSummary, setConfigureSummary] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/ncmBackupSummeryDashboard");
        setConfigureSummary(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const handleChartClick = (data) => {
    navigate("/ncm/config-data", { state: data.data });
  };

  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "horizontal",
      top: "0px",
      left: "center",
    },
    color: ["#46BB7D", "#FA5B5A", "#FAAD5A"],

    series: [
      {
        name: "",
        type: "pie",
        radius: "50%",
        data: configBackupSummary,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  const [ncmDevices, setNcmDevices] = useState([]);

  const ncmDevicesSummryColumns = [
    {
      title: "Device Type",
      key: "device_type",
      dataIndex: "device_type",
    },
    {
      title: "OS Type",
      key: "function",
      dataIndex: "function",
    },
    {
      title: "Devices",
      key: "device_count",
      dataIndex: "device_count",
    },
  ];

  useEffect(() => {
    getNcmDevicesSummary();
  }, []);

  const getNcmDevicesSummary = async () => {
    await axios
      .get(`${baseUrl}/ncmDeviceSummryDashboard`)
      .then((res) => {
        setNcmDevices(res.data);
      })
      .catch((err) => {
        console.log("ncmDevicesErrro ============>", err);
      });
  };

  return (
    <NcmDashboardStyle>
      <article className="ncm-dashboard-top">
        <Container title="Configuration Backup Summary">
          <SpinLoading spinning={loading}>
            <div style={{ width: "100%", height: "350px" }}>
              <ReactEcharts
                onEvents={{
                  click: handleChartClick,
                }}
                option={option}
                style={{ height: "100%", padding: "0px", paddingTop: "10px" }}
              />
            </div>
          </SpinLoading>
        </Container>

        <Container title="Configuration Change by Time">
          <BarChart endPoint="ncmChangeSummryByTime" />
        </Container>

        <Container title="Configuration Change by Device">
          <BarChart endPoint="ncmChangeSummryByDevice" />
        </Container>

        <Container title="Recent RCM Alarms" className="rcm-alarms-wrapper">
          <DonutChart endPoint="ncmAlarmSummery" alertsCount={3} />

          <article className="alarms-wrapper">
            <h3 className="heading">Device Name</h3>

            <article className="alarms-list">
              <article className="alarm">
                <h3 className="alarm-title">
                  Device Configuration Backup failed
                </h3>
                <h3 className="alarm-description">
                  NETS-DMZ-C367.nets-international
                </h3>

                <article className="time-and-date">
                  <span className="date">28-Jan-2023</span>
                  <span className="date">09:43:21 AM</span>
                </article>
              </article>
              <article className="alarm">
                <h3 className="alarm-title">
                  Device Configuration Backup failed
                </h3>
                <h3 className="alarm-description">
                  NETS-DMZ-C367.nets-international
                </h3>

                <article className="time-and-date">
                  <span className="date">28-Jan-2023</span>
                  <span className="date">09:43:21 AM</span>
                </article>
              </article>
              <article className="alarm">
                <h3 className="alarm-title">
                  Device Configuration Backup failed
                </h3>
                <h3 className="alarm-description">
                  NETS-DMZ-C367.nets-international
                </h3>

                <article className="time-and-date">
                  <span className="date">28-Jan-2023</span>
                  <span className="date">09:43:21 AM</span>
                </article>
              </article>
            </article>
          </article>
        </Container>

        <Container title="NCM Devices Summary">
          <TableStyling
            columns={ncmDevicesSummryColumns}
            dataSource={ncmDevices}
          />
        </Container>
      </article>
    </NcmDashboardStyle>
  );
};

export default indexMain;
