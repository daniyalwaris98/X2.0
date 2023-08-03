import styled from "styled-components";
import { FlexboxStyle } from "../../../styles/commonStyle";

export const PasswordGroupModalStyle = styled.form`
  .form-content {
    margin-bottom: 20px;

    .ant-select {
      width: 100%;

      .ant-select-selector {
        height: 40px;
        align-items: center;
        border-radius: 0.5rem;
      }
    }
  }

  .button-wrapper {
    ${FlexboxStyle({ justify: "center" })};

    .add-btn {
      width: 100px;
    }
  }
`;
