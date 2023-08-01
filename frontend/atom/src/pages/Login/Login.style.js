import styled from "styled-components";
import {
  Button,
  FlexboxStyle,
  GridBoxStyle,
  Poisitioning,
} from "../../styles/commonStyle";

export const LoginStyle = styled.section`
  ${GridBoxStyle({ columns: "1fr 1.2fr", align: "stretch" })};

  padding: 20px;
  background: ${({ theme }) => theme.colors.BACKGROUND_COLOR};

  @media (max-width: ${({ theme }) => theme.breakPoints.tablets}) {
    grid-template-columns: 1fr;
    height: 100vh;
  }

  .login-greetings {
    ${FlexboxStyle({ direction: "column", justify: "center" })};

    background: url("./images/common-images/login-triangle-top.png") no-repeat
        top left,
      url("./images/common-images/login-rope-top.png") no-repeat top 5% right
        10%,
      url("./images/common-images/login-triangle-bottom.png") no-repeat bottom
        right,
      url("./images/common-images/login-rope-bottom.png") no-repeat bottom 5%
        left 10%,
      ${({ theme }) => theme.gradients.PRIMARY_GRADIENT};

    padding: 20px 60px;
    border-radius: 10px;
    height: calc(100vh - 40px);

    @media (max-width: ${({ theme }) => theme.breakPoints.tablets}) {
      display: none;
    }

    .section-header {
      color: ${({ theme }) => theme.colors.WHITE_COLOR};

      margin-bottom: 50px;

      .heading {
        font-size: 32px;
        font-weight: 700;
        margin: 0;
      }

      .description {
        margin: 0;
        font-size: 16px;
      }
    }

    .login-img {
      display: block;
      width: 400px;

      img {
        max-width: 100%;
      }
    }
  }

  .login-form {
    ${FlexboxStyle({ direction: "column" })};
    ${Poisitioning}

    .form-content {
      ${FlexboxStyle({ direction: "column", justify: "center" })};

      flex: 1;

      max-width: 360px;
      width: 100%;

      .form-header {
        width: 100%;
        margin-bottom: 30px;
        color: ${({ theme }) => theme.colors.FONT_COLOR};

        .site-logo {
          display: block;

          img {
            max-width: 100%;
          }
        }
      }

      .error {
        color: ${({ theme }) => theme.colors.RED_COLOR};
      }

      form {
        margin-top: 20px;
        width: inherit;

        .form-input {
          margin-bottom: 25px;
        }

        .more-options {
          ${FlexboxStyle};

          margin-bottom: 60px;

          .rember-me {
            span {
              color: ${({ theme }) => theme.colors.FONT_COLOR};
            }
          }

          .link {
            color: ${({ theme }) => theme.colors.PRIMARY_COLOR};

            &:hover {
              color: ${({ theme }) => theme.colors.DARK_PRIMARY_COLOR};
            }
          }
        }

        .login-btn {
          box-shadow: 1px 2px 9px 0px rgba(102, 177, 39, 0.36);
          width: 100%;
          padding: 0.7rem;
        }
      }
    }

    .login-menus {
      ${FlexboxStyle({ gap: "40px" })};

      list-style: none;

      li {
        .menu-item-link {
          font-size: 12px;
          color: ${({ theme }) => theme.colors.GRAY_COLOR};

          &:hover {
            color: ${({ theme }) => theme.colors.PRIMARY_COLOR};
          }
        }
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
