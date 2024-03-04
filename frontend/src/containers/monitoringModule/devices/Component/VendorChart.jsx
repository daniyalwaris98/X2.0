import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const VendorChart = () => {
  useEffect(() => {
    // Initialize chart
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);

    // Specify options
    const option = {
      xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: [150, 230, 224, 218, 135, 147, 260],
          type: 'line',
          itemStyle: {
            color: 'green' // Set line color to green
          }
        }
      ]
    };

    // Set options to chart
    myChart.setOption(option);

    // Cleanup
    return () => {
      myChart.dispose();
    };
  }, []); 

  return (
    <div id="main" style={{ width: '100%', height: '400px' }}></div>
  );
};

export default VendorChart;
