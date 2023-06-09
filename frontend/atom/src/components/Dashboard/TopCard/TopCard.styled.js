import styled from 'styled-components';
import { Row, Col } from 'antd';

export const DivStyling = styled.div`
  // border-right: 1px solid #E8E8E8 !important;

  // &:last-child{border:none !important;}
  border-right:${(props)=> props.borderRight? "1px solid #E8E8E8 !important": null }
  // background-color: ${props => props.active ? "#C6FB8959" : "#fff"};

`;
