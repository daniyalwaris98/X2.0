import { Routes, Route } from "react-router-dom";
import React from "react";
import Navigation from "./Navigation";

const SecondNavBar = () => {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/" />
        <Route path="/physical-mapping" />
        <Route path="/ims" />
        <Route path="/inventry" />
        <Route path="/monitering" />
        <Route path="/auto-discovery" />
        <Route path="/ipam" />
        <Route path="/dcm" />
      </Routes>
    </div>
  );
};

export default SecondNavBar;
