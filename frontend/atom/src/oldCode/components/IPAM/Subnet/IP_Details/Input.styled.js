import styled from "styled-components";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FlexboxStyle } from "../../../../styles/commonStyle";

export const InputFieldIcon = styled(SearchOutlined)`
  transition: all 2s linear;
  &:active {
    margin-right: 100px;
  }
`;
export const InputField = styled(Input)`
  border: 1px solid rgba(0, 0, 0, 0.2) !important;
  box-shadow: none !important;
  overflow: hidden;
  &:focus {
    border: 1px solid #6ab344 !important;
  }
`;

export const ExportButtonStyle = styled.button`
  ${FlexboxStyle({ gap: "10px" })};

  padding: 10px;
  border: none;
  border-radius: 5px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.WHITE_COLOR};

  cursor: pointer;
  transition: 0.1s all linear;

  &:hover {
    color: #fff;
    background: #86a8bb;

    .icon {
      > svg {
        fill: #fff;
      }
    }
  }

  .icon {
    ${FlexboxStyle};

    > svg {
      fill: #000;
      width: 15px;
    }
  }
`;
