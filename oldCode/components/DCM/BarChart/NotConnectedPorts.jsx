import React, { useEffect, useState } from "react";
import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";
import "chartjs-plugin-zoom";
import { Chart as ChartJS } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
// useEffect(() => {}, []);
import { SpinLoading } from "../../AllStyling/All.styled";
import axios, { baseUrl } from "../../../utils/axios";

// useEffect(() => {
//   Bar.register(zoomPlugin);
// }, [zoomPlugin]);

const NotConnectedPorts = () => {
  const [loading, setLoading] = useState(false);
  const [myFunction, setMyFunction] = useState("");

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/notConnectedPortsBarChart");
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
                  coloe: "black",
                  anchor: "end",
                  align: "top",
                },
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
            tooltips: {
              callbacks: {
                label: function (tooltipItem) {
                  return tooltipItem.yLabel;
                },
              },
            },
            plugins: {
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
    // <div style={{ width: '100%', height: '270px' }}>
    //   <Bar
    //     data={{
    //       labels: [
    //         'January',
    //         'February',
    //         'March',
    //         'April',
    //         'May',
    //         'June',
    //         'July',
    //         'August',
    //         'September',
    //         'October',
    //         'November',
    //         'December',
    //         'jan',
    //         'feb',
    //         'mar',
    //         'apr',
    //         'may',
    //         'jun',
    //         'jul',
    //         'aug',
    //         'sep',
    //         'oct',
    //         'nov',
    //         'dec',
    //       ],
    //       datasets: [
    //         {
    //           label: '# of Values',
    //           backgroundColor: ['#66B127'],
    //           borderColor: '#66B127',
    //           borderWidth: 1,
    //           hoverOffset: 15,
    //           borderRadius: 20,
    //           datalabels: {
    //             coloe: 'black',
    //             anchor: 'end',
    //             align: 'top',
    //           },
    //           data: [
    //             65, 59, 80, 81, 56, 55, 40, 5, 66, 23, 2, 24, 65, 59,
    //             80, 81, 18, 23, 55, 12, 90, 54, 12, 80,
    //           ],
    //         },
    //       ],
    //     }}
    //     options={{
    //       // responsive: true,

    //       layout: {
    //         padding: {
    //           // top: 15,
    //         },
    //       },
    //       plugins: {
    //         zoom: {
    //           zoom: {
    //             enabled: true,
    //             // mode: "x",
    //           },
    //           // pan: {
    //           //   enabled: true,
    //           //   mode: "x",
    //           // },
    //         },
    //         legend: {
    //           display: true,
    //           position: 'top',
    //         },
    //       },
    //       // animation: {
    //       //   tension: {
    //       //     duration: 1000,
    //       //     easing: "linear",
    //       //     from: 1,
    //       //     to: 0,
    //       //     loop: true,
    //       //   },
    //       // },
    //       scales: {
    //         xAxes: [
    //           {
    //             gridLines: {
    //               display: false,
    //             },
    //           },
    //         ],
    //         yAxes: [
    //           {
    //             gridLines: {
    //               display: false,
    //             },
    //           },
    //         ],
    //       },
    //       maintainAspectRatio: false,
    //     }}
    //   />
    // </div>
  );
};

export default NotConnectedPorts;
