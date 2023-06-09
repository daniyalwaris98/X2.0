import React from "react";
import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const BarChart = () => {
  return (
    <div>
      <Bar
        data={{
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec",
          ],
          datasets: [
            {
              label: "# of Values",
              backgroundColor: ["#66B127"],
              borderColor: "#66B127",
              borderWidth: 1,
              hoverOffset: 15,
              borderRadius: 20,
              data: [
                65, 59, 80, 81, 56, 55, 40, 5, 66, 23, 2, 24, 65, 59, 80, 81,
                78, 23, 45, 12, 90, 54, 12, 80,
              ],
            },
          ],
        }}
        options={{
          layout: {
            padding: {
              top: 15,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "right",
            },
          },
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
      />
    </div>
  );
};

export default BarChart;
