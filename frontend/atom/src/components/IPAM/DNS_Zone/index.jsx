import React from "react";
import soon from "./assets/soon.png";

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
        src={soon}
        width="50%"
        height="70%"
        style={{ margin: "auto" }}
        alt=""
      />
    </div>
  );
};

export default index;
