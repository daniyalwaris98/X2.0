import { Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";
import Atom from "../Atom";
import PasswordGroup from "../PasswordGroup";
import Dashboard from "../Dashboard";
import { PropertySafetyFilled } from "@ant-design/icons";
import FirstNavBar from "../FirstNavBar";
import Login from "../Login";
import UAM from "../UAM";
import AtomMain from "../Atom/Atom";

const SecondNavBar = () => {
  const { pathname } = useLocation();
  const [configData, setConfigData] = useState(null);

  useEffect(() => {
    let config = localStorage.getItem("monetx_configuration");
    setConfigData(JSON.parse(config));
  }, []);

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
