import styled from "styled-components";
import { FlexboxStyle } from "../../../styles/commonStyle";

export const ButtonStyle = styled.button`
  ${FlexboxStyle({ justify: "center", gap: "1rem" })};

  background: ${({ theme }) => theme.colors.PRIMARY_COLOR};
  color: ${({ theme }) => theme.colors.WHITE_COLOR};
  padding: 8px;
  border-radius: 4px;
  border: none;

  cursor: pointer;

  &:disabled {
    background: ${({ theme }) => theme.colors.GRAY_COLOR};
    cursor: not-allowed;
  }

  .btn-text {
    margin: 0;
  }

  span {
    ${FlexboxStyle};

    width: 20px;

    img {
      max-width: 100%;
    }
  }
`;
