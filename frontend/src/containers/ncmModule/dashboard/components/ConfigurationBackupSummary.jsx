import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const ConfigurationBackupSummary = () => {
  useEffect(() => {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);
    let option;

    option = {
      polar: {
        radius: [30, '80%']
      },
      radiusAxis: {
        max: 4,
        axisLabel: {
          show: false, // Hide numeric labels
        },
      },
      angleAxis: {
        type: 'category',
        data: ['Backup Successful', 'Backup Failure', 'Not Backup'],
        startAngle: 0, // Adjust the start angle to 0 degrees
      },
      tooltip: {},
      series: [
        {
          type: 'bar',
          data: [2],
          coordinateSystem: 'polar',
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}',
          },
          itemStyle: {
            color: '#63B871',
            barWidth: 80,
          },
        },
        {
          type: 'bar',
          data: [12],
          coordinateSystem: 'polar',
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}',
          },
          itemStyle: {
            color: '#E89C42',
            barWidth: 40,
          },
        },
        {
          type: 'bar',
          data: [24],
          coordinateSystem: 'polar',
          label: {
            show: true,
            position: 'inside',
            formatter: '{c}',
          },
          itemStyle: {
            color: '#FF6363',
            barWidth: 40,
          },
        },
      ],
      animation: true
    };

    option && myChart.setOption(option);

    // Clean up the chart on component unmount
    return () => {
      myChart.dispose();
    };
  }, []); // Empty dependency array ensures that the effect runs only once on component mount

  return <div id="main" style={{ width: '100%', height: '250px' }}></div>;
};

export default ConfigurationBackupSummary;
