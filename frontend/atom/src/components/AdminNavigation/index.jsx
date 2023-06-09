import { Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import Navigation from "./Navigation";

import Admin from "../Admin";
// import ShowMember from "../Admin/ShowMember";
import Role from "../Admin/Role";
import FailedDevices from "../Admin/FailedDevices";

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
        {/* <Route exact path="/admin" element={<Admin />} /> */}
        {/* <Route exact path="/admin/show-member" element={<ShowMember />} />
        <Route exact path="/admin/role" element={<Role />} />
        <Route exact path="/admin/failed-devices" element={<FailedDevices />} /> */}

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
