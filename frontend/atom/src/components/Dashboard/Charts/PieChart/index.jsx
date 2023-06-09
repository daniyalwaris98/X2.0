import React, { useEffect, useState } from "react";
import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import axios, { baseUrl } from "../../../../utils/axios";

const PieChart = () => {
  const [loading, setLoading] = useState(false);
  const [myFunction, setMyFunction] = useState("");
  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/onboardedDevicesPerMonth");
        console.log("onboardedDevicesPerMonth", res);
        setMyFunction(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  console.log(myFunction.EDN);

  return (
    <div
      style={{
        paddingRight: "10px",
        paddingLeft: "10px",
        paddingBottom: "10px",
        width: "100%",
        height: "297px",
      }}
    >
      <Bar
        data={{
          labels: myFunction.labelsy,
          datasets: [
            {
              label: "EDN",
              backgroundColor: ["#6FCF97"],
              // borderColor: "rgba(19,199,12,1)",
              // borderWidth: 2,
              hoverOffset: 15,
              // borderRadius: 20,
              data: myFunction.EDN,
            },
            {
              label: "IGW",
              backgroundColor: ["#2D9CDB"],
              // borderColor: "rgba(19,55,32,1)",
              // borderWidth: 2,
              hoverOffset: 15,
              // borderRadius: 20,
              data: myFunction.IGW,
            },
            {
              label: "SOC",
              backgroundColor: ["#1AFA9A"],
              // borderColor: "rgba(122,249,32,1)",
              // borderWidth: 2,
              hoverOffset: 15,
              // borderRadius: 20,
              data: myFunction.SOC,
            },
          ],
        }}
        options={{
          ticks: {
            precision: 0,
          },
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 15,
            },
          },
          plugins: {
            legend: {
              labels: { boxWidth: 10, usePointStyle: true },

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
      />
    </div>
  );
};

export default PieChart;
