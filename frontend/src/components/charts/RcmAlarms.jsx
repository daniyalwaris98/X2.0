// import React, { useEffect, useRef } from 'react';
// import * as echarts from 'echarts';

// const RcmAlarms = () => {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const myChart = echarts.init(chartRef.current);

//     const option = {
//       tooltip: {
//         trigger: 'item',
//       },
//       legend: {
//         top: '5%',
//         left: 'center',
//       },
//       series: [
//         {
//           name: 'Access From',
//           type: 'pie',
//           radius: ['40%', '70%'],
//           avoidLabelOverlap: false,
//           label: {
//             show: false,
//             position: 'center',
//           },
//           emphasis: {
//             label: {
//               show: true,
//               fontSize: 40,
//               fontWeight: 'bold',
//             },
//           },
//           labelLine: {
//             show: false,
//           },
//           data: [
//             { value: 1048, name: 'Alarm 1' },
//             { value: 735, name: 'Alarm 2' },
//             { value: 580, name: 'Alarm 3' },
//             { value: 484, name: 'Alarm 4' },
//             { value: 300, name: 'Alarm 5' },
//           ],
//         },
//       ],
//     };

//     myChart.setOption(option);

//     // Handle chart resizing for responsiveness
//     const resizeHandler = () => {
//       myChart.resize();
//     };

//     window.addEventListener('resize', resizeHandler);

//     // Cleanup event listener and chart instance on unmount
//     return () => {
//       window.removeEventListener('resize', resizeHandler);
//       myChart.dispose();
//     };
//   }, []); // Empty dependency array to run the effect only once

//   return (
//       <div ref={chartRef} className="chart-container" style={{ width: '100%', height: '400px' }} />

  
//   );
// };

// export default RcmAlarms;


import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const RcmAlarms = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          color: ['#E34444'], // Set the color for all slices
          data: [
            { value: 1048, name: 'Alarm 1' },
            { value: 735, name: 'Alarm 2' },
            { value: 580, name: 'Alarm 3' },
           
          ],
        },
      ],
    };

    myChart.setOption(option);

    // Handle chart resizing for responsiveness
    const resizeHandler = () => {
      myChart.resize();
    };

    window.addEventListener('resize', resizeHandler);

    // Cleanup event listener and chart instance on unmount
    return () => {
      window.removeEventListener('resize', resizeHandler);
      myChart.dispose();
    };
  }, []); // Empty dependency array to run the effect only once

  return (
    <div ref={chartRef} className="chart-container" style={{ width: '100%', height: '400px' }} />
  );
};

export default RcmAlarms;

