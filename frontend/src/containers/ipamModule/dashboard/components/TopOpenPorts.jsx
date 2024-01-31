import React, { useEffect } from 'react';
import * as echarts from 'echarts';


const TopOpenPorts = ({ chartData }) => {
  useEffect(() => {
    if (!chartData || !chartData.ports || !chartData.values) {
      console.error('Invalid chart data:', chartData);
      return;
    }

    const option = {
      xAxis: {
        type: 'category',
        data: chartData.ports,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: chartData.values,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: '#F4F8F3',
            borderRadius: [20, 20, 0, 0],
          },
          itemStyle: {
            color: '#66B127',
            borderRadius: [20, 20, 0, 0],
          },
          emphasis: {
            itemStyle: {
              color: 'red',
              borderRadius: [20, 20, 0, 0],
            },
          },
        },
      ],
    };

    const chartDom = document.getElementById('main');
    if (!chartDom) {
      console.error('Chart element with id "main" not found.');
      return;
    }

    const myChart = echarts.init(chartDom);
    myChart.setOption(option);

    return () => {
      myChart.dispose();
    };
  }, [chartData]);

  return <div id="main" style={{ width: '100%', height: '400px' }} />;
};

// Example parent component
const App = () => {
  // Sample chart data
  const chartData = {
    ports: ['Port 1', 'Port 2', 'Port 3','Port 4', 'Port 5', 'Port 6'],
    values: [10, 20, 15,10, 20, 15],
  };

  return (
     <TopOpenPorts chartData={chartData} style={{width:"100%"}}/>
   );
};

export default App;
