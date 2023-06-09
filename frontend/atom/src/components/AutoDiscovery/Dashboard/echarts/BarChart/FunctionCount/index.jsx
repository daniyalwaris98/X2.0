import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import axios, { baseUrl } from "../../../../../../utils/axios";
import { SpinLoading } from "../../../../../AllStyling/All.styled";
const Index = () => {
  const [loading, setLoading] = useState(false);
//   const [funcLabel, setFuncLabel] = useState(false);
  const [myFunction, setMyFunction] = useState("");
  const [myFunctionLabal, setMyFunctionLabal] = useState("");

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getTopFunctionsForDiscovery");
        console.log("getTopFunctionsForDiscovery", res.data.name);
        setMyFunction(res.data.value);
        setMyFunctionLabal(res.data.name);
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
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
    xAxis: {
      type: 'category',
      data: myFunctionLabal
    //   data:['mon', 'tue', 'wed']
    },
    yAxis: {
      type: 'value'
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
        data: myFunction,
        type: 'bar',
        showBackground: true,
        barWidth: 35 ,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ]
  };
  return (
    <SpinLoading spinning={loading}>
      <div style={{ width: "100%", height: "400px" }}>
        <ReactEcharts
          option={option}
          style={{ height: "100%", padding: "0px", paddingTop: "10px" }}
        />
      </div>
    </SpinLoading>
  );
};
export default Index;
