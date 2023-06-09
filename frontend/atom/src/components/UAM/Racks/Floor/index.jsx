import React from "react";

const index = (props) => {
  return (
    <div
      style={{
        textAlign: "center",
        height: "110px",
        borderBottom: "1px solid",

        width: "100%",
       
        paddingTop: "6px",
      }}
    >
      <h1
        style={{
          color: "#66B127",
          padding: "0px",
          margin: "0px",
          fontSize: "50px",
        }}
      >
        {props.rackNumber}
      </h1>
      <p>FLOOR {props.floorNumber}</p>
    </div>
  );
};

export default index;
