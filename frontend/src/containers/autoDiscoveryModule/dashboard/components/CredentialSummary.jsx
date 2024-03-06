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
        right: "0%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: data ? data.labels : [],
      },
      yAxis: {
        type: "value",
      },
      legend: {
        orient: "horizontal",
        bottom: 5, // Adjust this value to position the legend as needed
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

  return <div id="credential" style={{ width: "100%", height: "350px", padding: "0px", margin: "0px" }}></div>;
};

export default CredentialSummary;
