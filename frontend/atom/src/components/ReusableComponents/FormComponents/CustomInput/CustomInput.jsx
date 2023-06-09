import React from "react";
import { CustomInputStyle } from "./CustomInput.style";

function CustomInput(props) {
  const { children, required, title, ...otherInputsProps } = props;
  return (
    <CustomInputStyle>
      <article className="input-header">
        <label className="input-title">{title}</label>
        {required && <span className="icon">*</span>}
      </article>

      <article className="input-wrapper">
        {!children ? (
          <input className="custom-input" {...otherInputsProps} />
        ) : (
          {
            children,
          }
        )}
      </article>
    </CustomInputStyle>
  );
}

export default CustomInput;
