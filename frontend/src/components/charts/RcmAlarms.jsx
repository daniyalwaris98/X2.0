import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const RcmAlarms = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          color: ['#E34444'],
          data: data, // Use the data passed through props
        },
      ],
    };

    myChart.setOption(option);

    // Handle chart resizing for responsiveness
    const resizeHandler = () => {
      myChart.resize();
    };

    window.addEventListener('resize', resizeHandler);

    // Cleanup event listener and chart instance on unmount
    return () => {
      window.removeEventListener('resize', resizeHandler);
      myChart.dispose();
    };
  }, [data]); // Include 'data' in the dependency array to re-run the effect when 'data' changes

  return (
    <div ref={chartRef} className="chart-container" style={{ width: '100%', height: '400px' }} />
  );
};

export default RcmAlarms;
