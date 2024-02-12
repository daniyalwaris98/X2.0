import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

function DeviceStatus() {
  const chartRefs = useRef([null, null, null, null]);

  useEffect(() => {
    const charts = chartRefs.current.map((ref) => echarts.init(ref));

    const options = [
      { title: 'Graph 1', value: 70, color: '#E34444' },
      { title: 'Graph 2', value: 45, color: '#F1B92A' },
      { title: 'Graph 3', value: 80, color: '#66B127' },
      { title: 'Graph 4', value: 60, color: '#7066FF' },
    ];

    options.forEach((data, index) => {
      const option = {
        grid: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
          containLabel: true,
          height: '80%', // Adjust the height as needed
        },
        series: [
          {
            type: 'gauge',
            progress: {
              show: true,
              width: 18,
              color:"red"
            },
            axisLine: {
              lineStyle: {
                width: 18,
                color: [
                  [data.value / 100, data.color], // Color up to the gauge value
                  [1, '#ddd'], // Remaining space color (grey)
                ],
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 15,
              lineStyle: {
                width: 2,
                color: '#999',
              },
            },
            axisLabel: {
              distance: 25,
              color: '#999',
              fontSize: 10, // Adjust the font size for axis labels
            },
            anchor: {
              show: true,
              showAbove: true,
              size: 25,
              itemStyle: {
                borderWidth: 10,
              },
            },
            title: {
              show: true,
              offsetCenter: [0, '0%'],
              textStyle: {
                fontSize: 12, // Adjust the font size for the title
                align: 'center',
              },
            },
            detail: {
              valueAnimation: true,
              fontSize: 10, // Adjust the font size for the detail value
              offsetCenter: [0, '70%'],
            },
            data: [
              {
                value: data.value,
                name: data.title,
              },
            ],
          },
        ],
        title: {
          text: data.title,
          subtext: `${data.value}%`,
          x: 'center',
          y: '0%', // Adjust the vertical position of the title
          textStyle: {
            fontSize: 16,
            // color: data.color, // Set the color of the title
          },
        },
      };

      charts[index].setOption(option);
    });

    // Cleanup on unmount
    return () => {
      charts.forEach((chart) => chart.dispose());
    };
  }, []); // Empty dependency array means this effect runs once after initial render

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', height: '300px' }}>
      {chartRefs.current.map((ref, index) => (
        <div key={index} ref={(el) => (chartRefs.current[index] = el)} style={{ width: '25%', height: '100%' }} />
      ))}
    </div>
  );
}

export default DeviceStatus;
