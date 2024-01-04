import React from "react";
import loginPageLeftImage from "../../resources/svgs/loginPageLeftImage.svg";
import Form from "./form";

function Index(props) {
  return (
    <div style={{ height: "96vh", display: "flex", padding: "2vh" }}>
      <div style={{ position: "relative", width: "50%" }}>
        <img
          src={loginPageLeftImage}
          alt="theme"
          height={"100%"}
          width={"100%"}
          style={{ objectFit: "cover", borderRadius: "7px" }}
        />
        <div
          style={{
            position: "absolute",
            top: "14%",
            left: "40%",
            transform: "translate(-50%, -50%)",
            color: "white", // Set text color
            fontSize: "14px", // Set font size
            // fontWeight: "bold", // Set font weight
            // textAlign: "center", // Center text
          }}
        >
          <div>
            <p>One Stop, Many Solutions</p>
            <p>
              One Solution that Speed up your Device Reports and Make Efficient
              way to organize your data.
            </p>
          </div>
        </div>
      </div>
      <div
        style={{
          width: "50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{}}>
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
