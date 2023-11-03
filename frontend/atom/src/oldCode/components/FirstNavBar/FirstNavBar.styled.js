import styled from "styled-components";
import { MenuOutlined } from "@ant-design/icons";

export const StyledInput = styled.input`
  margin: 8px;
  background-color: #353639;
  border: none;
  border-radius: 5px;
  padding-left: 10px;
  color: #fff;
  height: 30px;
  margin-top: 16px;

  &:focus {
    outline: none;
  }
`;
export const StyledMenu = styled.div`
  display: none;
  position: absolute;
  right: 2%;
  top: 22px;

  @media (max-width: 390px) {
    display: flex !important;
  }
`;

export const MainStyling = styled.div`
  display: flex;

  @media (max-width: 390px) {
    display: none !important;
  }
`;
