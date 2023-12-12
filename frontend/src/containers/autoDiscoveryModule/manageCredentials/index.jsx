import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import V1V2 from "./v1V2";
import V3 from "./v3";

const Index = () => {
  return (
    <>
      <V1V2 />
      <br />
      <V3 />
    </>
  );
};

export default Index;
