import React, { useEffect, useState } from "react";
import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";
import axios, { baseUrl } from "../../../../../utils/axios";
import "chartjs-plugin-zoom";
import { Chart as ChartJS } from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Spin } from "antd";
import { SpinLoading } from "../../../../AllStyling/All.styled.js";
import { Chart } from "chart.js";

// Chart.defaults.datasets.bar.barThickness = 25;
// useEffect(() => {}, []);

// useEffect(() => {
//   Bar.register(zoomPlugin);
// }, [zoomPlugin]);

const index = () => {
  const [loading, setLoading] = useState(false);
  const [vendorsCount, setVendorsCount] = useState("");

  useEffect(() => {
    const topSites = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/getVendorsCount");
        console.log("topSites", res.data);
        setVendorsCount(res.data);
        setLoading(false);

        // setSiteDeviceVendor(res.data);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    topSites();
  }, []);
  const labels = Object.keys(vendorsCount);
  const modifiedLabels = labels.map((label) => {
    if (label.length > 8) {
      return label.substring(0, 8) + '...';
    } else {
      return label;
    }
  });
  return (
    <SpinLoading spinning={loading}>
      <div
        style={{
          paddingRight: "25px",
          paddingLeft: "25px",
          marginTop: "20px",
          width: "100%",
          height: "380px",
          paddingBottom:"15px"
        }}
      >
      <Bar
  data={{
    categoryPercentage: 0.5,
    barPercentage: 1,
    labels: modifiedLabels, 
    datasets: [
      {
        categoryPercentage: 0.3,
        barPercentage: 1,
        backgroundColor: [
          "#6BB8EE",
          "#E86760",
          "#F2C94C",
          "#5FA3D1",
          "#66B127",
          "#27AE60",
          "#EB5757",
          "#90B624",
          "#C67171",
        ],
        borderColor: "#66B127",
        hoverOffset: 15,
        borderRadius: 5,
        data: Object.values(vendorsCount),
      },
    ],
  }}
  options={{
    scales: {
      x: {
        grid: {
          display: true,
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
      },
    },
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
    tooltip: {
        title: function(tooltipItems, data) {
          let label = labels[tooltipItems[0].index];
          let maxLabelLength = 15;
          if (label.length > maxLabelLength) {
            return label.substring(0, maxLabelLength) + '...';
          } else {
            return label;
          }
        }
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
