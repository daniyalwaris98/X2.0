import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import ModuleMenu from "../../components/moduleMenu";

function index(props) {
  return (
    <>
      <Card sx={{ marginBottom: "10px", height: "40px" }}>
        <ModuleMenu
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
            listStyle: "none",
            textDecoration: "none !important",
            margin: "0px",
            height: "40px",
          }}
          items={["Atom", "Password Group"]}
        />
      </Card>
      <Outlet />
    </>
  );
}

export default index;
