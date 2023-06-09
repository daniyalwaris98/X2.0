import React from "react";
import { useState, useEffect } from "react";
// import MyData from "./MyData";
import axios, { baseUrl } from "../../../../utils/axios";

import { SpinLoading } from "../../../AllStyling/All.styled";

import "./Floor.css";

const FloorIndex = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const allFloors = async () => {
      setLoading(true);
      try {
        const res = await axios.get(baseUrl + "/allFloors");
        console.log("allFloors", res);
        setData(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err.response);
        setLoading(false);
      }
    };
    allFloors();
  }, []);

  return (
    <SpinLoading spinning={loading} style={{ marginTop: "50px" }}>
      <div>
        {data.map((item, index) => {
          return (
            <div key={index} className="floor" style={{ textAlign: "center" }}>
              <h3
                style={{
                  color: "#66B127",
                  padding: "0px",
                  margin: "0px",
                  fontSize: "35px",
                }}
              >
                {item}
              </h3>
              <p>FLOOR {index}</p>
              <hr />
            </div>
          );
        })}
      </div>
    </SpinLoading>
  );
};

export default FloorIndex;
