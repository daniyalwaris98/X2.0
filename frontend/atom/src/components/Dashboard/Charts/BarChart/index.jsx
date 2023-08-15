import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios, { baseUrl } from "../../../../utils/axios";

const Barchart = () => {
  const [loading, setLoading] = useState(false);
  const [myFunction, setMyFunction] = useState("");

  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/functions");
        setMyFunction(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  return (
    <div
      style={{
        paddingRight: "10px",
        paddingLeft: "10px",
        marginTop: "10px",
        width: "100%",
        height: "302px",
        paddingBottom: "8px",
      }}
    >
      <Bar
        data={{
          labels: Object.keys(myFunction),
          datasets: [
            {
              backgroundColor: ["#66B127"],
              borderColor: "#66B127",
              borderWidth: 1,
              data: Object.values(myFunction),
            },
          ],
        }}
        options={{
          ticks: {
            precision: 0,
          },
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 15,
            },
          },
          plugins: {
            legend: {
              labels: { boxWidth: 10, usePointStyle: true },

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
                ticks: {
                  autoSkip: false,
                  maxRotation: 0,
                  minRotation: 0,
                },
                gridLines: {
                  display: false,
                  drawBorder: false,
                },
              },
            ],
            x: {
              ticks: {
                maxRotation: 0,
                minRotation: 25,
              },
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
          // scales: {
          //   y: {
          //     beginAtZero: true,
          //     // ticks: {
          //     //   callback: function (value, index) {
          //     //     console.log(this.getLabelForValue(value));
          //     //     if (this.getLabelForValue(index) == 5) {
          //     //       return myFunction.labelsy;
          //     //     }
          //     //   },
          //     // },
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
        // options={{
        //   responsive: true,
        //   maintainAspectRatio: false,
        //   layout: {
        //     padding: {
        //       top: 15,
        //     },
        //   },
        //   plugins: {
        //     legend: {
        //       display: false,
        //       position: "top",
        //     },
        //   },
        //   // animation: {
        //   //   tension: {
        //   //     duration: 1000,
        //   //     easing: "linear",
        //   //     from: 1,
        //   //     to: 0,
        //   //     loop: true,
        //   //   },
        //   // },
        //   scales: {
        //     yAxes: [
        //       {
        //         gridLines: {
        //           display: false,
        //           drawBorder: false,
        //         },
        //       },
        //     ],
        //     xAxes: [
        //       {
        //         barPercentage: 0.1,
        //         gridLines: {
        //           display: false,
        //           drawBorder: false,
        //         },
        //       },
        //     ],
        //     x: {
        //       grid: {
        //         display: false,
        //       },
        //     },
        //     y: {
        //       grid: {
        //         display: false,
        //         borderWidth: 0,
        //       },
        //     },
        //   },
        // }}
      />
    </div>
  );
};

export default Barchart;
