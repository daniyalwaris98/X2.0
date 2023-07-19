import styled from "styled-components";
import { Table, Button } from "antd";
import { CustomContainer } from "../../styles/commonStyle";

export const TableStyling = styled(Table)`
  margin-top: 10px;

  table tr:nth-child(2n) td {
    background-color: #f1ffe1;
  }

  && tbody > tr:hover > td {
    background: #d3f3ae;
  }

  .ant-table-container {
    .ant-table-header {
      table {
        thead.ant-table-thead {
          tr {
            th.ant-table-cell {
              background-color: #fff;
              font-size: 12px;
              margin: 0 !important;
              padding: 0 !important;
              padding: 5px 10px 10px 10px !important;
              font-weight: 600;
              color: #000;
              border: none;

              .ant-checkbox-inner {
                border: none;
                background-color: #fff;
              }
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
              font-size: 11px !important;
              margin: 0 !important;
              padding: 0 !important;
              padding-left: 10px !important;
              height: 33px;
              color: #fff !important;
              border: none;

              .ant-checkbox-wrapper {
                margin-right: 6px;
              }
              .ant-checkbox-inner {
                border: none;
                background-color: #fff;
              }
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
  .ant-pagination-item a {
    display: block;
    padding: 0 6px;
    color: #fff;
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
    background-color: #fff;
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
export const OnBoardStyledButton = styled(Button)`
  background-color: #f3f3f3;
  color: #9f9f9f;
  float: right;
  margin-right: 20px;
  border: 0px;
  text-align: center;
  border-radius: 8px;
  height: 40px;
  padding: auto;
  padding-right: 10px;
  padding: auto 0px;
  width: 165px;
  font-size: 22px;

  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.3);
    color: #9f9f9f;
  }
`;
export const StyledImportFileInput = styled.input`
  margin-top: 1px;
  width: 144px;
  position: relative;
  cursor: pointer;
  height: 100%;
  border-radius: 8px;
  outline: 0;

  &:hover:after {
    height: 40px;
    border-radius: 8px;
    background-color: #fff;
    border: 2px solid #3d9e47;
    color: #059150;
  }

  &:after {
    height: 40px;
    font-weight: 500;

    background-color: #3d9e47;
    padding: 5px;
    padding-top: 7.5%;
    font-size: 14px;
    text-align: center;
    position: absolute;
    top: 0;
    color: #fff;
    left: 0;
    width: 100%;
    height: 100%;
    content: "Import Excel";
  }
`;

export const StyledButton = styled(Button)`
  height: 30px;
  padding: 0px 12px 0 12px;
  font-size: 12px;
  font-family: Montserrat-Regular;
  font-weight: bold;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: ${(props) => props.color};
  border-color: ${(props) => props.color};
  color: white;
  border-radius: 3px;
  &:focus,
  &:hover {
    background-color: ${(props) => props.color};
    border-color: ${(props) => props.color};
    color: white;
    opacity: 0.8;
  }
`;

export const DivStratch = styled.div`
  width: 260px;
  border-bottom: 1px solid #000;

  @media (max-width: 900px) {
    width: 100%;
    border-bottom: 0px solid;
  }
`;

export const DiscoverTableModelStyle = styled.article`
  margin-top: 30px;

  .ant-table-cell {
    .ant-select {
      width: 100%;

      .ant-select-selector {
        background-color: ${({ theme }) => theme.colors.WHITE_COLOR} !important;
        color: ${({ theme }) => theme.colors.GRAY_COLOR} !important;
        height: 26px;

        .ant-select-selection-item {
          line-height: 26px !important;
        }
      }

      .ant-select-arrow {
        color: ${({ theme }) => theme.colors.GRAY_COLOR};

        &:hover {
          color: ${({ theme }) => theme.colors.GRAY_COLOR};
        }
      }
    }
  }
`;
