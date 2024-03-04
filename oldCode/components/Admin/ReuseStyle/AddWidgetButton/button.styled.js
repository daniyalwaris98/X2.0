import styled from "styled-components";
import { Button } from "antd";

export const AddAtomStyledButton = styled(Button)`
  background-color: #fff;
  color: #66B127;
  float: right;
  margin-right: 20px;
  border: 2px solid #66B127;
  // text-align: center;
  border-radius: 6px;
  padding-top: 20px,
  width: 125px;
  height: 40px;
  // padding: auto;
  // padding-right: 10px;
  // padding: auto 0px;

  font-size: 14px;

  &:hover {
    background-color: #66B127;
    color: #fff;
    border: 0px;
  }
`;
