import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios, { baseUrl } from "../../../../../utils/axios";
import "chartjs-plugin-zoom";
import { SpinLoading } from "../../../../AllStyling/All.styled.js";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [myTopSites, setMyTopSites] = useState("");

  useEffect(() => {
    const topSites = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/topSites");
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
    <SpinLoading spinning={loading}>
      <div
        style={{
          paddingRight: "10px",
          paddingLeft: "10px",
          marginTop: "20px",
          width: "100%",
          height: "320px",
        }}
      >
        <Bar
          data={{
            labels: myTopSites && Object.keys(myTopSites),
            datasets: [
              {
                categoryPercentage: 0.2, // notice here
                barPercentage: 1,
                backgroundColor: ["#66B127"],
                borderColor: "#66B127",

                hoverOffset: 15,

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

            layout: {
              padding: {
                top: 15,
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
      </div>
    </SpinLoading>
  );
};

export default index;
