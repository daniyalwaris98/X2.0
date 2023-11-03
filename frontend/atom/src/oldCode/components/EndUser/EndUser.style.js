import styled from "styled-components";
import {
  CommonSpacing,
  CustomContainer,
  FlexboxStyle,
  GridBoxStyle,
  Poisitioning,
} from "../../styles/commonStyle";

export const EndUserStyle = styled.article`
  ${CustomContainer};
  ${CommonSpacing};

  background: ${({ theme }) => theme.colors.WHITE_COLOR};
  height: 100vh;

  .heading {
    ${Poisitioning};

    margin: 25px 0;
    z-index: 1;
    font-size: 17px;
    font-weight: 600;

    &:after {
      ${Poisitioning({
        position: "absolute",
        top: "50%",
        right: "0",
        transform: "tranlateY(-50%)",
      })};
      content: "";
      width: 85%;
      height: 1px;
      background: ${({ theme }) => theme.colors.SILVER_COLOR};
      z-index: -1;
    }
  }

  .form-wrapper {
    .form-content {
      ${GridBoxStyle({ columns: "1fr 1fr" })};

      .input-full {
        grid-column: 1/-1;
      }
    }

    .button-wrapper {
      ${FlexboxStyle({ justify: "center", gap: "20px" })};

      margin-top: 40px;

      button {
        background: ${({ theme }) => theme.colors.PRIMARY_COLOR};
        color: ${({ theme }) => theme.colors.WHITE_COLOR};
        padding: 8px;
        width: 100px;
        border-radius: 4px;
        border: none;

        cursor: pointer;

        &.cancel-btn {
          background: ${({ theme }) => theme.colors.GRAY_COLOR};
        }
      }
    }
  }
`;

export const UserModalStyle = styled.article`
  margin: 0 60px;

  .heading {
    ${Poisitioning};

    margin: 25px 0;
    z-index: 1;
    font-size: 17px;
    font-weight: 600;

    &:after {
      ${Poisitioning({
        position: "absolute",
        top: "50%",
        right: "0",
        transform: "tranlateY(-50%)",
      })};
      content: "";
      width: 70%;
      height: 1px;
      background: ${({ theme }) => theme.colors.SILVER_COLOR};
      z-index: -1;
    }
  }

  .form-wrapper {
    .form-content {
      ${GridBoxStyle({ columns: "1fr 1fr" })};

      .input-full {
        grid-column: 1/-1;
      }
    }

    .button-wrapper {
      ${FlexboxStyle({ justify: "center", gap: "10px" })};

      margin-top: 40px;

      button {
        background: ${({ theme }) => theme.colors.PRIMARY_COLOR};
        color: ${({ theme }) => theme.colors.WHITE_COLOR};
        padding: 8px;
        width: 100px;
        border-radius: 4px;
        border: none;

        cursor: pointer;

        &.cancel-btn {
          background: ${({ theme }) => theme.colors.GRAY_COLOR};
        }
      }
    }
  }
`;
