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
        const res = await axios.get(baseUrl + "/getTopOsForDiscovery");
        console.log("res===============> os autodescovery", res);
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
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "horizontal",
      top: "0px",
      left: "center",
    },
    color: [
      "#999",
      "#fc8452",
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
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: myFunction,
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
