import React, { useEffect } from "react";
import * as echarts from "echarts";

const TopVendorForDiscovery = ({ data }) => {
  useEffect(() => {
    if (!data || !data.length) {
      console.error("Invalid data:", data);
      return;
    }

    const chartDom = document.getElementById("main");
    const myChart = echarts.init(chartDom);

    // Define colors array
    const colors = [
      "#63ABFD",
      "#84CC7D",
      "#3D9E47",
      "#5F83CA",
      "#E69B43",
      "#9E00D5",
    ];

    const option = {
      tooltip: {
        show: true,
        trigger: "item",
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
        radius: [7, "70%"], // Adjust the inner radius to decrease gap from the top
        center: ["50%", "40%","50%", "50%"], // Adjusted center to be in the middle horizontally and at the top vertically

      },
      series: data.map((item, index) => ({
        type: "bar",
        data: [item.value],
        coordinateSystem: "polar",
        name: item.name,
        color: colors[index % colors.length], // Use colors from the array
        label: {
          show: true,
          position: "inside", // Labels at the center of the bar
          formatter: "{c}", // Display data value as label
        },
      })),
      legend: {
        show: true,
        orient: "horizontal", // Display legend horizontally
        y: "bottom", // Adjust legend position
        icon: "circle",
        itemGap: 10, // Adjust the gap between legend items
        itemWidth: 20, // Adjust the width of legend items
        itemHeight: 10, // Adjust the height of legend items
      },
      emphasis: {
        focus: "series",
      },
      barGap: "5%",
    };
    

    option && myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [data]);

  return <div id="main" style={{ width: "100%", height: "400px" }}></div>;
};

export default TopVendorForDiscovery;
