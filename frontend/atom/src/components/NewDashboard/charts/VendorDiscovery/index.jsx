import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import axios, { baseUrl } from "../../../../utils/axios";
import { SpinLoading } from "../../../AllStyling/All.styled";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [myFunction, setMyFunction] = useState([]);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getTopVendorsForDiscovery");
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
      top: "0%",
      left: "center",
      itemGap: 20,
      itemWidth: 12,
      itemHeight: 12,
      padding: 0,
      paddingBottom: 90,
    },
    color: [
      "#73c0de",
      "#fc8452",
      "#1a7ff1",

      "#F0BD46",
      "#F3EB5F",
      "#43358B",
      "#ED9F41",
      "#D2DC58",
      "#9A2D4B",
      "#76AF55",
      "#DC4634",
      "#4194C9",
      "#E05F36",
      "#435FA8",
      "#753E91",
      "#BFB506",
      "#49275A",
      "#71B626",
      "#0280B7",
      "#B42B2B",
      "#D8801A",

      "#fac858",
      "#91cc75",

      "#3ba272",
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
      <div style={{ width: "100%", height: "326px" }}>
        <ReactEcharts
          option={option}
          onEvents={{
            click: (params) => {
              console.log(params.name);
            },
          }}
          style={{ height: "100%", padding: "0px", paddingTop: "10px" }}
        />
      </div>
    </SpinLoading>
  );
};
export default Index;
