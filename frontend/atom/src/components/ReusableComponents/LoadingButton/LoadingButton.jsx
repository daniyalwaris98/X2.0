import React from "react";
import { LoadingButtonStyle } from "./LoadingButton.style";
import Loader from "../../../assets/gifs/button-loader.gif";

function LoadingButton(props) {
  const { onClick, loading, btnText, ...otherBtnProps } = props;
  return (
    <LoadingButtonStyle onClick={onClick} {...otherBtnProps}>
      <p className="btn-text">{btnText}</p>
      {loading && (
        <span className="icon">
          <img src={Loader} alt="Loader" />
        </span>
      )}
    </LoadingButtonStyle>
  );
}

export default LoadingButton;
