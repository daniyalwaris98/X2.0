import React, { useEffect, useState } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  XAxis,
  YAxis,
  Tooltip,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

import axios, { baseUrl } from "../../../../../utils/axios";
import { SpinLoading } from "../../../../AllStyling/All.styled";
const data = [
  {
    name: "Fast Ethernet",
    value: "11.47",
    // pv: 2400,
    fill: "#56CCF2",
  },
  {
    name: "1G",
    value: 2.69,
    // pv: 4567,
    fill: "#FACE10",
  },
  {
    name: "10G",
    value: 15.69,
    // pv: 1398,
    fill: "#BB6BD9",
  },
  {
    name: "25G",
    value: 8.22,
    // pv: 9800,
    fill: "#82ca9d",
  },
  {
    name: "100G",
    value: 8.63,
    // pv: 3908,
    fill: "#F2994A",
  },
];

const style = {
  bottom: 0,
  top: 280,
  flexWrap: "wrap",
  // left: 350,
  // lineHeight: "24px",
  color: "#000",
  track: {
    background: ["#f3f3f3", "#e4e4e4"],
  },
};

const index = () => {
  const [loading, setLoading] = useState(false);
  const [myFunction, setMyFunction] = useState([]);

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
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "#fff",
              height: "100%",
              padding: "10px",
              // marginTop: "80px",
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
    <SpinLoading spinning={loading} tip="Loading...">
      <ResponsiveContainer width={"100%"} height={350}>
        {/* <RadialBarChart
          startAngle={450}
          endAngle={90}
          width={500}
          height={350}
          cx={150}
          cy={150}
          innerRadius={30}
          outerRadius={130}
          barSize={5}
          horizontalAlign="middle"
          // fill={["#56CCF2", "#27AE10", "#BB6BD9", "#F2994A", "#82ca9d"]}
          data={myFunction}
        >
          <RadialBar
            minAngle={15}
            label={{
              position: "start",
              fill: "#6B75",

              fontSize: "9px",
              fontWeight: "bold",
            }}
            // background={("#f3f3f3", "#e4e4e4")}
            clockWise
            dataKey="value"
            wrapperStyle={style}
          />
          <Legend
            iconSize={15}
            width={320}
            height={130}
            layout="horizontal"
            horizontalAlign="middle"
            wrapperStyle={style}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadialBarChart> */}
        <RadialBarChart
          width={500}
          height={350}
          cx={180}
          cy={180}
          startAngle={450}
          endAngle={90}
          innerRadius={100}
          outerRadius={480}
          barSize={11}
          data={myFunction}
        >
          <PolarAngleAxis
            type="number"
            label={{
              position: "start",
              fill: "#6B75",

              fontSize: "100px",
              fontWeight: "bold",
            }}
            domain={[0, 1500]}
            angleAxisId={0}
            tick={{ fill: "#000", fontSize: 12 }}
          />
          <PolarAngleAxis
            type="number"
            domain={[0, 1500]}
            angleAxisId={1}
            tick={false}
          />
          <PolarAngleAxis
            type="number"
            domain={[0, 1500]}
            angleAxisId={2}
            tick={false}
          />
          <PolarAngleAxis
            type="number"
            domain={[0, 1500]}
            angleAxisId={3}
            tick={false}
          />
          <PolarAngleAxis
            type="number"
            domain={[0, 1500]}
            angleAxisId={4}
            tick={{ fill: "#fff", fontSize: 12 }}
          />
          <RadialBar
            background
            label={{ position: "insideStart", fill: "#fff", fontSize: "15px" }}
            // wrapperStyle={style}
            dataKey="value"
            angleAxisId={0}
            data={[myFunction[0]]}
          />
          <RadialBar
            background
            // label={{
            //   position: "start",
            //   fill: "#6B75",

            //   fontSize: "9px",
            //   fontWeight: "bold",
            // }}
            label={{ position: "insideStart", fill: "#fff", fontSize: "15px" }}
            // wrapperStyle={style}
            dataKey="value"
            angleAxisId={1}
            data={[myFunction[1]]}
          />
          <RadialBar
            background
            label={{
              position: "start",
              fill: "#6B75",

              fontSize: "9px",
              fontWeight: "bold",
            }}
            // wrapperStyle={style}
            dataKey="value"
            angleAxisId={2}
            data={[myFunction[2]]}
          />
          <RadialBar
            background
            label={{ position: "insideStart", fill: "#fff", fontSize: "15px" }}
            // wrapperStyle={style}
            dataKey="value"
            angleAxisId={3}
            data={[myFunction[3]]}
          />
          <RadialBar
            background
            label={{ position: "insideStart", fill: "#fff", fontSize: "15px" }}
            // wrapperStyle={style}
            dataKey="value"
            angleAxisId={4}
            data={[myFunction[4]]}
          />
          {/* <Legend
            iconSize={15}
            width={320}
            height={130}
            layout="horizontal"
            horizontalAlign="middle"
            wrapperStyle={style}
          /> */}
          {/* <Tooltip content={<CustomTooltip />} /> */}
        </RadialBarChart>
      </ResponsiveContainer>
      {/* <Tooltip
          labelFormatter={(value) => {
            return `name: ${myFunction}`;
          }}
        /> */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ marginTop: "-30px", width: "200px" }}>
          {myFunction.map((item, index) => {
            return (
              <div
                key={index}
                style={{
                  textAlign: "left",
                  width: "150px",
                  marginLeft: "45px",
                }}
              >
                {item.name === "Clear" ? (
                  <span>
                    <span
                      style={{
                        width: "15px",
                        height: "10px",
                        background: "#67B027",
                        color: "#67B027",
                      }}
                    >
                      aa
                    </span>
                    &nbsp; {item.name} {item.value}
                  </span>
                ) : null}
                {item.name === "Critical" ? (
                  <span>
                    <span
                      style={{
                        width: "15px",
                        height: "10px",
                        background: "#FE9B3F",
                        color: "#FE9B3F",
                      }}
                    >
                      aa
                    </span>
                    &nbsp; {item.name} {item.value}
                  </span>
                ) : null}
                {item.name === "Attention" ? (
                  <span>
                    <span
                      style={{
                        width: "15px",
                        height: "10px",
                        background: "#E2B200",
                        color: "#E2B200",
                      }}
                    >
                      aa
                    </span>
                    &nbsp; {item.name} {item.value}
                  </span>
                ) : null}
                {item.name === "InActive" ? (
                  <span>
                    <span
                      style={{
                        width: "15px",
                        height: "10px",
                        background: "#A8A6A6",
                        color: "#A8A6A6",
                      }}
                    >
                      aa
                    </span>
                    &nbsp; {item.name} {item.value}
                  </span>
                ) : null}
                {item.name === "Service Down" ? (
                  <span>
                    <span
                      style={{
                        width: "15px",
                        height: "10px",
                        background: "#DC3938",
                        color: "#DC3938",
                      }}
                    >
                      aa
                    </span>
                    &nbsp; {item.name} {item.value}
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </SpinLoading>
  );
};

export default index;
