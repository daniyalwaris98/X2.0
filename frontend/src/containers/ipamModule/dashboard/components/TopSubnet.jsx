import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const TopSubnet = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    let myChart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Manual Added', 'Discovered from Devices'],
        bottom: 5, // Place legend at the bottom
        type: 'plain', // Show colored filled bullets with legends
        textStyle: {
          color: '#333' // Adjust legend text color
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%', // Adjust bottom to accommodate the legend
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.xAxis || []
      },
      yAxis: {
        type: 'value'
      },
      color: ['#A155B9', '#165BAA', '#3D9E47'], // Customize line colors
      series: [
        {
          name: 'Manual Added',
          type: 'line',
          stack: 'Total',
          data: data.manualAdded || [],
          lineStyle: {
            width: 3 // Adjust line width
          },
          symbol: 'circle', // Set symbol to circle
          symbolSize: 8, // Set symbol size
          itemStyle: {
            normal: {
              color: '#A155B9' // Fill color of the circle
            }
          }
        },
       
        {
          name: 'Discovered from Devices',
          type: 'line',
          stack: 'Total',
          data: data.discovered || [],
          lineStyle: {
            width: 3 // Adjust line width
          },
          symbol: 'circle', // Set symbol to circle
          symbolSize: 8, // Set symbol size
          itemStyle: {
            normal: {
              color: '#3D9E47' // Fill color of the circle
            }
          }
        }
      ]
    };

    myChart.setOption(option);

    // Cleanup
    return () => {
      myChart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '350px' }} />;
};

export default TopSubnet;
