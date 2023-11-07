import React from "react";
import { Outlet } from "react-router-dom";
import BasicCard from "../../components/cards";

function index(props) {
  return (
    <>
      <BasicCard>Atom Module</BasicCard>
      <Outlet />
    </>
  );
}

export default index;
