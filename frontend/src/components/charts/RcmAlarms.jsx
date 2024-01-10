import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const RcmAlarms = () => {
  useEffect(() => {
    // Initialize ECharts chart
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);

    // ECharts options
    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    };

    // Set ECharts options
    myChart.setOption(option);

    // Cleanup function to dispose of the chart when the component unmounts
    return () => {
      myChart.dispose();
    };
  }, []); // Empty dependency array ensures that the effect runs once after initial render

  return (
    <div id="main" style={{ width: '100%', height: '400px' }}>
      {/* The chart will be rendered here */}
    </div>
  );
};

export default RcmAlarms;
