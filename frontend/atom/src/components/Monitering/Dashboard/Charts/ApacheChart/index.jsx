import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import axios, { baseUrl } from "../../../../../utils/axios";
import { SpinLoading } from "../../../../AllStyling/All.styled";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [myFunction, setMyFunction] = useState([]);
  // var screenWidth = window.innerWidth;
  // font = {"sm": 14, "md": 16, "lg":18, "xl": 209}

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getMonitoringSpiral");
        console.log("getMonitoringSpiral", res);
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
      top: '0%',
      left: 'center',
      itemGap:20,
      itemWidth:20,
      itemHeight:20,
      padding:0,
      paddingBottom:40,
    },
    color: [
      "#e2b200",
      "#d7d7d7",

      "#66b127",
      "#ff9a40",
      "#a8a6a6",
      "#dc3938",
      "#90EE90",
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
    <div style={{ width: "100%", height: "400px" }}>
      <ReactEcharts
        option={option}
        style={{ height: "100%", padding: "0px", paddingTop: "12px" }}
      />
    </div>
  );
};
export default Index;
