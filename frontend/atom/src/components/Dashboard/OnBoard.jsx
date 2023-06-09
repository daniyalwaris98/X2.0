import React from "react";
import edn from "../assets/edn.svg";
import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import LineChart from "react-linechart";
import "../node_modules/react-linechart/dist/styles.css";

const OnBoard = () => {
  const data = [
    {
      color: "steelblue",
      points: [
        { x: 1, y: 2 },
        { x: 3, y: 5 },
        { x: 7, y: -3 },
      ],
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          backgroundColor: "rgba(187, 107, 217, 0.15)",
          flexWrap: "wrap",
          borderRadius: "12px",
        }}
      >
        <img src={edn} alt="" style={{ padding: "12px" }} />
      </div>
      <div style={{ alignItems: "center", position: "relative" }}>
        <p
          style={{
            margin: "0",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            marginLeft: "10px",
            color: "#676565",
          }}
        >
          EDN
        </p>
      </div>
      <div style={{ alignItems: "center", position: "relative" }}>
        <h2
          style={{
            margin: "0",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            marginLeft: "120px",
            color: "#676565",
            fontWeight: "bold",
          }}
        >
          98
        </h2>
      </div>
      {/* <div
        style={{
          alignItems: "center",
          position: "relative",
          float: "right",
          marginLeft: "10px",
        }}
      >
        {/* <LineChart width={900} height={150} data={data} /> */}

      {/* <Line
          style={{ width: 80 }}
          data={{
            labels: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
            ],
            datasets: [
              {
                // label: "My First dataset",
                // backgroundColor: [
                //   "rgba(155,99,32,0.2)",
                //   "rgba(155,99,32,0.9)",
                //   "rgba(54,162,235,0.9)",
                //   "rgba(255,206,86,0.9)",
                //   "rgba(75,192,192,0.9)",
                //   "rgba(153,102,255,0.9)",
                //   "rgba(255,15,64,0.9)",
                // ],
                borderColor: "rgba(25,199,132,1)",
                // borderWidth: 1,

                // hoverOffset: 15,
                data: [100, 59, 80, 81, 56, 55, 10],
                pointRadius: 0,
                tension: 0.4,
              },
            ],
          }}
          options={{
            elements: {
              point: {
                pointRadius: 0,
              },
            },

            layout: {
              padding: {
                bottom: 15,
              },
            },
            // plugins: {
            //   legend: {
            //     display: true,
            //     position: "right",
            //   },
            // },
            // animation: {
            //   tension: {
            //     duration: 1000,
            //     easing: "linear",
            //     from: 1,
            //     to: 0,
            //     loop: true,
            //   },
            // },
            scales: {
              display: false,
              xAxes: [
                {
                  gridLines: {
                    display: false,
                  },
                },
              ],
              yAxes: [
                {
                  gridLines: {
                    display: false,
                  },
                },
              ],
            },
          }}
        /> */}
      {/* </div>  */}
    </div>
  );
};

export default OnBoard;
