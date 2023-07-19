import styled from "styled-components";

import { Table } from "antd";

export const TableStyle = styled(Table)`
  border-radius: 8px;
  overflow: hidden;

  .ant-select-selection {
    background-color: #000 !important;
    color: #000;
  }

  .ant-table-tbody {
    padding: 5px !important;
  }
  .ant-table-tbody > tr > td {
    padding: 5px !important;
  }

  .ant-pagination-next > .ant-pagination-item-link {
    border-radius: 15px;
    color: #3d9e47;
    &:hover {
      border: 1px solid #3d9e47 !important;
      border-radius: 15px;
    }
  }

  .ant-pagination-prev > .ant-pagination-item-link {
    border-radius: 15px;

    color: #3d9e47;
    &:hover {
      border: 1px solid #3d9e47 !important;
      border-radius: 15px;
    }
  }

  .ant-pagination-item-link {
  }

  .ant-pagination-item-active {
    border-color: #66b127;
    background-color: #66b127;
  }

  .ant-pagination-item-active a {
    color: #fff !important;
  }

  .ant-pagination-item a {
    font-weight: 700;

    color: #3d9e47;

    &:hover {
      border-radius: 15px;
    }
  }

  .ant-pagination-next {
    margin-right: 12px;
  }

  .ant-pagination-item {
    border-radius: 15px;

    &:hover {
      border: 1px solid #3d9e47 !important;
      border-radius: 15px;
    }

    table tr:nth-child(2n) td {
      background-color: #f1ffe1;
    }

    && tbody > tr:hover > td {
      background: #d3f3ae;
    }
    && tbody:hover > tr:hover > td {
      background: #d3f3ae;
    }
    .ant-table-tbody > tr.ant-table-row-selected > td {
      background: #d3f3ae;
    }
  }

  .ant-table-container {
    .ant-table-header {
      table {
        thead.ant-table-thead {
          tr {
            th.ant-table-cell {
              .ant-checkbox-inner {
                border: none;
                background-color: #fff;
              }
              background-color: #fff;

              font-size: 12px;
              margin: 0 !important;
              padding: 0 !important;
              padding: 5px 10px 10px 10px !important;

              font-weight: 600;
              color: #000;

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
            background: #fafafa;

            color: #fff;
          }

          tr.ant-table-row-selected > td {
            background-color: #f5f5f5;

            color: #fff !important;
          }
          tr.ant-table-row {
            td.ant-table-cell {
              .ant-checkbox-wrapper {
                margin-right: 6px;
              }
              .ant-checkbox-inner {
                border: none;
                background-color: #fff;
              }

              font-size: 11px !important;
              margin: 0 !important;
              padding: 0 !important;
              padding-left: 10px !important;
              height: 33px;

              color: #fff !important;

              border: none;
            }
          }
          tr.dark {
            background-color: #1a1a1a;
          }
          tr.light {
            background-color: #fff;
          }
        }
      }
    }
  }

  .ant-pagination-jump-prev
    .ant-pagination-item-container
    .ant-pagination-item-ellipsis,
  .ant-pagination-jump-next
    .ant-pagination-item-container
    .ant-pagination-item-ellipsis {
    color: #fff;
  }

  .ant-pagination-item,
  .ant-pagination-item-active a {
    border-radius: 20px;
  }

  .ant-pagination-prev button,
  .ant-pagination-next button {
    color: #fff;
  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: none;
    border-radius: 5px;
    color: white;
    background-color: #2a2a2a;
  }

  .ant-select-arrow {
    color: #fff;
  }
`;
