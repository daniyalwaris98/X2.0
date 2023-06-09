import styled from "styled-components";
import { Row, Col } from "antd";
import { CustomContainer, FlexboxStyle } from "../../../styles/commonStyle";
import { CommonSpacing } from "../../../styles/commonStyle";

export const DivStyling = styled.div`
  // border-right: 1px solid #E8E8E8 !important;

  // &:last-child{border:none !important;}
  border-right: ${(props) =>
    props.borderRight ? "1px solid #E8E8E8 !important" : null};
  // background-color: ${(props) => (props.active ? "#C6FB8959" : "#fff")};
`;

export const HeaderStyle = styled.header`
  ${FlexboxStyle};
  ${CustomContainer};

  background: ${({ theme }) => theme.colors.WHITE_COLOR};
  border: 1px solid ${({ theme }) => theme.colors.DARK_GRAY_COLOR};
  box-shadow: 0px 5px 14px rgba(28, 29, 32, 0.03);
  border-radius: 10px;

  margin: 5px 30px 10px 30px;
  padding: 20px;

  .tab {
    ${FlexboxStyle({ gap: "20px" })};

    cursor: pointer;

    .icon {
      ${FlexboxStyle({ justify: "center" })};

      background: ${({ theme }) => theme.colors.LIGHT_PRIMARY_COLOR};
      width: 50px;
      height: 50px;
      border-radius: 10px;

      > svg {
        fill: ${({ theme }) => theme.colors.PRIMARY_COLOR};
        width: 20px;
      }
    }

    p {
      font-weight: bold;
      color: ${({ theme }) => theme.colors.DIM_GRAY_COLOR};
      font-size: 10px;
      margin: 0;
    }

    h2 {
      color: ${({ theme }) => theme.colors.DIM_GRAY_COLOR};
      font-weight: 700;
    }
  }
`;
