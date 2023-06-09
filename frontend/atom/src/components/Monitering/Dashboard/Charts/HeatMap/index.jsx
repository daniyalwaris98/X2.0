import React, { useState, useEffect } from "react";
import ApexCharts from "apexcharts";
import Chart from "react-apexcharts";
import axios, { baseUrl } from "../../../../../utils/axios";
import { SpinLoading } from "../../../../AllStyling/All.styled";

const index = () => {
  const [heatMapData, setHeatMapData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const serviceCalls = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/getMonitoringHeatmap");
        console.log("getMonitoringHeatmap", res);

        setHeatMapData(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    serviceCalls();
  }, []);

  const generateData = (count, yrange) => {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y,
      });
      i++;
    }
    return series;
  };

  const Data = {
    options: {
      chart: {
        height: 350,
        type: "heatmap",
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#008FFB"],
      // colors: ["#00A100", "#FFB200"],
      title: {
        text: "",
      },
      plotOptions: {
        heatmap: {
          colorScale: {
            ranges: [
              {
                from: 0,
                to: 1,
                color: "#00A100",
                name: "Up",
              },
              {
                // from: 6,
                // to: 20,
                color: "#128FD9",
                name: "medium",
              },
              {
                from: -1,
                to: 0,
                color: "#FFB200",
                name: "Down",
              },
            ],
          },
        },
      },
      //   xaxis: {
      //     categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
      //   },
    },
    series: heatMapData,
  };

  return (
    <div>
      <Chart
        options={Data.options}
        series={Data.series}
        type="heatmap"
        height={400}
        width="100%"
      />
    </div>
  );
};

export default index;
