import styled from "styled-components";
import { Button } from "antd";

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
