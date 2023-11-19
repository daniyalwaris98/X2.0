import React from "react";
import { Table } from "antd";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";

const StyledAntdTable = styled(Table)`
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
    /* border-right: 1px solid #f6f6f6; */
    font-weight: 700;
    z-index: 0;
    color: ${({ theme }) => theme?.palette?.default_table?.heading_text};
    background-color: ${({ theme }) =>
      theme?.palette?.default_table?.header_row};
  }
  .ant-table-thead > tr > th:first-child {
    text-align: start;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #f6f6f6 !important;
  }
`;

export const StyledTable = (props) => {
  const theme = useTheme();
  return <StyledAntdTable theme={theme} {...props} />;
};
