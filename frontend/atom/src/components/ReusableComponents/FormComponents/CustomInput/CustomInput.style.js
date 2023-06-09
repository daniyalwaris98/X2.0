import styled from "styled-components";
import { FlexboxStyle } from "../../../../styles/commonStyle";

export const CustomInputStyle = styled.article`
  text-align: left;

  .input-header {
    ${FlexboxStyle({ justify: "flex-start", gap: "10px" })};

    margin-bottom: 10px;

    .icon {
      color: ${({ theme }) => theme.colors.RED_COLOR};
    }
  }

  .input-wrapper {
    .custom-input {
      width: 100%;
      padding: 7px 10px;
      border-radius: 8px;
      border: 1px solid ${({ theme }) => theme.colors.GRAY_COLOR};
      outline: none;

      &::placeholder {
        color: ${({ theme }) => theme.colors.GRAY_COLOR};
      }
    }
  }
`;
