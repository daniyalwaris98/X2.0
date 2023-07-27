import styled from "styled-components";
import {
  CommonSpacing,
  CustomContainer,
  FlexboxStyle,
  GridBoxStyle,
} from "../../styles/commonStyle";

export const DashboardStyle = styled.section`
  .dashboard-content {
    ${CustomContainer};

    .layout {
      .react-grid-item {
        cursor: pointer;

        .content-wrapper {
          height: inherit;
        }
      }
    }
  }
`;

export const MenusWrapperStyle = styled.article`
  ${CustomContainer};
  ${CommonSpacing};

  background: ${({ theme }) => theme.colors.WHITE_COLOR};
  border: 1px solid ${({ theme }) => theme.colors.DARK_GRAY_COLOR};
  box-shadow: 0px 5px 14px rgba(28, 29, 32, 0.03);
  border-radius: 10px;

  margin-bottom: 10px;
  padding: 20px;

  @media (max-width: 992px) {
    max-width: 100%;
    overflow: auto;

    &::-webkit-scrollbar-thumb {
      width: 5px;
      height: 5px;
      background: ${({ theme }) => theme.colors.PRIMARY_COLOR};
    }
  }

  .menus {
    ${FlexboxStyle};

    @media (max-width: 992px) {
      width: 1000px;
    }

    .tab {
      ${FlexboxStyle({ gap: "20px" })};

      cursor: pointer;

      .icon {
        ${FlexboxStyle({ justify: "center" })};

        background: ${({ theme }) => theme.colors.LIGHT_PRIMARY_COLOR};
        width: 50px;
        height: 50px;
        border-radius: 10px;

        > svg {
          fill: ${({ theme }) => theme.colors.PRIMARY_COLOR};
          width: 20px;
        }
      }

      p {
        font-weight: bold;
        color: ${({ theme }) => theme.colors.DIM_GRAY_COLOR};
        font-size: 10px;
        margin: 0;
      }

      h2 {
        color: ${({ theme }) => theme.colors.DIM_GRAY_COLOR};
        font-weight: 700;
      }
    }
  }
`;

export const DevicesPerGlobalStyle = styled.article`
  height: inherit;
`;

export const RackDetailsStyle = styled.article`
  height: inherit;

  .racks-list {
    height: inherit;
    .container-content {
      ${FlexboxStyle({ justify: "flex-start", gap: "20px" })};

      flex-wrap: wrap;

      .rack-item {
        padding: 20px;
        border-radius: 10px;
        color: ${({ theme }) => theme.colors.WHITE_COLOR};

        &:nth-child(odd) {
          background: ${({ theme }) => theme.colors.PRIMARY_COLOR};
        }

        &:nth-child(even) {
          background: ${({ theme }) => theme.colors.YELLOW_COLOR};
        }
      }
    }
  }
`;

export const RackDetailsModelStyle = styled.article`
  .racks-details-wrapper {
    height: 500px;
    overflow: auto;

    .row {
      ${GridBoxStyle({ columns: "1fr 20px 1fr" })};

      text-align: center;

      padding: 10px;
      border-radius: 10px;

      &:nth-child(odd) {
        background: ${({ theme }) => theme.colors.LIGHT_PRIMARY_COLOR};
      }

      h3 {
        font-size: 15px;
      }
    }
  }

  .button-wrapper {
    ${FlexboxStyle({ justify: "center" })};

    margin-top: 30px;

    .ok-btn {
      padding: 10px 30px;
      background: ${({ theme }) => theme.colors.PRIMARY_COLOR};
      color: ${({ theme }) => theme.colors.WHITE_COLOR};
      border: none;
      border-radius: 10px;
      cursor: pointer;
    }
  }
`;
