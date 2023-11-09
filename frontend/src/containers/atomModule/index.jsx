import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu";
import NavigationDesktop from "../../components/modularNavigation";
import navLinksData from "./data.json";
import { Icon } from "@iconify/react";

const menuItems = [
  { id: "Atom", name: "Atom", path: "/" },
  {
    id: "password",
    name: "Password Group",
    children: [
      {
        id: "web-development",
        name: "Web Development",
        path: "/web-development",
      },
      {
        id: "mobile-app-development",
        name: "Mobile App Development",
        path: "/mobile-app-development",
      },
      {
        id: "design",
        name: "Design",
        children: [
          { id: "ui-ux-design", name: "UI/UX Design", path: "/ui-ux-design" },
          {
            id: "graphic-design",
            name: "Graphic Design",
            children: [
              {
                id: "ui-ux-design",
                name: "UI/UX Design",
                path: "/ui-ux-design",
              },
              {
                id: "graphic-design",
                name: "Graphic Design",
                path: "/graphic-design",
              },
            ],
          },
        ],
      },
    ],
  },
  { id: "about-us", name: "About Us", path: "/about" },
];

function index(props) {
  return (
    <>
      <Card
        sx={{
          marginBottom: "10px",
          height: "50px",
          boxShadow: "unset !important",
        }}
      >
        {/* <ModuleMenu items={["Atom", "Password Group"]} /> */}
        <HorizontalMenu menuItems={menuItems} />
        {/* <NavigationDesktop navLinksData={navLinksData} /> */}
      </Card>
      {/* <NavigationDesktop navLinksData={navLinksData} /> */}

      <Outlet />
    </>
  );
}

export default index;
