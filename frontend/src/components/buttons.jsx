import React, { useState } from "react";
import { Button } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";
import { Icon } from "@iconify/react";

export default function DefaultButton({ sx, handleClick, children, ...rest }) {
  const theme = useTheme();

  return (
    <Button
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "5px 12px",
        color: theme.palette.color.main,
        "&:hover": {
          backgroundColor: sx?.backgroundColor,
          opacity: 0.95,
        },
        ...sx,
      }}
      {...rest}
      onClick={handleClick}
    >
      {children.length > 1 ? children[0] : null}
      <span style={{ fontSize: "13px", textTransform: "capitalize" }}>
        {children.length > 1 ? children[1] : children[0]}
      </span>
    </Button>
  );
}

export function DropDownButton({
  sx,
  handleClick,
  children,
  options,
  ...rest
}) {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const StyledDiv = styled("div")(({ theme, sx }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #DEDEDE",
    padding: "6px 12px",
    color: sx?.color,
    cursor: "pointer",
    "&:hover": {
      backgroundColor: sx?.backgroundColor,
      opacity: 0.95,
    },
  }));

  const DropdownOptions = styled("div")(({ theme }) => ({
    position: "absolute",
    zIndex: "99999",
    top: "100%",
    right: 0,
    width: "110%",
    backgroundColor: theme.palette.color.main,
    border: "1px solid #DEDEDE",
    borderRadius: "0 0 4px 4px",
    zIndex: 1,
    display: isOpen ? "block" : "none",
  }));

  const StyledOption = styled("div")(({ theme, sx }) => ({
    color: theme.palette.textColor.default,
    padding: "6px 12px",
    fontSize: "14px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: theme.palette.color.tertiary,
      color: theme.palette.textColor.input,
    },
    ...sx,
  }));

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionType) => {
    setIsOpen(false);
    handleClick(optionType);
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onClick={handleButtonClick}
      {...rest}
    >
      <div style={{ display: "flex" }}>
        <StyledDiv
          sx={{
            borderTopLeftRadius: "4px",
            borderBottomLeftRadius: "4px",
            padding: "6px 12px 7px 12px",
            borderRight: "none",
            ...sx,
          }}
        >
          {children.length > 1 ? children[0] : null}
          <span style={{ fontSize: "13px", textTransform: "capitalize" }}>
            {children.length > 1 ? children[1] : children[0]}
          </span>
        </StyledDiv>
        <StyledDiv
          sx={{
            borderTopRightRadius: "4px",
            borderBottomRightRadius: "4px",
            padding: "6px 5px 7px 5px",
            ...sx,
          }}
        >
          <Icon fontSize="16px" icon="icon-park-outline:down" />
        </StyledDiv>
      </div>
      <DropdownOptions>
        {options.map((option) => (
          <StyledOption
            key={option.type}
            onClick={() => handleOptionClick(option.type)}
            sx={{}}
          >
            {option.icon} &nbsp;&nbsp;
            {option.type}
          </StyledOption>
        ))}
      </DropdownOptions>
    </div>
  );
}
