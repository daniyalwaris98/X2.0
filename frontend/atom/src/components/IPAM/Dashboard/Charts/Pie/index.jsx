import React, { useEffect, useState } from "react";
import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import axios, { baseUrl } from "../../../../../utils/axios";
import { Spin } from "antd";
import { SpinLoading } from "../../../../AllStyling/All.styled.js";
import { useNavigate } from "react-router-dom";

const index = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [subnetSummary, setSubnetSummary] = useState("");

  const data = {
    January: 56,
    February: 34,
    March: 78,
  };
  useEffect(() => {
    const dataCentreStatus = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/subnetSummary");
        console.log("dataCentreStatus", res.data);
        setSubnetSummary(res.data);

        setLoading(false);

        // setSiteDeviceVendor(res.data);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    dataCentreStatus();
  }, []);

  return (
    <SpinLoading spinning={loading} tip="Loading...">
      <div
        style={{
          marginTop: "10px",
          width: "100%",
          height: "278px",
          padding: "10px",
          // paddingLeft: "30px",
          // paddingRight: "20px",
        }}
      >
        <Pie
          // onClick={(e) => {
          //   var activePoints = myChart.getElementsAtEvent(e);
          //   var selectedIndex = activePoints[0]._index;
          //   console.log(this.data.datasets[0].data[selectedIndex]);
          // }}
          data={{
            // labels: ["January", "February", "March"],
            labels: Object.keys(subnetSummary),
            datasets: [
              {
                label: "# of Values",
                backgroundColor: ["#6FCBFF", "#FF9A40", "#FF5252"],
                borderColor: "white",
                borderWidth: 2,
                hoverOffset: 15,
                // borderRadius: 20,
                // data: [65, 59, 80],
                data: Object.values(subnetSummary),
              },
            ],
          }}
          options={{
            // cutout: "80%",
            // onClick: function (e, item) {
            //   // console.log("legend onClick", evt);
            //   console.log("legd item", item);
            //   console.log("legd", item[0].element.$context.parsed);
            //   console.log("legd", item[0].datasetIndex);
            //   console.log(e);
            //   let datasetIndex = item[0].datasetIndex;
            //   let dataIndex = item[0].index;
            //   let datasetLabel = e.chart.data.datasets[datasetIndex].label;
            //   let value = e.chart.data.datasets[datasetIndex].data[dataIndex];
            //   let label = e.chart.data.labels[dataIndex];
            //   console.log("In click", datasetLabel, label, value);
            //   navigate("/ipam/devices", {
            //     state: {
            //       source: label,
            //     },
            //   });
            // },
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 15,
                left: 15,
                bottom: 34,
              },
            },
            plugins: {
              legend: {
                onClick: function (e) {
                  e.stopPropagation();
                },
                // paddingBottom: 50,
                labels: {
                  padding: 20,

                  boxWidth: 10,
                  usePointStyle: true,
                },

                display: true,
                position: "right",
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
            // scales: {
            //   yAxes: [
            //     {
            //       gridLines: {
            //         display: false,
            //         drawBorder: false,
            //       },
            //     },
            //   ],
            //   xAxes: [
            //     {
            //       barPercentage: 0.1,
            //       gridLines: {
            //         display: false,
            //         drawBorder: false,
            //       },
            //     },
            //   ],
            //   x: {
            //     grid: {
            //       display: false,
            //     },
            //   },
            //   y: {
            //     grid: {
            //       display: false,
            //       borderWidth: 0,
            //     },
            //   },
            // },
          }}
        />
        {/* <Doughnut
        data={{
          labels: ["January", "February", "March"],
          datasets: [
            {
              label: "My First dataset",
              backgroundColor: ["#6FCF97", "#2D9CDB", "#EB5757"],
              borderColor: "rgba(25,199,132,1)",
              borderWidth: 1,
              hoverOffset: 15,
              data: [100, 59, 80],
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
              labels: { boxWidth: 10, usePointStyle: true },
              display: true,
              position: "top",
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
      /> */}
      </div>
    </SpinLoading>
  );
};

export default index;
