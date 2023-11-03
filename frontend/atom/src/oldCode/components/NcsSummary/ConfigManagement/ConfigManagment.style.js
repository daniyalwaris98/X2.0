import styled from "styled-components";
import { FlexboxStyle } from "../../../styles/commonStyle";

export const ConfigManagmentStyle = styled.section`
  padding: 20px;

  .html-template-placeholder {
    padding: 10px;

    .section-header {
      ${FlexboxStyle};

      .search-input {
        background: ${({ theme }) => theme.colors.WHITE_COLOR};
        border: 1px solid ${({ theme }) => theme.colors.GRAY_COLOR};
        border-radius: 10px;

        input {
          padding: 10px;
          border: none;
          background: none;
          border: none;
          outline: none;

          &::-webkit-input-placeholder {
            color: ${({ theme }) => theme.colors.GRAY_COLOR};
          }
        }

        button {
          background: none;
          border: none;
          color: ${({ theme }) => theme.colors.GRAY_COLOR};
          margin-left: 10px;
          font-size: 17px;

          cursor: pointer;

          &:hover {
            color: ${({ theme }) => theme.colors.DARK_COLOR};
          }

          &:first-of-type {
            transform: rotate(90deg);
          }

          &:last-of-type {
            transform: rotate(90deg);
          }
        }
      }
    }
  }
`;
