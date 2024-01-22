import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const TopSubnet = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    const option = {
      angleAxis: {},
      radiusAxis: {
        type: 'category',
        // data: ['Mon', 'Tue', 'Wed', 'Thu'],
        z: 10,
      },
      polar: {},
      series: [
        {
          type: 'bar',
          data: [1, 2, 3, 4],
          coordinateSystem: 'polar',
          name: 'Manual added',
          stack: 'a',
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            color: '#3E72E7', // Color for "Manual added"
          },
        },
        {
          type: 'bar',
          data: [2, 4, 6, 8],
          coordinateSystem: 'polar',
          name: 'DHCP',
          stack: 'a',
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            color: '#30C9C9', // Color for "DHCP"
          },
        },
        {
          type: 'bar',
          data: [1, 2, 3, 4],
          coordinateSystem: 'polar',
          name: 'Discovered Devices',
          stack: 'a',
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            color: '#F7BA1E', // Color for "Discovered Devices"
          },
        },
      ],
      legend: {
        show: true,
        data: ['Manual added', 'DHCP', 'Discovered Devices'],
      },
    };

    myChart.setOption(option);

    // Cleanup function to detach chart when component unmounts
    return () => myChart.dispose();
  }, []); // Empty dependency array to run effect only once

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default TopSubnet;
