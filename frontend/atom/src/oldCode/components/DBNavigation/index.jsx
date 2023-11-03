import { useLocation } from "react-router-dom";
import React from "react";
import Navigation from "./Navigation";

const SecondNavBar = () => {
  const { pathname } = useLocation();

  return pathname !== "/login" && <Navigation />;
};

export default SecondNavBar;
