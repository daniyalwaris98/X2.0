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
    console.log(JSON.parse(config));
  }, []);

  return (
    <div>
      {pathname !== "/login" && (
        <>
          <Navigation />
        </>
      )}

      {/* {this.props.location.pathname !== "/login" && <Login />} */}
      <Routes>
        {/* <Route path="/" element={<Dashboard />} /> */}
        {/* {configData?.atom.view ? (
          <Route path="/atom" element={<Atom />} />
        ) : null} */}

        {/* {configData?.atom.pages.atom.view ? (
          <Route path="/atom/main" element={<AtomMain />} />
        ) : null}
        {configData?.atom.pages.password_group.view ? (
          <Route path="/atom/password-group" element={<PasswordGroup />} />
        ) : null} */}

        {/* <Route path="/physical-mapping" />
        <Route path="/ims" />
        <Route path="/inventry" />
        <Route path="/monitering" />
        <Route path="/auto-discovery" />
        <Route path="/ipam" />
        <Route path="/dcm" /> */}
      </Routes>
    </div>
  );
};

export default SecondNavBar;
