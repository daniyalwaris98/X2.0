import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import axios, { baseUrl } from "../../../../../../utils/axios";
import { SpinLoading } from "../../../../../AllStyling/All.styled";

const Index = (props) => {
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
    series: [
      {
        type: "gauge",
        center: ["50%", "60%"],
        startAngle: 180,
        endAngle: -0,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: "#62b127",
        },
        progress: {
          show: true,
          width: 30,
        },
        pointer: {
          show: false,
        },
        axisLine: {
          lineStyle: {
            width: 30,
          },
        },
        axisTick: {
          distance: -45,
          splitNumber: 10,
          lineStyle: {
            width: 2,
            color: "#62b127",
          },
        },
        splitLine: {
          distance: -40,
          length: 8,
          lineStyle: {
            width: 1,
            color: "#62b127",
          },
        },
        axisLabel: {
          distance: 5,
          color: "#62b127",
          fontSize: 8,
        },
        anchor: {
          show: false,
        },
        title: {
          show: false,
        },
        detail: {
          valueAnimation: false,
          width: "60%",
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, "-15%"],
          fontSize: 25,
          fontWeight: "bolder",
          formatter: "{value} %",
          color: "inherit",
        },
        data: [
          {
            value: `${Math.round(props.memoryUtilizationValue)}`,
          },
        ],
      },
      {
        type: "gauge",
        center: ["50%", "60%"],
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        itemStyle: {
          color: "#62b127",
        },
        progress: {
          show: true,
          width: 8,
        },
        pointer: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        detail: {
          show: false,
        },
        data: [
          {
            value: `${Math.round(props.memoryUtilizationValue)}`,
          },
        ],
      },
    ],
  };

  return (
    <div style={{ width: "100%", height: "260px" }}>
      <ReactEcharts
        option={option}
        style={{ height: "100%", padding: "0px", paddingTop: "12px" }}
      />
    </div>
  );
};
export default Index;
