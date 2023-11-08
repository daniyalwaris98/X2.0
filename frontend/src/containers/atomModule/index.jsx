import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import ModuleMenu from "../../components/navTabs";
import HorizontalMenu from "../../components/horizontalMenu";
import NavigationDesktop from "../../components/modularNavigation";
import navLinksData from "./data.json";

function index(props) {
  return (
    <>
      <Card sx={{ marginBottom: "10px" }}>
        {/* <ModuleMenu items={["Atom", "Password Group"]} /> */}
        <HorizontalMenu />
        {/* <NavigationDesktop navLinksData={navLinksData} /> */}
      </Card>
      {/* <NavigationDesktop navLinksData={navLinksData} /> */}

      <Outlet />
    </>
  );
}

export default index;
