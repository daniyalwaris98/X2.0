import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const TypeSummaryChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    const option = {
      dataset: {
        source: [
          ['product', 'score', 'amount', 'color'],
          ['Cisco', 150, 50, '#3E72E7'],
          ['Arsita', 350, 80, '#74ABFF'],
          ['Fortinet', 450, 90, '#30C9C9'],
          ['Juniper', 450, 90, '#8F37FF'],
          ['D-Link', 450, 80, '#409F47'],
          ['Versa', 450, 60, '#F03F41'],
        ],
      },
      yAxis: { type: 'category' },
      xAxis: { type: 'value' },
      series: [
        {
          type: 'bar',
          encode: {
            x: 'amount',
            y: 'product',
          },
          itemStyle: {
            color: function (params) {
              return params.data[3]; // Set color based on the 'color' column
            },
            barBorderRadius: [0, 20, 20, 0], // Set bar radius [top-left, top-right, bottom-right, bottom-left]
          },
          barWidth: 15, // Adjust the width of the bars
          barHeight: 10, // Adjust the height of the bars
        },
      ],
    };

    myChart.setOption(option);

    // Cleanup function to destroy the chart when the component unmounts
    return () => myChart.dispose();
  }, []);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default TypeSummaryChart;
