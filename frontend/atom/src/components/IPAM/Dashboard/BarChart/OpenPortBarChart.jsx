import React, { useEffect, useState } from "react";
import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";
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
import { useNavigate } from "react-router-dom";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [myTopSites, setMyTopSites] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const topSites = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/topOpenPorts");
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
    <SpinLoading spinning={loading} tip="Loading...">
      <div
        style={{
          paddingRight: "10px",
          paddingLeft: "10px",
          width: "100%",
          height: "320px",
        }}
      >
        <Bar
          data={{
            labels: myTopSites && Object.keys(myTopSites),
            datasets: [
              {
                categoryPercentage: 0.3, // notice here
                barPercentage: 1,

                backgroundColor: ["#66B127"],
                borderColor: "#66B127",
                hoverOffset: 15,
                borderRadius: 5,
                data: myTopSites && Object.values(myTopSites),
              },
            ],
          }}
          options={{
            ticks: {
              precision: 0,
            },
            responsive: true,

            maintainAspectRatio: false,

            onClick: function (e, item) {
              let dataIndex = item[0].index;
              let label = e.chart.data.labels[dataIndex];

              navigate("/ipam/subnet/ip-details", {
                state: {
                  open_ports: label,
                },
              });
            },
            maintainAspectRatio: false,

            layout: {
              padding: {
                top: 15,
                bottom: 20,
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
                },
              ],
              xAxes: [
                {
                  // barThickness: 5,
                  // barPercentage: 0.2,
                  // categoryPercentage: 0.2,

                  gridLines: {
                    display: false,
                    // drawBorder: false,
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

export default index;
