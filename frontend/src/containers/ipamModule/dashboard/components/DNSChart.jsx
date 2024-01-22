import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const DNSChart = ({ color, data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    const option = {
      polar: {},
      angleAxis: {
        type: 'value',
        startAngle: 0,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { show: false },
        min: 0,
        max: 1,
      },
      radiusAxis: {
        type: 'category',
        data: [''],
        z: 10,
        axisLabel: { show: false },
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: { show: false },
      },
      series: [
        {
          type: 'bar',
          data: data || [0.50], // Use the provided data or default to [0.50]
          coordinateSystem: 'polar',
          name: 'Circular Line',
          roundCap: true,
          radius: ['10%', '50%'],
          itemStyle: {
            color: color || 'green', // Use the provided color or default to 'green'
            opacity: 0.8,
            barMaxWidth: 50,
            label: {
              show: true,
              position: 'inside',
              formatter: '{c}%',
            },
          },
        },
      ],
      legend: { show: false },
    };

    option && myChart.setOption(option);

    return () => myChart.dispose();
  }, [color, data]);

  return <div ref={chartRef} style={{ width: '50%', height: '400px' }} />;
};

export default DNSChart;
