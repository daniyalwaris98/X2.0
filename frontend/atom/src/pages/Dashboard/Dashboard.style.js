import styled from "styled-components";
import {
  CommonSpacing,
  CustomContainer,
  FlexboxStyle,
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

export const DevicesPerGlobalStyle = styled.article``;
