import React, { useState, useEffect } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import axios, { baseUrl } from "../../../utils/axios";
import { SpinLoading } from "../../AllStyling/All.styled";
const data = [
  {
    name: "Fast Ethernet",
    uv: 11.47,
    // pv: 2400,
    fill: "#56CCF2",
  },
  {
    name: "1G",
    uv: 2.69,
    // pv: 4567,
    fill: "#27AE10",
  },
  {
    name: "10G",
    uv: 15.69,
    // pv: 1398,
    fill: "#BB6BD9",
  },
  {
    name: "25G",
    uv: 8.22,
    // pv: 9800,
    fill: "#82ca9d",
  },
  {
    name: "100G",
    uv: 8.63,
    // pv: 3908,
    fill: "#F2994A",
  },
];

const style = {
  bottom: 0,
  top: 280,
  // left: 350,
  // lineHeight: "24px",
  color: "#000",
  track: {
    background: ["#f3f3f3", "#e4e4e4"],
  },
};

const UnusedSfps = () => {
  const [loading, setLoading] = useState(false);
  const [myFunction, setMyFunction] = useState([]);

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/unusedSfpsRadicalChart");
        console.log("unusedSfpsRadicalChart", res.data);
        setMyFunction(res.data);
        // console.log(f);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#fff",
              padding: "10px",
            }}
          >{`${payload[0].name} : ${payload[0].value}`}</p>
          {/* <p className="intro">{getIntroOfPage(label)}</p> */}
          {/* <p className="desc">Anything you want can be displayed here.</p> */}
        </div>
      );
    }

    return null;
  };
  return (
    <SpinLoading spinning={loading}>
      {/* <RadialBarChart
        startAngle={450}
        endAngle={90}
        width={285}
        height={355}
        cx={150}
        cy={150}
        innerRadius={30}
        outerRadius={130}
        barSize={5}
        // fill={["#56CCF2", "#27AE10", "#BB6BD9", "#F2994A", "#82ca9d"]}
        data={myFunction}
      >
        <RadialBar
          minAngle={15}
          label={{
            position: "end",
            fill: "#6B75",
            fontSize: "9px",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
          // background={("#f3f3f3", "#e4e4e4")}
          clockWise
          dataKey="value"
          wrapperStyle={style}
        />
        <Legend
          iconSize={15}
          width={300}
          height={130}
          layout="horizontal"
          horizontalAlign="middle"
          wrapperStyle={style}
        />
        <Tooltip content={<CustomTooltip />} />
      </RadialBarChart> */}
        <RadialBarChart  startAngle={450}
        
        endAngle={90} width={500} height={400} cx={150} cy={150} innerRadius={20}  outerRadius={140} barSize={8} data={myFunction}>
  <RadialBar
  
  minAngle={15} label={{ position: 'end', fill: '#000',
  
  fontSize: "9px",
  fontWeight: "bold",
  }} 
  isAnimationActive={false}
  background clockWise dataKey="value" />
  {/* <Legend iconSize={10} width={120} height={140} layout="vertical" verticalAlign="middle" align="right" /> */}
  <Legend
          iconSize={15}
          width={300}
          height={130}
          layout="horizontal"
          horizontalAlign="middle"
          wrapperStyle={style}
        />
  <Tooltip content={<CustomTooltip />} />

</RadialBarChart>
    </SpinLoading>
  );
};

export default UnusedSfps;
