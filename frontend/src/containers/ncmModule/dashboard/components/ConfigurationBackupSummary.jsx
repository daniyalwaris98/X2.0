import React, { useEffect } from "react";
import * as echarts from "echarts";

const ConfigurationBackupSummary = () => {
  useEffect(() => {
    const chartDom = document.getElementById("backupSummaryChart");
    const myChart = echarts.init(chartDom);
    const option = {
      angleAxis: {
        type: "category",
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      radiusAxis: {
        max: 8,
        axisLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      polar: {},
      series: [
        {
          type: "bar",
          data: [4.2],
          coordinateSystem: "polar",
          name: "Linux",
          emphasis: {
            focus: "series",
          },
          color: "#63ABFD",
        },
        {
          type: "bar",
          data: [2],
          coordinateSystem: "polar",
          name: "Cisco",
          emphasis: {
            focus: "series",
          },
          color: "#3D9E47",
        },
        {
          type: "bar",
          data: [3],
          coordinateSystem: "polar",
          name: "MicroSoft",
          emphasis: {
            focus: "series",
          },
          color: "#9E00D5",
        },
        {
          type: "bar",
          data: [4],
          coordinateSystem: "polar",
          name: "VMware",
          emphasis: {
            focus: "series",
          },
          color: "#84CC7D",
        },
        {
          type: "bar",
          data: [5],
          coordinateSystem: "polar",
          name: "OpenBSD",
          emphasis: {
            focus: "series",
          },
          color: "#E69B43",
        },
        {
          type: "bar",
          data: [6],
          coordinateSystem: "polar",
          name: "FreeBSD",
          emphasis: {
            focus: "series",
          },
          color: "#5F83CA",
        },
      ],
      legend: {
        show: true,
        data: ["Linux", "Cisco", "MicroSoft", "VMware", "OpenBSD", "FreeBSD"],
        y: "top",
        padding: [10, 0],
      },
    };
    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []);

  return <div id="backupSummaryChart" style={{ width: "100%", height: "400px" }}></div>;
};

export default ConfigurationBackupSummary;
