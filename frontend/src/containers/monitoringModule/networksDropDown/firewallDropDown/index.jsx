import React from "react";
import { Outlet } from "react-router-dom";

export const DROPDOWN_NAME = "Firewall";
export const DROPDOWN_PATH = "firewall";

function Index(props) {
  return <Outlet />;
}

export default Index;
