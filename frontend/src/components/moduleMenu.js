import React from "react";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export default function ModuleMenu({ array, items, ...style }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <ul {...style}>
      {items.map((item, index) => (
        <li>
          {console.log(index, "item index")}
          <Link
            className="menu-item"
            style={{ textDecoration: "none", height: "40px" }}
            to={index === 0 ? "/atom_module/atom" : "/atom_module"}
          >
            {item}
          </Link>
        </li>
      ))}
      <li>
        <div>
          <Button
            id="demo-positioned-button"
            aria-controls={open ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            Dashboard
          </Button>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            {array.map((item, index) => (
              <Link
                className="menu-item"
                style={{ textDecoration: "none", height: "40px" }}
                to={index === 0 ? "/atom_module/atom" : "/atom_module"}
              >
                <MenuItem onClick={handleClose}>{item}</MenuItem>
              </Link>
            ))}
          </Menu>
        </div>
      </li>
    </ul>
  );
}
