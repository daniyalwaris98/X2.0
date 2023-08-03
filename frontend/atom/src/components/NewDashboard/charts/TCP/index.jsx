import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios, { baseUrl } from "../../../../utils/axios";
import "chartjs-plugin-zoom";
import { SpinLoading } from "../../../AllStyling/All.styled.js";

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
        setMyTopSites(res.data);
        setLoading(false);
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
          height: "328px",
        }}
      >
        <Bar
          data={{
            labels: myTopSites && Object.keys(myTopSites),
            datasets: [
              {
                categoryPercentage: 0.3,
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
      </div>
    </SpinLoading>
  );
};

export default index;
