import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const SnmpStatus = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);

      const option = {
        legend: {
          data: ['Allocated Budget', 'Actual Spending']
        },
        radar: {
          indicator: [
            { name: 'Sales', max: 6500 },
            { name: 'Admin', max: 16000 },
            { name: 'Inform', max: 30000 },
            { name: 'Customer', max: 38000 },
            { name: 'Develop', max: 52000 },
            { name: 'Market', max: 25000 }
          ]
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
                value: [4200, 3000, 20000, 35000, 50000, 18000],
                name: 'Allocated Budget'
              },
              {
                value: [5000, 14000, 28000, 26000, 42000, 21000],
                name: 'Actual Spending',
                areaStyle: {
                  color: '#3D9E47', // Color for 'Actual Spending'
                },
              }
            ]
          }
        ]
      };

      myChart.setOption(option);
    }
  }, []);

  return (
    <div ref={chartRef} id="snmpStatusChart" style={{ width: '80%', height: '400px', margin: "0 0 0 30px" }} />
  );
};

export default SnmpStatus;
