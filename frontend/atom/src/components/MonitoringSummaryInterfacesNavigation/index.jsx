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

      {/* {this.props.location.pathname !== "/login" && <Login />} */}
      <Routes>
        {/* <Route exact path="/uam/devices" element={<Devices />} />
        <Route exact path="/uam/sites" element={<Sites />} />
        <Route exact path="/uam/racks" element={<Racks />} />
        <Route exact path="/uam/devices" element={<Devices />} />
        <Route exact path="/uam/boards" element={<Boards />} />
        <Route exact path="/uam/subboards" element={<SubBoards />} />
        <Route exact path="/uam/sfps" element={<SFPS />} />
        <Route exact path="/uam/licensce" element={<Licensce />} /> */}

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
