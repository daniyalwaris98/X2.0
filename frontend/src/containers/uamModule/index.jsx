import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu";

const menuItems = [
  { id: "sites", name: "Sites", path: "sites" },
  { id: "racks", name: "Racks", path: "racks" },
  { id: "devices", name: "Devices", path: "devices" },
  { id: "boards", name: "Boards", path: "boards" },
  { id: "sub_boards", name: "Sub Boards", path: "sub_boards" },
  { id: "sfps", name: "SFPs", path: "sfps" },
  { id: "licenses", name: "Licenses", path: "licenses" },
  { id: "aps", name: "APs", path: "aps" },
  { id: "hw_lifecycle", name: "HW Lifecycle", path: "hw_lifecycle" },
];

function Index(props) {
  return (
    <>
      <Card
        sx={{
          marginBottom: "10px",
          height: "50px",
          boxShadow: "unset !important",
        }}
      >
        <HorizontalMenu menuItems={menuItems} defaultPage="sites" />
      </Card>
      <Outlet />
    </>
  );
}

export default Index;
