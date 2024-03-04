import styled from 'styled-components';
import {Button,Table} from "antd"

export const AddAtomStyledButton = styled(Button)`
   background-color: #E4FFCE;
  color: #00a339;
  float: left;
  margin-right: 20px;
//   border: 2px solid #00a339;
  border:none;
  // text-align: center;
  border-radius: 6px;
  padding-top: 20px,
  width: 125px;
  // height: 25px;
  // padding: auto;
  // padding-right: 10px;
  // padding: auto 0px;

  font-size: 14px;

  &:hover {
    background-color: #00a339;
    color: #fff;
    border: 0px;
  }
`;

export const StyledExportButton = styled(Button)`
  background-color: #fff;
  color: #9f9f9f;
  float: right;
  // margin-right: 20px;
  border: 0px;
  text-align: center;
  margin-right: 15px;
  border-radius: 8px;
//   width: 100%;
  height: 30px;

  font-weight: 500;
  font-size: 14px;

  &:hover {
    border: 1px solid #86a8bb;
    // background-color: #86a8bb;
    color: #86a8bb;
    // font-weight: 500;
  }
`;


export const TableStyling = styled(Table)`
  // margin-top: 10px;
  // .ant-table-container {
  //   .ant-table-content {
  //     table {
  //       thead.ant-table-thead {
  //         tr {
  //           th.ant-table-cell {
  //             font-size: 12px;
  //             margin: 0 !important;
  //             padding: 0 !important;
  //             padding: 5px 10px 5px 10px !important;

  //             font-weight: 600;
  //           }
  //         }
  //       }
  //       tbody.ant-table-tbody {
  //         tr.ant-table-row {
  //           td.ant-table-cell {
  //             font-size: 11px !important;
  //             margin: 0 !important;
  //             padding: 0 !important;
  //             padding-left: 10px !important;
  //             height: ${(p) => p.cellHeight || "33px"} !important;
  //           }
  //         }
  //         tr.dark {
  //         }
  //         tr.light {
  //         }
  //       }
  //     }
  //   }
  // }
  margin-top: 10px;
  table tr:nth-child(2n) td {
    background-color: #F1FFE1;
    }
 
    && tbody > tr:hover > td {
      background: #D3F3AE;
    }
  
  .ant-table-container {
    .ant-table-header {
      table {
        thead.ant-table-thead {
          tr {
            th.ant-table-cell {
              .ant-checkbox-inner {
                border: none;
                background-color:#fff; 
                // $
                // {(props) =>
                //   props.darkMode
                //     ? props.theme.darkMode.tertiary
                //     : props.theme.lightMode.tertiary};
              }
              background-color: #fff;
              // $
              // {(props) =>
              //   props.darkMode
              //     ? props.theme.darkMode.primary
              //     : props.theme.lightMode.primary};
              font-size: 12px;
              margin: 0 !important;
              padding: 0 !important;
              padding: 5px 10px 10px 10px !important;
              // font-family: 
              // $
              // {(props) => props.theme.fontFamily.primary};
              font-weight: 600;
              color: #000;
              // $
              // {(props) =>
              //   props.darkMode
              //     ? props.theme.darkMode.fontColor
              //     : props.theme.lightMode.fontColor};
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
            // $
            // {(props) =>
            //   props.darkMode
            //     ? props.theme.darkMode.rowHoverandSelected
            //     : props.theme.lightMode.rowHoverandSelected};
            color: #fff;
          //   $
          //   {(props) =>
          //     props.darkMode
          //       ? props.theme.darkMode.fontSecondaryColor
          //       : props.theme.lightMode.fontSecondaryColor} !important;
          // }

          tr.ant-table-row-selected > td {
            background-color: #f5f5f5;
            // $
            // {(props) =>
            //   props.darkMode
            //     ? props.theme.darkMode.rowHoverandSelected
            //     : props.theme.lightMode.rowHoverandSelected};
            color: #fff !important;
          //   $
          //   {(props) =>
          //     props.darkMode
          //       ? props.theme.darkMode.fontSecondaryColor
          //       : props.theme.lightMode.fontSecondaryColor} !important;
          // }
          tr.ant-table-row {
            td.ant-table-cell {
              .ant-checkbox-wrapper {
                margin-right: 6px;
              }
              .ant-checkbox-inner {
                border: none;
                background-color: #fff;
                // $
                // {(props) =>
                //   props.darkMode
                //     ? props.theme.darkMode.tertiary
                //     : props.theme.lightMode.tertiary};
              }

              font-size: 11px !important;
              margin: 0 !important;
              padding: 0 !important;
              padding-left: 10px !important;
              height: 33px;
              // $
              // {(p) => p.cellHeight || "33px"} !important;
              color: #fff !important;
              $
              // {(props) =>
              //   props.darkMode
              //     ? props.theme.darkMode.fontColor
              //     : props.theme.lightMode.fontColor};
              border: none;
            }
          }
          tr.dark {
            background-color: #1a1a1a;
            // $
            // {(props) =>
            //   props.darkMode
            //     ? props.theme.darkMode.secondary
            //     : props.theme.lightMode.secondary};
          }
          tr.light {
            background-color: #fff;
            // $
            // {
            //   (props) =>
            //   props.darkMode
            //     ? props.theme.darkMode.primary
            //     : props.theme.lightMode.primary};
          }
        }
      }
    }
  }
  .ant-pagination-item a {
    display: block;
    padding: 0 6px;
    color: #fff;
  //   $
  //   {(props) =>
  //     props.darkMode
  //       ? props.theme.darkMode.fontSecondaryColor
  //       : props.theme.lightMode.fontSecondaryColor};
  //   transition: none;
  // }

  .ant-pagination-jump-prev
    .ant-pagination-item-container
    .ant-pagination-item-ellipsis,
  .ant-pagination-jump-next
    .ant-pagination-item-container
    .ant-pagination-item-ellipsis {
    color: #fff;
  //   $
  //   {(props) =>
  //     props.darkMode
  //       ? props.theme.darkMode.fontSecondaryColor
  //       : props.theme.lightMode.fontSecondaryColor};
  // }

  .ant-pagination-item,
  .ant-pagination-item-active a {
    border-radius: 20px;
    background-color: #fff;
    // $
    // {(props) =>
    //   props.darkMode
    //     ? props.theme.darkMode.primary
    //     : props.theme.lightMode.primary};
    // border: none;
    // color: white;
  }

  .ant-pagination-prev button,
  .ant-pagination-next button {
    color: #fff;
    // $
  //   {(props) =>
  //     props.darkMode
  //       ? props.theme.darkMode.fontSecondaryColor
  //       : props.theme.lightMode.fontSecondaryColor};
  // }

  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: none;
    border-radius: 5px;
    color: white;
    background-color: #2a2a2a;
    // $
    // {(props) =>
    //   props.darkMode
    //     ? props.theme.darkMode.primary
    //     : props.theme.lightMode.primary};

  }

  .ant-select-arrow {
   color: #fff;
  // $
  // {(props) =>
  //     props.darkMode
  //       ? props.theme.darkMode.fontSecondaryColor
  //       : props.theme.lightMode.fontSecondaryColor};
  // }
`;