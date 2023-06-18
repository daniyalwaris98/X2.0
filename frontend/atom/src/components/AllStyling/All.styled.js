import styled from "styled-components";
import {
  Button,
  Progress,
  Table,
  Row,
  Col,
  Input,
  // Link,
  Dropdown,
  Modal,
  Spin,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import dash from "../NavBar/Assets/dash.svg";
import atom from "../NavBar/Assets/atom.svg";
// import { Link } from "react-router-dom";

export const ProgressStyled = styled(Progress)`
  .ant-progress-circle > .ant-progress-text {
    font-size: 4em !important;
  }
  /* ant-progress-circle .ant-progress-text */
`;
export const PopConfirmStyled = styled(Popconfirm)`
  button.ant-btn.ant-btn-primary.ant-btn-sm {
    background-color: brown;
  }
  /* .ant-popover-buttons > .ant-btn-primary {
    background-color: brown;
  } */
`;

export const AddAtomStyledButton = styled(Button)`
  background-color: #fff;
  color: #66b127;
  float: right;
  margin-right: 20px;
  border: 2px solid #66b127;
  // text-align: center;
  border-radius: 6px;
  /* padding-top: 20px; */
  /* width: 125px; */
  height: 40px;
  /* z-index: 3; */
  font-weight: 600;

  font-size: 14px;

  &:hover {
    background-color: #66b127;
    color: #fff !important;
    border: 2px solid #66b127;
  }
`;

export const StyledExportButton = styled.button`
  color: #9f9f9f;
  padding: 6px;
  height: 33px;
  background-color: transparent;
  border: 0px;
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;

  cursor: pointer;

  img:nth-child(2) {
    display: none;
  }

  font-weight: 500;
  font-size: 14px;

  &:hover {
    color: #fff;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 1px 5px 0px;
    border-radius: 8px;
    background-color: #86a8bb;

    img:nth-child(1) {
      display: none;
    }

    img:nth-child(2) {
      display: block;
    }
  }
`;

export const ExportRowButton = styled.button`
  color: #fff;
  /* float: right; */
  padding: 6px;
  height: 33px;
  // margin-right: 20px;
  background-color: #71b626;
  border: 0px;
  text-align: center;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
  /* box-shadow: rgba(99, 99, 99, 0.2) 0px 1px 5px 0px; */

  /* border: 1px solid #86a8bb !important; */

  /* // height: 40px; */

  font-weight: 500;
  font-size: 14px;
  /* &:active {
    /* color: #66b127; */
  /* color: #fff; */
  //   border-bottom:2px solid #66B127;
  //   cursor:pointer;
  /*  */
  &:hover {
    /* border: 1px solid #66b127 !important; */
    color: #fff;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 1px 5px 0px;
    border-radius: 8px;
    background-color: #86a8bb;

    // color:#71b626;

    // font-weight: 500;
  }
`;

export const StyledTempExportButton = styled.button`
  background-color: #86a8bb !important;
  color: #fff;
  float: right;
  border: 0px;
  text-align: center;
  border-radius: 8px;

  font-weight: 500;
  font-size: 14px;
`;

export const TableStyling = styled(Table)`
  border: 1px solid rgba(0, 0, 0, 0.1);
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

  /* .ant-pagination-disabled > .ant-pagination-item-link {
    border-radius: 15px;
    color: #3d9e47;
    &:hover {
      border: 1px solid #3d9e47 !important;
      border-radius: 15px;
    }
  } */

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

  /* .ant-pagination-item {
    border-color: #fff;
  } */

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

  /* .ant-pagination-item a {
    display: block;
    padding: 0 6px;
    color: #fff;
  } */

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
export const IPHistoryTableStyling = styled(Table)`

box-shadow: rgba(99, 99, 99, 0.2) 0px 1px 5px 0px;
// border-radius:12px;


.ant-select-selection {
  background-color: #000 !important;
  color:#000;
}

.ant-table-tbody {
  padding: 5px !important;
}
.ant-table-tbody > tr > td {
  padding: 5px !important;
}

.ant-pagination-disabled > .ant-pagination-item-link{
  border-radius:15px;
  color:#3d9e47;
  &:hover{

border:1px solid #3d9e47 !important;
border-radius:15px;

}
}


 .ant-pagination-next >.ant-pagination-item-link{
  border:none !important;
  /* border-radius:15px; */
  color:#3d9e47 !important;
  &:hover{

    border:1px solid #3d9e47 !important;
  border-radius:15px;

  }


 }
 .ant-pagination-prev >.ant-pagination-item-link{
  border-radius:15px;
  border:none !important;

  color:#3d9e47;
  &:hover{

border:1px solid #3d9e47 !important;
border-radius:15px;

}


 }
 .ant-pagination-item-link{
/* border:1px solid #3d9e47; */

 }

.ant-pagination-item-active {
border-color:#66B127;
background-color: #66B127;

 }
.ant-pagination-item-active a {
color: #fff !important;

 }
 .ant-pagination-item{
border-color:#fff;

 }

.ant-pagination-item a{
  // &:a{
    font-weight:700;
    /* color:rgba(255,255,255,0.5) !important; */
    color:#3d9e47;
    /* border-color:#3d9e47 !important; */
    &:hover{

/* border:1px solid #3d9e47 !important; */
border-radius:15px;

}

  // }
}

.ant-pagination-next{
  margin-right:12px;
  /* &:hover{

border:1px solid #3d9e47 !important;
border-radius:15px;

} */
}

.ant-pagination-item {
  border-radius:15px;
  
  &:hover{

border:1px solid #3d9e47 !important;
border-radius:15px;

}

}



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
  /* table tr:nth-child(2n) td {
    background-color: #F1FFE1;
    } */
 
    && tbody > tr:hover > td {
      background: #D3F3AE;
    }
    && tbody:hover > tr:hover > td {
      background: #D3F3AE;
    }
    .ant-table-tbody > tr.ant-table-row-selected > td{
      background: #D3F3AE;

    }

    /* .duplicate-row {
      table tr:nth-child(2n) td {
      background: #D3F;
    }
  } */


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
              /* $ */
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
   }

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
 }

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
   }

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
  }

`;
export const OnBoardStyledButton = styled(Button)`
  background-color: #c6fb8959;
  color: #9f9f9f;
  float: right;
  margin-right: 20px;
  border: 2px solid #aafb8959;
  text-align: center;
  border-radius: 8px;
  height: 40px;
  padding: auto;
  padding-right: 10px;
  padding: auto 0px;
  // width: 165px;
  font-size: 22px;
  z-index: 3;

  &:hover {
    border: 1px solid rgba(0, 0, 0, 0.3);
    color: #9f9f9f;
  }
`;

export const StyledImportFileInput = styled.input`
  position: relative;
  margin-top: 1px;
  width: 144px;
  height: 100%;
  border-radius: 8px;
  outline: 0;
  padding-top: 7px;
  cursor: pointer;

  &:hover:after {
    height: 36px;
    border-radius: 8px;
    background-color: #fff;
    border: 2px solid #3d9e47;
    color: #059150;
  }

  &:after {
    height: 36px;
    font-weight: 500;

    background-color: #3d9e47;
    padding: 5px;
    padding-top: 4%;
    font-size: 15px;
    text-align: center;
    position: absolute;
    top: 0;
    color: #fff;
    left: 0;
    width: 100%;
    height: 100%;
    content: "Import Excel";
  }
  // };
  // color:
  // $
  // {(props) =>
  //   props.color ? props.color : props.theme.darkMode.fontSecondaryColor};
  // }

  // position: relative;
  // cursor: pointer;
  // height: 40px;
  // border-radius: 8px;
  // outline: 0;

  // // float: right;
  // // box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

  // &:hover:after {
  //   height: 40px;
  //   background-color: #fff;
  //   border: 2px solid #3d9e47;
  //   color: #059150;

  //   // box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  // }
  // &:after {
  //   height: 40px;
  //   box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  //   background-color: #3d9e47;
  //   // font-weight: bold;
  //   color: #fff;
  //   padding-top: 3.5%;
  //   padding: auto;
  //   font-size: 14px;
  //   text-align: center;
  //   position: absolute;
  //   font-weight: 500;
  //   top: 0;
  //   left: 0;
  //   width: 305px;

  //   height: 100%;
  //   content: "Import Excel";

  //   border-radius: 8px;
  // }
`;

export const StyledButton = styled(Button)`
  height: 36px;
  padding: 0px 12px 0 12px;
  font-size: 15px;
  // font-family: Montserrat-Regular;
  // font-weight: bold;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: ${(props) => props.color};
  border-color: ${(props) => props.color};
  z-index: 3;

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

export const StyledInput = styled(Input)`
  height: 2.2rem;
  border-radius: 12px;
  border: none !important;
  box-shadow: none !important;
  overflow: hidden;
  &:focus {
    border: 1px solid #6ab344 !important;
  }
`;
export const LoginStyledInput = styled(Input)`
  height: 2.8rem;

  border-radius: 6px;
  border: none !important;
  box-shadow: none !important;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.3) !important;

  &:focus {
    border: 1px solid #6ab344 !important;
  }
`;
export const LoginPassStyledInput = styled(Input.Password)`
  height: 2.8rem;
  border-radius: 6px;
  /* border: none !important; */
  box-shadow: none !important;
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.3) !important;

  &:focus {
    border: 1px solid #6ab344 !important;
  }
`;
export const Styledselect = styled.select`
  height: 2.2rem;
  border-radius: 12px;
  width: 100%;
  outline: none;
  border: 0.1px solid #cfcfcf;
`;
export const Styledselectmcm = styled.select`
  width: 100%;
  // marginLeft: "10px",
  height: 2rem;
  border: 1px solid #cfcfcf;
  border-radius: 3px;
  margin-top: -1px;
`;

export const InputWrapper = styled.div`
  text-align: left;
  font-size: 12px;
  // white-space: nowrap;
  // display: flex;
  // justify-content: space-between;
  padding-bottom: 10px;
`;

export const StyledSubmitButton = styled(Input)`
  font-size: 15px;
  // height: 27px;
  z-index: 3;

  // font-weight: bolder;
  // width: 15%;
  padding: auto;
  // text-align: center;

  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: ${(props) => props.color};
  border-color: ${(props) => props.color};
  color: white;
  border-radius: 5px;
  &:focus,
  &:hover {
    background-color: ${(props) => props.color};
    border-color: ${(props) => props.color};
    color: white;
    opacity: 0.8;
  }
`;

export const StyledModalButton = styled(Button)`
  height: 27px;
  z-index: 3;

  font-size: 15px;
  // font-weight: bolder;
  // width: 15%;
  font-family: Montserrat-Regular;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: ${(props) => props.color};
  border-color: ${(props) => props.color};
  color: white;
  border-radius: 5px;
  &:focus,
  &:hover {
    background-color: ${(props) => props.color};
    border-color: ${(props) => props.color};
    color: white;
    opacity: 0.8;
  }
`;

export const ColStyling = styled(Col)`
  border-right: 1px solid #e8e8e8;

  @media (max-width: 950px) {
    border: none;
  }
`;

export const AddStyledButton = styled(Button)`
  background-color: #00a339;
  color: #fff;
  z-index: 3;
  float: left;
  margin-left: 12px;
  margin-right: 20px;
  border: none;
  border-radius: 6px;
  /* padding-top: 20px, */
  /* width: 125px; */
  font-size: 14px;
  font-weight: 600;
  &:hover {
    background-color: transparent;
    color: #00a339 !important;
    border: 1px solid #00a339;
  }
`;

export const TableStyle = styled(Table)`
box-shadow: rgba(99, 99, 99, 0.2) 0px 1px 5px 0px;
// border-radius:12px;


.ant-select-selection {
  background-color: #000 !important;
  color:#000;
}

.ant-table-tbody {
  padding: 5px !important;
}
.ant-table-tbody > tr > td {
  padding: 5px !important;
}

.ant-pagination-disabled > .ant-pagination-item-link{
  border-radius:15px;
  color:#3d9e47;
  &:hover{

border:1px solid #3d9e47 !important;
border-radius:15px;

}
}


 .ant-pagination-next >.ant-pagination-item-link{
  border-radius:15px;
  color:#3d9e47;
  &:hover{

    border:1px solid #3d9e47 !important;
  border-radius:15px;

  }


 }
 .ant-pagination-prev >.ant-pagination-item-link{
  border-radius:15px;
  color:#3d9e47;
  &:hover{

border:1px solid #3d9e47 !important;
border-radius:15px;

}


 }
 .ant-pagination-item-link{
border:1px solid #3d9e47;
 }


.ant-pagination-item-active {
border-color:#3d9e47;
 }

.ant-pagination-item a{
  // &:a{
    font-weight:100;
    color:#3d9e47;
    /* border-color:#3d9e47 !important; */
    &:hover{

/* border:1px solid #3d9e47 !important; */
border-radius:15px;

}

  // }
}
.ant-pagination-next{
  margin-right:12px;
  /* &:hover{

border:1px solid #3d9e47 !important;
border-radius:15px;

} */
}

.ant-pagination-item {
  border-radius:15px;
  &:hover{

border:1px solid #3d9e47 !important;
border-radius:15px;

}

}

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

  //            
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
              // padding: 5px 10px 10px 10px !important;
              // font-family: 
              // $
              // {(props) => props.theme.fontFamily.primary};
              
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
              // padding-left: 10px !important;
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
    // padding: 0 6px;
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
export const MainTableMainDiv = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;
export const MainTableMainP = styled.nav`
  padding: 10px;
  color: #333333;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  border-bottom: ${(props) => (props.active ? "2px solid #66B127" : "#333333")};
  color: ${(props) => (props.active ? "#66B127" : "#333333")};

  // &:hover {
  //   color: #66B127;
  //   transform: scale(1.05);
  //   cursor:pointer;
  // }
  // &:active{
  //   color: #66B127;
  //   border-bottom:2px solid #66B127;
  //   cursor:pointer;

  // }
`;
export const MainTableDropDown = styled(Dropdown)`
  cursor: pointer;
  font-weight: 600;
  font-size: 16px;
  border-bottom: ${(props) => (props.active ? "2px solid #66B127" : "#333333")};
  color: ${(props) => (props.active ? "#66B127" : "#333333")};
`;
export const DSO = styled.p`
  cursor: pointer;
  background-color: ${(props) => (props.bg ? "#AFFFCF33 !important" : null)};
  color: ${(props) => (props.color ? "#66B127 !important" : null)};
  background-color: ${(props) => (props.bgone ? "#F8C71233 !important" : null)};
  color: ${(props) => (props.colorone ? "#E2B200 !important" : null)};
  background-color: ${(props) =>
    props.bgtwo ? "#DC39381A !important" : "#C5C5C526"};
  color: ${(props) => (props.colortwo ? "#DC3938 !important" : "#878787")};

  background-color: ${(props) => props.backgroundColor};
`;
export const RackDetail = styled.p`
  background-color: ${(props) =>
    props.bgcolor ? "#66B127 !important" : "#E2B200 !important"};
`;
export const MainTableModal = styled(Modal)`
  margin-top: -50px;

  .ant-modal-body {
    padding: 0px;
  }
`;

export const MainTableColP = styled.p`
  padding-left: 40px;
  font-size: 10px;
`;

export const SpinLoading = styled(Spin)`
  .ant-spin-dot-item {
    background-color: #00a339;
  }
  // .ant-spin-nested-loading  > .ant-spin > .ant-spin-text {
  //   color: #00a339 !important;
  // }
`;

export const MainTableFailedDevices = styled.div`
  padding: 10px;
  cursor: pointer;

  border-bottom: ${(props) =>
    props.active ? "3px solid #66B127" : "1px solid #cccccc"};
  // border-right: ${(props) =>
    props.active ? "3px solid #66B127" : "1px solid #cccccc"};
  color: ${(props) => (props.active ? "#66B127" : "#333333")};
  background-color: ${(props) => (props.active ? "#C6FB8959" : "#fff")};
`;
export const MainTableFailedDevicesTitle = styled.h3`
  color: ${(props) => (props.active ? "#66B127" : "#333333")};
  font-weight: ${(props) => (props.active ? "700" : "400")};
`;
export const SummaryDevices = styled.div`
  padding: 3px;
  cursor: pointer;

  border-bottom: ${(props) =>
    props.active ? "2px solid #66B127" : "1px solid #cccccc"};
  color: ${(props) => (props.active ? "#66B127" : "#333333")};
  /* background-color: ${(props) => (props.active ? "#C6FB8959" : "#fff")}; */
`;
export const MainTitle = styled.h3`
  margin-bottom: 0px !important;
  color: ${(props) => (props.active ? "#66B127" : "#888")};
  font-weight: ${(props) => (props.active ? "600" : "500")};
`;

export const cloudDevices = styled.div`
  padding: 3px;
  cursor: pointer;

  border-bottom: ${(props) =>
    props.active ? "2px solid #66B127" : "1px solid #cccccc"};
  color: ${(props) => (props.active ? "#66B127" : "#333333")};
  background-color: ${(props) => (props.active ? "#C6FB8959" : "#fff")};
  &:hover {
    cursor: pointer !important;
  }
`;
export const cloudMainTitle = styled.h3`
  margin-bottom: 0px !important;
  color: ${(props) => (props.active ? "#66B127" : "#888")};
  font-weight: ${(props) => (props.active ? "600" : "500")};
  background-color: #0f0;

  &:hover {
    cursor: pointer !important;
  }
`;

export const cloudMainTitleTest = styled.h3`
  margin-bottom: 0px !important;
  color: "#66B127";
  // font-weight: ${(props) => (props.active ? "600" : "500")};
  // background-color: #0f0;
`;

export const ActiveImg = styled.div`
  // background-image: url(${(props) => (props.img ? `${dash}` : { atom })});
  // background: url(${(props) => (props.image ? { dash } : { atom })});
`;
export const DivStyling = styled.div`
  // border-right: 1px solid #E8E8E8 !important;

  // &:last-child{border:none !important;}
  border-right: ${(props) =>
    props.borderRight ? "1px solid #E8E8E8 !important" : null};
  // background-color: ${(props) => (props.active ? "#C6FB8959" : "#fff")};
`;
export const CardMargin = styled.div`
  margin-bottom: ${(props) => (props.marginBottom ? "5px" : null)};
`;
export const StyledButtonipCh = styled.button`
  color: ${(props) => (props.active ? "#eee" : "#8B8B8B")};
  background-color: ${(props) => (props.active ? "#71B626" : "#eee")};
`;

export const SvgStyling = styled.img`
  &:active {
    color: #0f0;
    filter: contrast(5);
  }
`;
export const RoleDivStyling = styled.div`
  color: ${(props) => (props.active ? "#fff" : "#c6fb8959")};
  background-color: ${(props) => (props.active ? "#c6fb8959" : "#fff")};
  cursor: pointer;
  /* &:hover {
    background-color: #c6fb8959;
    cursor: pointer;
  }
  &:focus {
    background-color: #fb8959;
    cursor: pointer;
  } */
`;
export const StyledselectIpam = styled.select`
  height: 2rem;
  margin-top: 3px;
  /* border-radius: 12px; */
  width: 100%;
  padding-left: 7px;
  padding-right: 7px;
  border: 1px solid grey;
  outline: none;
  border: 0.1px solid #cfcfcf;
`;
export const Styledselection = styled.select`
  height: 2.2rem;
  margin-top: 3px;
  border-radius: 12px;
  width: 100%;
  padding-left: 7px;
  padding-right: 7px;
  border: 1px solid grey;
  outline: none;
  border: 0.1px solid #cfcfcf;
`;

export const StyledInputForm = styled(Input)`
  height: 2.2rem;
  border-radius: 3px;
  border: 1px solid #cfcfcf !important;
  box-shadow: none !important;
  overflow: hidden;
  &:focus {
    border: 1px solid #6ab344 !important;
  }
`;

export const TempExpo = styled.button`
  margin-right: 10px;
  color: #000;
  // background-color: #86a8bb;
  background-color: transparent;
  float: right;
  border: 0px;
  text-align: center;
  border-radius: 8px;
  width: 220px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;

  &:hover {
    background-color: #86a8bb;
  }
`;

export const DeleteButton = styled.button`
  width: 100px;
  height: 32px;
  font-weight: 600;
  color: white !important;
  background-color: #cc867f !important;
  border: 0px;
  text-align: center;
  border-radius: 8px;

  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;

  /* border: 1px solid #86a8bb !important; */

  cursor: pointer;

  &:hover {
    background-color: red !important;
  }
`;
export const BackupButton = styled.button`
  width: 100px;
  height: 32px;
  font-weight: 600;
  color: white !important;
  background-color: #86a8bb !important;
  border: 0px;
  text-align: center;
  border-radius: 8px;

  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;

  /* border: 1px solid #86a8bb !important; */

  cursor: pointer;

  &:hover {
    background-color: #8bb !important;
  }
`;
export const DownloadButton = styled.button`
  width: 100px;
  height: 32px;
  font-weight: 600;
  color: white !important;
  background-color: #66b127 !important;
  border: 0px;
  text-align: center;
  border-radius: 8px;

  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;

  /* border: 1px solid #86a8bb !important; */

  cursor: pointer;

  &:hover {
    background-color: #66b15f !important;
  }
`;
export const ReScanButton = styled.button`
  width: 100px;
  height: 30px;
  color: white !important;
  /* background-color: red !important; */
  border: 0px;
  text-align: center;
  border-radius: 8px;

  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 2px 0px;

  background-color: #6ab344 !important;

  cursor: pointer;
  &:hover {
    background-color: #86a8aa !important;
  }
`;

export const ColRowNumberStyle = styled.h4`
  color: #66b127;
  font-weight: 700;
`;
export const MainDivStyle = styled.div`
  background-color: #ffffff;
  margin-right: 15px;
  margin-left: 15px;
`;

export const LinkStyled = styled(Link)`
  color: rgba(0, 0, 0, 0.5);

  &:hover {
    color: rgb(0, 0, 0) !important;
  }
`;

export const AddButtonStyle = styled.button`
  height: 45px;
  background-color: #66b127;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: transparent;
    border: 1px solid #66b127;
    color: #66b127;
  }
`;
export const DNSTestButtonStyle = styled.button`
  height: 35px;
  border: 1px solid #66b127;
  background-color: transparent;

  color: #66b127;

  border-radius: 5px;
  /* padding: 10px; */
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background-color: #66b127;

    color: #fff;
  }
`;

export const InterfaceTableStyling = styled(Table)`

box-shadow: rgba(99, 99, 99, 0.2) 0px 1px 5px 0px;
// border-radius:12px;


.ant-select-selection {
  background-color: #000 !important;
  color:#000;
}

.ant-table-tbody {
  padding: 5px !important;
}
.ant-table-tbody > tr > td {
  padding: 5px !important;
}

.ant-pagination-disabled > .ant-pagination-item-link{
  border-radius:15px;
  color:#3d9e47;
  &:hover{

border:1px solid #3d9e47 !important;
border-radius:15px;

}
}


 .ant-pagination-next >.ant-pagination-item-link{
  border:none !important;
  /* border-radius:15px; */
  color:#3d9e47 !important;
  &:hover{

    border:1px solid #3d9e47 !important;
  border-radius:15px;

  }


 }
 .ant-pagination-prev >.ant-pagination-item-link{
  border-radius:15px;
  border:none !important;

  color:#3d9e47;
  &:hover{

border:1px solid #3d9e47 !important;
border-radius:15px;

}


 }
 .ant-pagination-item-link{
/* border:1px solid #3d9e47; */

 }

.ant-pagination-item-active {
border-color:#66B127;
background-color: #66B127;

 }
.ant-pagination-item-active a {
color: #fff !important;

 }
 .ant-pagination-item{
border-color:#fff;

 }

.ant-pagination-item a{
  // &:a{
    font-weight:700;
    /* color:rgba(255,255,255,0.5) !important; */
    color:#3d9e47;
    /* border-color:#3d9e47 !important; */
    &:hover{

/* border:1px solid #3d9e47 !important; */
border-radius:15px;

}

  // }
}

.ant-pagination-next{
  margin-right:12px;
  /* &:hover{

border:1px solid #3d9e47 !important;
border-radius:15px;

} */
}

.ant-pagination-item {
  border-radius:15px;
  
  &:hover{

border:1px solid #3d9e47 !important;
border-radius:15px;

}

}



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
  /* table tr:nth-child(2n) td {
    background-color: #F1FFE1;
    }
 
    && tbody > tr:hover > td {
      background: #D3F3AE;
    }
    && tbody:hover > tr:hover > td {
      background: #D3F3AE;
    }
    .ant-table-tbody > tr.ant-table-row-selected > td{
      background: #D3F3AE;

    } */
    table tr:nth-child(1n) td {
    color: #66B127;
    }
    table tr:nth-child(2n) td {
    color: #6BCFCA;
    }
    table tr:nth-child(3n) td {
    color: #F9B11F;
    }
    .ant-table-thead .ant-table-cell {
  background-color: #c6fb8947 !important;
  color: #66b127 !important;
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
              /* $ */
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
  }

`;
export const HwBtnStyle = styled.button`
  height: 36px;
  background-color: #66b127;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 3px;
  padding-right: 6px;
  padding-left: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: transparent;
    border: 1px solid #66b127;
    color: #66b127;
  }
`;
export const CreBtnStyle = styled.button`
  background-color: #66b127;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px;
  font-weight: bold;
  height: 30px;
  width: 160px;
  cursor: pointer;

  &:hover {
    background-color: transparent;
    border: 1px solid #66b127;
    color: #66b127;
  }
`;
export const CreBtnStyleAuto = styled.button`
  background-color: #66b127;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 5px;
  font-weight: bold;
  height: 40px;
  width: 200px;
  cursor: pointer;

  &:hover {
    background-color: transparent;
    border: 1px solid #66b127;
    color: #66b127;
  }
`;
export const HoverStyle = styled.span`
  background: url(${atom}) no-repeat;
  width: 20px; /* your image width */
  height: 20px; /* your image height */
  display: inline-block;

  &:hover {
    background: url(${dash}) no-repeat;
  }
`;

export const HoverLabelStyle = styled.label`
  display: inline-block;
`;
export const StyleCmdInput = styled(Input)`
  border: 1px solid (0, 0, 0, 0.3) !important;
  box-shadow: none !important;
  overflow: hidden;
  &:focus {
    border: 1px solid #6ab344 !important;
  }
  &:hover {
    border: 1px solid #6ab344 !important;
  }
`;
export const ColStyleCre = styled(Col)`
  background-color: ${(props) =>
    props.active ? "rgba(146, 146, 146, 0.08)" : "#fff"};
  border: ${(props) =>
    props.active
      ? "1px solid rgba(146, 146, 146, 0.24)"
      : "1px solid rgba(0, 0, 0, 0.1)"};
  border-bottom: ${(props) =>
    props.active ? "4px solid #999999" : "1px solid rgba(0, 0, 0, 0.1)"};
  cursor: pointer;
  padding: 5px;
  border-radius: 8px;
  text-align: center;
  //   display: grid;
  // display:flex;
  // justify-content: center;
  // align-items: center;
  place-items: center;
`;
export const DivStyleCre = styled.div`
  cursor: pointer;
  background-color: ${(props) =>
    props.active ? "transparent" : "transparent"};
  margin-bottom: 8px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  border: ${(props) => (props.active ? "1px solid #6ab127" : "1px solid #ccc")};
`;

export const PStyleCre = styled.p`
  cursor: pointer;
font-size:15px;
color: ${(props) => (props.active ? "#6ab127" : "#000")};
// fontSize: "22px",
// fontWeight: 700,
font-weight: ${(props) => (props.active ? "700" : "500")};

color: ${(props) => (props.active ? "#6ab127" : "#000")};

// padding: "0px",
 margin: 0px;
 padding: 5px;

 padding-top:12px;
 padding-bottom:12px;
}}
//   background-color: ${(props) =>
  props.active ? "rgba(146, 146, 146, 0.08)" : "#fff"};
  background-color: transparent;
`;
