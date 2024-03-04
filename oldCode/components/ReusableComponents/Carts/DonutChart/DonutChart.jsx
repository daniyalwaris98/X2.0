import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";

import axios, { baseUrl } from "../../../../utils/axios/index";
import { DonutChartStyle } from "./DonutChart.style";

function DonutChart(props) {
  const { endPoint, alertsCount } = props;
  const [data, setData] = useState([]);

  useEffect(() => {
    getDonutChartData();
  }, []);

  const getDonutChartData = async () => {
    await axios
      .get(`${baseUrl}/${endPoint}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "horizontal",
      top: "0px",
      left: "center",
    },
    color: [
      "#FB7457",
      "#fc8452",
      "#999",
      "#73c0de",
      "#3ba272",
      "#9a60b4",
      "#ea7ccc",
      "#5470c6",
      "#91cc75",
      "#fac858",
      "#ee6666",
      "#ffc0de",
      "#3ba272",
      "#11aab4",
      "#1a7ff1",
      "#1ff0",
    ],
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "60%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: [
          {
            name: `${alertsCount} Alarms `,
            value: alertsCount,
          },
        ],
      },
    ],
  };
  return (
    <DonutChartStyle>
      <ReactEcharts option={option} />
    </DonutChartStyle>
  );
}

export default DonutChart;
