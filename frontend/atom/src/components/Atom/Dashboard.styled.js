import styled from "styled-components";
import { Table, Button } from "antd";
import { CustomContainer, FlexboxStyle } from "../../styles/commonStyle";

export const AtomStyle = styled.section`
  .atom-table {
    border: 1px solid ${({ theme }) => theme.colors.GRAY_COLOR};

    .ant-table-thead {
      .ant-table-cell {
        .ant-select {
          width: 100%;

          .ant-select-selector {
            background-color: ${({ theme }) =>
              theme.colors.WHITE_COLOR} !important;
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
    }

    .ant-table-row {
      border: 1px solid red;

      .ant-table-cell {
        .status-icon {
          ${FlexboxStyle({ justify: "center" })};

          cursor: pointer;

          > svg {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
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

  .button-wrapper {
    ${FlexboxStyle({ justify: "center" })};

    margin-top: 30px;
  }
`;
