import React from "react";
import MenuItem from "./menuItem";

const Dropdown = ({
  submenus,
  dropdown,
  depthLevel,
  menuPath,
  handleAddMenuPath,
  handleRemoveMenuPath,
  selectedMenuPath,
  setSelectedMenuPath,
}) => {
  depthLevel = depthLevel + 1;
  const dropdownClass = depthLevel > 1 ? "dropdown-submenu" : "";

  return (
    <ul className={`dropdown ${dropdownClass} ${dropdown ? "show" : ""}`}>
      {submenus.map((submenu, index) => (
        <MenuItem
          item={submenu}
          key={index}
          depthLevel={depthLevel}
          menuPath={menuPath}
          handleAddMenuPath={handleAddMenuPath}
          handleRemoveMenuPath={handleRemoveMenuPath}
          selectedMenuPath={selectedMenuPath}
          setSelectedMenuPath={setSelectedMenuPath}
        />
      ))}
    </ul>
  );
};

export default Dropdown;
