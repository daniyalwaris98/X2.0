import React from "react";
import { CustomInputStyle } from "./CustomInput.style";

function CustomInput(props) {
  const { className, children, required, title, ...otherInputsProps } = props;
  return (
    <CustomInputStyle className={className}>
      <article className="input-header">
        <label className="input-title">{title}</label>
        {required && <span className="icon">*</span>}
      </article>

      <article className="input-wrapper">
        {!children ? (
          <input
            className="custom-input"
            required={required}
            {...otherInputsProps}
          />
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
