import React from "react";
// import MobileNav from "./mobileNav";
import Navbar from "./navbar";
import { Link } from "react-router-dom";

const Header = ({ menuItems }) => {
  return (
    <header>
      <div className="nav-area">
        {/* for large screens */}
        <Navbar menuItems={menuItems} />

        {/* for small screens */}
        {/* <MobileNav /> */}
      </div>
    </header>
  );
};

export default Header;
