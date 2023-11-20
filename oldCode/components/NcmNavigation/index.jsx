import { Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navigation from "./Navigation";

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
    </div>
  );
};

export default SecondNavBar;
