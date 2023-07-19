import { css } from "styled-components";

export const Poisitioning = ({
  position,
  top,
  right,
  bottom,
  left,
  transform,
}) => css`
  position: ${position || "relative"};
  top: ${top};
  right: ${right};
  bottom: ${bottom};
  left: ${left};
  transform: ${transform};
`;

export const FlexboxStyle = ({ justify, align, gap, direction }) => css`
  display: flex;
  align-items: ${align || "center"};
  justify-content: ${justify || "space-between"};
  gap: ${gap};
  flex-direction: ${direction};
`;

export const GridBoxStyle = ({ columns, align, gap }) => css`
  display: grid;
  grid-template-columns: ${columns || "repeat(4, 1fr)"};
  align-items: ${align};
  gap: ${gap || "20px"};
`;

export const CommonSpacing = css`
  margin-left: 25px;
  margin-right: 25px;
`;

export const CustomContainer = css`
  max-width: 1440px;
  margin: 0 auto;
`;
