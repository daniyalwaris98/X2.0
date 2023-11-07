import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import ModuleMenu from "../../components/navTabs";

function index(props) {
  return (
    <>
      <Card sx={{ marginBottom: "10px" }}>
        <ModuleMenu items={["Atom", "Password Group"]} />
      </Card>
      <Outlet />
    </>
  );
}

export default index;
