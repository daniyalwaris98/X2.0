import styled from "styled-components";
import { Col } from "antd";
export const ColStyle = styled(Col)`
  background-color: ${(props) => (props.active ? "rgba(146, 146, 146, 0.08)" : "#fff")};
  border: ${(props) => (props.active ? "1px solid rgba(146, 146, 146, 0.24)" : "1px solid rgba(0, 0, 0, 0.1)")};
  border-bottom: ${(props) => (props.active ? "4px solid #999999" : "1px solid rgba(0, 0, 0, 0.1)")};
  cursor: pointer;
  padding: 5px;
  border-radius:8px;
  text-align: center;
//   display: grid;
// display:flex;
// justify-content: center;
// align-items: center;
  place-items: center;
`;
export const ColStyleTwo = styled(Col)`
background-color: ${(props) => (props.active ? "#FFEDEA" : "#fff")};
border: ${(props) => (props.active ? "1px solid #FFEDEA" : "1px solid rgba(0, 0, 0, 0.1)")};
border-bottom: ${(props) => (props.active ? "4px solid #FF7661" : "1px solid rgba(0, 0, 0, 0.1)")};
cursor: pointer;
padding: 5px;
border-radius:8px;
text-align: center;
//   display: grid;
// display:flex;
// justify-content: center;
// align-items: center;
place-items: center;
  `;
export const ColStyleThree = styled(Col)`
background-color: ${(props) => (props.active ? "#FFF3E9" : "#fff")};
border: ${(props) => (props.active ? "1px solid #FFF3E9" : "1px solid rgba(0, 0, 0, 0.1)")};
border-bottom: ${(props) => (props.active ? "4px solid #FF9131" : "1px solid rgba(0, 0, 0, 0.1)")};
cursor: pointer;
padding: 5px;
border-radius:8px;
text-align: center;
//   display: grid;
// display:flex;
// justify-content: center;
// align-items: center;
place-items: center;
  `;
export const ColStyleFour = styled(Col)`
background-color: ${(props) => (props.active ? "#E9FFEB" : "#fff")};
border: ${(props) => (props.active ? "1px solid #E9FFEB" : "1px solid rgba(0, 0, 0, 0.1)")};
border-bottom: ${(props) => (props.active ? "4px solid #3D9E47" : "1px solid rgba(0, 0, 0, 0.1)")};
cursor: pointer;
padding: 5px;
border-radius:8px;
text-align: center;
//   display: grid;
// display:flex;
// justify-content: center;
// align-items: center;
place-items: center;
  `;
export const PStyle = styled.p`
  cursor: pointer;

//   background-color: ${(props) => (props.active ? "rgba(146, 146, 146, 0.08)" : "#fff")};
  background-color: transparent;
`;
export const DivStyle = styled.div`
  cursor: pointer;
  background-color: transparent;

//   background-color: ${(props) => (props.active ? "rgba(146, 146, 146, 0.08)" : "#fff")};
`;


export const DivStratch = styled.div`
  width: 850px;
  border-bottom: "1px solid rgba(175, 175, 175, 0.2)";
  overflow: none;
  @media (max-width: 900px) {
    width: 100%;
    border-bottom: 0px solid;
  }
`;
