import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const ConfigurationByTimeLineChart = ({ companyData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    try {
      const companies = Object.keys(companyData);

      const seriesData = companies.map((company) => {
        return {
          name: company,
          type: 'bar',
          data: [companyData[company]], // Wrap the data in an array
        };
      });

      const myChart = echarts.init(chartRef.current);

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            label: {
              show: true,
            },
          },
        },
        legend: {
          data: companies,
        },
        xAxis: [
          {
            type: 'category',
            data: companies,
            axisLabel: {
              interval: 0, // Display all labels
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: 'Number of Devices',
          },
        ],
        series: seriesData,
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
    } catch (error) {
      console.error('Error rendering chart:', error);
    }
  }, [companyData]);

  return (
    <div ref={chartRef} className="chart-container" style={{ width: '100%', height: '400px' }} />
  );
};

export default ConfigurationByTimeLineChart;
