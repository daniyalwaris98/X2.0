import React from "react";
import error from "./assets/error.jpg";

const index = () => {
  return (
    <div
      style={{
        margin: "auto",
        width: "100%",
        height: "72vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <img
        src={error}
        width="50%"
        height="70%"
        style={{ margin: "auto" }}
        alt=""
      />
    </div>
  );
};

export default index;
