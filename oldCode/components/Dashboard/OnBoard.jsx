import React from "react";
import edn from "../assets/edn.svg";
import "../node_modules/react-linechart/dist/styles.css";

const OnBoard = () => {
  const data = [
    {
      color: "steelblue",
      points: [
        { x: 1, y: 2 },
        { x: 3, y: 5 },
        { x: 7, y: -3 },
      ],
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          backgroundColor: "rgba(187, 107, 217, 0.15)",
          flexWrap: "wrap",
          borderRadius: "12px",
        }}
      >
        <img src={edn} alt="" style={{ padding: "12px" }} />
      </div>
      <div style={{ alignItems: "center", position: "relative" }}>
        <p
          style={{
            margin: "0",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            marginLeft: "10px",
            color: "#676565",
          }}
        >
          EDN
        </p>
      </div>
      <div style={{ alignItems: "center", position: "relative" }}>
        <h2
          style={{
            margin: "0",
            position: "absolute",
            top: "50%",
            transform: "translateY(-50%)",
            marginLeft: "120px",
            color: "#676565",
            fontWeight: "bold",
          }}
        >
          98
        </h2>
      </div>
    </div>
  );
};

export default OnBoard;
