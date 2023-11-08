import React from "react";
import { Link } from "react-router-dom";

export default function ModuleMenu({ items, ...style }) {
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
    </ul>
  );
}
