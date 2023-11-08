import React, { useState } from "react";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const menuItems = [
  { id: "home", name: "Home", path: "/" },
  {
    id: "services",
    name: "Services",
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

const HorizontalMenu = () => {
  const [openSubmenus, setOpenSubmenus] = useState({});

  const handleMenuClick = (event, id) => {
    setOpenSubmenus((prevOpenSubmenus) => ({
      ...prevOpenSubmenus,
      [id]: !prevOpenSubmenus[id],
    }));
  };

  const renderMenuItems = (items, parentId = null) => {
    return items.map((item) => {
      const id = parentId ? `${parentId}-${item.id}` : item.id;

      if (item.children) {
        return (
          <div key={id} style={{ position: "relative" }}>
            <MenuItem
              key={id}
              id={id}
              onClick={(event) => handleMenuClick(event, id)}
            >
              {item.name}
            </MenuItem>
            <Menu
              anchorEl={document.getElementById(id)}
              open={openSubmenus[id]}
              onClose={() => handleMenuClick(null, id)}
              anchorReference="anchorPosition"
              anchorPosition={{
                top: 120,
                left: document.getElementById(id)?.offsetWidth + 75 || 170,
              }} // Position the nested menu to the right side of the parent menu item
            >
              {renderMenuItems(item.children, id)}
            </Menu>
          </div>
        );
      } else {
        return (
          <MenuItem
            id={id}
            key={id}
            component={Link}
            to={item.path}
            onClick={() => handleMenuClick(null, parentId)}
          >
            {item.name}
          </MenuItem>
        );
      }
    });
  };

  return <div style={{ display: "flex" }}>{renderMenuItems(menuItems)}</div>;
};

export default HorizontalMenu;
