import React, { useEffect } from "react";
import * as echarts from "echarts";
const CredentialSummary = () => {
  useEffect(() => {
    var chartDom = document.getElementById("Credential Summary");
    var myChart = echarts.init(chartDom);
    var option;
    option = {
     
      tooltip: {
        trigger: "axis",
        axisPointer: {
          lineStyle: {
            type: "line",
            color: "orange",
          },
        },
        Label: {
          show: false,
        },
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: true,
        },
        axisLabel: {
          show: false,
        },
      },
      yAxis: {
        type: "value",
      },
      legend: {
        y: "bottom",
        icon: "circle",
      },
      series: [
        {
          name: "SNMP V1/V2",
          data: [-100, 142, -190, 234, 490, 230],
          type: "line",
          symbol: "none",
          smooth: true,
          itemStyle: {
            color: "green",
          },
          emphasis: {
            focus: "series",
          },
        },
        {
          name: "SNMP V3",
          data: [32, 62, 901, 94, 1290, 130],
          type: "line",
          symbol: "none",
          smooth: true,
          itemStyle: {
            color: "blue",
          },
          emphasis: {
            focus: "series",
          },
        },
        {
          name: "SSH Login",
          data: [-55, 532, 301, 794, 190, 1130],
          type: "line",
          symbol: "none",
          smooth: true,
          itemStyle: {
            color: "grey",
          },
          emphasis: {
            focus: "series",
          },
        },
      ],
    };
    option && myChart.setOption(option);
    return () => {
      myChart.dispose();
    };
  }, []);
  return (
    <div
      id="Credential Summary"
      style={{ width: "100%", height: "400px" }}
    ></div>
  );
};
export default CredentialSummary;