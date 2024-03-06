import React, { useEffect } from "react";
import * as echarts from "echarts";

const TopOpenPorts = () => {
  useEffect(() => {
    const chartDom = document.getElementById("TopOpenPortsChart");
    const myChart = echarts.init(chartDom);

    const option = {
      xAxis: {
        type: "category",
        data: ["Jan", "Feb", "Mar", "Apr", "May"],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          interval: 0,
          rotate: 0,
          formatter: (value) => value.split(" ").join("\n"),
        },
      },
      yAxis: {
        type: "value",
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          data: [0, 40, 10, 70, 0],
          type: "bar",
          showBackground: true,
          backgroundStyle: {
            color: "rgba(180, 180, 180, 0.2)",
            borderRadius: [20, 20, 20, 20],
          },
          itemStyle: { color: "green", borderRadius: [20, 20, 20, 20] },
        },
      ],
    };

    myChart.setOption(option);

    return () => myChart.dispose();
  }, []);

  return <div id="TopOpenPortsChart" style={{ width: "100%", height: "350px", margin: 0, padding: 0 }} />;
};

export default TopOpenPorts;
