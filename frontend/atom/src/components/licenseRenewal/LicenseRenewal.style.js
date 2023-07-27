import styled from "styled-components";
import { Poisitioning } from "../../styles/commonStyle";

export const LicenseRenewalStyle = styled.article`
  ${Poisitioning};

  padding: 1rem;
  text-align: center;

  .date-of-expiry {
    ${Poisitioning({ position: "absolute", top: "-24px", right: "-24px" })};

    background: ${({ theme }) => theme.colors.SILVER_COLOR};
    padding: 5px;
    -webkit-clip-path: polygon(0 0, 100% 0%, 100% 100%, 25% 100%);
    clip-path: polygon(0 0, 100% 0%, 100% 100%, 25% 100%);
    width: 323px;

    .date {
      font-size: 12px;
      text-align: right;
      margin: 0;
      color: ${({ theme }) => theme.colors.DARK_COLOR};

      span {
        color: ${({ theme }) => theme.colors.BLACK_COLOR};
      }
    }
  }

  .logo-wrapper {
    display: inline-block;
    margin-top: 30px;
    width: 80px;

    .license-logo {
      max-width: 100%;
    }
  }

  .license-input {
    margin: 20px 0;
  }
`;
