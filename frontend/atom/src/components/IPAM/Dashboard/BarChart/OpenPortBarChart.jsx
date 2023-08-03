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
          // marginTop: "20px",
          width: "100%",
          height: "320px",
        }}
      >
        <Bar
          // onClick={(e) => {
          //   var activePoints = myChart.getElementsAtEvent(e);
          //   var selectedIndex = activePoints[0]._index;
          //   console.log(this.data.datasets[0].data[selectedIndex]);
          // }}
          data={{
            labels: myTopSites && Object.keys(myTopSites),
            // labels: ["a", "b", "c"],
            datasets: [
              {
                categoryPercentage: 0.3, // notice here
                barPercentage: 1,
                // label: "# of Values",
                backgroundColor: [
                  "#66B127",
                  //   "#5FA3D1",
                  // "#27AE60",
                  //   "#F2C94C",
                  //   "#EB5757",
                  //   "#90B624",
                ],
                borderColor: "#66B127",

                // barPercentage: 0.5,
                // barThickness: 15,
                // maxBarThickness: 10,
                // minBarLength: 3,

                // borderWidth: 1,
                hoverOffset: 15,
                borderRadius: 5,
                // barPercentage: 1,
                // barPercentage: 0.5,
                // categoryPercentage: 0.2,
                // barThickness: 20,
                // maxBarThickness: 20,
                // datalabels: {
                //   coloe: "black",
                //   anchor: "end",
                //   align: "top",
                // },
                data: myTopSites && Object.values(myTopSites),
                // data: [1, 3, 5, 9],
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
              // console.log("legend onClick", evt);
              console.log("legd item", item);
              console.log("legd", item[0].element.$context.parsed);
              console.log("legd", item[0].datasetIndex);
              console.log(e);
              let datasetIndex = item[0].datasetIndex;
              let dataIndex = item[0].index;
              let datasetLabel = e.chart.data.datasets[datasetIndex].label;
              let value = e.chart.data.datasets[datasetIndex].data[dataIndex];
              let label = e.chart.data.labels[dataIndex];
              console.log("In click", datasetLabel, label, value);
              navigate("/ipam/subnet/ip-details", {
                state: {
                  open_ports: label,
                },
              });
            },
            maintainAspectRatio: false,
            // barPercentage: 3.9,
            // inflateAmount: 15,
            // categoryPercentage: 0.2,
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
