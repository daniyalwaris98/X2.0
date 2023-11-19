import React from "react";
import { Table } from "antd";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";

const DefaultStyledAntDesignTable = styled(Table)`
  margin-top: 10px;
  .ant-table-container {
    .ant-table-header {
      table {
        thead.ant-table-thead {
          tr {
            th.ant-table-cell {
              .ant-checkbox-inner {
                border: none;
                background-color: ${({ theme }) =>
                  theme?.palette?.default_table?.check_box_inner};
              }
              background-color: ${({ theme }) =>
                theme?.palette?.default_table?.header_row};
              font-size: 12px;
              margin: 0 !important;
              padding: 0 !important;
              padding: 5px 10px 10px 10px !important;
              font-family: ${({ theme }) =>
                theme?.palette?.default_table?.fontFamily};
              font-weight: 600;
              color: ${({ theme }) =>
                theme?.palette?.default_table?.header_text};
              border: none;
            }
          }
        }
      }
    }
    .ant-table-body {
      table {
        tbody.ant-table-tbody {
          tr.ant-table-row:hover > td {
            background: ${({ theme }) =>
              theme?.palette?.default_table?.hovered_row};
            color: ${({ theme }) =>
              theme?.palette?.default_table?.hovered_text} !important;
          }

          tr.ant-table-row-selected > td {
            background-color: ${({ theme }) =>
              theme?.palette?.default_table?.selected_row};
            color: ${({ theme }) =>
              theme?.palette?.default_table?.selected_text} !important;
          }
          tr.ant-table-row {
            td.ant-table-cell {
              .ant-checkbox-wrapper {
                margin-right: 6px;
              }
              .ant-checkbox-inner {
                border: none;
                background-color: ${({ theme }) =>
                  theme?.palette?.default_table?.check_box_inner};
              }

              font-size: 11px !important;
              margin: 0 !important;
              padding: 0 !important;
              padding-left: 10px !important;
              height: ${(p) => p.cellHeight || "33px"} !important;
              color: ${({ theme }) =>
                theme?.palette?.default_table?.primary_text};
              border: none;
            }
          }
          tr.odd {
            background-color: ${({ theme }) =>
              theme?.palette?.default_table?.odd_row};
          }
          tr.even {
            background-color: ${({ theme }) =>
              theme?.palette?.default_table?.even_row};
          }
        }
      }
    }
  }

  ///////////////////////////////////////////////////////////////////////////
`;

export default function DefaultTable(props) {
  const theme = useTheme();
  return <DefaultStyledAntDesignTable theme={theme} {...props} />;
}

// .ant-pagination-item a {
//   display: block;
//   padding: 0 6px;
//   color: ${(props) =>
//     props.darkMode
//       ? props.theme.darkMode.fontSecondaryColor
//       : props.theme.lightMode.fontSecondaryColor};
//   transition: none;
// }

// .ant-pagination-jump-prev
//   .ant-pagination-item-container
//   .ant-pagination-item-ellipsis,
// .ant-pagination-jump-next
//   .ant-pagination-item-container
//   .ant-pagination-item-ellipsis {
//   color: ${(props) =>
//     props.darkMode
//       ? props.theme.darkMode.fontSecondaryColor
//       : props.theme.lightMode.fontSecondaryColor};
// }

// .ant-pagination-item,
// .ant-pagination-item-active a {
//   border-radius: 20px;
//   background-color: ${(props) =>
//     props.darkMode
//       ? props.theme.darkMode.primary
//       : props.theme.lightMode.primary};
//   border: none;
//   color: white;
// }

// .ant-pagination-prev button,
// .ant-pagination-next button {
//   color: ${(props) =>
//     props.darkMode
//       ? props.theme.darkMode.fontSecondaryColor
//       : props.theme.lightMode.fontSecondaryColor};
// }

// .ant-select:not(.ant-select-customize-input) .ant-select-selector {
//   border: none;
//   border-radius: 5px;
//   color: white;
//   background-color: ${(props) =>
//     props.darkMode
//       ? props.theme.darkMode.primary
//       : props.theme.lightMode.primary};
// }

// .ant-select-arrow {
//   color: ${(props) =>
//     props.darkMode
//       ? props.theme.darkMode.fontSecondaryColor
//       : props.theme.lightMode.fontSecondaryColor};
// }

//////////////////////////////////////////

// .ant-table {
//   overflow-x: auto !important;
// }

// .ant-table-tbody > tr > td {
//   padding: 12px;
//   padding-right: 15px;
//   padding-left: 15px;
//   font-size: 16px;
//   border-right: 1px solid
//     ${({ theme }) => theme?.palette?.default_table?.border};
// }
// .ant-table-tbody > tr > td:first-child {
//   text-align: start;
// }
// .ant-table-thead > tr > th {
//   padding: 12px;
//   font-size: 16px;
//   padding-left: 15px;
//   padding-right: 15px;
//   font-weight: 700;
//   z-index: 0;
//   color: ${({ theme }) => theme?.palette?.default_table?.heading_text};
//   background-color: ${({ theme }) =>
//     theme?.palette?.default_table?.header_row};
// }
// .ant-table-thead > tr > th:first-child {
//   text-align: start;
// }

// .ant-table-tbody > tr > td {
//   background-color: ${({ theme }) =>
//     theme?.palette?.default_table?.even_row} !important;
// }

// .ant-table-tbody > tr:hover > td {
//   background-color: ${({ theme }) =>
//     theme?.palette?.default_table?.selected_row} !important;
// }
