import React from "react";
import Dropdown from "./dropdown";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const MenuItems = ({
  item,
  depthLevel,
  menuPath,
  handleAddMenuPath,
  handleRemoveMenuPath,
  selectedMenuPath,
  setSelectedMenuPath,
}) => {
  const [dropdown, setDropdown] = useState(false);
  let ref = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdown]);

  const onMouseEnter = () => {
    handleAddMenuPath(item.name);
    setDropdown(true);
  };

  const onMouseLeave = () => {
    handleRemoveMenuPath();
    setDropdown(false);
  };

  const toggleDropdown = () => {
    setDropdown((prev) => !prev);
  };

  const closeDropdown = () => {
    dropdown && setDropdown(false);
  };

  return (
    <li
      className="menu-items"
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={closeDropdown}
    >
      {item.path && item.children ? (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            className={`${
              selectedMenuPath[depthLevel] === item.name ? "selected" : ""
            }`}
            onClick={() => toggleDropdown()}
          >
            <Link to={item.path}>{item.name}</Link>
            {depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
          </button>
          <Dropdown
            depthLevel={depthLevel}
            submenus={item.children}
            dropdown={dropdown}
            menuPath={menuPath}
            handleAddMenuPath={handleAddMenuPath}
            handleRemoveMenuPath={handleRemoveMenuPath}
            selectedMenuPath={selectedMenuPath}
            setSelectedMenuPath={setSelectedMenuPath}
          />
        </>
      ) : !item.path && item.children ? (
        <>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            className={`${
              selectedMenuPath[depthLevel] === item.name ? "selected" : ""
            }`}
            onClick={() => toggleDropdown()}
          >
            {item.name}
            {depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
          </button>
          <Dropdown
            depthLevel={depthLevel}
            submenus={item.children}
            dropdown={dropdown}
            menuPath={menuPath}
            handleAddMenuPath={handleAddMenuPath}
            handleRemoveMenuPath={handleRemoveMenuPath}
            selectedMenuPath={selectedMenuPath}
            setSelectedMenuPath={setSelectedMenuPath}
          />
        </>
      ) : (
        <Link
          to={item.path}
          onClick={() => setSelectedMenuPath([...menuPath])}
          className={`${
            selectedMenuPath[depthLevel] === item.name ? "selected" : ""
          }`}
        >
          {item.name}
        </Link>
      )}
    </li>
  );
};

export default MenuItems;
