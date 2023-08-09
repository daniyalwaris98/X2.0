import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

import axios, { baseUrl } from "../../../../../utils/axios";

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
        setDcs(res.data);
        setLoading(false);
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
        }}
      >
        <Doughnut
          data={{
            labels: Object.keys(dcs),
            datasets: [
              {
                label: "# of Values",
                backgroundColor: ["#6FCF97", "#2D9CDB", "#EB5757"],
                borderColor: "rgba(25,199,132,1)",
                borderWidth: 1,
                hoverOffset: 15,
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
          }}
        />
      </div>
    </SpinLoading>
  );
};

export default index;
