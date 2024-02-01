import React from "react";
import Dropdown from "./dropdown";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./main.css";
import dcm from "../../containers/adminModule/roles/assets/dcm.svg";

const MenuItems = ({
  item,
  depthLevel,
  menuPath,
  handleAddMenuPath,
  handleRemoveMenuPath,
  selectedMenuPath,
  setSelectedMenuPath,
}) => {
  const menuItemClassName =
    depthLevel === 0 ? "root-menu-item menu-item" : "menu-item";
  const menuItemTextClassName =
    depthLevel === 0 ? "root-menu-item-text" : "menu-item-text";
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
    handleAddMenuPath(item.id);
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
      className={menuItemClassName}
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={closeDropdown}
      style={{ cursor: "pointer", border: "0px solid red" }}
    >
      {item.path && item.children ? (
        <div style={{ display: "flex", padding: "0 10px" }}>
          {/* <img src={dcm} alt="" width={15} style={{ paddingRight: "0px" }} /> */}
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={() => toggleDropdown()}
            className={`${menuItemTextClassName} ${
              selectedMenuPath[depthLevel] === item.id ? "selected" : ""
            }`}
            style={{ border: "0px solid red", height: "51px" }}
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
        </div>
      ) : !item.path && item.children ? (
        <div style={{ display: "flex", padding: "0 10px" }}>
          {/* <img src={dcm} alt="" width={15} style={{ paddingRight: "0px" }} /> */}
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={() => toggleDropdown()}
            className={`${menuItemTextClassName} ${
              selectedMenuPath[depthLevel] === item.id ? "selected" : ""
            }`}
            style={{ border: "0px solid red", height: "100%" }}
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
        </div>
      ) : (
        <div style={{ display: "flex", padding: "0 10px" }}>
          <Link
            className={`${menuItemTextClassName} ${
              selectedMenuPath[depthLevel] === item.id ? "selected" : ""
            }`}
            to={item.path}
            onClick={() => setSelectedMenuPath([...menuPath])}
            style={{
              height: "50px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", padding: "0 10px" }}>
              {/* <img
                src={
                  item.activeIcon && item.inIcon
                    ? selectedMenuPath[depthLevel] === item.id
                      ? item.activeIcon
                      : item.inIcon
                    : dcm
                }
                alt=""
                width={15}
                style={{ paddingRight: "10px" }}
              /> */}
              <div>{item.name}</div>
            </div>
          </Link>
        </div>
      )}
    </li>
  );
};

export default MenuItems;
