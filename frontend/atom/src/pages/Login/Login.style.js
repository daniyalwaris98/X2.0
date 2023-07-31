import styled from "styled-components";
import {
  FlexboxStyle,
  GridBoxStyle,
  Poisitioning,
} from "../../styles/commonStyle";

export const LoginStyle = styled.article`
  display: grid;
  place-items: center;
  height: 100vh;

  .login-container {
    ${GridBoxStyle({ columns: "1fr 1fr", align: "flex-start" })}

    max-width: 1200px;
    margin: auto;

    place-items: center;

    .form-container {
      .welcome-text {
        font-weight: 600;
        margin: 0;
      }

      .logo {
        margin-bottom: 20px;
        width: 256px;
      }

      .greeting-text {
        line-height: 16px;
        font-weight: 500;
        margin: 0;
      }

      .input-form-wrapper {
        margin: 0;
      }

      .login-form-button {
        background: linear-gradient(
          269.92deg,
          #3d9e47 -32.33%,
          #6fb544 108.19%
        );
        border-radius: 6px;
        color: #fff;
        border: none;
        padding: 12px;
        width: 100%;
        margin-top: 15px;
        font-weight: 500;

        transition: all.3s all linear;
        cursor: pointer;

        &:hover {
          background: #3d9e47;
        }
      }
    }

    .login-gif-wrapper {
      width: 100%;

      img {
        max-width: 100%;
      }
    }
  }
`;

export const LicenseFormModalStyle = styled.article`
  .heading {
    ${Poisitioning};

    margin: 10px 0;
    z-index: 1;
    font-size: 13px;
    font-weight: 600;

    &:after {
      ${Poisitioning({
        position: "absolute",
        top: "50%",
        right: "0",
        transform: "tranlateY(-50%)",
      })};
      content: "";
      width: 78%;
      height: 1px;
      background: ${({ theme }) => theme.colors.SILVER_COLOR};
      z-index: -1;
    }
  }

  .form-wrapper {
    height: 500px;
    overflow: auto;
    padding: 0 20px;

    .form-content {
      ${GridBoxStyle({ columns: "1fr 1fr", gap: "10px" })};

      margin: 20px 0;

      .form-input {
        .input-header {
          .input-title {
            font-size: 10px;
            font-weight: 600;
          }
        }

        .text-area-input {
          padding: 7px 10px;
          width: 100%;
          border-radius: 8px;
          border: 1px solid ${({ theme }) => theme.colors.GRAY_COLOR};
          outline: none;

          &::placeholder {
            color: ${({ theme }) => theme.colors.GRAY_COLOR};
          }
        }
      }

      .input-full {
        grid-column: 1/-1;
      }
    }

    .button-wrapper {
      ${FlexboxStyle({ justify: "center", gap: "10px" })};

      margin-top: 40px;
    }
  }
`;

export const SuperAdminModalStyle = styled.form`
  ${GridBoxStyle({ columns: "1fr 1fr" })};

  .custom-input {
    .input-wrapper {
      .ant-select {
        width: 100%;

        .ant-select-selector {
          height: 36px;
          border: 1px solid ${({ theme }) => theme.colors.GRAY_COLOR};
          border-radius: 8px;
        }
      }
    }
  }

  .button-wrapper {
    ${FlexboxStyle({ justify: "center" })};

    grid-column: 1/-1;

    margin-top: 1rem;
  }
`;
