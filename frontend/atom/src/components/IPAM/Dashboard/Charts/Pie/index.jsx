import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios, { baseUrl } from "../../../../../utils/axios";
import { SpinLoading } from "../../../../AllStyling/All.styled.js";
import { useNavigate } from "react-router-dom";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [subnetSummary, setSubnetSummary] = useState("");

  useEffect(() => {
    const dataCentreStatus = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/subnetSummary");
        setSubnetSummary(res.data);
        setLoading(false);
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
        }}
      >
        <Pie
          data={{
            labels: subnetSummary && Object.keys(subnetSummary),
            datasets: [
              {
                label: "# of Values",
                backgroundColor: ["#6FCBFF", "#FF9A40", "#FF5252"],
                borderColor: "white",
                borderWidth: 2,
                hoverOffset: 15,
                data: subnetSummary && Object.values(subnetSummary),
              },
            ],
          }}
          options={{
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
                labels: {
                  padding: 20,

                  boxWidth: 10,
                  usePointStyle: true,
                },

                display: true,
                position: "right",
              },
            },
          }}
        />
      </div>
    </SpinLoading>
  );
};

export default index;
