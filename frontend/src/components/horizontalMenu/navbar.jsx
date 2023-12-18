import React from "react";
// import { menuItemsData } from "./menuItemsData";
import MenuItems from "./menuItems";

const Navbar = ({ menuItems }) => {
  const depthLevel = 0;

  return (
    <nav className="desktop-nav">
      <ul className="menus">
        {menuItems.map((menu, index) => {
          return <MenuItems items={menu} key={index} depthLevel={depthLevel} />;
        })}
      </ul>
    </nav>
  );
};

export default Navbar;
