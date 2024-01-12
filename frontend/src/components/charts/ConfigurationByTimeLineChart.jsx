import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ConfigurationByTimeLineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);
    const lineColor = '#22B44B';
    const areaColor = {
      type: 'linear',
      x: 0,
      y: 0,
      x2: 0,
      y2: 1,
      colorStops: [
        { offset: 0, color: 'rgba(34, 180, 75, 0.8)' },
        { offset: 1, color: 'rgba(34, 180, 75, 0)' },
      ],
    };

    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['Authorized'],
        right: '20px',
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        // Add your data here, for example:
        // data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      },
      yAxis: {
        type: 'value',
        name: 'Number of Changes',
        axisLabel: {
          formatter: '{value}',
        },
      },
      series: [
        {
          name: 'Authorized',
          type: 'line',
          smooth: true,
          // Add your data here, for example:
          data: [120, 132, 101, 134, 90, 230],
          lineStyle: {
            color: lineColor,
          },
          itemStyle: {
            color: lineColor,
          },
          areaStyle: {
            color: areaColor,
          },
        },
      ],
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div id="main" ref={chartRef} style={{ width: '100%', height: '400px' }} />
  );
};

export default ConfigurationByTimeLineChart;
