import React from "react";
import DBNavigation from "../DBNavigation/index";
import dbGreen from "./assets/dbGreen.png";
import { Outlet } from "react-router-dom";
import DBSummary from "./DBSummary.jsx";



const Databasee = () => {
  return (
    <div style={{ backgroundColor: "#FFFFFF" }}>
      <div>
        <div>
          <div style={{ paddingBottom: "2px" }}>
            <h2
              style={{
                float: "left",
                marginLeft: "20px",
                fontWeight: "bold",
                marginTop: "5px",
              }}
            >
              <img
                src={dbGreen}
                alt=""
                style={{ width: "30px", height: "30px" }}
              />
              &nbsp; Database Portal
            </h2>
          </div>
        </div>
      </div>
      <br />

      <br />

      <div
        style={{
          borderBottom: "1px solid #eaeaea",
          marginTop: "2px",
        }}
      ></div>

      <div
        style={{
          marginTop: "5px",
          marginBottom: "-3px",
        }}
      >
        <DBNavigation />
        <DBSummary/>
      </div>
      
      <Outlet />
    </div>
  );
};

export default Databasee;
