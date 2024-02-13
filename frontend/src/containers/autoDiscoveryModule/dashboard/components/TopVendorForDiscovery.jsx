import React, { useEffect } from "react";
import * as echarts from "echarts";

const TopVendorForDiscovery = ({ data }) => {
  useEffect(() => {
    const chartDom = document.getElementById("main");
    const myChart = echarts.init(chartDom);
    const option = {
      tooltip: {
        label: {
          show: false,
        },
      },
      angleAxis: {
        type: "category",
        startAngle: 270,
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
        max: 12,
        startAngle: 90,
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
      polar: {
        radius: [2, "80%"],
      },
      series: [
        {
          type: "bar",
          data: data.map(item => item.value),
          coordinateSystem: "polar",
          name: "Backup Successful",
          color: "green",
        },
        {
          type: "bar",
          data: data.map(item => item.value / 2), // Just for example purposes
          coordinateSystem: "polar",
          name: "Backup Failure",
          color: "red",
        },
        {
          type: "bar",
          data: data.map(item => item.value / 3), // Just for example purposes
          coordinateSystem: "polar",
          name: "Not Backup",
          color: "orange",
        },
      ],
      legend: {
        show: true,
        y: "bottom",
        icon: "circle",
      },
      emphasis: {
        focus: "series",
      },
      barGap: "3%",
    };
    option && myChart.setOption(option);
    return () => {
      myChart.dispose();
    };
  }, [data]);

  return <div id="main" style={{ width: "100%", height: "400px" }}></div>;
};

export default TopVendorForDiscovery;
