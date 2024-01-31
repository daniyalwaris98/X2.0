
import React, { useEffect } from "react";
import * as echarts from "echarts";
const TopSubnet = () => {
  useEffect(() => {
    const chartDom = document.getElementById("subnet");
    const myChart = echarts.init(chartDom);
    const option = {
      // title: [
      //   {
      //     text: "Subnet Summary",
      //   },
      // ],
      angleAxis: {
        max: 6,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
      },
      radiusAxis: {
        type: "category",
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
      },
      polar: {
        radius: [80, "80%"],
      },
      series: [
        {
          type: "bar",
          data: [4],
          coordinateSystem: "polar",
          name: "Discovered from Devices",
          color: "orange",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
          itemStyle: {
            borderRadius: [20, 20, 20, 20],
          },
          emphasis: {
            focus: "series",
          },
        },
        {
          type: "bar",
          data: [5],
          coordinateSystem: "polar",
          name: "Mannual Added",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
          },
          itemStyle: {
            borderRadius: [20, 20, 20, 20],
          },
          emphasis: {
            focus: "series",
          },
        },
      ],
      graphic: [
        {
          type: "text",
          left: "center",
          top: "center",
          style: {
            text: "Alarms",
            fill: "black",
            fontSize: 18,
          },
        },
      ],
      legend: {
        show: true,
        data: ["Mannual Added", "Discovered from Devices"],
        icon: "circle",
        itemGap: 20,
        y: "bottom",
      },
    };
    myChart.setOption(option);
    return () => {
      myChart.dispose();
    };
  }, []);
  return <div id="subnet" style={{ width: "100%", height: "400px" }} />;
};
export default TopSubnet;