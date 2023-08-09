import React, { useEffect, useState } from "react";
import ReactEcharts from "echarts-for-react";
import axios, { baseUrl } from "../../../../utils/axios/index";

import { BarChartStyle } from "./BarChart.style";

function BarChart(props) {
  const { endPoint } = props;

  const [name, setName] = useState("");
  const [value, setValue] = useState("");

  useEffect(() => {
    getBarChartData();
  }, []);

  const getBarChartData = async () => {
    await axios
      .get(`${baseUrl}/${endPoint}`)
      .then((res) => {
        console.log("res", res);

        setName(res.data.name);
        setValue(res.data.value);
      })
      .catch((err) => console.log("err", err));
  };

  const option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: {
      type: "category",
      data: name,
    },
    yAxis: {
      type: "value",
    },
    color: [
      "#3ba272",
      "#fc8452",
      "#fac858",
      "#1a7ff1",

      "#91cc75",

      "#ee6666",
      "#ffc0de",
      "#11aab4",
      "#1ff0",
      "#9a60b4",
      "#999",

      "#3ba272",
      "#5470c6",

      "#ea7ccc",

      "#84C8C2",
      "#F2BB72",
      "#D18FCA",

      "#3F3C9D",
      "#E9D756",

      "#D0E1F9",

      "#ED7D3A",

      "#B3C3BF",
    ],
    series: [
      {
        data: value,
        type: "bar",
        showBackground: true,
        barWidth: 35,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  };

  return (
    <BarChartStyle>
      <ReactEcharts option={option} />
    </BarChartStyle>
  );
}

export default BarChart;
