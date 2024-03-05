// import React, { useEffect } from "react";
// import * as echarts from "echarts";

// const TopOpenPorts = ({ data }) => {
//   useEffect(() => {
//     const chartDom = document.getElementById("time");
//     if (!chartDom) {
//       console.error("Chart container not found");
//       return;
//     }

//     const myChart = echarts.init(chartDom);

//     if (!data || data.length === 0 || !data[0]?.value || !data[0]?.name) {
//       console.error("Invalid data format");
//       myChart.clear(); // Clear the chart if data is not available
//       return;
//     }

//     const option = {
//       xAxis: {
//         type: "category",
//         data: data[0]?.name?.slice(1) || [], // Ensure name property exists and slice data if necessary
//         axisLine: { show: false },
//         axisTick: { show: false },
//         axisLabel: {
//           interval: 0,
//           rotate: 0,
//           formatter: (value) => value.split(" ").join("\n"),
//         },
//       },
//       yAxis: { type: "value" },
//       series: [
//         {
//           data: data[0]?.value?.slice(1) || [], // Ensure value property exists and slice data if necessary
//           type: "bar",
//           showBackground: true,
//           backgroundStyle: {
//             color: "rgba(180, 180, 180, 0.2)",
//             borderRadius: [20, 20, 0, 0],
//           },
//           itemStyle: { color: "#66B127", borderRadius: [20, 20, 0, 0] },
//         },
//       ],
//     };
//     myChart.setOption(option);

//     return () => myChart.dispose();
//   }, [data]);

//   return <div id="time" style={{ width: "100%", height: "400px" }} />;
// };

// export default TopOpenPorts;

import React, { useEffect } from "react";
import * as echarts from "echarts";

const TopOpenPorts = () => {
  useEffect(() => {
    const chartDom = document.getElementById("TopOpenPortsChart");
    const myChart = echarts.init(chartDom);

    const option = {
      xAxis: {
        type: "category",
        data: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
         
        ],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          interval: 0,
          rotate: 0,
          formatter: (value) => value.split(" ").join("\n"),
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          data: [0, 40, 0, 70, 0, ],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
            borderRadius: [20, 20, 20, 20],
          },
          itemStyle: { color: "green", borderRadius: [20, 20, 20, 20] },
        },
      ],
    };

    myChart.setOption(option);

    return () => myChart.dispose();
  }, []);

  return <div id="TopOpenPortsChart" style={{ width: "100%", height: "400px" }} />;
};

export default TopOpenPorts;
