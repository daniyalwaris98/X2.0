import React, { useState, useEffect } from "react";
import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import axios, { baseUrl } from "../../../../../utils/axios";
import { SpinLoading } from "../../../../AllStyling/All.styled";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [mysfpstatus, setMySfpStatus] = useState("");

  useEffect(() => {
    const sfpStatus = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/sfpStatus");
        // console.log("sfpStatus", res);
        setMySfpStatus(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    sfpStatus();
  }, []);
  return (
    <SpinLoading spinning={loading}>
      <div
        style={{
          marginTop: "20px",
          width: "100%",
          height: "290px",
          padding: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <Doughnut
          data={{
            labels: Object.keys(mysfpstatus),
            datasets: [
              {
                label: "# of Values",
                backgroundColor: [
                  "#6EDE7A",
                  "#8DD5EC",
                  "#8CA9EE",
                  "#66B127",
                  "#FFB127",
                  "#A6FA27",
                  "#66B1FF",
                  "#AAA127",
                  "#66EE97",
                  "#66B7",
                  "#6627",
                ],
                borderColor: "rgba(25,199,132,1)",
                borderWidth: 1,
                hoverOffset: 15,

                // borderRadius: 20,
                data: Object.values(mysfpstatus),
              },
            ],
          }}
          options={{
            cutout: "70%",
            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 15,
                bottom: 30,
              },
            },
            plugins: {
              legend: {
                onClick: function (e) {
                  e.stopPropagation();
                },
                labels: { boxWidth: 10, usePointStyle: true },

                display: true,
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
