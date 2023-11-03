import React, { useState } from "react";
import { MasterInputStyle } from "./MasterInput.style";

function MasterInput(props) {
  const {
    onChange = () => {},
    icon,
    className,
    type,
    placeholder,
    ...otherInputProps
  } = props;

  const [inputActive, setInputActive] = useState(false);
  const [input, setInput] = useState("");
  const [inputType, setInputType] = useState(false);

  const handleInput = (e) => {
    setInput(e.target.value);

    if (input.trim().length <= 1) {
      setInputActive(false);
    } else {
      setInputActive(true);
    }

    onChange(e);
  };

  const handleBlur = () => {
    if (input.trim().length == 0) {
      setInputActive(false);
    } else if (input == "undefined") {
      setInputActive(false);
    } else {
      setInputActive(true);
    }
  };

  const handleInputType = () => {
    if (type == "password") {
      setInputType(!inputType);
    }
  };

  return (
    <MasterInputStyle
      type={type}
      className={className}
      active={inputActive}
      onClick={() => setInputActive(true)}
      onBlur={handleBlur}
    >
      {placeholder && <span className="placeholder">{placeholder}</span>}
      <input
        type={inputType ? "text" : type}
        onChange={handleInput}
        autoComplete="off"
        {...otherInputProps}
      />
      {icon && (
        <span className="icon" onClick={handleInputType}>
          {icon}
        </span>
      )}
    </MasterInputStyle>
  );
}

export default MasterInput;
