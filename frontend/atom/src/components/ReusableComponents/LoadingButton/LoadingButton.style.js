import styled from "styled-components";
import { FlexboxStyle } from "../../../styles/commonStyle";

export const LoadingButtonStyle = styled.button`
  ${FlexboxStyle({ gap: "8px" })};

  padding: 10px 30px;
  border-radius: 8px;
  border: none;
  background: ${({ theme }) => theme.colors.PRIMARY_COLOR};
  color: ${({ theme }) => theme.colors.WHITE_COLOR};

  cursor: pointer;

  &:disabled {
    background: ${({ theme }) => theme.colors.GRAY_COLOR};

    cursor: not-allowed;
  }

  .btn-text {
    margin: 0;
  }

  .icon {
    ${FlexboxStyle({ justify: "center" })};

    width: 20px;
    height: 20px;

    img {
      max-width: 100%;
    }
  }
`;
