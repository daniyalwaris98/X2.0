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
    left: 0,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #DEDEDE",
    borderRadius: "0 0 4px 4px",
    zIndex: 1,
    display: isOpen ? "block" : "none",
  }));

  const StyledOption = styled("div")(({ theme, sx }) => ({
    padding: "6px 12px",
    fontSize: "13px",
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

  const handleOptionClick = (option) => {
    setIsOpen(false);
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onClick={handleButtonClick}
      // onClick={handleClick}
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
            key={option.name}
            onClick={() => handleOptionClick(option.name)}
            sx={{}}
          >
            {option.icon} &nbsp;
            {option.name}
          </StyledOption>
        ))}
      </DropdownOptions>
    </div>
  );
}
