import React, { useEffect } from "react";
import * as echarts from "echarts";

function TopOsAutoDiscovery() {
  useEffect(() => {
    const chartDom = document.getElementById("topOsChart"); 
    const myChart = echarts.init(chartDom);
    const option = {
    //   title: {
    //     text: "Top OS in Auto Discovery",
    //   },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: [
          "Windows_1",
          "Linux_1",
          "IOS_1",
          "Linux_2",
          "IOS_2",
          "Windows_2",
        ],
        y: "bottom",
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        axisLine: {
          show: "",
        },
        axisTick: {
          show: "",
        },
        data: [
          "Windows_1",
          "Linux_1",
          "IOS_1",
          "Linux_2",
          "IOS_2",
          "Windows_2",
        ],
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "Windows_1",
          type: "line",
          data: [-20, 42, 10, 34, 110, 48, 20],
          lineStyle: {
            type: "dashed",
          },
          itemStyle: {
            color: "red",
          },
        },
        {
          name: "Linux_1",
          type: "line",
          data: [20, 82, 31, 54, 28, 100, 70],
          itemStyle: {
            color: "blue",
          },
        },
        {
          name: "IOS_1",
          type: "line",
          data: [10, 32, 20, 54, 60, 20, 40],
          lineStyle: {
            type: "dashed",
          },
          itemStyle: {
            color: "yellow",
          },
        },
        {
          name: "Linux_2",
          type: "line",
          data: [15, 10, 30, 34, -60, 30, -20],
          areaStyle: {
            origin: "auto",
          },
          itemStyle: {
            color: "green",
          },
        },
        {
          name: "IOS_2",
          type: "line",
          data: [25, 32, 10, 34, 90, 50, 20],
          itemStyle: {
            color: "black",
          },
        },
        {
          name: "Windows_2",
          type: "line",
          data: [30, 12, 20, 14, 70, 30, 50],
          itemStyle: {
            color: "orange",
          },
        },
      ],
    };
    myChart.setOption(option);
    return () => {
      myChart.dispose();
    };
  }, []);
  return <div id="topOsChart" style={{ width: "100%", height: "400px" }}></div>; 
}

export default TopOsAutoDiscovery;
