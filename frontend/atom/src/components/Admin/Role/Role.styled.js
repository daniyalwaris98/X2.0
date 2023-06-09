import styled from "styled-components";
import { FlexboxStyle } from "../../../styles/commonStyle";

export const StyledDiv = styled.div`
  .icon {
    ${FlexboxStyle({ justify: "center" })}

    > svg {
      width: 25px;

      fill: none;
      stroke: ${({ theme }) => theme.colors.PRIMARY_COLOR};
    }
  }
`;
