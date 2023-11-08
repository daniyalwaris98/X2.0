import React from "react";

const DefaultWrapper = ({ sx, children, ...rest }) => {
  return (
    <div style={{ display: "block", ...sx }} {...rest}>
      {children}
    </div>
  );
};

export default DefaultWrapper;

export const InputWrapper = ({ sx, children, ...rest }) => {
  return (
    <div style={{ marginTop: "5px", ...sx }} {...rest}>
      {children}
    </div>
  );
};
