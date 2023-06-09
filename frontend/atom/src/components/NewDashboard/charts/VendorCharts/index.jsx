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
          height: "320px",
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

  );
};

export default index;
