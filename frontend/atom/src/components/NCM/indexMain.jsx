import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";

import axios, { baseUrl } from "../../utils/axios";
import { SpinLoading } from "../AllStyling/All.styled.js";
import { NcmDashboardStyle } from "./NcmDashboard.style";
import CustomTable from "../ReusableComponents/CustomTable/CustomTable";
import Container from "../ReusableComponents/Container/Container";

const indexMain = () => {
  const [loading, setLoading] = useState(false);
  const [configBackupSummary, setConfigureSummary] = useState([]);

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
                option={option}
                style={{ height: "100%", padding: "0px", paddingTop: "10px" }}
              />
            </div>
          </SpinLoading>
        </Container>

        <Container title="NCM Devices Summary">
          <CustomTable
            columns={ncmDevicesSummryColumns}
            dataSource={ncmDevices}
          />
        </Container>
      </article>
    </NcmDashboardStyle>
  );
};

export default indexMain;
