import React, { useState } from "react";
import { Table } from "antd";
import styled from "styled-components";
import { useTheme } from "@mui/material/styles";
import DefaultScrollbar from "./scrollbar";
import { getTableScrollWidth } from "../utils/helpers";

const DefaultStyledAntDesignTable = styled(Table)`
  .ant-table-container {
    thead.ant-table-thead {
      tr {
        th.ant-table-cell {
          .ant-checkbox-indeterminate .ant-checkbox-inner:after {
            background-color: ${({ theme }) =>
              theme?.palette?.default_table?.check_box_checked};
          }

          .ant-checkbox-inner {
            border-color: ${({ theme }) =>
              theme?.palette?.default_table?.check_box_border};
            background-color: ${({ theme }) =>
              theme?.palette?.default_table?.check_box_inner};
          }
          border-radius: 0 !important;
          background-color: ${({ theme }) =>
            theme?.palette?.default_table?.header_row};
          font-size: 14px;
          margin: 0 !important;
          padding: 0 !important;
          padding: 5px 10px 10px 10px !important;
          font-family: ${({ theme }) =>
            theme?.palette?.default_table?.fontFamily};
          font-weight: 600;
          color: ${({ theme }) => theme?.palette?.default_table?.header_text};
          border: none;
        }
      }
    }

    tbody.ant-table-tbody {
      tr.ant-table-row:hover > td {
        background: ${({ theme }) =>
          theme?.palette?.default_table?.hovered_row};
        color: ${({ theme }) =>
          theme?.palette?.default_table?.hovered_text} !important;
      }

      tr.ant-table-row-selected > td {
        background-color: ${({ theme }) =>
          theme?.palette?.default_table?.selected_row} !important;
        color: ${({ theme }) =>
          theme?.palette?.default_table?.selected_text} !important;
      }

      tr {
        td.ant-table-cell {
          .ant-checkbox-wrapper {
            margin-right: 6px;
          }
          .ant-checkbox-inner {
            border-color: ${({ theme }) =>
              theme?.palette?.default_table?.check_box_border};
            background-color: ${({ theme }) =>
              theme?.palette?.default_table?.check_box_inner};
          }

          font-size: 13px !important;
          margin: 0 !important;
          padding: 0 !important;
          padding-left: 10px !important;
          height: ${(p) => p.cellHeight || "37px"} !important;
          color: ${({ theme }) => theme?.palette?.default_table?.primary_text};
          border: none;
        }
      }

      tr.odd > td {
        background-color: ${({ theme }) =>
          theme?.palette?.default_table?.odd_row};
      }

      tr.even > td {
        background-color: ${({ theme }) =>
          theme?.palette?.default_table?.even_row};
      }

      tr.selected-row > td {
        background-color: #e5ffda;
      }

      tr.selected-row:hover > td {
        background-color: #e5ffda;
      }

      tr.clickable-row:hover > td {
        cursor: pointer;
      }
    }
  }

  /* .ant-pagination-item a {
    display: block;
    padding: 0 6px;
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_text};
    transition: none;
  }

  .ant-pagination-jump-prev
    .ant-pagination-item-container
    .ant-pagination-item-ellipsis,
  .ant-pagination-jump-next
    .ant-pagination-item-container
    .ant-pagination-item-ellipsis {
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_border};
  }

  .ant-pagination-item,
  .ant-pagination-item-active a {
    border-radius: 20px;
    background-color: ${({ theme }) =>
    theme?.palette?.default_table?.pagination_background};
    border: none;
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_text};
  }

  .ant-pagination-prev button,
  .ant-pagination-next button {
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_border};
  }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: none;
    border-radius: 5px;
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_text};
    background-color: ${({ theme }) =>
    theme?.palette?.default_table?.pagination_background};
  }

  .ant-select-arrow {
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_border};
  } */

  .ant-pagination-prev {
    margin-right: 5px !important;
  }

  .ant-pagination-next {
    margin-right: 5px !important;
    margin-left: 5px !important;
  }

  .ant-pagination-next > .ant-pagination-item-link {
    border-radius: 0px;
    border: 1px solid
      ${({ theme }) => theme?.palette?.default_table?.pagination_border} !important;
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_text};
    &:hover {
      border: 1px solid
        ${({ theme }) => theme?.palette?.default_table?.pagination_border} !important;
      border-radius: 0px;
    }
  }
  .ant-pagination-prev > .ant-pagination-item-link {
    border-radius: 0px;
    border: 1px solid
      ${({ theme }) => theme?.palette?.default_table?.pagination_border} !important;
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_text};
    &:hover {
      border: 1px solid
        ${({ theme }) => theme?.palette?.default_table?.pagination_border} !important;
      border-radius: 0px;
    }
  }
  .ant-pagination-item-link {
    color: ${({ theme }) =>
      theme?.palette?.default_table?.pagination_text} !important;
    border: 1px solid
      ${({ theme }) => theme?.palette?.default_table?.pagination_border};
  }

  .ant-pagination-item-active {
    color: ${({ theme }) =>
      theme?.palette?.default_table?.pagination_text} !important;
    border-color: ${({ theme }) =>
      theme?.palette?.default_table?.pagination_border};
    background-color: ${({ theme }) =>
      theme?.palette?.default_table?.pagination_background};
    &:hover {
      color: ${({ theme }) =>
        theme?.palette?.default_table?.pagination_text} !important;
      border-color: ${({ theme }) =>
        theme?.palette?.default_table?.pagination_border} !important;
    }
  }
  .ant-pagination-item-active a {
    color: ${({ theme }) =>
      theme?.palette?.default_table?.pagination_text} !important;
    background-color: ${({ theme }) =>
      theme?.palette?.default_table?.pagination_background} !important;
  }
  .ant-pagination-item {
    border-color: ${({ theme }) =>
      theme?.palette?.default_table?.pagination_border};
  }

  .ant-pagination-item a {
    font-weight: 700;
    color: ${({ theme }) => theme?.palette?.default_table?.pagination_text};
    &:hover {
      border-radius: 15px;
    }
  }

  .ant-pagination-next {
    margin-right: 12px;
  }

  .ant-pagination-item {
    border-radius: 0px;
    &:hover {
      border-radius: 0px;
    }
  }
`;

export default function DefaultTable({
  displayColumns = [],
  selectedRowKeys = null,
  setSelectedRowKeys = null,
  getCheckboxProps = null,
  scroll = true,
  ...rest
}) {
  const theme = useTheme();

  const rowSelection = {
    getCheckboxProps,
    selectedRowKeys,
    onChange: onSelectChange,
    selection: Table.SELECTION_ALL,
  };

  function onSelectChange(selectedRowKeys) {
    setSelectedRowKeys(selectedRowKeys);
  }

  function handleChange(pagination, filters, sorter, extra) {
    console.log("Various parameters", pagination, filters, sorter, extra);
  }

  return (
    // <DefaultScrollbar>
    <DefaultStyledAntDesignTable
      onChange={handleChange}
      rowSelection={selectedRowKeys ? rowSelection : null}
      columns={displayColumns}
      scroll={{ x: scroll ? getTableScrollWidth(displayColumns) : 0 }}
      style={{ whiteSpace: "pre" }}
      rowClassName={(record, index) => (index % 2 === 0 ? "even" : "odd")}
      size="small"
      pagination={{
        defaultPageSize: 10,
        pageSizeOptions: [20, 50, 100, 500, 1000],
      }}
      theme={theme}
      {...rest}
    />
    // </DefaultScrollbar>
  );
}
