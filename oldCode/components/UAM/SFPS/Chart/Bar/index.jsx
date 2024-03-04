import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-plugin-zoom";
import axios, { baseUrl } from "../../../../../utils/axios";
import { SpinLoading } from "../../../../AllStyling/All.styled";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [mysfpmode, setMySfpMode] = useState("");

  useEffect(() => {
    const sfpStatus = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/sfpMode");
        setMySfpMode(res.data);
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
      <div style={{ marginTop: "20px", width: "100%", height: "320px" }}>
        {mysfpmode && (
          <Bar
            data={{
              labels: mysfpmode && Object.keys(mysfpmode),
              datasets: [
                {
                  categoryPercentage: 0.08, // notice here
                  barPercentage: 1,
                  label: "# of Values",
                  backgroundColor: [
                    "#6EDE7A",
                    "#8DD5EC",
                    "#8CA9EE",
                    "#66B127",
                    "#A6FA27",
                    "#AAA127",
                    "#66B1FF",
                    "#AAA127",
                    "#66EE97",
                    "#66B7",
                    "#6627",
                  ],
                  borderWidth: 1,
                  hoverOffset: 15,
                  borderRadius: 8,
                  data: mysfpmode && Object.values(mysfpmode),
                },
              ],
            }}
            options={{
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

                  display: true,

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
                    barPercentage: 0.1,
                    gridLines: {
                      display: false,
                      drawBorder: false,
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
        )}
      </div>
    </SpinLoading>
  );
};

export default index;
