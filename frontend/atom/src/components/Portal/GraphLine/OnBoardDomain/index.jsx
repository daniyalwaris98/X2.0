import React from "react";
import edn from "../assets/edn.svg";
import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const OnBoardDomain = (props) => {
  return (
    <div style={{ display: "flex", marginTop: "30px", marginBottom: "15px" }}>
      <div
        style={{
          backgroundColor: "rgba(187, 107, 217, 0.15)",
          // backgroundColor: "#000",
          flexWrap: "wrap",
          borderRadius: "12px",
        }}
      >
        <img src={props.serviceImg} alt="" style={{ padding: "12px" }} />
      </div>
      <div style={{ alignItems: "center", position: "relative" }}>
        <p
          style={{
            margin: "0",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            marginLeft: "10px",
            color: "#9F9F9F",
            fontWeight: "bold",
          }}
        >
          {props.serviceName}
        </p>
      </div>
      <div style={{ alignItems: "center", position: "relative" }}>
        <h2
          style={{
            margin: "0",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            marginLeft: "160px",
            color: "#676565",
            fontWeight: "bold",
          }}
        >
          {props.serviceValue}
        </h2>
      </div>
      <div
        style={{
          alignItems: "center",
          position: "relative",
          float: "right",
          marginLeft: "195px",
        }}
      >
        <Line
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
                borderWidth: 1,
                // hoverOffset: 15,
                pointRadius: 0,
                data: [190, 9, 80, 51, 16, 155, 90],
              },
            ],
          }}
          options={{
            layout: {
              padding: {
                bottom: 10,
                top: 22,
              },
            },
            plugins: {
              legend: {
                display: false,
                // position: "right",
                boxWidth: 0,
              },
            },
            animation: {
              tension: {
                duration: 1000,
                easing: "linear",
                from: 1,
                to: 0,
                loop: true,
              },
            },
            scales: {
              yAxes: [
                {
                  ticks: {
                    // min: 1,
                  },
                },
              ],
              y: {
                grid: {
                  drawBorder: false, // <-- this removes y-axis line
                  drawOnChartArea: false, // <-- this removes y-axis line
                  // drawBorder: 3,
                  display: false,
                },
              },
              x: {
                grid: {
                  drawBorder: false, // <-- this removes y-axis line
                  drawOnChartArea: false, // <-- this removes y-axis line
                  // drawBorder: 3,
                  display: false,
                },
              },

              display: false,

              // xAxes: [
              //   {
              //     display: false,
              //     gridLines: {},
              //   },
              // ],
              // yAxes: [
              //   {
              //     // display: false,
              //     gridLines: {
              //       drawBorder: false,
              //     },
              //   },
              // ],
            },
          }}
        />
      </div>
    </div>
  );
};

export default OnBoardDomain;
