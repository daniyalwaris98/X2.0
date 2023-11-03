import React, { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import axios, { baseUrl } from "../../../../../../utils/axios";
import { SpinLoading } from "../../../../../AllStyling/All.styled";
const Index = () => {
  const [loading, setLoading] = useState(false);
  const [myFunction, setMyFunction] = useState([]);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/ipAvailibity");
        console.log("ipAvailibity", res);
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
      top: "0px",
      bottom: "100px",
      left: "center",
    },
    // color: ["#E1B200", "#67B027", "#FE9B3F", "#90EE8F", "#DC3938", "#679000"],
    color: ["#2D9CDB", "#4BE58C", "#FE676B"],

    series: [
      {
        name: "",
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
        // label: {
        //   normal: {
        //     show: true,
        //     formatter: function (params) {
        //       return params.name + "\n" + params.percent + "%";
        //     },
        //     textStyle: {
        //       fontSize: 20,
        //     },
        //   },
        // },

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
        minAngle: "25",
      },
    ],
  };
  return (
    <div style={{ width: "100%", height: "246px" }}>
      <ReactEcharts
        option={option}
        style={{ height: "100%", padding: "0px", paddingTop: "10px" }}
      />
    </div>
  );
};
export default Index;
