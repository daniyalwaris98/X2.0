import React, { useEffect, useState } from "react";
import MenuItem from "./menuItem";

const Navbar = ({ menuItems }) => {
  const depthLevel = 0;
  const [menuPath, setMenuPath] = useState([]);
  const [selectedMenuPath, setSelectedMenuPath] = useState([]);

  // useEffect(() => {
  //   if (menuPath.length === 1) alert("menuPath" + JSON.stringify(menuPath));
  // }, [menuPath]);

  function handleAddMenuPath(menuItem) {
    setMenuPath((prev) => [...prev, menuItem]);
  }

  function handleRemoveMenuPath() {
    setMenuPath((prev) => prev.slice(0, -1));
  }

  return (
    <nav className="desktop-nav">
      <ul className="menus">
        {menuItems.map((menu, index) => {
          return (
            <MenuItem
              item={menu}
              key={index}
              depthLevel={depthLevel}
              menuPath={menuPath}
              handleAddMenuPath={handleAddMenuPath}
              handleRemoveMenuPath={handleRemoveMenuPath}
              selectedMenuPath={selectedMenuPath}
              setSelectedMenuPath={setSelectedMenuPath}
            />
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
