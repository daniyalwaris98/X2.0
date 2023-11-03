import styled from "styled-components";

export const DivStratch = styled.div`
  width: 350px;
  border-bottom: "1px solid rgba(175, 175, 175, 0.2)";
  overflow: none;
  @media (max-width: 900px) {
    width: 100%;
    border-bottom: 0px solid;
  }
`;
