import { Routes, useLocation } from "react-router-dom";
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

      <Routes></Routes>
    </div>
  );
};

export default SecondNavBar;
