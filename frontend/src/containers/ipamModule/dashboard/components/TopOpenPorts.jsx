import React, { useEffect } from 'react';
import * as echarts from 'echarts';

const TopOpenPorts = () => {
  useEffect(() => {
    // Your ECharts code here
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);

    var option = {
      xAxis: {
        type: 'category',
        data: ['Port 22', 'Port 22', 'Port 22', 'Port 22', 'Port 22', 'Port 22', 'Port 22'],
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: '#F4F8F3',
            borderRadius: [20, 20, 0, 0], // Set the radius of the bars
          },
          itemStyle: {
            color: '#66B127', // Set the color of the bars
            borderRadius: [20, 20, 0, 0], // Set the border radius of color-filled inside the bar
          },
          emphasis: {
            itemStyle: {
              color: 'red', // Set the inside filler color when highlighted
              borderRadius: [20, 20, 0, 0], // Set the border radius of color-filled inside the highlighted bar
            },
          },
        },
      ],
    };

    option && myChart.setOption(option);

    // Clean up ECharts instance on component unmount
    return () => {
      myChart.dispose();
    };
  }, []); // Empty dependency array ensures that this effect runs once after initial render

  return <div id="main" style={{ width: '100%', height: '400px' }}></div>;
};

export default TopOpenPorts;
