import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import axios, { baseUrl } from "../../../../../utils/axios";
import { SpinLoading } from "../../../../AllStyling/All.styled.js";

const index = () => {
  const [loading, setLoading] = useState(false);
  const [dnsSummary, setDnsSummary] = useState("");

  useEffect(() => {
    const dataCentreStatus = async () => {
      setLoading(true);

      try {
        const res = await axios.get(baseUrl + "/dnsSummary");
        setDnsSummary(res.data);
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
        <Doughnut
          data={{
            labels: Object.keys(dnsSummary),
            datasets: [
              {
                label: "# of Values",
                backgroundColor: ["#FB7457", "#89F597", "#2D9CDB"],
                borderColor: "white",
                borderWidth: 2,
                hoverOffset: 15,

                data: Object.values(dnsSummary),
              },
            ],
          }}
          options={{
            cutout: "60%",

            responsive: true,
            maintainAspectRatio: false,
            layout: {
              padding: {
                top: 20,
                left: 15,
                bottom: 40,
              },
            },
            plugins: {
              legend: {
                onClick: function (e) {
                  e.stopPropagation();
                },
                paddingBottom: 50,
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
