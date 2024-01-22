import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const IpAvailable = () => {
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
          radius: ['40%', '70%'],
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
          data: [
            { value: 1048, name: 'Total IPs', itemStyle: { color: '#74ABFF' } },
            { value: 735, name: 'Free IPs', itemStyle: { color: '#66B127' } },
            { value: 580, name: 'Used IPs', itemStyle: { color: '#8F37FF' } },
          ],
        },
      ],
    };

    myChart.setOption(option);

    // Cleanup function to detach chart when component unmounts
    return () => myChart.dispose();
  }, []); // Empty dependency array to run effect only once

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default IpAvailable;
