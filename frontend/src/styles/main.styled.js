import { Table } from "antd";
import styled from "styled-components";

export const StyledTable = styled(Table)`
  .ant-table {
    overflow-x: auto !important;
  }

  .ant-table-tbody > tr > td {
    padding: 12px;
    padding-right: 15px;
    padding-left: 15px;
    font-size: 16px;
    border-right: 1px solid #f6f6f6;
  }
  .ant-table-tbody > tr > td:first-child {
    text-align: start;
  }
  .ant-table-thead > tr > th {
    padding: 12px;
    font-size: 16px;
    padding-left: 15px;
    padding-right: 15px;
    border-right: 1px solid #f6f6f6;
    font-weight: 700;
    z-index: 0;
  }
  .ant-table-thead > tr > th:first-child {
    text-align: start;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #f6f6f6 !important;
  }
`;
