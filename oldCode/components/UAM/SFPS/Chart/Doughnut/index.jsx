import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
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
        {mysfpstatus && (
          <Doughnut
            data={{
              labels: mysfpstatus && Object.keys(mysfpstatus),
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

                  data: mysfpstatus && Object.values(mysfpstatus),
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
            }}
          />
        )}
      </div>
    </SpinLoading>
  );
};

export default index;
