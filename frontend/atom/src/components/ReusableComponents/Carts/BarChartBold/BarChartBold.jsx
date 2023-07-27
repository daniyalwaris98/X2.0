import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

import axios, { baseUrl } from "../../../../utils/axios/index";

import { BarChartBoldStyle } from "./BarChartBold.style";

function BarChartBold() {
  const [data, setData] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    await axios
      .get(`${baseUrl}/topOpenPorts`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log("err", err));
  };

  return (
    <BarChartBoldStyle>
      <Bar
        data={{
          labels: Object.keys(data),
          datasets: [
            {
              categoryPercentage: 0.3,
              barPercentage: 1,
              backgroundColor: ["#66B127"],
              borderColor: "#66B127",

              hoverOffset: 15,
              borderRadius: 5,

              data: Object.values(data),
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
    </BarChartBoldStyle>
  );
}

export default BarChartBold;
