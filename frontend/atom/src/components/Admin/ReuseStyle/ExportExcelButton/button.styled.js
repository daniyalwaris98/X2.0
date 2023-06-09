import styled from "styled-components";
import { Button } from "antd";

export const StyledExportButton = styled(Button)`
  background-color: #fff;
  color: #9f9f9f;
  float: right;
  // margin-right: 20px;
  border: 0px;
  text-align: center;
  border-radius: 8px;
  width: 100%;
  height: 40px;

  font-weight: 500;
  font-size: 14px;

  &:hover {
    border: 1px solid #86a8bb;
    // background-color: #86a8bb;
    color: #86a8bb;
    // font-weight: 500;
  }
`;
