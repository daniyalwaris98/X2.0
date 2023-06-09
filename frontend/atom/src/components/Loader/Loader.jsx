import React from "react";
import { LoaderStyle } from "./Loader.style";
import PreLoader from "../../assets/loader.gif";

function Loader() {
  return (
    <LoaderStyle>
      <img src={PreLoader} alt="Loader..." />
    </LoaderStyle>
  );
}

export default Loader;
