import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-plugin-zoom";

import axios, { baseUrl } from "../../../utils/axios";
import { SpinLoading } from "../../AllStyling/All.styled";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [myFunction, setMyFunction] = useState("");

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/totalPortsBarChart");

        setMyFunction(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  return (
    <SpinLoading spinning={loading}>
      <div style={{ marginTop: "35px", width: "100%", height: "365px" }}>
        <Bar
          data={{
            // labels: ["Fast Ethernet", "1G", "10G", "25G", "100G"],
            labels: Object.keys(myFunction),

            datasets: [
              {
                // label: ["Fast Ethernet"],

                backgroundColor: [
                  "#F2994A",
                  "#27AE60",
                  "#F2C94C",
                  "#EB5757",
                  "#2D9CDB",
                ],
                // borderColor: "#66B127",
                borderWidth: 1,
                hoverOffset: 15,
                // borderRadius: 20,
                datalabels: {
                  // display: true,
                  color: "black",
                  align: "top",
                  anchor: "end",
                  font: { size: "14" },
                },
                // datalabels: {
                //   color: "black",
                //   anchor: "end",
                //   align: "top",
                // },
                // data: [65, 59, 80, 81, 56, 55],
                data: Object.values(myFunction),
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                // top: 15,
              },
            },
            // plugins: [ChartDataLabels],
            tooltips: {
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.yLabel;
                },
              },
            },

            plugins: {
              // datalabels: {
              //   display: true,
              //   color: "black",
              //   align: "end",
              //   anchor: "end",
              //   font: { size: "1884" },
              // },
              legend: {
                display: false,
                position: "top",
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
              yAxes: [
                {
                  gridLines: {
                    display: false,
                    drawBorder: false,
                  },
                  ticks: {
                    display: false,
                  },
                },
              ],
              xAxes: [
                {
                  barPercentage: 0.1,
                  gridLines: {
                    display: false,
                    drawBorder: false,
                  },
                  // ticks: {
                  //   autoSkip: false,
                  //   maxRotation: 0,
                  //   minRotation: 0,
                  // },
                },
              ],
              // xAxes: [
              //   {
              //     barPercentage: 0.1,
              //     gridLines: {
              //       display: false,
              //       drawBorder: false,
              //     },
              //   },
              // ],
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  maxRotation: 0,
                  minRotation: 0,
                },
              },
              y: {
                grid: {
                  display: false,
                  borderWidth: 0,
                },
                ticks: {
                  display: false,
                },
              },
            },
          }}
        />
      </div>
    </SpinLoading>
  );
};

export default index;
