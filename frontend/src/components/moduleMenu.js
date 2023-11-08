import React from "react";
import { Link } from "react-router-dom";

export default function ModuleMenu({ items, ...style }) {
  return (
    <ul {...style}>
      {items.map((item, index) => (
        <li className="menu-item">
          {console.log(index, "item index")}
          <Link
            style={{ textDecoration: "none" }}
            to={index === 0 ? "/atom_module/atom" : "/atom_module"}
          >
            {item}
          </Link>
        </li>
      ))}
    </ul>
  );
}
