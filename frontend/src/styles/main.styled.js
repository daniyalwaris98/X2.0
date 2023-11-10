import { Layout, Menu, Table, Input, Card } from "antd";
import styled from "styled-components";

export const TableStyle = styled(Table)`
  .ant-table {
    overflow-x: auto !important;
  }
  .ant-table-tbody > tr > td {
    padding: 3px;
    padding-right: 10px;
    padding-left: 10px;
    font-size: 16px;
    text-align: center;
  }
  .ant-table-tbody > tr > td:first-child {
    text-align: start;
  }
  .ant-table-thead > tr > th {
    padding: 3px;
    font-size: 16px;
    padding-right: 10px;

    text-align: center;
  }
  .ant-table-thead > tr > th:first-child {
    text-align: start;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #3d9e47 !important;
    color: "white !important";
  }
`;
