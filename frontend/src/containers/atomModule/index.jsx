import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";
import HorizontalMenu from "../../components/horizontalMenu";

const menuItems = [
  { id: "Atom", name: "Atom", path: "/" },
  {
    id: "password",
    name: "Password Group",
    children: [
      {
        id: "web-development",
        name: "Web Development",
        path: "atom",
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
            path: "atom",

            // children: [
            //   {
            //     id: "ui-ux-design",
            //     name: "UI/UX Design",
            //     path: "/ui-ux-design",
            //   },
            //   {
            //     id: "graphic-design",
            //     name: "Graphic Design",
            //     path: "atom",
            //   },
            // ],
          },
        ],
      },
    ],
  },
  { id: "about-us", name: "About Us", path: "atom" },
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
        <HorizontalMenu menuItems={menuItems} />
      </Card>
      <Outlet />
    </>
  );
}

export default Index;
