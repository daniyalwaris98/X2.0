// import React, { useEffect, useRef } from 'react';
// import * as echarts from 'echarts';

// const FunctionChart = ({ deviceNames, values }) => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const myChart = echarts.init(chartRef.current);

//     const categories = deviceNames;

//     const option = {
//       tooltip: {
//         trigger: 'axis',
//         axisPointer: {
//           type: 'cross',
//           label: {
//             backgroundColor: '#283b56',
//           },
//         },
//       },
//       toolbox: {
//         show: true,
//         feature: {
//           // dataView: { readOnly: false },
//           // restore: {},
//           // saveAsImage: {},
//         },
//       },
//       dataZoom: {
//         show: false,
//         start: 0,
//         end: 100,
//       },
//       grid: {  
//         left: 30,
//         right: 30,
//         bottom: 0,
//         top: 30, 
//         containLabel: true
//       },
//       xAxis: [
//         {
//           type: 'category',
//           boundaryGap: true,
//           data: categories,
//         }
//       ],
//       yAxis: [
//         {
//           type: 'value',
//           scale: true,
//           name: '',
//           max: 30,
//           min: 0,
//           boundaryGap: [0.2, 0.2],
//         },
//         {
//           type: 'value',
//           scale: true,
//           name: '',
//           max: 1200,
//           min: 0,
//           boundaryGap: [0.2, 0.2],
//         },
//       ],
//       series: [
//         {
//           type: 'bar',
//           yAxisIndex: 1,
//           data: values,
//           barWidth: '40%', // Fixed width for the bars
//           itemStyle: {
//             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
//               { offset: 0, color: '#008AB5' },
//               { offset: 1, color: '#FFFFFF' },
//             ]),
//             borderRadius: [15, 15, 15, 15],
//           },
//         },
//         {
//           type: 'line',
//           yAxisIndex: 0,
//           data: values,
//           itemStyle: {
//             color: '#008AB5',
//           },
//         },
//       ],
//     };

//     myChart.setOption(option);

//     const intervalId = setInterval(() => {
//       values.shift();
//       values.push(Math.round(Math.random() * 1000));

//       myChart.setOption({
//         xAxis: [
//           {
//             data: categories,
//           }
//         ],
//         series: [
//           {
//             data: values,
//           },
//           {
//             data: values,
//           },
//         ],
//       });
//     }, 2100);

//     return () => {
//       clearInterval(intervalId);
//       myChart.dispose();
//     };
//   }, [deviceNames, values]);

//   return <div ref={chartRef} className="chart-container" style={{ width: '100%', height: '350px' }} />;
// };

// export default FunctionChart;

import React, { useEffect } from "react";
import * as echarts from "echarts";

const FunctionChart = () => {
  useEffect(() => {
    const chartDom = document.getElementById("FunctionChart");
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "line", // Set appropriate type for axisPointer
        },
      },
      xAxis: {
        type: "category", // Set type to "category"
        data: [
          "Switch",
          "Firewall",
          "VM",
          "Router",
          "Switch 2",
          "Firewall 2",
          "VM 2",
          
         
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
          show: true, // Set to true to show split line
        },
      },
      series: [
        {
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "#73C0DE" },
              { offset: 1, color: "white" },
            ]),
          },
          smooth: 0.6,
          type: "line",
          emphasis: {
            focus: "series",
          },
          data: [350, 532,
            //  401, 354,
             290, 390, 377
            ],
          itemStyle: {
            color: "#5C99B1",
            width: 5,
          },
          z: 1,
        },
        {
          type: "bar",
          emphasis: {
            focus: "series",
          },
          data: [350, 532, 401, 354, 290, 390, 377, 490, 450, 480, 350, 280],
          itemStyle: {
            color: "#73C0DE",
            borderRadius: [20, 20, 20, 20],
          },
        },
      ],
    };

    myChart.setOption(option);

    return () => myChart.dispose();
  }, []);

  return <div id="FunctionChart" style={{ width: "100%", height: "400px" }}></div>;
};

export default FunctionChart;
