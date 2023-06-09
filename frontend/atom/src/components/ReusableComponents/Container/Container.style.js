import styled from "styled-components";

export const ContainerStyle = styled.article`
  background: ${({ theme }) => theme.colors.DULL_WHITE_COLOR};
  border: 0.6px solid ${({ theme }) => theme.colors.DARK_GRAY_COLOR};
  box-shadow: 0px 8px 14px rgba(28, 29, 32, 0.04);
  border-radius: 10px;
  overflow: hidden;

  .title {
    padding: 10px;
    font-size: 14px;
    font-weight: 600;
    border-left: 5px solid #66b127;
    margin-bottom: 20px;
  }

  .container-content {
    padding: 15px;
  }
`;
