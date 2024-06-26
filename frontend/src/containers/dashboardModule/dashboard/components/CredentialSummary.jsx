import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const CredentialSummary = () => {
  useEffect(() => {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);
    
    const option = {
      title: {
        text: 'Step Line'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Step Start', 'Step Middle', 'Step End']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Step Start',
          type: 'line',
          step: 'start',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: 'Step Middle',
          type: 'line',
          step: 'middle',
          data: [220, 282, 201, 234, 290, 430, 410]
        },
        {
          name: 'Step End',
          type: 'line',
          step: 'end',
          data: [450, 432, 401, 454, 590, 530, 510]
        }
      ]
    };
    
    option && myChart.setOption(option);

    // Clean up the chart instance on unmount
    return () => {
      myChart.dispose();
    };
  }, []);

  return <div id="main" style={{ width: '100%', height: '400px' }}></div>;
};

export default CredentialSummary;
