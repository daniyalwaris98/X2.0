import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";
import axios, { baseUrl } from "../../../../utils/axios";
import "chartjs-plugin-zoom";
import { Chart as ChartJS } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Spin } from "antd";
import { SpinLoading } from "../../../AllStyling/All.styled.js";
import { Chart } from "chart.js";

// Chart.defaults.datasets.bar.barThickness = 25;
// useEffect(() => {}, []);

// useEffect(() => {
//   Bar.register(zoomPlugin);
// }, [zoomPlugin]);

const index = () => {
  const [loading, setLoading] = useState(false);
  const [myTopSites, setMyTopSites] = useState("");

  const data = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

  useEffect(() => {
    const topSites = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/topSites");
        console.log("topSites", res.data);
        setMyTopSites(res.data);
        setLoading(false);

        // setSiteDeviceVendor(res.data);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    topSites();
  }, []);

  return (
    <SpinLoading spinning={loading}>
      <div
        style={{
          paddingRight: "10px",
          paddingLeft: "10px",
          marginTop: "20px",
          width: "100%",
          height: "320px",
        }}
      >
        {/* <Bar
          data={{
            labels: Object.keys(myTopSites),
            datasets: [
              {
                categoryPercentage: 0.2, 
                barPercentage: 1,
              
                backgroundColor: ["#66B127"],
                borderColor: "#66B127",

                hoverOffset: 15,

                data: Object.values(myTopSites),
              },
            ],
          }}
          options={{
            ticks: {
              precision: 0,
            },
            responsive: true,
            indexAxis: "y",
            maintainAspectRatio: false,
         
            layout: {
              padding: {
                top: 15,
              },
            },
            plugins: {
              legend: {
                display: false,
                position: "top",
              },
            },
          
            scales: {
              yAxes: [
                {
                  gridLines: {
                    display: false,
                    drawBorder: false,
                  },
                },
              ],
              xAxes: [
                {
                  gridLines: {
                    display: false,
                    drawBorder: false,
                  },
                },
              ],
              x: {
                grid: {
                  display: false,
                },
              },
              y: {
                grid: {
                  display: false,
                  borderWidth: 0,
                },
              },
            },
          }}
        /> */}

        <ResponsiveContainer height={250} width={"100%"}>
          <BarChart
            layout="vertical"
            // width={500}
            // height={300}
            data={data}
            margin={{ left: 50, right: 50 }}
            stackOffset="expand"
            // margin={{
            //   top: 20,
            //   right: 30,
            //   left: 20,
            //   bottom: 5
            // }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis hide type="number" axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" stroke="#000" fontSize="12" />

            <Tooltip />
            <Legend />
            <Bar dataKey="pv" stackId="a" fill="#8884d8" />
            <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </SpinLoading>
  );
};

export default index;
