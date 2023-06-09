import styled from "styled-components";
import {
  CommonSpacing,
  FlexboxStyle,
  GridBoxStyle,
  Poisitioning,
} from "../../../styles/commonStyle";

export const FailedDevicesStyle = styled.article`
  ${CommonSpacing};

  .failed-devices-counter {
    ${GridBoxStyle({ columns: "repeat(5, 1fr)" })};

    @media (max-width: 900px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 600px) {
      grid-template-columns: 1fr;
    }
  }

  .failed-devices-tabs {
    ${GridBoxStyle({ columns: "1fr 2fr", align: "flex-start" })};
    ${Poisitioning};

    margin-top: 60px;
    padding-bottom: 40px;

    .tabs-wrapper {
      ${Poisitioning({ position: "sticky", top: "20px" })};
    }

    .tab-data {
      background: ${({ theme }) => theme.colors.LIGHT_SECONDARY_COLOR};
      border: 1px solid ${({ theme }) => theme.colors.SILVER_COLOR};
      border-radius: 10px;
      overflow: hidden;

      .title {
        border-left: 5px solid ${({ theme }) => theme.colors.PRIMARY_COLOR};
        padding: 10px;
        margin-bottom: 40px;
      }

      .failed-devices-table {
        tbody {
          td {
            &:last-child {
              width: 540px;
              height: 63px;
              overflow: hidden;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
        }
      }
    }
  }
`;

export const TabStyle = styled.article`
  ${FlexboxStyle({
    justify: "flex-start",
    gap: "20px",
    align: "center",
  })};

  background: ${(p) =>
    p.tabActive == true
      ? ({ theme }) => theme.colors.LIGHT_PRIMARY_COLOR
      : ({ theme }) => theme.colors.LIGHT_SECONDARY_COLOR};
  border: 0.6px solid
    ${(p) =>
      p.tabActive == true
        ? ({ theme }) => theme.colors.PRIMARY_COLOR
        : ({ theme }) => theme.colors.SILVER_COLOR};
  color: ${(p) =>
    p.tabActive == true
      ? ({ theme }) => theme.colors.PRIMARY_COLOR
      : ({ theme }) => theme.colors.SECONDARY_COLOR};
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;

  cursor: pointer;

  .icon {
    ${FlexboxStyle({ justify: "center" })};

    > svg {
      width: 17px;

      fill: ${(p) =>
        p.tabActive == true
          ? ({ theme }) => theme.colors.PRIMARY_COLOR
          : ({ theme }) => theme.colors.SECONDARY_COLOR};

      path {
        stroke: ${(p) =>
          p.tabActive == true
            ? ({ theme }) => theme.colors.PRIMARY_COLOR
            : ({ theme }) => theme.colors.SECONDARY_COLOR};
      }
    }
  }

  .tab-text {
    margin: 0;
  }
`;
