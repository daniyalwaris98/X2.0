import { Layout, Menu, Table, Input, Card } from "antd";
import styled from "styled-components";

// .ant-table-tbody > tr {
//   background-color: ${({ theme }) => theme.palette.background.default};
// }
export const TableStyle = styled(Table)`
  .ant-table {
    overflow-x: auto !important;
  }

  .ant-table-tbody > tr > td {
    padding: 3px;
    padding-right: 10px;
    padding-left: 10px;
    font-size: 16px;
    // text-align: center;
    border-right: 1px solid #acacac;
  }
  .ant-table-tbody > tr > td:first-child {
    text-align: start;
  }
  .ant-table-thead > tr > th {
    padding: 3px;
    font-size: 16px;
    padding-left: 10px;
    padding-right: 10px;
    border-right: 1px solid #acacac;
    // text-align: center;
  }
  .ant-table-thead > tr > th:first-child {
    text-align: start;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #f6f6f6 !important;
  }
`;
