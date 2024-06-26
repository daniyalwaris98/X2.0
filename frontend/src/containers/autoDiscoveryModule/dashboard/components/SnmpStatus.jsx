import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const SnmpStatus = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const myChart = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '13%',
        left: 'center'
      },
 
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ["50%", "40%","0%", "0%"], // Adjusted center to be in the middle horizontally and at the top vertically

          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 484, name: 'SNMP Enabled', itemStyle: { color: '#3D9E47' } }, // Green color
            { value: 300, name: 'SNMP Disabled', itemStyle: { color: '#E34444' } } // Red color
          ]
        }
      ]
    };

    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, []); // Empty dependency array to run only once when the component mounts

  return <div ref={chartRef} style={{ width: '100%', height: '350px' ,padding:"0px", margin:"0px"}} />;
};

export default SnmpStatus;
