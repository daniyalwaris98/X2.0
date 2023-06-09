import { Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import Navigation from "./Navigation";
import Atom from "../Atom";
import PasswordGroup from "../PasswordGroup";
import Dashboard from "../Dashboard";
import { PropertySafetyFilled } from "@ant-design/icons";
import FirstNavBar from "../FirstNavBar";
import Login from "../Login";
import UAM from "../UAM";
import Sites from "../UAM/Sites";
import Racks from "../UAM/Racks";
import Devices from "../UAM/Devices";
import Boards from "../UAM/Boards";
import SubBoards from "../UAM/SubBoards";
import SFPS from "../UAM/SFPS";
import Licensce from "../UAM/Licensce";

const SecondNavBar = () => {
  const { pathname } = useLocation();
  return (
    <div>
      {pathname !== "/login" && (
        <>
          <Navigation />
        </>
      )}

      <Routes></Routes>
    </div>
  );
};

export default SecondNavBar;
