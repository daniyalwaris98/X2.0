import React from "react";
import { Outlet } from "react-router-dom";
import Card from "../../components/cards";

function index(props) {
  return (
    <>
      <Card sx={{ marginBottom: "10px" }}>Atom Module</Card>
      <Outlet />
    </>
  );
}

export default index;
