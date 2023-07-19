import styled from "styled-components";

export const DivStyling = styled.div`
  border-right: ${(props) =>
    props.borderRight ? "1px solid #E8E8E8 !important" : null};
`;
