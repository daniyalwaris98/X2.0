import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const SnmpStatus = ({ responseData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option = {
        legend: {
          data: responseData.map(item => item.name)
        },
        radar: {
          indicator: responseData.map(item => ({ name: item.name, max: item.value }))
        },
        series: [
          {
            name: 'Budget vs spending',
            type: 'radar',
            areaStyle: {
              color: '#E34444', // Color for 'Allocated Budget'
            },
            data: [
              {
                value: responseData.map(item => item.value),
                name: 'Allocated Budget'
              }
            ]
          }
        ]
      };

      myChart.setOption(option);
    }
  }, [responseData]);

  return (
    <div ref={chartRef} id="snmpStatusChart" style={{ width: '80%', height: '400px', margin: "0 0 0 30px" }} />
  );
};

export default SnmpStatus;
