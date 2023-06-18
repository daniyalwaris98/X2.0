import styled from "styled-components";
import {
  CommonSpacing,
  FlexboxStyle,
  GridBoxStyle,
} from "../../styles/commonStyle";

export const NcmDashboardStyle = styled.article`
  ${CommonSpacing};

  .ncm-dashboard-top {
    ${GridBoxStyle({ columns: "repeat(3, 1fr)" })};

    margin-bottom: 20px;

    @media (max-width: 900px) {
      ${GridBoxStyle({ columns: "1fr" })};
    }

    .graph-placeholder {
      border-radius: 12px;
      background: #fcfcfc;
      box-shadow: "rgba(0, 0, 0, 0.05) 0px 0px 0px 1px";
      border: 0.6px solid rgba(0, 0, 0, 0.1);
      overflow: hidden;

      .title {
        padding: 10px;
        font-size: 14px;
        font-weight: 600;
        border-left: 5px solid #66b127;
        margin-bottom: 20px;
      }
    }
  }

  .ncm-dashboard-bottom {
    ${GridBoxStyle({ columns: "1fr 2fr" })};

    .progress-graph {
      width: "100%";
      height: "350px";
    }

    .alarms {
      .heading {
        font-weight: 600;
        font-size: 15px;
        margin-bottom: 30px;
      }

      .alarms-list {
        .card {
          margin-bottom: 20px;
          border-left: 5px solid ${({ theme }) => theme.colors.TOMATO_COLOR};
          box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.07);
          padding: 10px;
          padding-left: 30px;

          .card-heading {
            font-weight: 600;
            font-size: 15px;
          }

          p {
            margin: 0;
          }

          .date-and-time {
            ${FlexboxStyle({ justify: "flex-start", gap: "20px" })}
          }
        }
      }
    }
  }

  .rcm-alarms-wrapper {
    .alarms-wrapper {
      .heading {
        font-size: 15px;
        margin-bottom: 20px;
      }

      .alarms-list {
        .alarm {
          border-left: 5px solid ${({ theme }) => theme.colors.TOMATO_COLOR};
          padding: 10px;
          padding-left: 20px;
          border-radius: 5px 0 0 5px;
          box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.07);
          margin-bottom: 10px;

          h3 {
            margin: 0;
          }
          .alarm-title {
            font-size: 12px;
            font-weight: 700;
          }

          .alarm-description {
            font-size: 12px;
          }

          .time-and-date {
            ${FlexboxStyle({ justify: "flex-start", gap: "10px" })};

            font-size: 11px;
          }
        }
      }
    }
  }
`;
