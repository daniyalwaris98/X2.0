import React, { useEffect, useState } from "react";
import { Bar, Pie, Line, Doughnut, PolarArea } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import axios, { baseUrl } from "../../../../../utils/axios";
import { Spin } from "antd";
import { SpinLoading } from "../../../../AllStyling/All.styled.js";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [dcs, setDcs] = useState("");

  const data = {
    January: 56,
    February: 34,
    March: 78,
  };
  useEffect(() => {
    const dataCentreStatus = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/dataCentreStatus");
        console.log("dataCentreStatus", res.data);
        setDcs(res.data);
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
    <SpinLoading spinning={loading}>
      <div
        style={{
          marginTop: "20px",
          width: "100%",
          height: "250px",
          padding: "10px",
          // paddingLeft: "20px",
          // paddingRight: "20px",
        }}
      >
        <Doughnut
          data={{
            // labels: ["January", "February", "March"],
            labels: Object.keys(dcs),
            datasets: [
              {
                label: "# of Values",
                backgroundColor: ["#6FCF97", "#2D9CDB", "#EB5757"],
                borderColor: "rgba(25,199,132,1)",
                borderWidth: 1,
                hoverOffset: 15,
                // borderRadius: 20,
                // data: [65, 59, 80],
                data: Object.values(dcs),
              },
            ],
          }}
          options={{
            cutout: "60%",

            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 10,
                bottom: 30,
              },
            },
            plugins: {
              legend: {
                onClick: function (e) {
                  e.stopPropagation();
                },
                paddingBottom: 50,
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
