import { Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import Navigation from "./Navigation";

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
