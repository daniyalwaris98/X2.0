import styled from "styled-components";
import { Col } from "antd";
export const ColStyle = styled(Col)`
  background-color: ${(props) => (props.active ? "#c6fb8959" : "transparent")};
  cursor: pointer;
  padding: 5px;
  text-align: center;
  display: grid;
  place-items: center;
`;
export const ColStyleTow = styled(Col)`
  cursor: pointer;
  padding: 5px;
  text-align: center;
  display: grid;
  place-items: center;
  background-color: ${(props) => (props.active ? "#c6fb8959" : "transparent")};
`;
export const PStyle = styled.p`
  cursor: pointer;

  background-color: ${(props) => (props.active ? "#c6fb8959" : "transparent")};
`;
export const DivStyle = styled.div`
  cursor: pointer;

  background-color: ${(props) => (props.active ? "#c6fb8959" : "transparent")};
`;
