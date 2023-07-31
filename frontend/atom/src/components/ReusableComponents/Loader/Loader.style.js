import styled from "styled-components";
import { FlexboxStyle, Poisitioning } from "../../styles/commonStyle";

export const LoaderStyle = styled.article`
  ${Poisitioning({ position: "absolute", top: "0", left: "0" })};
  ${FlexboxStyle({ justify: "center" })};

  width: 100%;
  height: 100%;

  img {
    width: 80px;
  }
`;
