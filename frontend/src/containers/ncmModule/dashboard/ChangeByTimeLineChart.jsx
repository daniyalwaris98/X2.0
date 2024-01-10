import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import $ from 'jquery';

const ChangeByTimeLineChart = () => {
  useEffect(() => {
    const ROOT_PATH = 'https://echarts.apache.org/examples';

    const fetchData = async () => {
      try {
        const rawData = await $.get(`${ROOT_PATH}/data/asset/data/life-expectancy-table.json`);
        run(rawData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();

    return () => {
      // Clean up any resources or event listeners here if needed
    };
  }, []); // Empty dependency array ensures that the effect runs only once on component mount

  const run = (_rawData) => {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);

    const option = {
      dataset: [
        {
          id: 'dataset_raw',
          source: _rawData
        },
        {
          id: 'dataset_since_1950_of_germany',
          fromDatasetId: 'dataset_raw',
          transform: {
            type: 'filter',
            config: {
              and: [
                { dimension: 'Year', gte: 1950 },
                { dimension: 'Country', '=': 'Germany' }
              ]
            }
          }
        },
        {
          id: 'dataset_since_1950_of_france',
          fromDatasetId: 'dataset_raw',
          transform: {
            type: 'filter',
            config: {
              and: [
                { dimension: 'Year', gte: 1950 },
                { dimension: 'Country', '=': 'France' }
              ]
            }
          }
        }
      ],
      title: {
        text: 'Income of Germany and France since 1950'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        nameLocation: 'middle'
      },
      yAxis: {
        name: 'Income'
      },
      series: [
        {
          type: 'line',
          datasetId: 'dataset_since_1950_of_germany',
          showSymbol: false,
          encode: {
            x: 'Year',
            y: 'Income',
            itemName: 'Year',
            tooltip: ['Income']
          }
        },
        {
          type: 'line',
          datasetId: 'dataset_since_1950_of_france',
          showSymbol: false,
          encode: {
            x: 'Year',
            y: 'Income',
            itemName: 'Year',
            tooltip: ['Income']
          }
        }
      ]
    };

    option && myChart.setOption(option);

    // Clean up the chart on component unmount
    return () => {
      myChart.dispose();
    };
  };

  return <div id="main" style={{ width: '100%', height: '400px' }}></div>;
};

export default ChangeByTimeLineChart;
