import React from "react";

export default function DefaultWrapper({ sx, children, ...rest }) {
  return (
    <div style={{ display: "block", ...sx }} {...rest}>
      {children}
    </div>
  );
}

export function InputWrapper({ sx, children, ...rest }) {
  return (
    <div style={{ marginTop: "5px", ...sx }} {...rest}>
      {children}
    </div>
  );
}
