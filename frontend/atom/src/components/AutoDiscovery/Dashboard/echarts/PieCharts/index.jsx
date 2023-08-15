import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import axios, { baseUrl } from "../../../../../utils/axios";
import { SpinLoading } from "../../../../AllStyling/All.styled";
const Index = () => {
  const [loading, setLoading] = useState(false);
  const [myFunction, setMyFunction] = useState([]);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getSnmpStatusGraph");
        setMyFunction(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const option = {
    // title: {
    //   text: "Referer of a Website",
    //   subtext: "Fake Data",
    //   left: "center",
    // },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "horizontal",
      top: "0px",
      left: "center",
    },
    color: [
      // "#6ab15f",
      // "rgba(255,0,0,0.6)",

      "#5ad120",
      "#dd3a3f",
    ],
    series: [
      {
        name: "",
        type: "pie",
        radius: "50%",
        data: myFunction,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };
  return (
    <SpinLoading spinning={loading}>
      <div style={{ width: "100%", height: "350px" }}>
        <ReactEcharts
          option={option}
          style={{ height: "100%", padding: "0px", paddingTop: "10px" }}
        />
      </div>
    </SpinLoading>
  );
};
export default Index;
