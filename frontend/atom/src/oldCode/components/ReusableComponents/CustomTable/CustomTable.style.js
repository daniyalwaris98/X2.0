import styled from "styled-components";

export const CustomTableStyle = styled.table`
  width: 100%;
  padding: 20px;

  tr {
    td {
      padding: 15px;
    }
  }

  thead {
    td {
      font-weight: 600;
    }
  }

  tbody {
    tr {
      &:nth-child(odd) {
        background: ${({ theme }) => theme.colors.LIGHT_PRIMARY_COLOR};
      }
    }
  }
`;
