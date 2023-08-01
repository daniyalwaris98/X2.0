import styled from "styled-components";
import { FlexboxStyle, Poisitioning } from "../../../styles/commonStyle";

export const SwitchStyle = styled.article`
  ${Poisitioning({ position: "absolute", right: "20px", top: "20px" })};

  background: ${({ theme }) => theme.colors.LIGHT_BACKGROUND_COLOR};

  padding: 8px 12px;
  border-radius: 50px;
  cursor: pointer;

  .toggle-button {
    ${FlexboxStyle({ justify: "center" })};

    width: 20px;
    height: 20px;

    > svg {
      animation: switch 0.1s linear;

      path {
        stroke: ${({ theme }) => theme.colors.FONT_COLOR_REVERSE};
      }
    }
  }

  @keyframes switch {
    0% {
      transform: translateY(20px);
      opacity: 0.1;
    }

    100% {
      transform: translateY(0px);
      opacity: 1;
    }
  }
`;
