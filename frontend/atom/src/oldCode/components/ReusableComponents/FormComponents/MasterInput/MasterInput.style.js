import styled from "styled-components";
import { FlexboxStyle, Poisitioning } from "../../../../styles/commonStyle";

export const MasterInputStyle = styled.article`
  ${Poisitioning};
  ${FlexboxStyle};

  border: 1px solid red;
  border-color: ${(p) =>
    p.active
      ? ({ theme }) => theme.colors.PRIMARY_COLOR
      : ({ theme }) => theme.colors.BORDER_COLOR};
  border-radius: 5px;
  padding: 4px 10px;

  .placeholder {
    ${Poisitioning({
      position: "absolute",
      top: (p) => (p.active ? "-8%" : "50%"),
      left: (p) => (p.active ? "10px" : "20px"),
      transform: "translateY(-50%)",
    })};

    scale: ${(p) => (p.active ? "0.8" : "1")};
    color: ${(p) =>
      p.active
        ? ({ theme }) => theme.colors.PRIMARY_COLOR
        : ({ theme }) => theme.colors.FONT_COLOR};
    transition: 0.2s all linear;
    background: ${(p) =>
      p.active ? ({ theme }) => theme.colors.BACKGROUND_COLOR : "unset"};
    padding: ${(p) => (p.active ? "10px" : "unset")};
  }

  input {
    flex: 1;
    border: none;
    outline: none;
    padding: 10px;
    background: none;
    color: ${({ theme }) => theme.colors.FONT_COLOR};
  }

  .icon {
    ${FlexboxStyle({ justify: "center" })};

    cursor: ${(p) => (p.type == "password" ? "pointer" : "unset")};

    > svg {
      width: 18px;

      path {
        stroke: ${({ theme }) => theme.colors.BORDER_COLOR};
      }
    }
  }
`;
