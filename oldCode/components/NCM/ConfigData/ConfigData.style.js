import styled from "styled-components";
import { FlexboxStyle, GridBoxStyle } from "../../../styles/commonStyle";

export const ConfigDataStyle = styled.section`
  margin: 25px 25px;

  .graphs-wrapper {
    ${GridBoxStyle({ columns: "1fr 1fr" })};

    margin-bottom: 30px;

    .sort-by-soverity {
      .container-content {
        ${FlexboxStyle({ justify: "space-around" })};

        height: 100%;

        .stages {
          ${FlexboxStyle({ direction: "column" })};

          cursor: pointer;

          .heading {
            font-size: 12px;
            margin-top: 10px;
          }
        }
      }
    }
  }
`;
