import React from "react";
import { Outlet } from "react-router-dom";

export const DROPDOWN_NAME = "All Servers";
export const DROPDOWN_PATH = "all_servers";

function Index(props) {
  return <Outlet />;
}

export default Index;
