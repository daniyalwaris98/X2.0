import React from "react";
import Spinner from "../../../assets/button-loader.gif";
import { ButtonStyle } from "./Button.style";

function Button(props) {
  const { btnText, loading, ...otherBtnProps } = props;
  return (
    <ButtonStyle {...otherBtnProps} disabled={loading}>
      <p className="btn-text">{btnText}</p>
      {loading && (
        <span className="spinner">
          <img src={Spinner} alt="Loading..." />
        </span>
      )}
    </ButtonStyle>
  );
}

export default Button;
