import React, { useEffect } from "react";
import * as echarts from "echarts";

const CredentialSummary = ({ data }) => {
  useEffect(() => {
    const chartDom = document.getElementById("credential");
    const myChart = echarts.init(chartDom);

    const option = {
      tooltip: {
        trigger: "axis",
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: data ? data.labels : [],
      },
      yAxis: {
        type: "value",
      },
      series: data
        ? data.values.map((item) => ({
            name: item.name,
            type: "line",
            step: "start",
            data: item.values,
          }))
        : [],
    };

    option && myChart.setOption(option);

    // Clean up the chart instance on unmount
    return () => {
      myChart.dispose();
    };
  }, [data]); // Re-render chart when data changes

  return <div id="credential" style={{ width: "100%", height: "400px" }}></div>;
};

export default CredentialSummary;
