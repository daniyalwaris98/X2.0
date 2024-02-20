// import React, { useEffect, useRef } from 'react';
// import * as echarts from 'echarts';

// const ConfigurationByTimeLineChart = ({ companyData }) => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     try {
//       const companies = Object.keys(companyData);

//       const seriesData = companies.map((company) => {
//         return {
//           name: company,
//           type: 'bar',
//           data: [companyData[company]], // Wrap the data in an array
//         };
//       });

//       const myChart = echarts.init(chartRef.current);

//       const option = {
//         tooltip: {
//           trigger: 'axis',
//           axisPointer: {
//             type: 'shadow',
//             label: {
//               show: true,
//             },
//           },
//         },
//         legend: {
//           data: companies,
//         },
//         xAxis: [
//           {
//             type: 'category',
//             data: companies,
//             axisLabel: {
//               interval: 0, // Display all labels
//             },
//           },
//         ],
//         yAxis: [
//           {
//             type: 'value',
//             name: 'Number of Devices',
//           },
//         ],
//         series: seriesData,
//       };

//       myChart.setOption(option);

//       // Handle chart resizing for responsiveness
//       const resizeHandler = () => {
//         myChart.resize();
//       };

//       window.addEventListener('resize', resizeHandler);

//       // Cleanup event listener and chart instance on unmount
//       return () => {
//         window.removeEventListener('resize', resizeHandler);
//         myChart.dispose();
//       };
//     } catch (error) {
//       console.error('Error rendering chart:', error);
//     }
//   }, [companyData]);

//   return (
//     <div ref={chartRef} className="chart-container" style={{ width: '100%', height: '400px' }} />
//   );
// };

// export default ConfigurationByTimeLineChart;
import React, { useEffect } from "react";
import * as echarts from "echarts";

const ConfigurationByTimeLineChart = ({ data }) => {
  useEffect(() => {
    const chartDom = document.getElementById("main");
    const myChart = echarts.init(chartDom);
    
    const option = {
    //   title: { text: "Device Type" },
      xAxis: {
        type: "category",
        data: data.map(item => item.name),
        axisLine: { show: false }, // Hide the x-axis line
        axisTick: { show: false }, // Hide the x-axis ticks
        axisLabel: {
          interval: 0,
          rotate: 0,
          formatter: (value) => value.split(" ").join("\n"),
        },
      },
      yAxis: { type: "value" },
      series: [
        {
          data: data.map(item => item.value),
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
            borderRadius: [20, 20, 0, 0],
          },
          itemStyle: { color: "#66B127", borderRadius: [20, 20, 0, 0] },
        },
      ],
    };
    myChart.setOption(option);
    return () => myChart.dispose();
  }, [data]);

  return <div id="main" style={{ width: "100%", height: "400px" }} />;
};

export default ConfigurationByTimeLineChart;

