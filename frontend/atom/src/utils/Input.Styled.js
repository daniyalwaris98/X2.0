import styled from "styled-components";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

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
