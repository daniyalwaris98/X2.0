import React, { useState } from "react";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function HorizontalMenu({ menuItems }) {
  const [openSubmenus, setOpenSubmenus] = useState({});
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const handleMenuClick = (event, id) => {
    setOpenSubmenus((prevOpenSubmenus) => ({
      ...prevOpenSubmenus,
      [id]: !prevOpenSubmenus[id],
    }));
    setSelectedMenuItem(id);
  };

  const renderMenuItems = (
    items,
    parentId = null,
    position = { top: 125, left: 0 }
  ) => {
    return items.map((item) => {
      const id = parentId ? `${parentId}-${item.id}` : item.id;
      const isClicked = id === selectedMenuItem;
      if (item.children) {
        return (
          <div key={id} style={{ position: "relative", height: "50px" }}>
            <MenuItem
              key={id}
              id={id}
              onClick={(event) => handleMenuClick(event, id)}
              className={isClicked ? "clickedMenuItem" : "menu_item"}
            >
              {item.name}
            </MenuItem>
            <Menu
              anchorEl={document.getElementById(id)}
              open={openSubmenus[id]}
              onClose={(event) => handleMenuClick(event, id)}
              anchorReference="anchorPosition"
              anchorPosition={{
                top: position.top,
                left:
                  position.left +
                    document.getElementById(id)?.offsetWidth +
                    10 || 0,
              }} // Position the nested menu to the right side of the parent menu item
            >
              {renderMenuItems(item.children, id, { top: 215, left: 160 })}
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
            onClick={(event) =>
              handleMenuClick(
                event,
                // parentId
                id
              )
            }
            className={isClicked ? "clickedMenuItem" : "menu_item"}
          >
            {item.name}
          </MenuItem>
        );
      }
    });
  };

  return <div style={{ display: "flex" }}>{renderMenuItems(menuItems)}</div>;
}
