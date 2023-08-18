import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import axios, { baseUrl } from "../../../../utils/axios/index";
import { HorizontalBarChartStyle } from "./HorizontalBarChart.style";

function HorizontalBarChart(props) {
  const { endPoint } = props;

  const [vendors, setVendors] = useState("");

  useEffect(() => {
    getVendors();
  }, []);

  const getVendors = async () => {
    return await axios
      .get(`${baseUrl}/${endPoint}`)
      .then((response) => {
        setVendors(response.data);
      })
      .catch((err) => {
        console.log("err=========>", err);
      });
  };

  const labels = vendors && Object.keys(vendors);
  const modifiedLabels =
    vendors &&
    labels.map((label) => {
      if (label.length > 8) {
        return label.substring(0, 8) + "...";
      } else {
        return label;
      }
    });

  return (
    <HorizontalBarChartStyle>
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
              data: vendors && Object.values(vendors),
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
              title: function (tooltipItems, data) {
                let label = labels[tooltipItems[0].index];
                let maxLabelLength = 15;
                if (label.length > maxLabelLength) {
                  return label.substring(0, maxLabelLength) + "...";
                } else {
                  return label;
                }
              },
            },
          },
        }}
      />
    </HorizontalBarChartStyle>
  );
}

export default HorizontalBarChart;
