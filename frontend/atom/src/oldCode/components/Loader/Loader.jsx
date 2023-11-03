import React from "react";
import { LoaderStyle } from "./Loader.style";
import PreLoader from "../../assets/gifs/loader.gif";

function Loader() {
  return (
    <LoaderStyle>
      <img src={PreLoader} alt="Loader..." />
    </LoaderStyle>
  );
}

export default Loader;
