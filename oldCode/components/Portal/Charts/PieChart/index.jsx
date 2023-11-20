import React from "react";
import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const PieChart = () => {
  return (
    <div>
      <Pie
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
              label: "My First dataset",
              backgroundColor: [
                "rgba(155,99,32,0.2)",
                "rgba(155,99,32,0.9)",
                "rgba(54,162,235,0.9)",
                "rgba(255,206,86,0.9)",
                "rgba(75,192,192,0.9)",
                "rgba(153,102,255,0.9)",
                "rgba(255,15,64,0.9)",
              ],
              borderColor: "rgba(25,199,132,1)",
              borderWidth: 1,
              hoverOffset: 15,
              data: [100, 59, 80, 81, 56, 55, 10],
            },
          ],
        }}
        options={{
          layout: {
            padding: {
              bottom: 15,
            },
          },
          plugins: {
            legend: {
              display: true,
              position: "right",
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
      />
    </div>
  );
};

export default PieChart;
